package com.maisonelysia.controller;

import com.maisonelysia.repository.OrderRepository;
import com.maisonelysia.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/forecast")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ForecastController {

    private final OrderRepository orderRepository;
    private final AiService aiService;

    @GetMapping
    public Map<String, Object> getForecast() {

        try {
            LocalDate today = LocalDate.now();
            LocalDateTime start = today.minusDays(6).atStartOfDay();

            List<Object[]> raw = orderRepository.countLastDays(start);

            List<Map<String, Object>> last7Days = new ArrayList<>();

            for (Object[] r : raw) {
                Map<String, Object> d = new HashMap<>();
                d.put("day", r[0].toString());
                d.put("count", ((Number) r[1]).intValue());
                last7Days.add(d);
            }

            Map<String, Object> ai = aiService.getPrediction(last7Days);

            Map<String, Object> res = new HashMap<>();
            res.put("last7Days", last7Days);
            res.put("predictedTomorrowOrders", ai.get("tomorrowOrders"));
            res.put("confidence", ai.get("confidence"));
            res.put("trend", ai.get("trend"));

            return res;

        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("error", e.getMessage());
        }
    }
}