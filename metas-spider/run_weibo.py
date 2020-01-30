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
    now_time = time.strftime('%Y-%m-%d-%H', time.localtime())
    print('++++++++运行任务', now_time)
    os.system("scrapy crawl mblogSpider -a topic="+topic)


    base_path = "/Users/changsiteng/PycharmProjects/weiboSA/topic/"
    datapath = base_path + topic + "/" + topic + now_time + ".txt"

    gpu_base_path = ""

    '''
    1 将爬好的文件推送至gpu topic/call.txt文件中 
    2 登录GPU 调用模型结果写入 call_result.txt 和 call_result_count.txt中
    3 将call_result.txt复制到本地topic/result/topic+time.txt中
    4 call_result_count.txt复制到本地topic/resultCount/topic+time.txt中
    '''
    os.system("scp "+datapath+" cst@gpu:"+gpu_base_path+"/data/calldata/"+topic+"/call.txt")

    # !!!!!!!!!!! 在这里决定了 cd 到哪个文件夹 + 调用哪个模型 (4 0 )
    os.system("ssh gpu && cd " + gpu_base_path + "/train_04_emojiupdate1 && "
                                                 "CUDA_VISIBLE_DEVICES=2 python -u train.py 4 0 0 "+topic)

    if not os.path.exists(base_path+topic+"/result"):
        os.mkdir(base_path+topic+"/result")
    if not os.path.exists(base_path + topic + "/resultcount"):
        os.mkdir(base_path + topic + "/resultcount")

    os.system("scp cst@gpu:"+gpu_base_path+"/data/calldata/"+topic+"/call_result.txt  " +
              base_path + topic+"/result/"+ topic + now_time+".txt")

    os.system("scp cst@gpu:"+gpu_base_path+"/data/calldata/"+topic+"/call_result_count.json  " +
              base_path + topic + "/resultcount/" + topic + now_time + ".json")



