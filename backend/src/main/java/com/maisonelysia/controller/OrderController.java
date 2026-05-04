package com.maisonelysia.controller;

import com.maisonelysia.model.Order;
import com.maisonelysia.model.User;
import com.maisonelysia.model.Notification;

import com.maisonelysia.repository.OrderRepository;
import com.maisonelysia.repository.UserRepository;
import com.maisonelysia.repository.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> body) {

        try {
            Long userId = Long.valueOf(body.get("userId").toString());
            Double total = Double.valueOf(body.get("total").toString());

            String address = (String) body.get("address");
            String notes = (String) body.get("notes");

            User user = userRepository.findById(userId).orElse(null);

            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            Order order = new Order();
            order.setUser(user);
            order.setTotal(total);
            order.setStatus("PENDING");
            order.setCreatedAt(LocalDateTime.now());
            order.setDeliveryAddress(address);
            order.setNotes(notes);

            orderRepository.save(order);

            return ResponseEntity.ok(order);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error");
        }
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/user/{id}")
    public List<Order> getUserOrders(@PathVariable Long id) {
        return orderRepository.findByUser_IdOrderByCreatedAtDesc(id);
    }

    @PutMapping("/{id}/deliver")
    public ResponseEntity<?> deliverOrder(@PathVariable Long id) {

        Order order = orderRepository.findById(id).orElse(null);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        order.setStatus("DELIVERED");
        orderRepository.save(order);

        Notification n = new Notification();
        n.setUser(order.getUser());
        n.setMessage("Votre commande #" + order.getId() + " est livrée !");
        n.setIsRead(false);
        n.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(n);

        return ResponseEntity.ok(order);
    }
}