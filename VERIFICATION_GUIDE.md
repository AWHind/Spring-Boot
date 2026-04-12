# Guide de Vérification - Maison Élysia

## Checklist de Démarrage

### Étape 1: Préparer l'Environnement

- [ ] MySQL 8.0+ installé et en cours d'exécution
- [ ] Base de données `restaurant_db` créée
- [ ] Node.js 18+ et npm/pnpm installés
- [ ] Java 17+ et Maven installés
- [ ] Les identifiants MySQL sont configurés dans `application.properties`

### Étape 2: Démarrer le Backend

```bash
cd backend

# Compiler et démarrer le backend
mvn clean spring-boot:run
```

Vérifiez les logs:
```
[main] com.maisonelysia.RestaurantApplication : Starting RestaurantApplication
[main] com.maisonelysia.RestaurantApplication : Started RestaurantApplication in X.XXX seconds
[v0] ✓ 35 plats français de Maison Élysia initialisés avec succès!
```

### Étape 3: Vérifier les Endpoints Backend

Ouvrez [http://localhost:8080/api/dishes](http://localhost:8080/api/dishes) dans le navigateur.

Vous devriez voir une réponse JSON avec tous les plats:
```json
[
  {
    "id": 1,
    "name": "Soupe à l'Oignon Gratinée",
    "description": "...",
    "price": 12.50,
    "category": "Entrées",
    "rating": 5,
    "reviews": 245,
    "available": true
  },
  ...
]
```

### Étape 4: Démarrer le Frontend

```bash
cd template-spring

# Installer les dépendances
pnpm install

# Démarrer le serveur de développement
pnpm dev
```

Vérifiez les logs:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Étape 5: Accéder à l'Application

Ouvrez [http://localhost:3000](http://localhost:3000) dans le navigateur.

Vous devriez voir:
- Page d'accueil avec héro section en français
- Sections "Nos Spécialités" avec les plats du backend
- Chatbot flottant en bas à droite
- Footer avec liens des réseaux sociaux

## Tests des Endpoints API

### 1. Test GET /api/dishes (Récupérer tous les plats)

```bash
curl -X GET http://localhost:8080/api/dishes
```

**Réponse attendue**: Array de 35 plats avec structure complète

### 2. Test GET /api/dishes/{id} (Récupérer un plat)

```bash
curl -X GET http://localhost:8080/api/dishes/1
```

**Réponse attendue**: Un plat avec l'ID 1

### 3. Test GET /api/dishes/category/{category} (Plats par catégorie)

```bash
curl -X GET http://localhost:8080/api/dishes/category/Entrées
```

**Réponse attendue**: Array de 8 entrées

### 4. Test POST /api/reservations (Créer une réservation)

```bash
curl -X POST http://localhost:8080/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "phone": "+21612345678",
    "reservationDate": "2024-12-25T19:30:00",
    "numberOfGuests": 4,
    "specialRequests": "Pas de cacahuètes"
  }'
```

**Réponse attendue**: Réservation créée avec ID

### 5. Test POST /api/chat (Envoi d'un message chatbot)

```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userMessage": "Quel est votre horaire?"
  }'
```

**Réponse attendue**: Message du bot en français

## Tests du Frontend

### 1. Vérifier la Page d'Accueil
- [ ] Heading "Le Goût. L'Élégance. L'Excellence." visible
- [ ] Boutons "Commander Maintenant" et "Explorer le Menu" présents
- [ ] Sections: Nos Spécialités, À Propos, Localisation visibles
- [ ] Images chargées correctement

### 2. Vérifier le Menu
- [ ] Accédez à [http://localhost:3000/menu](http://localhost:3000/menu)
- [ ] Les 35 plats s'affichent correctement
- [ ] Filtre de recherche fonctionne (essayez "Coq")
- [ ] Boutons "Commander" présents pour chaque plat

### 3. Vérifier le Chatbot
- [ ] Chatbot visible en bas à droite
- [ ] Cliquez pour l'ouvrir
- [ ] Testez les messages:
  - "Quel est votre menu?"
  - "Quelle est votre adresse?"
  - "Horaire d'ouverture?"
- [ ] Les réponses apparaissent en français

### 4. Vérifier l'Intégration API
- [ ] Consultez la console du navigateur (F12)
- [ ] Vérifiez l'onglet "Network"
- [ ] Vous devriez voir les requêtes:
  - `GET /api/dishes` (page d'accueil)
  - `GET /api/menu` (page menu)
  - `POST /api/chat` (chatbot)

### 5. Vérifier les Logs

**Backend logs** (mvn spring-boot:run):
```
[v0] API Request: GET /api/dishes
[v0] API Response: 200 GET /api/dishes
```

**Frontend logs** (Console du navigateur):
```
[v0] API Request: GET /api/dishes
[v0] API Response: 200 GET /api/dishes
```

## Vérification de la Base de Données

### Accédez à MySQL CLI:
```bash
mysql -u root -p restaurant_db
```

### Commandes de vérification:
```sql
-- Voir toutes les tables
SHOW TABLES;

-- Compter les plats
SELECT COUNT(*) as total_dishes FROM dishes;

-- Voir les catégories
SELECT DISTINCT category FROM dishes;

-- Voir les réservations
SELECT * FROM reservations;

-- Voir les messages de chat
SELECT * FROM chat_messages;
```

## Checklist de Fonctionnalité

### Frontend
- [ ] Page d'accueil charge correctement
- [ ] Menu affiche 35 plats
- [ ] Chatbot répond en français
- [ ] Footer affiche liens réseaux sociaux
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Tous les textes en français
- [ ] Images s'affichent correctement

### Backend
- [ ] /api/dishes retourne 35 plats
- [ ] /api/dishes/{id} fonctionne
- [ ] /api/dishes/category/{cat} fonctionne
- [ ] POST /api/reservations crée une réservation
- [ ] POST /api/chat retourne une réponse
- [ ] CORS activé (pas d'erreurs CORS)
- [ ] Gestion d'erreur appropriée

### Base de Données
- [ ] MySQL fonctionne
- [ ] Base `restaurant_db` existe
- [ ] 35 plats chargés
- [ ] Tables créées correctement
- [ ] Indexes présents pour performance

## Résolution des Problèmes

### Erreur: "Cannot resolve symbol 'Dish'"
**Solution**: Assurez-vous que les entités sont compilées: `mvn clean compile`

### Erreur: "No such table: dishes"
**Solution**: 
1. Vérifiez que la base existe
2. Relancez le backend avec `mvn clean spring-boot:run`
3. Exécutez les scripts SQL manuellement

### Erreur CORS: "Access to XMLHttpRequest has been blocked"
**Solution**: Vérifiez que CorsConfig est activé et la requête utilise `http://localhost:8080`

### Chatbot ne répond pas
**Solution**: 
1. Vérifiez les logs du backend
2. Assurez-vous que `POST /api/chat` fonctionne avec curl
3. Vérifiez que le `NEXT_PUBLIC_API_URL` est correct

### Les plats ne s'affichent pas
**Solution**:
1. Vérifiez que `/api/dishes` retourne les données
2. Assurez-vous que la base de données est remplie
3. Vérifiez la console du navigateur pour les erreurs

## Performance

### Vérifier les temps de réponse:
```bash
# Mesurer le temps de réponse
time curl -X GET http://localhost:8080/api/dishes

# Devrait être < 100ms
```

### Optimisations appliquées:
- [ ] Indexes sur `category`, `vegetarian`, `gluten_free`, `available`
- [ ] Connection pooling configuré
- [ ] Pagination disponible
- [ ] Caching des réponses (à implémenter)

## Prochaines Étapes

Après validation:
1. Déployer le frontend sur Vercel
2. Déployer le backend sur un serveur
3. Configurer une base de données de production
4. Implémenter l'authentification
5. Ajouter les paiements (Stripe)
6. Améliorer le chatbot avec l'IA
