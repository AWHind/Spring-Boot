# 🍽️ Maison Élysia – Plateforme intelligente de gestion de restaurant

## 🚀 Présentation

**Maison Élysia** est une application Full Stack moderne dédiée à la gestion des restaurants.
Elle permet de gérer les commandes clients, les traitements côté administrateur et un système de notifications automatique.

🎯 Objectif :

* Simplifier la gestion des commandes
* Améliorer l’expérience client
* Automatiser les notifications

---

## 🧠 Concept

Le projet simule un système réel :

👤 Client → passe une commande
👨‍💼 Admin → valide / livre
🔔 Système → envoie notification

---

## 🏗️ Architecture

```
Frontend (Next.js)
        ↓
Backend (Spring Boot API)
        ↓
Base de données (MySQL)
```

---

## 🛠️ Technologies utilisées

### 🔙 Backend

* Java 17
* Spring Boot
* Spring Data JPA
* MySQL

### 🔜 Frontend

* Next.js (React)
* Tailwind CSS
* Axios

---

## ✨ Fonctionnalités

### 👤 Côté Client

* 🛒 Passer une commande
* 📦 Suivre ses commandes
* 🔔 Recevoir des notifications
* 👤 Gestion du profil

### 👨‍💼 Côté Admin

* 📋 Gestion des commandes
* ✅ Validation des commandes
* 🚚 Marquer comme livrée
* 📊 Dashboard avec statistiques
* 🔍 Filtrage des commandes

---

## 🔔 Système de notification

Fonctionnalité clé du projet 🔥

✔ Lorsqu’une commande est validée → notification envoyée
✔ Lorsqu’une commande est livrée → notification envoyée
✔ Stockage en base de données
✔ Affichage côté client

---

## 📡 API Endpoints

### 📦 Commandes

```
POST   /api/orders
GET    /api/orders
GET    /api/orders/user/{id}
PUT    /api/orders/{id}/validate
PUT    /api/orders/{id}/deliver
DELETE /api/orders/{id}
```

### 🔔 Notifications

```
GET /api/notifications/user/{id}
```

---

## 🧪 Tests API (Postman)

### Valider une commande

```
PUT http://localhost:8081/api/orders/1/validate
```

### Marquer comme livrée

```
PUT http://localhost:8081/api/orders/1/deliver
```

---

## 📂 Structure du projet

```
Spring-Boot/
│
├── backend/           → API Spring Boot
├── template-spring/   → Frontend Next.js
├── ai-service/        → Module IA (optionnel)
```

---

## ⚙️ Installation

### 🔙 Backend

```
cd backend
mvn clean install
mvn spring-boot:run
```

---

### 🔜 Frontend

```
cd template-spring
npm install
npm run dev
```

---

## 🌍 Accès

* Frontend → http://localhost:3000
* Backend → http://localhost:8081

---

## 📸 Interface

* 🎨 Dashboard Admin moderne
* 🛒 Page commandes client
* 🔔 Notifications dynamiques

---

## 🚀 Améliorations futures

* 🔥 Notifications en temps réel (WebSocket)
* 💳 Paiement en ligne
* 📱 Version mobile
* 📊 Analytics avancé

---

## 👨‍💻 Auteur

**Hind Awity**

---

## ⭐ Conclusion

Ce projet démontre :

* une bonne maîtrise de Spring Boot
* une intégration complète Frontend / Backend
* une logique métier claire (commandes + notifications)

👉 Idéal pour portfolio, stage ou projet professionnel
