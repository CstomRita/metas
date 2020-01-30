# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html
from scrapy.item import Item, Field


class WeibozItem(Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    text = Field()  # 微博正文

class TopicItem(Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    midtext = Field() # midtext: "阅读22.5亿 讨论196.5万 详情>",
    img = Field() # 话题图片

class HotTopic(Item):
    topicname = Field()
    topicdesc = Field()
    readcount = Field()
