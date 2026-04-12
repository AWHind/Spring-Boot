# Quick Start Guide - Maison Élysia

## 🚀 Get Running in 2 Minutes

### Terminal 1: Start the Backend

```bash
cd backend
mvn spring-boot:run
```

✅ Wait for: `Sample dishes initialized successfully!`

### Terminal 2: Start the Frontend

```bash
cd template-spring
pnpm install  # First time only
pnpm dev
```

✅ Open: `http://localhost:3000`

---

## 🎯 What to Test

### 1. Chatbot (Floating button bottom-right)
- Click the chat button
- Type: "menu", "contact", "hours", "réservation"
- Get French responses from backend

### 2. Menu Page
- Click "Menu" in header
- View dishes from backend database
- All 10 sample dishes are displayed

### 3. About Section
- Scroll down on home page
- See "À Propos" section with restaurant info

### 4. Location
- Scroll down further
- See "Localisation" with embedded map

---

## 📝 Environment Setup

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Backend (application.properties)
```
server.port=8080
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
```

---

## 🔧 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Port 8080 in use" | `lsof -i :8080` then kill process, or change port in application.properties |
| "Port 3000 in use" | `pnpm dev -- -p 3001` |
| "Connection refused" | Ensure backend is running on :8080 |
| "CORS error" | Check `CorsConfig.java` allows http://localhost:3000 |
| "No dishes showing" | Verify `DataInitializer.java` ran (check console logs) |

---

## 📂 Project Layout

```
.
├── backend/                 ← Spring Boot API (Port 8080)
│   ├── src/main/java/
│   ├── pom.xml
│   └── README.md
├── template-spring/         ← Next.js Frontend (Port 3000)
│   ├── app/
│   ├── components/
│   ├── lib/api/client.ts   ← API communication
│   └── package.json
├── INTEGRATION_GUIDE.md     ← Full setup guide
├── BACKEND_IMPLEMENTATION.md ← Backend details
└── QUICK_START.md          ← This file
```

---

## 🛠️ Key Files to Know

### Backend
- `RestaurantApplication.java` - Main entry point
- `DishController.java` - Dish endpoints
- `ChatbotService.java` - Chatbot logic
- `DataInitializer.java` - Sample data
- `CorsConfig.java` - CORS settings

### Frontend
- `lib/api/client.ts` - API client with axios
- `components/common/Chatbot.tsx` - Chatbot UI & logic
- `app/page.tsx` - Homepage
- `.env.local` - Configuration

---

## 📡 API Endpoints (Backend)

### Dishes
```
GET  /api/dishes                    # All dishes
GET  /api/dishes/{id}              # Single dish
GET  /api/dishes/category/Entrées  # By category
POST /api/dishes                   # Create
PUT  /api/dishes/{id}              # Update
```

### Reservations
```
GET  /api/reservations             # All
GET  /api/reservations/{id}        # Single
POST /api/reservations             # Create
PUT  /api/reservations/{id}        # Update
DEL  /api/reservations/{id}        # Delete
```

### Chat
```
POST /api/chat                     # Send message
```

---

## 🎓 How It Works

```
User clicks "Send" in chatbot
    ↓
Chatbot.tsx calls chatApi.sendMessage()
    ↓
axios POST to http://localhost:8080/api/chat
    ↓
ChatController receives request
    ↓
ChatbotService processes message
    ↓
Response returned as JSON
    ↓
Frontend displays bot response
```

---

## 💾 Database

### H2 Console
- URL: `http://localhost:8080/h2-console`
- Username: `sa`
- Password: (empty)
- JDBC URL: `jdbc:h2:mem:testdb`

### Sample Data
- 10 French dishes auto-loaded on startup
- Reset on application restart
- Edit `DataInitializer.java` to modify

---

## 🎯 Next Steps

### To Add a Feature

1. **Backend**: Add endpoint in Controller
2. **Service**: Add business logic
3. **Frontend**: Call from `lib/api/client.ts`
4. **Component**: Update UI to display

### Example: Add a Reviews Endpoint

**Backend:**
```java
// ReviewController.java
@PostMapping("/reviews")
public ResponseEntity<Review> addReview(@RequestBody ReviewDTO review) {
    return ResponseEntity.ok(reviewService.save(review));
}
```

**Frontend:**
```typescript
// lib/api/client.ts
export const reviewApi = {
  add: async (review: any) => {
    const response = await apiClient.post('/reviews', review);
    return response.data;
  }
}
```

**Component:**
```tsx
import { reviewApi } from '@/lib/api/client';

const handleReview = async (review) => {
  const result = await reviewApi.add(review);
  // Update UI
}
```

---

## 🔍 Debugging Tips

### Backend Logs
```bash
# Check console output while running mvn spring-boot:run
# Look for:
# - HTTP request logs
# - Database initialization
# - Error messages
```

### Frontend Logs
```bash
# Browser DevTools Console (F12)
# Look for:
# - [v0] API Request: ...
# - [v0] API Response: ...
# - [v0] API Error: ...
```

### Network Inspection
```bash
# DevTools → Network tab
# Check XHR requests
# Verify response status (200, 201, 404, etc.)
# Check request/response bodies
```

---

## ✅ Checklist

- [ ] Backend running on :8080
- [ ] Frontend running on :3000
- [ ] Can open localhost:3000 in browser
- [ ] Chatbot button visible
- [ ] Can send chatbot message
- [ ] Chatbot gets response from backend
- [ ] Menu page shows dishes
- [ ] About section visible
- [ ] No console errors

---

## 📚 Full Documentation

- **Backend Setup**: `backend/README.md`
- **Integration Details**: `INTEGRATION_GUIDE.md`
- **Architecture**: `BACKEND_IMPLEMENTATION.md`
- **Frontend Code**: `template-spring/app/page.tsx`

---

## 🆘 Need Help?

1. Check console logs in both terminals
2. Verify both services running on correct ports
3. Ensure `.env.local` has correct API URL
4. Try restarting both services
5. Clear browser cache (Ctrl+Shift+Delete)
6. Check full guides above

---

**Happy coding! 🍽️**
