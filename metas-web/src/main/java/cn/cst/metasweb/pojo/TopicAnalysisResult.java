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

    JSONObject analysisResult;

    public TopicAnalysisResult(String topicName, String readCount, String discussCount, String coverUrl, JSONObject analysisResult) {
        this.topicName = topicName;
        this.readCount = readCount;
        this.discussCount = discussCount;
        this.coverUrl = coverUrl;
        this.analysisResult = analysisResult;
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
