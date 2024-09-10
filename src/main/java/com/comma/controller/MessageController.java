package com.comma.controller;

import com.comma.service.MessagingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessagingService messagingService;

    @PostMapping("/send")
    public void sendMessage(@RequestParam String memberId, @RequestParam String message) {
        messagingService.sendMessageToUser(memberId, message);
    }
}