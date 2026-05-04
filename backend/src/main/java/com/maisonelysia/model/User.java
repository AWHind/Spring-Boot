package com.maisonelysia.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    // 🔥 SECURITY FIX
    @JsonIgnore
    @Column(nullable = false)
    private String password;

    private String name;

    private String phone;

    @Column(nullable = false)
    private String role;

    private String adresse;

    ///////////////////////////////////////////////////////
    // RELATION CARTE
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "carte_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Carte carte;

    ///////////////////////////////////////////////////////
    // GETTERS & SETTERS

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }

    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }

    public void setRole(String role) { this.role = role; }

    public String getAdresse() { return adresse; }

    public void setAdresse(String adresse) { this.adresse = adresse; }

    public Carte getCarte() { return carte; }

    public void setCarte(Carte carte) { this.carte = carte; }
}