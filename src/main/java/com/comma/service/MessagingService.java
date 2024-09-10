package com.comma.service;

import com.comma.handler.MessageHandler;
import org.springframework.stereotype.Service;

@Service
public class MessagingService {

    public void sendMessageToUser(String memberId, String message) {
        MessageHandler.sendMessageToUser(memberId, message);
    }
}