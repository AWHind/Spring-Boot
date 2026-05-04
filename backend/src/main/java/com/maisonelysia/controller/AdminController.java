package com.maisonelysia.controller;

import com.maisonelysia.model.Order;
import com.maisonelysia.model.User;
import com.maisonelysia.repository.UserRepository;
import com.maisonelysia.repository.OrderRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    // 🔥 TEST (مهم برشا)
    @GetMapping("/test")
    public String test() {
        return "ADMIN WORKING 🔥";
    }

    /* ================= STATS ================= */
    @GetMapping("/stats")
    public Map<String, Object> getStats() {

        long totalOrders = orderRepository.count();
        long totalClients = userRepository.count();

        double revenue = orderRepository.findAll()
                .stream()
                .mapToDouble(Order::getTotal)
                .sum();

        double avgBasket = totalOrders > 0 ? revenue / totalOrders : 0;

        return Map.of(
                "orders", totalOrders,
                "revenue", revenue,
                "avgBasket", avgBasket,
                "clients", totalClients
        );
    }

    /* ================= LAST ORDERS ================= */
    @GetMapping("/latest-orders")
    public List<Order> getLatestOrders() {
        return orderRepository.findTop5ByOrderByCreatedAtDesc();
    }

    /* ================= CUSTOMERS ================= */
    @GetMapping("/customers")
    public List<Map<String, Object>> getCustomers() {

        List<User> users = userRepository.findByRole("CLIENT");
        List<Map<String, Object>> result = new ArrayList<>();

        for (User user : users) {

            List<Order> orders = new ArrayList<>();

            try {
                orders = orderRepository.findByUser_Id(user.getId());
            } catch (Exception e) {
                System.out.println("ERROR fetching orders for user " + user.getId());
            }

            int totalOrders = orders.size();

            double totalSpent = orders.stream()
                    .mapToDouble(Order::getTotal)
                    .sum();

            String loyalty = "bronze";
            if (totalOrders >= 10) loyalty = "gold";
            else if (totalOrders >= 5) loyalty = "silver";

            Map<String, Object> map = new HashMap<>();
            map.put("id", user.getId());
            map.put("name", user.getName());
            map.put("email", user.getEmail());
            map.put("totalOrders", totalOrders);
            map.put("totalSpent", totalSpent);
            map.put("loyaltyTier", loyalty);

            result.add(map);
        }

        return result;
    }

    /* ================= PROMO STATS ================= */
    @GetMapping("/promotions/stats")
    public List<Integer> getPromoStats() {

        // 🔥 TEMP DATA (باش يبان chart)
        return List.of(1, 3, 2, 5, 4, 6, 2);
    }

    /* ================= REVENUE ================= */
    @GetMapping("/revenue")
    public List<Double> getRevenue() {
        return List.of(120.0, 200.0, 150.0, 300.0, 250.0, 400.0, 350.0);
    }

    /* ================= CATEGORIES ================= */
    @GetMapping("/categories")
    public List<Integer> getCategories() {
        return List.of(5, 10, 7, 3);
    }

}