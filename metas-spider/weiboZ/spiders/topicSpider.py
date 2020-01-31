# -*- coding: utf-8 -*-
import calendar
import os
import re
import time
import urllib

import scrapy
import json
from w3lib.html import remove_tags,replace_escape_chars
from weiboZ.items import WeibozItem, TopicItem, HotTopic
import logging
from clean import clean

'''
1. 不能指定topic scrapy crawl mblogSpider -a topic=xx ------>已经找到对应的URL
2. 只限100页 因为移动端限制100页，暂时不修改？？
3. 存储到mongoDB 可以不更改变
'''
class SearchspiderSpider(scrapy.Spider):

    name = "topicSpider"
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

    def __init__(self, num=100, *args, **kwargs):
        super(SearchspiderSpider, self).__init__(*args, **kwargs)
        self.now_time = time.localtime()
        if not os.path.exists('hottopic'):
            os.mkdir('hottopic')
        self.path = 'hottopic/'+ time.strftime('%Y-%m-%d-%H', self.now_time)
        if not os.path.exists(self.path):
            os.mkdir(self.path)
        self.num = int(num)
        self.topiccount = 0

        form_data = {
            'containerid': '106003type=25&t=3&disable_hot=1&filter_type=topicband',
            'title':'微博热搜',
            'extparam':'pos=0_0&mi_cid=100103&cate=10103&filter_type=realtimehot&c_type=30&display_time='+ str(calendar.timegm(time.gmtime())),
            'luicode':'10000011',
            'lfid':'231583'
        }
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
        cardN = len(js['data']['cards'])
        for i in range(N,cardN):
            cgN = js['data']['cards'][i]
            if 'card_group' in cgN.keys():
                for j in range(len(cgN['card_group'])):
                    it = cgN['card_group'][j]
                    #logging.warning('i:%d,j:%d' % (i, j))
                    try:
                        topicname = it['title_sub']
                        topicdesc = it['desc1']
                        readcount = it['desc2']
                        cover_url = it['pic']
                        item = HotTopic()
                        item['topicname'] = topicname
                        item['readcount'] = readcount
                        item['topicdesc'] = topicdesc
                        self.topiccount += 1
                        self.write(str(self.topiccount) + "\t" + topicname + "\t"+ topicdesc + "\t"+ readcount + "\t" + cover_url)
                        counts = str(readcount).strip().split(' ')
                        self.write_to_topic(str(counts[1][-2:]+counts[1][0:-2])
                                            + "\t"
                                            + str(counts[0][-2:]+counts[0][0:-2])
                                            + "\t" + cover_url + "\t" + topicdesc,topicname)

                        yield item
                    except BaseException as e:
                        print(e)

    def parse(self, response):
        # 处理第一页
        logging.warning('do page1.')
        items = self.parseFunc(response, 0)
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
        with open(self.path + '/topic.txt','a') as f:
            f.write((text))  # 写入
            f.write('\n')  # 有时放在循环里面需要自动转行，不然会覆盖上一条数据

    # 把爬到的新话题再放一份到topic中
    def write_to_topic(self,text,topicName):
        topicPath = "topic/" + str(topicName[1:-1])
        if not os.path.exists(topicPath):
            os.mkdir(topicPath)
        with open(topicPath + '/'+str(topicName[1:-1])+'.txt', 'w+') as f:
            f.write((text))  # 写入
            f.write('\n')  # 有时放在循环里面需要自动转行，不然会覆盖上一条数据

    '''
    语料清洗部分
    '''

