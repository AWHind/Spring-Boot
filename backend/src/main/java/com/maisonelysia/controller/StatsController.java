package com.maisonelysia.controller;

import com.maisonelysia.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StatsController {

    private final OrderRepository orderRepository;

    @GetMapping("/stats/last7days")
    public List<Map<String, Object>> last7days() {

        LocalDate today = LocalDate.now();
        List<Map<String, Object>> result = new ArrayList<>();

        for (int i = 6; i >= 0; i--) {

            LocalDate day = today.minusDays(i);

            LocalDateTime start = day.atStartOfDay();
            LocalDateTime end = day.plusDays(1).atStartOfDay();

            int count = orderRepository.countBetween(start, end);

            Map<String, Object> map = new HashMap<>();
            map.put("day", day.getDayOfWeek().toString().substring(0, 3));
            map.put("orders", count);

            result.add(map);
        }

        return result;
    }
}