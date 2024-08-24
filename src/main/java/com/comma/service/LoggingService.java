package com.comma.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class LoggingService {
    private static final Logger logger = LoggerFactory.getLogger(LoggingService.class);

    public void logPageVisit(String username, String pageName) {
        logger.info("User: {}, Page: {}, Time: {}", username, pageName, System.currentTimeMillis());
    }
}