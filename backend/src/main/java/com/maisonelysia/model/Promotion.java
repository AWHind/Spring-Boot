package com.maisonelysia.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double discount;

    private String type; // PERCENT / FIXED

    private Boolean active = true;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @ManyToMany
    @JoinTable(
            name = "promotion_dishes",
            joinColumns = @JoinColumn(name = "promotion_id"),
            inverseJoinColumns = @JoinColumn(name = "dish_id")
    )
    private List<Dish> dishes;
}