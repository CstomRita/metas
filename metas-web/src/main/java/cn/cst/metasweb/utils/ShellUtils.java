package cn.cst.metasweb.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.InputStreamReader;

/**
 * @ Author     ：ChangSiteng
 * @ Date       ：Created in 08:30 2020-01-29
 * @ Description：shell工具类
 * @ Modified By：
 * @Version: $
 */
public class ShellUtils {

    private static Logger logger = LoggerFactory.getLogger(ShellUtils.class);

    public static void runShell(String shell) {
        try {
            Process process = Runtime.getRuntime().exec(new String[]{"/bin/sh","-c",shell});
            process.waitFor();
            BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream(),"GBK"));
            String line = null;
            while ( (line = in.readLine()) != null) {
                logger.info(line);
            }
            in.close();
        } catch (Exception e) {
            logger.warn(e.toString());
        }
    }
}
