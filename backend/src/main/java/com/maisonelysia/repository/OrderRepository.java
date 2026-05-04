package com.maisonelysia.repository;

import com.maisonelysia.model.Order;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    ///////////////////////////////////////////////////////
    // ✅ Orders by user (simple)
    List<Order> findByUser_Id(Long userId);

    ///////////////////////////////////////////////////////
    // 🔥 IMPORTANT: Orders sorted (استعمل هذا)
    List<Order> findByUser_IdOrderByCreatedAtDesc(Long userId);

    ///////////////////////////////////////////////////////
    // ✅ Latest 5 orders
    List<Order> findTop5ByOrderByCreatedAtDesc();

    ///////////////////////////////////////////////////////
    // ✅ Total per user
    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE o.user.id = :userId")
    Double getTotalByUserId(@Param("userId") Long userId);

    ///////////////////////////////////////////////////////
    // ✅ Count between dates
    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :start AND o.createdAt < :end")
    int countBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    ///////////////////////////////////////////////////////
    // ✅ Sum between dates
    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE o.createdAt >= :start AND o.createdAt < :end")
    Double sumBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    ///////////////////////////////////////////////////////
    // 🔥 AI - count last days
    @Query("""
        SELECT FUNCTION('DATE', o.createdAt), COUNT(o)
        FROM Order o
        WHERE o.createdAt >= :start
        GROUP BY FUNCTION('DATE', o.createdAt)
        ORDER BY FUNCTION('DATE', o.createdAt)
    """)
    List<Object[]> countLastDays(@Param("start") LocalDateTime start);

    ///////////////////////////////////////////////////////
    // 🔥 AI - revenue last days
    @Query("""
        SELECT FUNCTION('DATE', o.createdAt), COALESCE(SUM(o.total),0)
        FROM Order o
        WHERE o.createdAt >= :start
        GROUP BY FUNCTION('DATE', o.createdAt)
        ORDER BY FUNCTION('DATE', o.createdAt)
    """)
    List<Object[]> revenueLastDays(@Param("start") LocalDateTime start);
}