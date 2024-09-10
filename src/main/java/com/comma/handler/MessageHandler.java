package com.comma.handler;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

public class MessageHandler extends TextWebSocketHandler {

    private static final ConcurrentHashMap<String, WebSocketSession> userSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String memberId = getMemberId(session);
        userSessions.put(memberId, session);
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Handle incoming messages if needed
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String memberId = getMemberId(session);
        userSessions.remove(memberId);
    }

    private String getMemberId(WebSocketSession session) {
        // Extract memberId from session attributes or query parameters
        return (String) session.getAttributes().get("memberId");
    }

    public static void sendMessageToUser(String memberId, String message) {
        WebSocketSession session = userSessions.get(memberId);
        if (session != null && session.isOpen()) {
            try {
                session.sendMessage(new TextMessage(message));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}