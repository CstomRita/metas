package cn.cst.metasweb.controller;

import cn.cst.metasweb.pojo.Topic;
import cn.cst.metasweb.service.TopicService;
import cn.cst.metasweb.utils.ResponseResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.Null;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;

/**
 * @ Author     ：ChangSiteng
 * @ Date       ：Created in 14:20 2020-01-27
 * @ Description：话题Controller
 * @ Modified By：
 * @Version: $
 */
@CrossOrigin
@Controller
public class TopicController {

    private Logger logger = LoggerFactory.getLogger(TopicController.class);

    @Autowired
    TopicService topicService;

    @RequestMapping("/getHotTopic")
    @ResponseBody
    public ResponseResult getHotTopic() {
        logger.info("接收请求");
        ArrayList<Topic> hotTopic = topicService.getHotTopic();
        logger.info("将返回"+hotTopic.size());
        return ResponseResult.success(hotTopic);
    }

    @RequestMapping("/getTopicAnalysis/{topic}")
    @ResponseBody
    public ResponseResult getTopicAnalysis(@PathVariable String topic){
        try {
            topic = URLDecoder.decode(topic, "GBK");
        } catch (UnsupportedEncodingException e) {
            logger.warn(e.toString());
        }
        return ResponseResult.success(topicService.getAnalysisResult(topic));
    }

    @RequestMapping("/concernTopic/{topic}")
    @ResponseBody
    public ResponseResult concernTopic(@PathVariable String topic){
        if (topicService.concernTopic(topic)) {
            return ResponseResult.success();
        }
        return ResponseResult.error();
    }

    @RequestMapping("/cancelConcernTopic/{topic}")
    @ResponseBody
    public ResponseResult cancelConcernTopic(@PathVariable String topic) {
        if (topicService.cancelConcernTopic(topic)) {
            return ResponseResult.success();
        }
        return ResponseResult.error();
    }


    @RequestMapping("/getTopicTrend/{topic}/{time}")
    @ResponseBody
    public ResponseResult getTopicTrend(@PathVariable String topic,@PathVariable String time){
        try {
            topic = URLDecoder.decode(topic, "GBK");
            time = URLDecoder.decode(time, "GBK");
        } catch (UnsupportedEncodingException e) {
            logger.warn(e.toString());
        }
        return ResponseResult.success(topicService.getTopicTrend(topic,time));
    }

    @RequestMapping(value = "/getConcernTopicInfo",method = RequestMethod.POST)
    @ResponseBody
    public ResponseResult getConcernTopicInfo(@RequestParam(value = "concernTopicList",required = false) ArrayList<String> concernTopicList) {
        return ResponseResult.success(topicService.getConcernTopicInfo(concernTopicList));
    }
}
