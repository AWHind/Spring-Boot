package com.maisonelysia.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double total;
    private String status; // PENDING, VALIDATED...
    private LocalDateTime createdAt;
    private String deliveryAddress;
    private String notes;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"password"})
    private User user;

    public Order() {
        this.createdAt = LocalDateTime.now();
    }

    // getters/setters
    public Long getId() { return id; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}