package cn.cst.metasweb.pojo;

import com.alibaba.fastjson.JSONObject;

/**
 * @ Author     ：ChangSiteng
 * @ Date       ：Created in 09:42 2020-01-28
 * @ Description：情感分析结果
 * @ Modified By：
 * @Version: $
 */
public class TopicAnalysisResult {

    String topicName;
    String readCount;
    String discussCount;
    String coverUrl;
    String topicDesc;
    String time;

    public TopicAnalysisResult(String topicName, String readCount, String discussCount, String coverUrl, String topicDesc, String time, JSONObject analysisResult) {
        this.topicName = topicName;
        this.readCount = readCount;
        this.discussCount = discussCount;
        this.coverUrl = coverUrl;
        this.topicDesc = topicDesc;
        this.time = time;
        this.analysisResult = analysisResult;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    JSONObject analysisResult;

    public TopicAnalysisResult(String topicName, String readCount, String discussCount, String coverUrl, String topicDesc, JSONObject analysisResult) {
        this.topicName = topicName;
        this.readCount = readCount;
        this.discussCount = discussCount;
        this.coverUrl = coverUrl;
        this.topicDesc = topicDesc;
        this.analysisResult = analysisResult;
    }

    public TopicAnalysisResult(Topic topic,JSONObject analysisResult){
        this.topicName = topic.getTopicName();
        this.readCount = topic.getReadCount();
        this.discussCount = topic.getDiscussCount();
        this.coverUrl = topic.getCoverUrl();
        this.topicDesc = topic.getTopicDesc();
        this.analysisResult = analysisResult;
    }
    public TopicAnalysisResult(Topic topic,JSONObject analysisResult,String time){
        this.topicName = topic.getTopicName();
        this.readCount = topic.getReadCount();
        this.discussCount = topic.getDiscussCount();
        this.coverUrl = topic.getCoverUrl();
        this.topicDesc = topic.getTopicDesc();
        this.analysisResult = analysisResult;
        this.time = time;
    }

    public String getTopicDesc() {
        return topicDesc;
    }

    public void setTopicDesc(String topicDesc) {
        this.topicDesc = topicDesc;
    }

    public String getCoverUrl() {
        return coverUrl;
    }

    public void setCoverUrl(String coverUrl) {
        this.coverUrl = coverUrl;
    }

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    public String getReadCount() {
        return readCount;
    }

    public void setReadCount(String readCount) {
        this.readCount = readCount;
    }

    public String getDiscussCount() {
        return discussCount;
    }

    public void setDiscussCount(String discussCount) {
        this.discussCount = discussCount;
    }

    public JSONObject getAnalysisResult() {
        return analysisResult;
    }

    public void setAnalysisResult(JSONObject analysisResult) {
        this.analysisResult = analysisResult;
    }
}
