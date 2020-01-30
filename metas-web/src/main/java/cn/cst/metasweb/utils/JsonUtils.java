package cn.cst.metasweb.utils;

import cn.cst.metasweb.service.Impl.TopicServiceImpl;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;

/**
 * @ Author     ：ChangSiteng
 * @ Date       ：Created in 16:30 2020-01-28
 * @ Description：JSON工具
 * @ Modified By：
 * @Version: $
 */
public class JsonUtils {

    private static Logger logger = LoggerFactory.getLogger(JsonUtils.class);

    public static JSONObject readJson(String jsonFilePath) {
        try {
            File file = new File(jsonFilePath);
            String input = FileUtils.readFileToString(file,"UTF-8");
            JSONObject obj = JSON.parseObject(input);
            return obj;
        } catch (Exception e) {
            logger.warn(e.toString());
            return null;
        }
    }
}
