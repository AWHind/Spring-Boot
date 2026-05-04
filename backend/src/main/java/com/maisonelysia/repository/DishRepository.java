package com.maisonelysia.repository;

import com.maisonelysia.model.Dish;
import com.maisonelysia.model.Category; // 🔥 مهم

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; // 🔥 مهم
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DishRepository extends JpaRepository<Dish, Long> {

    /* ================= BASIC ================= */

    // 🔹 filter par catégorie (FIX)
    List<Dish> findByCategory(Category category);

    /* ================= PROMO ================= */

    // 🔥 client menu avec promo
    @Query("""
        SELECT DISTINCT d FROM Dish d
        LEFT JOIN FETCH d.promotions
    """)
    List<Dish> findAllWithPromotions();

    // 🔥 catégorie + promo
    @Query("""
        SELECT DISTINCT d FROM Dish d
        LEFT JOIN FETCH d.promotions
        WHERE d.category = :category
    """)
    List<Dish> findByCategoryWithPromotions(@Param("category") Category category);

}