package com.maisonelysia.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class ChatService {

    private final RestTemplate restTemplate = new RestTemplate();

    public String askAI(String message, Map<String, Object> stats) {

        String url = "http://localhost:5000/chat";

        Map<String, Object> body = new HashMap<>();
        body.put("message", message);
        body.put("stats", stats);

        Map res = restTemplate.postForObject(url, body, Map.class);

        return (String) res.get("reply");
    }
}