package cn.cst.metasweb.pojo;

import org.springframework.context.annotation.Bean;

/**
 * @ Author     ：ChangSiteng
 * @ Date       ：Created in 14:26 2020-01-27
 * @ Description：话题
 * @ Modified By：
 * @Version: $
 */

public class Topic {
   private  String topicName;
   private  String topicDesc;
   private  String readCount;
   private  String discussCount;
   private  String coverUrl;

    public String getCoverUrl() {
        return coverUrl;
    }

    public void setCoverUrl(String coverUrl) {
        this.coverUrl = coverUrl;
    }

    public Topic(String topicName, String topicDesc, String discussCount, String readCount,String coverUrl) {
        this.topicName = topicName;
        this.topicDesc = topicDesc;
        this.readCount = readCount;
        this.discussCount = discussCount;
        this.coverUrl = coverUrl;
    }

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    public String getTopicDesc() {
        return topicDesc;
    }

    public void setTopicDesc(String topicDesc) {
        this.topicDesc = topicDesc;
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
}
