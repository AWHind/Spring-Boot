package com.maisonelysia.controller;

import com.maisonelysia.model.Notification;
import com.maisonelysia.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    // GET notifications by user
    @GetMapping("/user/{id}")
    public List<Notification> getUserNotifications(@PathVariable Long id) {
        return notificationRepository.findByUser_IdOrderByCreatedAtDesc(id);
    }

    // mark as read
    @PutMapping("/{id}/read")
    public Notification markAsRead(@PathVariable Long id) {
        Notification n = notificationRepository.findById(id).orElseThrow();
        n.setIsRead(true);
        return notificationRepository.save(n);
    }
}