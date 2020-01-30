# -*- coding: utf-8 -*-
'''
 @File  : run.py
 @Author: ChangSiteng
 @Date  : 2020-01-09
 @Desc  : 
 '''

# import-path
import calendar
import sys
import os

curPath = os.path.abspath(os.path.dirname(__file__))
rootPath = os.path.split(curPath)[0]
sys.path.append(rootPath)

import time
import os

if __name__ == '__main__':

    print('++++++++运行任务', time.strftime('%Y-%m-%d-%H', time.localtime()))
    os.system("scrapy crawl topicSpider")

