# Guide Complet du Chatbot Maison Élysia

## 📋 Vue d'ensemble

Le chatbot de Maison Élysia est un assistant virtuel élégant et intelligent conçu pour améliorer l'expérience client. Il combine un design premium avec une logique conversationnelle avancée.

---

## 🎨 Caractéristiques du Design

### 1. **Apparence Générale**
- **Bouton flottant**: En bas à droite avec animation d'impulsion
- **Style premium**: Gradient orange (#FF6B35), ombres subtiles
- **Design moderne**: Arrondi (border-radius), avec transitions fluides
- **Responsif**: S'adapte aux petits écrans (max-width: calc(100vw - 32px))

### 2. **Fenêtre de Chat**
- **Dimensions**: 384px de large, 550px de hauteur
- **Arrondi**: 3xl (48px) pour un aspect premium
- **Ombre**: 2xl pour créer de la profondeur

### 3. **Animations**
- Ouverture/fermeture fluide avec transition de 300ms
- Avatar du bot avec icône mignonne
- Typing indicator (trois points qui rebondissent)
- Bouton d'impulsion sur l'icône de nouveau message
- Scaling smooth du bouton au survol

---

## 💬 Système de Messages

### Structure d'un Message
```typescript
interface Message {
  id: string;              // Identifiant unique
  text: string;            // Contenu du message
  sender: 'user' | 'bot';  // Expéditeur
  timestamp: Date;         // Heure du message
  suggestions?: QuickReply[]; // Boutons de suggestion
}
```

### Bulles de Message
- **Messages utilisateur**: Orange (#FF6B35), aligné à droite
- **Messages bot**: Blanc avec bordure grise, aligné à gauche
- **Avatar bot**: Petite bulle avec initial "M" (Maison)
- **Timestamp**: Affichage de l'heure au format HH:MM

### Quick Replies (Suggestions)
- Boutons cliquables sous chaque message du bot
- Gradient orange avec effet hover
- Icônes emoji pour meilleure UX
- Valeurs prédéfinies pour navigation rapide

---

## 🧠 Logique Conversationnelle

### Détection Intelligente

Le chatbot reconnaît plus de **8 catégories** de questions avec détection avancée:

#### 1. **Menu & Plats** 🍽️
**Déclencheurs**: "menu", "plat", "manger", "voir_menu"
```
Réponse: Présentation du menu avec suggestion de consulter le menu complet
Suggestions: "Voir le menu", "Nos spécialités", "Nos vins"
```

#### 2. **Réservation** 📅
**Déclencheurs**: "réservation", "réserver", "table", "reserver"
```
Réponse: Informations de contact et méthodes de réservation
Suggestions: "Réserver maintenant", "Nos horaires", "Notre adresse"
```

#### 3. **Horaires** ⏰
**Déclencheurs**: "heure", "ouvert", "fermeture", "horaire"
```
Réponse: Horaires d'ouverture et infos événements
Suggestions: "Réserver une table", "Événements spéciaux", "Nous trouver"
```

#### 4. **Localisation** 📍
**Déclencheurs**: "adresse", "localisation", "où", "situé"
```
Réponse: Adresse complète avec infos pratiques
Suggestions: "Nous appeler", "Réserver", "Localisation"
```

#### 5. **Contact** 📞
**Déclencheurs**: "contact", "téléphone", "email", "appel"
```
Réponse: Numéro de téléphone et email
Suggestions: "Réserver", "Localisation", "Menu"
```

#### 6. **Spécialités** ⭐
**Déclencheurs**: "spécialité", "specialite", "recommandation", "meilleur"
```
Réponse: Descriptions des plats phares
Suggestions: "Menu complet", "Commander", "Plus d'infos"
```

#### 7. **Livraison** 🚚
**Déclencheurs**: "livraison", "livrer", "domicile", "commander"
```
Réponse: Infos sur la livraison et commandes
Suggestions: "Voir le menu", "Commander", "Plus d'infos"
```

#### 8. **Salutations** 👋
**Déclencheurs**: "bonjour", "bonsoir", "salut", "coucou"
```
Réponse: Message de bienvenue complet
Suggestions: "Consulter le menu", "Infos pratiques", "Réserver"
```

### Fallback (Réponse par Défaut)
Si la question ne correspond à aucune catégorie, le bot propose de préciser:
```
"C'est une excellente question! 🤔 Pouvez-vous préciser votre demande?"
```

---

## 🔌 Intégration Backend

### API Endpoint: `POST /api/chat`

**Request:**
```json
{
  "userMessage": "Bonjour"
}
```

**Response:**
```json
{
  "botResponse": "Réponse du serveur"
}
```

### Gestion des Erreurs
- Si l'API est indisponible, le chatbot utilise **fallback client-side**
- Les réponses mock continuent de fonctionner normalement
- Logging: Messages d'erreur visibles en console [v0] pour debugging

### Configuration
```typescript
// Dans lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
```

---

## 📱 Fonctionnalités

### 1. **Typing Indicator**
- Affichage de "..." animé pendant que le bot "tape"
- Trois points qui rebondissent
- Animé avec Tailwind CSS

### 2. **Auto-scroll**
- Scroll automatique vers le dernier message
- Comportement smooth avec `scrollIntoView({ behavior: 'smooth' })`
- Utilise un ref invisible `messagesEndRef`

### 3. **Historique des Messages**
- Tous les messages sont stockés dans l'état React
- Timestamps affichés sous chaque message
- Format: HH:MM (ex: 14:30)

### 4. **Historique Persistant** (Bonus)
- Peut être étendu avec localStorage ou sessionStorage
- Format JSON pour sérialisation facile
- Reset au fermeture du chat (optionnel)

### 5. **Gestion du Focus**
- Input focus automatique au clic sur suggestion
- Clavier: Enter pour envoyer (Shift+Enter pour multiligne)
- Bouton envoi désactivé si texte vide

---

## 🛠️ Configuration

### Variables d'Environnement
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Tailwind Configuration
Le chatbot utilise uniquement les couleurs Tailwind standard:
- `#FF6B35` (Orange primary)
- `gray-*` (Neutral grays)
- `white` (Background)

### Responsive Design
- Mobile: Fenêtre s'adapte avec `max-w-[calc(100vw-32px)]`
- Padding ajusté pour petits écrans
- Bouton flottant visible sur tous les appareils

---

## 🚀 Utilisation

### Démarrage par Défaut
Le chatbot est **automatiquement activé** sur toutes les pages car intégré dans le layout:

```tsx
// app/layout.tsx
import { Chatbot } from '@/components/common/Chatbot'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Chatbot /> {/* ← Présent partout */}
      </body>
    </html>
  )
}
```

### Interaction Utilisateur
1. **Cliquez** sur le bouton flottant orange en bas à droite
2. **Posez une question** ou cliquez sur une suggestion
3. **Lisez la réponse** avec les options proposées
4. **Continuez la conversation** naturellement

---

## 📊 Suggestions Quick Reply

Chaque réponse du bot propose 3 boutons de suggestion contextuels:

### Exemple: Utilisateur dit "Menu"
```
Bot: "Notre menu propose une sélection raffinée..."
     [📖 Voir le menu] [⭐ Nos spécialités] [🍷 Nos vins]
```

### Exemple: Utilisateur dit "Réserver"
```
Bot: "Nous serions ravi de vous accueillir..."
     [📅 Réserver maintenant] [🏪 Nos horaires] [📍 Notre adresse]
```

---

## 🎯 Cas d'Usage

### Cas 1: Client pressé
- Clique sur "Consulter le menu"
- Clique sur "Réserver"
- Obtient les infos de contact

### Cas 2: Première visite
- Pose "Bonjour"
- Bot propose les 3 options principales
- Explore ce qui l'intéresse

### Cas 3: Client avancé
- Tape directement sa question: "Que recommandez-vous?"
- Bot reconnaît et propose les spécialités
- Peut envoyer un SMS rapidement

---

## 🐛 Debugging

### Logs Disponibles
Les messages sont loggés en console avec le préfixe `[v0]`:

```javascript
// API calls
[v0] API Request: POST http://localhost:8080/api/chat
[v0] API Response: 200 http://localhost:8080/api/chat

// Errors
[v0] Chat API error, using fallback: Connection refused
```

### Vérification en Console
```javascript
// Dans la console du navigateur
// 1. Cherchez les messages [v0]
// 2. Vérifiez que l'API est bien accessible
// 3. Testez les réponses mock
```

---

## 📝 Contenu en Français Uniquement

Tous les textes du chatbot sont en français:
- ✅ Messages du bot
- ✅ Placeholders d'input
- ✅ Boutons et suggestions
- ✅ Timestamps au format français

---

## 🎓 Extensions Futures

Le chatbot peut facilement être étendu avec:

1. **Persistent Chat History**
   - Sauvegarder dans localStorage
   - Restaurer la conversation

2. **NLP/AI Integration**
   - Intégrer GPT pour réponses naturelles
   - Sentiment analysis

3. **Proactive Notifications**
   - Notifications push
   - Messages de bienvenue personnalisés

4. **Multi-language Support**
   - Détecter la langue
   - Réponses en anglais, arabe, etc.

5. **Rich Content**
   - Images des plats
   - Vidéos de présentation
   - Liens interactifs

6. **Analytics**
   - Tracker les conversations
   - Mesurer la satisfaction
   - Identifier les questions fréquentes

---

## 📞 Support

Pour toute question sur le chatbot:
1. Consultez ce guide
2. Vérifiez les logs en console
3. Testez avec l'API mock
4. Contactez le support technique

---

**Version**: 2.0 - Premium Edition
**Dernière mise à jour**: 2024
**Statut**: Production-Ready ✅
