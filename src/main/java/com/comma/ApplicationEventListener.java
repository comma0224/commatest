package com.comma;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.stereotype.Component;

@Component
public class ApplicationEventListener implements ApplicationListener<ApplicationStartedEvent> {

    private static final Logger logger = LoggerFactory.getLogger(ApplicationEventListener.class);

    @Override
    public void onApplicationEvent(ApplicationStartedEvent event) {
        logger.info("");
        logger.info("===================================");
        logger.info("== Comma 시작 기동이 완료되었습니다. ==");
        logger.info("===================================");
        logger.info("");
    }

    @Component
    public static class ApplicationReadyEventListener implements ApplicationListener<ApplicationReadyEvent> {
        @Override
        public void onApplicationEvent(ApplicationReadyEvent event) {
            logger.info("");
            logger.info("========================");
            logger.info("== Comma 준비되었습니다. ==");
            logger.info("========================");
            logger.info("");
        }
    }

    @Component
    public static class ContextClosedEventListener implements ApplicationListener<ContextClosedEvent> {
        @Override
        public void onApplicationEvent(ContextClosedEvent event) {
            logger.info("");
            logger.info("===================================");
            logger.info("== Comma 종료 기동이 완료되었습니다. ==");
            logger.info("===================================");
            logger.info("");
        }
    }
}