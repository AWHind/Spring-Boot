package com.maisonelysia.controller;

import com.maisonelysia.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AiController {

    private final AiService aiService;

    @PostMapping("/predict")
    public Map<String, Object> predict(@RequestBody Object body) {
        return aiService.getPrediction(body);
    }

    @PostMapping("/chat")
    public Map<String, Object> chat(@RequestBody Map<String, Object> body) {
        return aiService.chat(body);
    }
}