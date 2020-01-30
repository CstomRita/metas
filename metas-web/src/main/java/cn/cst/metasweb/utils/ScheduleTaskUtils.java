package cn.cst.metasweb.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.Trigger;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

/**
 * @ Author     ：ChangSiteng
 * @ Date       ：Created in 08:46 2020-01-29
 * @ Description：定时任务工具类
 * 通过这个类注册、删除定时任务
 * 主要组件：
 *  1一个map用于查找、记录
 *  2 一个ThreadPoolTaskScheduler可以注册定时任务
 *  3 scheduledFuture定时任务本身，有一个cancel方法可以取消定时任务
 * @ Modified By：
 * @Version: $
 */
@Component
public class ScheduleTaskUtils {

  private Map<String, ScheduledFuture<?>> taskList = new ConcurrentHashMap<>();
  private Logger logger = LoggerFactory.getLogger(ScheduleTaskUtils.class);

  @Autowired
  private ThreadPoolTaskScheduler threadPoolTaskScheduler;

  public boolean addTask(Runnable task, Trigger trigger,String key) {
      ScheduledFuture<?> schedule = threadPoolTaskScheduler.schedule(task, trigger);
      if (!taskList.containsKey(key)) {
          taskList.put(key,schedule);
          logger.info("已经增加名字为"+key+"的定时任务！");
          return true;
      }
      logger.error("已经存在名字为"+key+"的定时任务，无法增加！");
      return false;
  }

  public boolean removeTask(String key) {
      ScheduledFuture<?> toBeRemovedFuture = taskList.remove(key);
      if (toBeRemovedFuture != null) {
          toBeRemovedFuture.cancel(true);
          logger.info("已经删除名字为"+key+"的定时任务！");
          return true;
      }else{
          logger.error("不存在名字为"+key+"的定时任务！");
          return false;
      }
  }


    /**
     * 更新定时任务
     * 有可能会出现：
     * 1、旧的任务不存在，此时直接添加新任务；
     * 2、旧的任务存在，先删除旧的任务，再添加新的任务
     * @param task 任务
     * @param trigger 定时器
     * @param key 任务名称
     * @return
     */
    public boolean updateTask(Runnable task, Trigger trigger, String key) {
        ScheduledFuture toBeRemovedFuture = taskList.remove(key);
        // 存在则删除旧的任务
        if (toBeRemovedFuture != null) {
            toBeRemovedFuture.cancel(true);
        }
        return addTask(task, trigger, key);
    }

    /**
     * @Author: ChangSiteng
     * @Description: 是否包含名称为key的定时任务
     * @return: boolean
     */
    public boolean containsTask(String key) {
        return taskList.containsKey(key);
    }
}
