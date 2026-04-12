# Configuration de la Base de Données - Maison Élysia

## Vue d'ensemble

L'application utilise **MySQL 8.0+** comme base de données (auparavant H2). Le nom de la base de données est **`restaurant_db`**.

## Configuration Rapide

### 1. Installer MySQL

#### Sur Windows:
```bash
# Installer MySQL Community Server
# https://dev.mysql.com/downloads/mysql/

# Après l'installation, ouvrir MySQL Command Line Client
mysql -u root -p

# Créer la base de données:
CREATE DATABASE restaurant_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Sur macOS (avec Homebrew):
```bash
brew install mysql
brew services start mysql

# Accéder à MySQL
mysql -u root

# Créer la base de données:
CREATE DATABASE restaurant_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Sur Linux (Ubuntu/Debian):
```bash
sudo apt-get install mysql-server

# Sécuriser l'installation (optionnel)
sudo mysql_secure_installation

# Accéder à MySQL
mysql -u root -p

# Créer la base de données:
CREATE DATABASE restaurant_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configurer les Identifiants

Modifiez `backend/src/main/resources/application.properties`:

```properties
# Remplacez les valeurs par vos identifiants MySQL:
spring.datasource.username=root
spring.datasource.password=votreMotDePasse
spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
```

### 3. Exécuter les Scripts SQL

Deux options disponibles:

#### Option A: Utiliser MySQL CLI
```bash
# Accéder à MySQL
mysql -u root -p

# Sélectionner la base de données
USE restaurant_db;

# Exécuter le script de création
source backend/database/01_create_schema.sql;

# Exécuter le script d'initialisation
source backend/database/02_insert_sample_data.sql;

# Vérifier les données
SELECT COUNT(*) as total_dishes FROM dishes;
```

#### Option B: Spring Boot Auto-Create (Recommandé)
Le backend automatise la création du schéma:

1. Assurez-vous que `spring.jpa.hibernate.ddl-auto=update` est défini dans `application.properties`
2. Lancez le backend: `mvn spring-boot:run`
3. Spring Boot créera automatiquement toutes les tables

### 4. Vérifier la Connexion

```bash
# Depuis le terminal MySQL
USE restaurant_db;
SHOW TABLES;

# Devrait afficher:
# chat_messages
# dishes
# order_items
# orders
# reservations
# users
```

## Structure de la Base de Données

### Table: `dishes` (Plats)
```sql
| Colonne      | Type          | Description                   |
|--------------|---------------|-------------------------------|
| id           | BIGINT        | Identifiant unique            |
| name         | VARCHAR(255)  | Nom du plat                   |
| description  | TEXT          | Description détaillée         |
| price        | DECIMAL(10,2) | Prix en dinars                |
| category     | VARCHAR(100)  | Catégorie (Entrées, Plats...) |
| image        | VARCHAR(500)  | URL de l'image                |
| rating       | INT           | Notation (1-5 étoiles)        |
| reviews      | INT           | Nombre d'avis                 |
| vegetarian   | BOOLEAN       | Plat végétarien?              |
| gluten_free  | BOOLEAN       | Sans gluten?                  |
| available    | BOOLEAN       | Disponible?                   |
| created_at   | TIMESTAMP     | Date de création              |
| updated_at   | TIMESTAMP     | Dernière modification         |
```

### Table: `reservations` (Réservations)
```sql
| Colonne           | Type          | Description                 |
|-------------------|---------------|------------------------------|
| id                | BIGINT        | Identifiant unique           |
| name              | VARCHAR(255)  | Nom du client               |
| email             | VARCHAR(255)  | Email du client              |
| phone             | VARCHAR(20)   | Téléphone du client          |
| reservation_date  | DATETIME      | Date et heure de réservation |
| number_of_guests  | INT           | Nombre de personnes          |
| special_requests  | TEXT          | Demandes spéciales           |
| status            | VARCHAR(50)   | Status (CONFIRMED, PENDING)  |
| created_at        | TIMESTAMP     | Date de création             |
| updated_at        | TIMESTAMP     | Dernière modification        |
```

### Table: `chat_messages` (Messages Chatbot)
```sql
| Colonne       | Type      | Description         |
|---------------|-----------|---------------------|
| id            | BIGINT    | Identifiant unique  |
| user_message  | TEXT      | Message de l'user   |
| bot_response  | TEXT      | Réponse du chatbot  |
| timestamp     | TIMESTAMP | Date du message     |
```

### Table: `users` (Utilisateurs - Optionnel)
Pour implémenter l'authentification personnalisée à l'avenir.

### Table: `orders` & `order_items` (Commandes - Futur)
Pour gérer les commandes et les articles commandés.

## Données Initiales

35 plats français de Maison Élysia sont chargés automatiquement:

- **8 Entrées**: Soupe à l'Oignon, Foie Gras, Escargots, etc.
- **9 Plats Principaux**: Coq au Vin, Filet de Bœuf, Homard, etc.
- **6 Desserts**: Crème Brûlée, Tarte Tatin, Mousse au Chocolat, etc.
- **6 Boissons**: Champagne, Vins, Jus, Café, etc.
- **5 Spécialités**: Plateau de Fromages, Menu Dégustation, etc.

## Troubleshooting

### Erreur: "Access denied for user 'root'@'localhost'"
```bash
# Réinitialiser le mot de passe MySQL
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
FLUSH PRIVILEGES;
```

### Erreur: "Unknown database 'restaurant_db'"
```bash
# Créer la base de données
mysql -u root -p -e "CREATE DATABASE restaurant_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Erreur: "Can't connect to MySQL server"
1. Vérifiez que MySQL est démarré
2. Vérifiez l'URL de connexion dans `application.properties`
3. Vérifiez les identifiants utilisateur/mot de passe

### Backend ne crée pas les tables automatiquement
1. Vérifiez que `spring.jpa.hibernate.ddl-auto=update` est défini
2. Assurez-vous que la base de données existe
3. Relancez le backend avec `mvn clean spring-boot:run`

## Utiliser PostgreSQL à la Place (Optionnel)

Pour utiliser PostgreSQL au lieu de MySQL:

### 1. Modifier pom.xml:
```xml
<!-- Remplacer MySQL Driver par PostgreSQL -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.6.0</version>
    <scope>runtime</scope>
</dependency>
```

### 2. Modifier application.properties:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/restaurant_db
spring.datasource.driverClassName=org.postgresql.Driver
spring.datasource.username=postgres
spring.datasource.password=

spring.jpa.database-platform=org.hibernate.dialect.PostgreSQL10Dialect
```

### 3. Créer la base de données PostgreSQL:
```bash
createdb -U postgres restaurant_db
```

## Sauvegarde et Restoration

### Sauvegarder la base de données:
```bash
mysqldump -u root -p restaurant_db > backup.sql
```

### Restaurer à partir d'une sauvegarde:
```bash
mysql -u root -p restaurant_db < backup.sql
```

## Configuration de Production

Pour la production, modifiez:

```properties
# Utiliser une base de données distante
spring.datasource.url=jdbc:mysql://your-db-host:3306/restaurant_db

# Désactiver la création automatique de schéma
spring.jpa.hibernate.ddl-auto=validate

# Augmenter le pool de connexions
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=10
```

## Ressources Utiles

- [Documentation MySQL](https://dev.mysql.com/doc/)
- [Documentation Spring Boot Data JPA](https://spring.io/projects/spring-data-jpa)
- [Hibernate Documentation](https://hibernate.org/)
