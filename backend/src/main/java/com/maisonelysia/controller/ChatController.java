package com.maisonelysia.controller;

import com.maisonelysia.dto.ChatMessageDTO;
import com.maisonelysia.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping
    public ResponseEntity<ChatMessageDTO> sendMessage(@RequestBody ChatMessageDTO messageDTO) {
        ChatMessageDTO response = chatbotService.processMessage(messageDTO.getUserMessage());
        return ResponseEntity.ok(response);
    }

}
