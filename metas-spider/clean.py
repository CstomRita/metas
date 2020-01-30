# -*- coding: utf-8 -*-
'''
 @File  : clean.py
 @Author: ChangSiteng
 @Date  : 2020-01-09
 @Desc  : 
 '''

# import-path
import sys
import os
import time

import emoji as emoji

curPath = os.path.abspath(os.path.dirname(__file__))
rootPath = os.path.split(curPath)[0]
sys.path.append(rootPath)

import re

from functools import reduce
from lxml import html
from bs4 import BeautifulSoup




def dealBr(text):
    '''
    去掉微博信息中的url地址
    '''
    return re.sub('<br/>', '。', text)
import re

def filter_emoji(desstr,restr=''):
    #过滤表情
    try:
        co = re.compile(u'[\U00010000-\U0010ffff]')
    except re.error:
        co = re.compile(u'[\uD800-\uDBFF][\uDC00-\uDFFF]')
    return co.sub(restr, desstr)

def filter_str(desstr,restr=''):
    #过滤除中英文及数字以外的其他字符
    res = re.compile("[^\u4e00-\u9fa5^a-z^A-Z^0-9]")
    return res.sub(restr, desstr)

def clean(text):
    # 去除emoji的表情符，因为无法被识别
    text = filter_emoji(text)
    i = 0
    bs = BeautifulSoup(text, 'html.parser')
    trs = bs.find_all('span', class_='url-icon')
    for tr in trs:
        imgs = tr.find_all('img')
        for img in imgs:
            if img.get('alt') != None:  # 提取img标签中的alt内容(图片标题)
                emoji = img.get('alt')
                i += 1
                img.string = emoji
                img.replaceWithChildren()
        tr.replaceWithChildren()
    [s.extract() for s in bs('span')]
    [s.extract() for s in bs('a')]
    text = dealBr(str(bs)).strip()
    # 去重 #xx#
    pattern = re.compile(r'(#)(.*)(#)')
    text = pattern.sub(r'', text)
    pattern = re.compile(r'(【)(.*)(】)')
    text = pattern.sub(r'', text)

    # 去掉其他无法编码的
    text = (str(bytes(text, encoding='utf-8').decode('utf-8').encode('gbk', 'ignore').decode('gbk')))
    return text
if __name__ == "__main__":
    f = open('topic/北京/北京2020-01-09-17.txt', 'r')
    a = list(f)
    for text in a:
        print(clean(text))



