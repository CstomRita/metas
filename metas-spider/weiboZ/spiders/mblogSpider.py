# -*- coding: utf-8 -*-
import os
import re
import time
import urllib

import scrapy
import json
from w3lib.html import remove_tags,replace_escape_chars
from weiboZ.items import WeibozItem, TopicItem
import logging
from clean import clean

'''
1. 不能指定topic scrapy crawl mblogSpider -a topic=xx ------>已经找到对应的URL
2. 只限100页 因为移动端限制100页，暂时不修改？？
3. 存储到mongoDB 可以不更改变
'''
class SearchspiderSpider(scrapy.Spider):

    name = "mblogSpider"
    #allowed_domains = ["http://m.weibo.cn/page/"]

    url_base = 'https://m.weibo.cn/api/container/getIndex?'
    '''
    里面的parse方法，这个方法有两个作用
    1.负责解析start_url下载的Response 对象，根据item提取数据（解析item数据的前提是parse里全部requests请求都被加入了爬取队列）
    所以start_urls一定要有
    2.如果有新的url则加入爬取队列，负责进一步处理，URL的Request 对象
    
    爬虫时发生了什么？
    Scrapy为Spider的 start_urls 属性中的每个url创建了Request 对象
    并将 parse 方法作为回调函数(callback)赋值给了requests
    而requests对象经过调度器的调度，执行生成response对象并送回给parse() 方法进行解析
    '''
    start_urls = [  # 开始爬取的链接
        url_base
    ]

    # 移动版最多允许查看100页
    maxPage = 100

    def __init__(self, num=100, topic='', *args, **kwargs):
        super(SearchspiderSpider, self).__init__(*args, **kwargs)
        if not os.path.exists('topic'):
            os.mkdir('topic')
        if not os.path.exists('topic/'+topic):
            os.mkdir('topic/'+topic)
        self.now_time = time.localtime()
        self.num = int(num)
        self.topic = topic
        form_data = {
            'containerid': '100103type=1&q=#'+topic+'#',
            'page_type':'searchall'
        }
        if len(self.topic) != 0:
            self.url_temp = self.url_base + urllib.parse.urlencode(form_data) +'&page='
            print(self.url_temp)

    '''
    重写 来改变start——urls
    '''
    def start_requests(self):
        yield scrapy.Request(self.url_temp)

    def etl(self, d, k, keys):
        return d[k] if k in keys and d[k] != None else 0

    def parseFunc(self, response, N):
        js = json.loads(response.text, encoding='utf-8')
        if N != 0:
            topic = TopicItem()
            topic_desc = js['data']['cardlistInfo']['cardlist_head_cards'][0]['head_data']['midtext']
            counts = str(topic_desc).strip().split(' ')
            print(counts,"-----",topic_desc)
            topic['midtext'] = topic_desc
            img_url = js['data']['cardlistInfo']['cardlist_head_cards'][0]['head_data']['portrait_url']
            topic['img'] = img_url
            desc = js['data']['cardlistInfo']['desc']
            self.writeTopic(counts[0] + "\t" + counts[2] + "\t" + img_url + "\t" + desc)

        cardN = len(js['data']['cards'])
        for i in range(N, cardN):
            cgN = js['data']['cards'][i]
            if 'card_group' in cgN.keys():
                for j in range(len(cgN['card_group'])):
                    it = cgN['card_group'][j]
                    #logging.warning('i:%d,j:%d' % (i, j))
                    if 'mblog' in it.keys():
                        mblog = it['mblog']
                        item = WeibozItem()
                        item['text'] = mblog['text']
                        self.write(mblog['text'])
                        yield item
            elif 'mblog' in cgN.keys():
                mblog = cgN['mblog']
                item = WeibozItem()
                item['text'] = mblog['text']
                self.write(mblog['text'])
                yield item



    def parse(self, response):
        # 处理第一页
        logging.warning('do page1.')
        items = self.parseFunc(response, 2) # 第一个页从第2个卡片开始...
        for item in items:
            yield item

        # 处理其余页
        for i in range(2, min(self.maxPage, self.num) + 1):
            logging.warning('do page%d' % i)
            yield scrapy.Request(self.url_temp + str(i), self.parse_other)

    def parse_other(self, response):
        items = self.parseFunc(response, 0)
        for item in items:
            yield item

    def write(self,text):
        """将爬取的信息写入文件"""
        '''
        需要清洗文本
        '''
        with open('topic/' + self.topic + '/' + self.topic + time.strftime('%Y-%m-%d-%H', self.now_time) + '.txt','a') as f:
            f.write(clean(text))  # 写入
            f.write('\n')  # 有时放在循环里面需要自动转行，不然会覆盖上一条数据

    def writeTopic(self, text):
        # 如果存在，不重新写了
        if(os.path.exists('topic/' + self.topic + '/' + self.topic + '.txt')):
            return
        """将爬取的信息写入csv文件"""
        with open('topic/' + self.topic + '/' + self.topic + '.txt','w+') as f:
            f.write(text)  # 写入
            f.write('\r\n')  # 有时放在循环里面需要自动转行，不然会覆盖上一条数据

    '''
    语料清洗部分
    '''

