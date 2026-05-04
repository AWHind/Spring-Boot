package com.maisonelysia.service;

import org.springframework.stereotype.Service; // 🔥 هذا هو الحل

@Service
public class CarteService {

    public String calculateLevel(double total) {

        if (total > 500) return "GOLD";
        if (total > 200) return "SILVER";
        return "BRONZE";
    }
}