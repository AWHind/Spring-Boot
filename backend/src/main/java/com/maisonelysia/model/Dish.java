package com.maisonelysia.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "dishes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dish {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private Double price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String image;

    @Builder.Default
    private Integer rating = 0;

    @Builder.Default
    private Integer reviews = 0;

    @Builder.Default
    private Boolean vegetarian = false;

    @Builder.Default
    private Boolean glutenFree = false;

    @Builder.Default
    private Boolean available = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /* 🔥 RELATION PROMOTION */
    @ManyToMany(mappedBy = "dishes")
    @JsonIgnore
    private List<Promotion> promotions;

    /* ================= PROMO LOGIC ================= */

    // ✅ FIX هنا
    @JsonProperty("discount")
    public Double getDiscount() {
        if (promotions != null && !promotions.isEmpty()) {
            return promotions.get(0).getDiscount(); // ✔ Double
        }
        return null;
    }

    @JsonProperty("promoPrice")
    public Double getPromoPrice() {
        if (promotions != null && !promotions.isEmpty()) {
            Promotion p = promotions.get(0);
            return price - (price * p.getDiscount() / 100);
        }
        return null;
    }

    /* ================= AUTO DATES ================= */

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}