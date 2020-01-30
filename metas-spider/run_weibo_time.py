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
    topic = sys.argv[1]
    while True:
        os.system("Python run_weibo.py "+ topic)
        time.sleep(60*60)  # 一小时运行一次

