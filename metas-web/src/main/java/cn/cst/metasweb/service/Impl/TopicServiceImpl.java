package cn.cst.metasweb.service.Impl;

import cn.cst.metasweb.pojo.Topic;
import cn.cst.metasweb.pojo.TopicAnalysisResult;
import cn.cst.metasweb.service.TopicService;
import cn.cst.metasweb.utils.JsonUtils;
import cn.cst.metasweb.utils.ScheduleTaskUtils;
import cn.cst.metasweb.utils.ShellUtils;
import com.alibaba.fastjson.JSONObject;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.Trigger;
import org.springframework.scheduling.TriggerContext;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Component;

import java.io.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

/**
 * @ Author     ：ChangSiteng
 * @ Date       ：Created in 14:25 2020-01-27
 * @ Description：
 * @ Modified By：
 * @Version: $
 */
@Component
public class TopicServiceImpl implements TopicService {

    private final String dataPath = "/Users/changsiteng/PycharmProjects/WeMediaSentimentAnalysis/metas/metas-spider";
    private Logger logger = LoggerFactory.getLogger(TopicServiceImpl.class);
    private SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd-HH");

    @Override
    public ArrayList<Topic> getHotTopic() {
        String date = df.format(new Date());
        String hottopicPath = dataPath + "/hottopic/" + date + "/topic.txt";
        File file = new File(hottopicPath);

        /**
         * 文件不存在，证明需要运行爬虫程序
         */
        if (!file.exists()) {
            String cmd = "cd "+ dataPath + " && python run_hottopic.py";
            System.out.println(cmd);
            ShellUtils.runShell(cmd);
        }

        /**
         * 文件存在直接读取
         */
        ArrayList<Topic> topicList = new ArrayList<Topic>();
        try {
            BufferedReader br = new BufferedReader(new FileReader(new File(hottopicPath)));
            String s = null;
            while ( (s = br.readLine()) != null) {
                String[] mess = s.trim().split("\\t");
                String topicName = mess[1];
                String topicDesc = mess[2];
                String[] counts = mess[3].split(" ");
                String disscussCount = counts[0].substring(0, counts[0].length() - 2);
                String readCount = counts[1].substring(0, counts[1].length() - 2);
                String coverUrl = mess[4].trim();
                topicList.add(new Topic(topicName,topicDesc,disscussCount,readCount,coverUrl));
            }
            br.close();
        } catch (Exception e) {
            logger.warn(e.toString());
        }

        return topicList;
    }


    @Override
    public TopicAnalysisResult getAnalysisResult(String topic) {
        /**
         先看dataPath/topic/topic/resultcount/topic+时间.txt是否存在
         不存在 需要运行爬虫+调用模型的脚本 run_weibo.py
         存在则直接拿数据
         **/

//        String date = df.format(new Date());
        String date = "2020-01-10-08";
        String resultPath = dataPath + "/topic/" + topic + "/resultcount/"
                + topic + date + ".json";
        File file = new File(resultPath);

        /**
         * 文件不存在，证明需要运行爬虫程序
         */
        if (!file.exists()) {
            String cmd = "cd "+ dataPath + " && python run_weibo.py "+topic;
            System.out.println(cmd);
            ShellUtils.runShell(cmd);
        }
        JSONObject analysisResult = JsonUtils.readJson(resultPath);
        Topic topicInfo = getTopicInfo(topic);
        return new TopicAnalysisResult(topicInfo,analysisResult);
    }

    @Autowired
    ScheduleTaskUtils scheduleTaskUtils;

    @Override
    public Boolean concernTopic(String topic) {
        String cmd = "cd "+ dataPath + " && python run_weibo.py "+topic;
        if (scheduleTaskUtils.containsTask(topic)) return true;
        return (scheduleTaskUtils.addTask(new Runnable() {
            @Override
            public void run() {
//                ShellUtils.runShell(cmd);
                System.out.println(cmd);
            }
        }, new Trigger() {
            @Override
            public Date nextExecutionTime(TriggerContext triggerContext) {
                // 触发器
                String cron = "0 0 * * * ?";
                CronTrigger trigger = new CronTrigger(cron);
                return trigger.nextExecutionTime(triggerContext);
            }
        }, topic));
    }

    @Override
    public Boolean cancelConcernTopic(String topic) {
        // 本来先查找数据库里是否还有人关注，这里由于简单，就直接取消了
        return scheduleTaskUtils.removeTask(topic);
    }

    @Override
    public ArrayList<TopicAnalysisResult> getTopicTrend(String topic, String concernTime) {
        ArrayList<TopicAnalysisResult> results = new ArrayList<>();
        Topic topicInfo = getTopicInfo(topic);

        String folerPath = dataPath + "/topic/" + topic + "/resultcount";
        File[] files = new File(folerPath).listFiles();
        for (File file : files) {
            String fileTime = file.getName().split(".json")[0].substring(topic.length());
            try {
                if (df.parse(concernTime).compareTo(df.parse(fileTime)) <= 0) {
                    JSONObject analysisResult = JsonUtils.readJson(file.getPath());
                    TopicAnalysisResult result = new TopicAnalysisResult(
                           topicInfo, analysisResult
                    );
                    results.add(result);
                }
            } catch (ParseException e) {
                logger.warn(e.toString());
            }
        }
        return results;
    }

    /**
     * @Author: ChangSiteng
     * @Description: 已有文件的情况下，获取Topic信息
     */
    private Topic getTopicInfo(String topicName) {
        String topicPath = dataPath + "/topic/" + topicName  + "/" + topicName +".txt";
        String readCount = "";
        String discussCount = "";
        String coverUrl = "";
        String topicDesc = "";
        try {
            BufferedReader br = new BufferedReader(new FileReader(new File(topicPath)));
            String s = null;
            while ((s = br.readLine()) != null) {
                String[] mess = s.trim().split("\\t");
                System.out.println(mess.length);
                readCount = mess[0].substring(2);
                discussCount = mess[1].substring(2);
                coverUrl = mess[2].trim();
                if (mess.length > 3) {
                    logger.info(topicName + "有描述desc");
                    topicDesc = mess[3];
                }else{
                    logger.info(topicName + "无描述desc");
                }
            }
        }catch (Exception e) {
            logger.warn(e.toString());
        }
        return new Topic(topicName,topicDesc,discussCount,readCount,coverUrl);
    }

    /**
     * @Author: ChangSiteng
     * @Description: 给定话题名称 获取其简介、讨论人数等等....
     * @param concernTopicList:
     * @return: java.util.ArrayList<cn.cst.metasweb.pojo.Topic>
     */
    @Override
    public ArrayList<Topic> getConcernTopicInfo(ArrayList<String> concernTopicList) {
        ArrayList<Topic> list = new ArrayList<>();
        for (String topicName:concernTopicList) {
            if (!new File(dataPath + "/topic/" + topicName  + "/" + topicName +".txt").exists()) {
                String cmd = "cd "+ dataPath + " && scrapy crawl mblogSpider -a topic="+topicName;
                logger.info("运行"+cmd);
                ShellUtils.runShell(cmd);
            }
            list.add(getTopicInfo(topicName.trim()));
        }
        return list;
    }

    @Test
    public void test(){
//        getTopicTrend("小黄车","2020-01-10-08");
        getTopicInfo("小黄车");
    }


    }
