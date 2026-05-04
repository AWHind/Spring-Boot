package com.maisonelysia.repository;

import com.maisonelysia.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    // 🔐 login
    User findByEmail(String email);

    // 👥 admin → clients فقط
    List<User> findByRole(String role);

    // 📊 dashboard → عدد users حسب role
    long countByRole(String role);
}