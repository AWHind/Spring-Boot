package com.maisonelysia.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class Carte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // GOLD / SILVER / BRONZE

    private int points;

    // 🔥 relation inverse (optionnelle mais pro)
    @OneToOne(mappedBy = "carte")
    @JsonIgnore
    private User user;

    // ===== GETTERS & SETTERS =====

    public Long getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}