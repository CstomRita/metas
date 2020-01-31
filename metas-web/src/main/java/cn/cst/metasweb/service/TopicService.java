package cn.cst.metasweb.service;

import cn.cst.metasweb.pojo.Topic;
import cn.cst.metasweb.pojo.TopicAnalysisResult;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

/**
 * @ Author     ：ChangSiteng
 * @ Date       ：Created in 14:25 2020-01-27
 * @ Description：
 * @ Modified By：
 * @Version: $
 */
@Service
public interface TopicService {
    ArrayList<Topic> getHotTopic();
    TopicAnalysisResult getAnalysisResult(String topic);
    Boolean concernTopic(String topic);
    Boolean cancelConcernTopic(String topic);
    ArrayList<TopicAnalysisResult> getTopicTrend(String topic,String concernTime);
    ArrayList<Topic> getConcernTopicInfo(ArrayList<String> concernTopicList);
}
