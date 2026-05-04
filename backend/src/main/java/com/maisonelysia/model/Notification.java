package com.maisonelysia.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // getters & setters
    public Long getId() { return id; }
    public String getMessage() { return message; }
    public Boolean getIsRead() { return isRead; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public User getUser() { return user; }

    public void setId(Long id) { this.id = id; }
    public void setMessage(String message) { this.message = message; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUser(User user) { this.user = user; }
}