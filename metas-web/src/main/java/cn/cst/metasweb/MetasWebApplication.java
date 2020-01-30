package cn.cst.metasweb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MetasWebApplication {

    public static void main(String[] args) {

        SpringApplication.run(MetasWebApplication.class, args);
    }

}
