package com.maisonelysia.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AiService {

    private final RestTemplate restTemplate = new RestTemplate();

    // 🔮 Prediction API (Flask /predict)
    public Map<String, Object> getPrediction(Object data) {

        try {
            String url = "http://localhost:5000/predict";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Object> request = new HttpEntity<>(data, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            return response.getBody();

        } catch (Exception e) {
            e.printStackTrace();

            // 🔥 fallback باش ما يطيحش Spring
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("tomorrowOrders", 0);
            fallback.put("confidence", 0.0);
            fallback.put("trend", "ERROR");

            return fallback;
        }
    }

    // 💬 Chat API (Flask /chat)
    public Map<String, Object> chat(Map<String, Object> body) {

        try {
            String url = "http://localhost:5000/chat";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            return response.getBody();

        } catch (Exception e) {
            e.printStackTrace();

            Map<String, Object> fallback = new HashMap<>();
            fallback.put("reply", "AI service unavailable 🤖");

            return fallback;
        }
    }
}