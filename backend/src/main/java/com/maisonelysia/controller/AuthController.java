package com.maisonelysia.controller;

import com.maisonelysia.model.User;
import com.maisonelysia.repository.UserRepository;
import com.maisonelysia.repository.OrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    ///////////////////////////////////////////////////////
    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User request) {

        request.setPassword(encoder.encode(request.getPassword()));

        if (request.getRole() == null || request.getRole().isEmpty()) {
            request.setRole("CLIENT");
        }

        User savedUser = userRepository.save(request);

        return ResponseEntity.ok(Map.of(
                "id", savedUser.getId(),
                "email", savedUser.getEmail(),
                "name", savedUser.getName(),
                "role", savedUser.getRole()
        ));
    }

    ///////////////////////////////////////////////////////
    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {

        String email = req.get("email");
        String password = req.get("password");

        User user = userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "User not found"));
        }

        if (!encoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Invalid email or password"));
        }

        Double total = 0.0;
        try {
            total = orderRepository.getTotalByUserId(user.getId());
            if (total == null) total = 0.0;
        } catch (Exception e) {
            System.out.println("Error total: " + e.getMessage());
        }

        String level;
        if (total > 500) level = "GOLD";
        else if (total > 200) level = "SILVER";
        else level = "BRONZE";

        Map<String, Object> response = new HashMap<>();

        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("name", user.getName());
        response.put("role", user.getRole());

        response.put("carte", Map.of(
                "type", level,
                "points", total.intValue()
        ));

        return ResponseEntity.ok(response);
    }
}