# Démarrage Rapide - Maison Élysia (5 minutes)

## Avant de Commencer

✅ MySQL 8.0+ doit être installé
✅ Node.js 18+ doit être installé  
✅ Java 17+ et Maven doivent être installés

---

## Étape 1: Configuration MySQL (2 minutes)

### Ouvrir MySQL
```bash
mysql -u root -p
```

### Créer la base de données
```sql
CREATE DATABASE restaurant_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Vérifier
```sql
SHOW DATABASES;
-- Vous devez voir: restaurant_db
```

---

## Étape 2: Démarrer le Backend (2 minutes)

### Terminal 1: Aller au dossier backend
```bash
cd /vercel/share/v0-project/backend
```

### Démarrer avec Maven
```bash
mvn clean spring-boot:run
```

### Vérifier le démarrage
Vous devez voir dans les logs:
```
✓ Started RestaurantApplication in X.XXX seconds
[v0] ✓ 35 plats français de Maison Élysia initialisés avec succès!
```

### Tester rapidement
Ouvrir dans le navigateur:
```
http://localhost:8080/api/dishes
```
Vous devez voir une liste JSON avec 35 plats

---

## Étape 3: Démarrer le Frontend (1 minute)

### Terminal 2: Aller au dossier frontend
```bash
cd /vercel/share/v0-project/template-spring
```

### Installer et démarrer
```bash
pnpm install
pnpm dev
```

### Vérifier le démarrage
Vous devez voir:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## Étape 4: Accéder à l'Application (Immédiat!)

Ouvrir dans le navigateur:
```
http://localhost:3000
```

Vous devez voir:
✅ Page d'accueil en français
✅ "Le Goût. L'Élégance. L'Excellence."
✅ Sections: Nos Spécialités, À Propos, Localisation
✅ Chatbot flottant en bas à droite

---

## Tester les Fonctionnalités

### Test 1: Menu
Cliquez sur "Explorer le Menu" → Devrait afficher 35 plats

### Test 2: Chatbot
Cliquez sur le chatbot en bas à droite
- Tapez "Quel est votre horaire?"
- Le bot devrait répondre en français

### Test 3: Recherche
Sur la page Menu, cherchez "Coq"
- Devrait afficher "Coq au Vin"

---

## Résoudre les Problèmes

### Erreur: "Cannot connect to MySQL"
```bash
# Vérifier que MySQL est en cours d'exécution
mysql -u root -p

# Si ça ne marche pas, relancer MySQL:
# macOS: brew services restart mysql
# Windows: Relancer le service MySQL
# Linux: sudo systemctl restart mysql
```

### Erreur: "Unknown database 'restaurant_db'"
```bash
mysql -u root -p
CREATE DATABASE restaurant_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Erreur: "Port 8080 déjà utilisé"
Le backend utilise le port 8080. Si un autre service l'utilise:
```bash
# Chercher le processus
# Windows: netstat -ano | findstr :8080
# Mac/Linux: lsof -i :8080

# Ou changer le port dans: backend/src/main/resources/application.properties
# server.port=8081
```

### Erreur: "Port 3000 déjà utilisé"
```bash
# Frontend peut utiliser un autre port automatiquement
# Sinon: pnpm dev -- -p 3001
```

---

## Liens Importants

| Ressource | URL |
|-----------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api |
| Tous les plats | http://localhost:8080/api/dishes |
| Menu du site | http://localhost:3000/menu |
| Chatbot | Sur la page (coin bas-droit) |

---

## Vérification Complète (5 minutes supplémentaires)

### Vérifier Backend
```bash
# Dans un terminal, tester les endpoints:
curl http://localhost:8080/api/dishes
curl http://localhost:8080/api/dishes/1
curl http://localhost:8080/api/dishes/category/Entrées
```

### Vérifier Frontend
1. Accédez à http://localhost:3000
2. Appuyez sur F12 (ouvrir les logs)
3. Onglet "Network"
4. Rechargez la page
5. Vous devez voir les requêtes GET /api/dishes

### Vérifier Base de Données
```bash
mysql -u root -p restaurant_db
SELECT COUNT(*) as total FROM dishes;
-- Devrait afficher: 35
```

---

## Commandes Utiles

### Arrêter le Backend
```
Appuyez sur Ctrl+C dans Terminal 1
```

### Arrêter le Frontend
```
Appuyez sur Ctrl+C dans Terminal 2
```

### Redémarrer le Backend
```bash
cd backend
mvn clean spring-boot:run
```

### Effacer les données et recommencer
```bash
mysql -u root -p
DROP DATABASE restaurant_db;
CREATE DATABASE restaurant_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Puis relancer le backend (DataInitializer recrée les plats automatiquement)

---

## Aperçu de l'Application

### Page d'Accueil (/)
- Hero section avec image
- Section "Nos Spécialités" avec 6 plats vedettes
- Section "À Propos"
- Section "Localisation" avec carte Google
- CTA "Prêt à commander?"

### Page Menu (/menu)
- Barre de recherche
- Grille de 35 plats
- Filtrage dynamique
- Boutons "Commander"

### Chatbot (Flottant)
- Accessible depuis n'importe quelle page
- Répond en français
- Répond aux questions sur:
  - Menu & plats
  - Horaires
  - Adresse & contact
  - Réservations
  - Livraison

### Footer
- Liens de navigation
- Liens réseaux sociaux (Facebook, Instagram, Twitter)
- Informations de contact
- Copyright

---

## Architecture Simplifiée

```
Frontend (Next.js)  ←→  Backend API  ←→  MySQL DB
localhost:3000         localhost:8080    restaurant_db
```

---

## Prochaines Étapes (Optionnel)

Une fois que tout fonctionne:
1. Lire `COMPLETE_SOLUTION.md` pour comprendre l'architecture
2. Lire `DATABASE_SETUP.md` pour configurer une vraie base (production)
3. Implémenter l'authentification
4. Ajouter les paiements (Stripe)
5. Déployer sur Vercel + AWS

---

## Support

Si quelque chose ne fonctionne pas:
1. Vérifiez les logs (Terminal 1 et 2)
2. Consultez `VERIFICATION_GUIDE.md`
3. Consultez `DATABASE_SETUP.md`
4. Consultez `TESTING_GUIDE.md`

---

**Status**: ✅ Prêt à démarrer!

Vous avez maintenant une application full-stack complète avec:
- ✅ Frontend élégant en français
- ✅ Backend REST API fonctionnel
- ✅ Base de données MySQL
- ✅ 35 plats français
- ✅ Chatbot intelligent
- ✅ Responsive design

Bon appétit! 🍽️
