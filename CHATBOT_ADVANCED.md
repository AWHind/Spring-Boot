# Chatbot Maison Élysia - Guide Avancé

## 🚀 Features Implémentées

### 1. Premium UI/UX ✅
- **Floating Button**: Animation d'impulsion, gradient smooth
- **Glass Morphism**: Ombres subtiles, gradient semi-transparent
- **Micro-interactions**: Transitions fluides (300ms), hover effects
- **Responsive**: Mobile-first, adapté tous les écrans
- **Animations**: Typing indicator, avatar badges

### 2. Logique Conversationnelle Intelligente ✅
- **8 catégories** de questions avec multi-keywords
- **Quick Replies**: 3 suggestions contextuelles par message
- **Fallback intelligent**: Mode dégradé si API indisponible
- **Detection avancée**: Case-insensitive, trim, normalize

### 3. Gestion d'État Robuste ✅
- **Messages History**: Toutes les conversations sauvegardées
- **Timestamps**: Heure précise pour chaque message
- **Typing Indicator**: Feedback visuel pendant le chargement
- **Error Handling**: Catch/try avec fallback client-side

### 4. Backend Integration ✅
- **API Endpoint**: POST /api/chat prêt pour utilisation
- **Axios Client**: Configuration complète avec interceptors
- **Fallback Responses**: Fonctionne même sans backend
- **Logging**: Messages détaillés pour debugging

---

## 🎯 Architecture Technique

### Component Structure
```
Chatbot.tsx
├── State Management
│   ├── messages: Message[]
│   ├── input: string
│   ├── isOpen: boolean
│   └── isLoading: boolean
├── Message Handling
│   ├── handleSendMessage()
│   ├── getResponse()
│   └── handleKeyPress()
├── UI Components
│   ├── Floating Button
│   ├── Chat Window
│   ├── Messages Container
│   ├── Quick Replies
│   └── Input Area
└── Refs
    └── messagesEndRef (scroll)
```

### Response Structure
```typescript
interface ResponseWithSuggestions {
  text: string;
  suggestions: QuickReply[];
}

const FRENCH_RESPONSES = {
  greeting: { text: "...", suggestions: [...] },
  menu: { text: "...", suggestions: [...] },
  // ... 8 categories total
}
```

---

## 🔧 Configuration Avancée

### 1. Personnaliser les Réponses
**Fichier**: `components/common/Chatbot.tsx`

```typescript
// Ajouter une nouvelle catégorie
const FRENCH_RESPONSES = {
  // ... existing responses
  wines: {
    text: "Nos vins sélectionnés...",
    suggestions: [
      { label: "🍷 Voir la carte", value: "carte_vins" },
      { label: "📖 Accueil", value: "accueil" },
    ],
  },
}

// Ajouter la détection
if (lowerMessage.includes('vin') || lowerMessage.includes('wine')) {
  return FRENCH_RESPONSES.wines;
}
```

### 2. Modifier les Styles
**Couleurs Principales**:
```typescript
// Orange primary
bg-[#FF6B35]
from-[#FF6B35]

// Grays
bg-gray-50
border-gray-200

// Gradient
from-[#FF6B35] to-[#FF6B35]/90
```

**Ajouter des styles personnalisés**:
```tsx
// Dans globals.css
@layer components {
  .chatbot-bubble {
    @apply rounded-2xl px-4 py-3 shadow-md transition-all;
  }
}
```

### 3. Intégrer l'API Real
**Backend Configuration** (`application.properties`):
```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_db
```

**Test de l'API**:
```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"userMessage": "Bonjour"}'
```

---

## 📈 Métriques & Analytics

### Implémenter le Tracking
```typescript
const trackChatEvent = (event: string, data?: any) => {
  console.log(`[CHAT_EVENT] ${event}`, data);
  
  // Optionnel: Envoyer à Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', `chat_${event}`, data);
  }
};

// Utilisation
handleSendMessage = async (messageText) => {
  trackChatEvent('message_sent', { text: messageText });
  // ... rest of code
}
```

### Métriques Utiles
1. **Conversations totales**
2. **Questions par catégorie**
3. **Taux de clic sur suggestions**
4. **Durée moyenne de conversation**
5. **Taux d'API fallback**

---

## 🔐 Sécurité

### Validation Input
```typescript
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Prevent XSS
    .substring(0, 500);    // Max length
};
```

### Éviter les Injections
```typescript
// ❌ Mauvais
<p>{message.text}</p>

// ✅ Bon (Tailwind avec paragraphe normal)
<p className="text-sm">{message.text}</p>
```

### CORS Configuration (Backend)
```java
@Configuration
public class CorsConfig {
  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
          .allowedOrigins("http://localhost:3000")
          .allowedMethods("GET", "POST", "PUT", "DELETE")
          .allowCredentials(true)
          .maxAge(3600);
      }
    };
  }
}
```

---

## 🧪 Testing

### Unit Tests
```typescript
// __tests__/Chatbot.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Chatbot } from '@/components/common/Chatbot';

describe('Chatbot', () => {
  it('renders floating button', () => {
    render(<Chatbot />);
    expect(screen.getByLabelText('Open chat')).toBeInTheDocument();
  });

  it('opens chat window on click', () => {
    render(<Chatbot />);
    fireEvent.click(screen.getByLabelText('Open chat'));
    expect(screen.getByPlaceholderText('Tapez votre question...')).toBeInTheDocument();
  });

  it('sends message on Enter', () => {
    render(<Chatbot />);
    fireEvent.click(screen.getByLabelText('Open chat'));
    
    const input = screen.getByPlaceholderText('Tapez votre question...');
    fireEvent.change(input, { target: { value: 'Bonjour' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' });
    
    expect(screen.getByText('Bonjour')).toBeInTheDocument();
  });
});
```

### E2E Tests (Cypress)
```javascript
// cypress/e2e/chatbot.cy.js
describe('Chatbot E2E', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('completes full conversation flow', () => {
    // Open chat
    cy.get('button[aria-label="Open chat"]').click();
    
    // Send message
    cy.get('input[placeholder*="Tapez"]').type('Bonjour{enter}');
    
    // Check response
    cy.contains('Bienvenue à Maison Élysia').should('be.visible');
    
    // Click suggestion
    cy.contains('Consulter le menu').click();
    
    // Verify menu response
    cy.contains('Notre menu propose').should('be.visible');
  });
});
```

---

## 🚨 Troubleshooting

### Problème: Le chatbot ne s'affiche pas
**Solution**:
1. Vérifiez que `<Chatbot />` est dans `layout.tsx`
2. Vérifiez les imports: `import { Chatbot } from '@/components/common/Chatbot'`
3. Vérifiez que le composant est client-side: `'use client'`

### Problème: L'API n'est pas appelée
**Solution**:
1. Vérifiez que le backend tourne: `curl http://localhost:8080/api/dishes`
2. Vérifiez `NEXT_PUBLIC_API_URL` dans `.env.local`
3. Vérifiez la configuration CORS du backend
4. Ouvrez les DevTools (F12) et cherchez l'erreur réseau

### Problème: Les messages ne s'affichent pas
**Solution**:
1. Vérifiez que `messagesEndRef` n'est pas `null`
2. Vérifiez la structure du Message type
3. Vérifiez que les clés uniques (`id`) sont présentes

### Problème: Les suggestions ne fonctionnent pas
**Solution**:
1. Vérifiez que `handleSendMessage(suggestion.value)` est appelé
2. Vérifiez que la valeur correspond aux déclencheurs dans `getResponse()`
3. Vérifiez que les boutons ne sont pas désactivés (`disabled` prop)

---

## 📊 Performance Optimization

### 1. Lazy Loading
```typescript
import dynamic from 'next/dynamic';

const Chatbot = dynamic(() => import('@/components/common/Chatbot'), {
  ssr: false,
  loading: () => null,
});
```

### 2. Memoization
```typescript
const MemoizedMessage = React.memo(({ message }) => (
  <div className="...">
    <p>{message.text}</p>
  </div>
));
```

### 3. Virtual Scrolling (pour beaucoup de messages)
```typescript
import { FixedSizeList } from 'react-window';

// Remplacer .map() par VirtualList pour 1000+ messages
```

### 4. Debounce Input
```typescript
const debouncedSend = useCallback(
  debounce((msg: string) => handleSendMessage(msg), 300),
  []
);
```

---

## 🌐 Déploiement

### Vercel Deployment
```bash
# Push sur GitHub
git push origin main

# Vercel déploie automatiquement
# Frontend: https://votre-app.vercel.app
```

### Environment Variables (Vercel)
1. Allez dans Settings → Environment Variables
2. Ajoutez: `NEXT_PUBLIC_API_URL=https://votre-api.com/api`
3. Redéployez

### Backend Deployment (Heroku)
```bash
# Build et déploiement
mvn clean package
heroku login
heroku create votre-app
git push heroku main

# Backend disponible à: https://votre-api.herokuapp.com/api
```

---

## 🔮 Features Futures

### 1. Persistent Chat History
```typescript
// Sauvegarder dans localStorage
const saveMessages = (messages: Message[]) => {
  localStorage.setItem('chatHistory', JSON.stringify(messages));
};

// Restaurer au démarrage
const loadMessages = () => {
  const saved = localStorage.getItem('chatHistory');
  return saved ? JSON.parse(saved) : [];
};
```

### 2. User Identification
```typescript
interface Message extends ... {
  userId?: string;
  sessionId?: string;
}

// Tracker qui parle au chatbot
const userId = localStorage.getItem('userId') || generateId();
```

### 3. AI-Powered Responses
```typescript
// Intégrer GPT/Claude
const getAIResponse = async (message: string) => {
  const response = await fetch('/api/chat/ai', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
  return response.json();
};
```

### 4. Multi-language
```typescript
const LANGUAGES = {
  fr: FRENCH_RESPONSES,
  en: ENGLISH_RESPONSES,
  ar: ARABIC_RESPONSES,
};

const getResponse = (message: string, lang: string) => {
  return LANGUAGES[lang]?.greeting || FRENCH_RESPONSES.greeting;
};
```

### 5. Rich Media
```typescript
interface Message {
  text: string;
  image?: string;
  video?: string;
  link?: { label: string; url: string };
}
```

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Axios](https://axios-http.com/docs/intro)

---

## 📞 Support

Pour plus d'aide:
1. Consultez `CHATBOT_GUIDE.md` pour les bases
2. Vérifiez les logs console (`[v0]`)
3. Testez l'API directement: `curl http://localhost:8080/api/chat`
4. Contactez le support technique

---

**Dernière mise à jour**: 2024
**Statut**: Production Ready ✅
**Version**: 2.0 Premium
