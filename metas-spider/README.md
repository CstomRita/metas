## 数据获取模块 —— 爬虫程序

### 项目借鉴：
[微博话题爬取与存储分析,实战部分](https://luzhijun.github.io/2016/10/29/微博话题爬取与存储分析/#section-2)


## 爬取内容：

### 微博热门话题榜单

爬取URL：

```python
url_base = 'https://m.weibo.cn/api/container/getIndex?'
form_data = {
            'containerid': '106003type=25&t=3&disable_hot=1&filter_type=topicband',
            'title':'微博热搜',
            'extparam':'pos=0_0&mi_cid=100103&cate=10103&filter_type=realtimehot&c_type=30&display_time='+ str(calendar.timegm(time.gmtime())),
            'luicode':'10000011',
            'lfid':'231583'
        }
self.url_temp = self.url_base + urllib.parse.urlencode(form_data) +'&page='
```

运行方法：`scrapy crawl topicSpider`

运行结果：存储至hottopic下topic.txt中


### 某个话题下的所有评论

爬取URL：

```python
url_base = 'https://m.weibo.cn/api/container/getIndex?'
form_data = {
            'containerid': '100103type=1&q=#'+topic+'#',
            'page_type':'searchall'
        }
self.url_temp = self.url_base + urllib.parse.urlencode(form_data) +'&page='
```

运行方法：`scrapy crawl mblogSpider -a topic=小黄车`

运行结果：存储至topic下txt中

### run_hottopic.py

爬取热门话题脚本

### run_weibo.py

Step1.  `scrapy crawl mblogSpider -a topic=小黄车` 

Step2. 连接GPU服务器进行情感分析

Step3. 将结果复制到topic/小黄车/result 文件夹下

### run.py

简单定时运行更新