package com.comma.config;

import com.comma.handler.AdminHandler;
import com.comma.handler.MessageHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new AdminHandler(), "/category-updates").setAllowedOrigins("*");
        registry.addHandler(new MessageHandler(), "/user-messages").setAllowedOrigins("*");
    }
}