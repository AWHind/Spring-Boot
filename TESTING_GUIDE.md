# Testing Guide - Maison Élysia

## Manual Testing Checklist

### 1. Backend API Testing

#### Start Backend
```bash
cd backend
mvn spring-boot:run
```

#### Test with cURL or Postman

**Test GET /api/dishes**
```bash
curl http://localhost:8080/api/dishes
```
Expected: JSON array with 10 dishes

**Test GET /api/dishes/category/Entrées**
```bash
curl "http://localhost:8080/api/dishes/category/Entrées"
```
Expected: JSON array with appetizers only

**Test POST /api/chat**
```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"userMessage":"Bonjour"}'
```
Expected: JSON with `botResponse` field

**Test POST /api/reservations**
```bash
curl -X POST http://localhost:8080/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "phone":"+21612345678",
    "reservationDate":"2024-12-25T20:00:00",
    "numberOfGuests":4,
    "specialRequests":"Window seat preferred"
  }'
```
Expected: Created reservation with ID

### 2. Frontend Testing

#### Start Frontend
```bash
cd template-spring
pnpm dev
```

#### Test Homepage
- [ ] Page loads at http://localhost:3000
- [ ] Header displays correctly with French text
- [ ] Hero section visible
- [ ] "Commander Maintenant" button clickable
- [ ] "Explorer le Menu" button clickable

#### Test Menu Page
- [ ] Click "Menu" in header
- [ ] Dishes load from backend
- [ ] All 10 dishes visible
- [ ] Dish cards show: name, description, price, image, rating
- [ ] "Commander" buttons visible

#### Test Chatbot
- [ ] Floating button visible bottom-right
- [ ] Click button - chat window opens
- [ ] Chat header shows "Maison Élysia Support"
- [ ] Initial greeting message displayed
- [ ] Type "menu" - bot responds about menu
- [ ] Type "contact" - bot shows phone and email
- [ ] Type "hours" - bot shows business hours
- [ ] Type "réservation" - bot explains reservation process
- [ ] Messages show in correct order
- [ ] Can close and reopen chat

#### Test About Section
- [ ] Scroll down on homepage
- [ ] "À Propos" section visible
- [ ] Restaurant description displayed
- [ ] Stats shown (20+ Years, 150+ Dishes, 5★)
- [ ] Restaurant image visible

#### Test Location Section
- [ ] Scroll down further
- [ ] "Localisation" section visible
- [ ] Map embedded and visible
- [ ] Title and description present

#### Test Footer
- [ ] Footer background is dark
- [ ] Links in French (Accueil, Menu, À propos, Spécialités)
- [ ] Contact info visible (phone, email, address)
- [ ] Social media links present (Facebook, Instagram, Twitter)
- [ ] Copyright year correct

#### Test Responsive Design
- [ ] Open DevTools (F12)
- [ ] Test on mobile (375px width)
  - [ ] Header hamburger menu works
  - [ ] Layout stacks vertically
  - [ ] Text readable
  - [ ] Images scale properly
- [ ] Test on tablet (768px width)
  - [ ] Layout adapts well
  - [ ] Navigation visible
- [ ] Test on desktop (1200px+)
  - [ ] Full layout displayed
  - [ ] All elements visible

### 3. API Integration Testing

#### Test API Client Error Handling

1. **Stop Backend**
   - Stop the Spring Boot server
   - Try accessing menu page
   - Should show mock data instead
   - Console should show API error logs

2. **Slow Network**
   - Use DevTools throttle (Slow 3G)
   - Send chatbot message
   - Should show loading spinner
   - Should eventually get response

3. **Invalid Request**
   - Test API endpoint with wrong data
   - Verify error handling

### 4. Database Testing

#### Access H2 Console
```
http://localhost:8080/h2-console
```

- Username: `sa`
- Password: (empty)
- JDBC URL: `jdbc:h2:mem:testdb`

#### Test Queries
```sql
-- Check dishes
SELECT * FROM dishes;

-- Check reservations
SELECT * FROM reservations;

-- Check chat messages
SELECT * FROM chat_messages;

-- Count records
SELECT COUNT(*) FROM dishes;
```

### 5. Chatbot Testing Matrix

Test these keyword combinations:

| Input | Expected Category | Should Contain |
|-------|------------------|-----------------|
| "menu" | Menu | "sélection", "plats" |
| "plat" | Menu | "sélection", "plats" |
| "contact" | Contact | "+126", "email", "Élysia" |
| "téléphone" | Contact | "+126" |
| "horaire" | Hours | "ouvert", "23h" |
| "heure" | Hours | "ouvert", "23h" |
| "adresse" | Location | "123 Rue", "Tunis" |
| "où" | Location | "123 Rue" |
| "réservation" | Reservation | "réserver", "formulaire" |
| "réserver" | Reservation | "réserver" |
| "livraison" | Delivery | "livraison", "domicile" |
| "bonjour" | Greeting | "Bienvenue", "aider" |
| "hello" | Default | "question" |

### 6. Frontend API Call Testing

#### Open DevTools Network Tab
1. Open http://localhost:3000
2. Press F12 → Network tab
3. Go to Menu page
4. Look for XHR requests to `/api/dishes`
5. Verify:
   - Status: 200
   - Method: GET
   - URL: http://localhost:8080/api/dishes
   - Response: Valid JSON array

#### Send Chatbot Message
1. Open DevTools Network tab
2. Type message in chatbot
3. Look for XHR POST to `/api/chat`
4. Verify:
   - Status: 200
   - Method: POST
   - Request body: `{userMessage: "..."}`
   - Response body: `{userMessage: "...", botResponse: "..."}`

### 7. Console Log Testing

#### Backend Console
Watch for these logs:
```
Sample dishes initialized successfully!
```

#### Frontend Console (DevTools → Console)
Watch for:
```
[v0] API Request: POST /api/chat
[v0] API Response: 200 /api/chat
```

Look for any errors (red messages)

### 8. Performance Testing

#### Load Time
- [ ] Homepage loads in < 2 seconds
- [ ] Menu page loads in < 1 second
- [ ] Chatbot response in < 1 second

#### Network Requests
- [ ] Minimal requests (no duplicates)
- [ ] Request sizes reasonable
- [ ] No 4xx or 5xx errors

### 9. Accessibility Testing

#### Keyboard Navigation
- [ ] Tab through header links
- [ ] Can open/close chatbot with keyboard
- [ ] Send chatbot message with Enter key
- [ ] Focus indicators visible

#### Screen Reader
- [ ] Alt text on images
- [ ] Form labels present
- [ ] Semantic HTML used
- [ ] ARIA attributes where needed

#### Color Contrast
- [ ] Text readable on backgrounds
- [ ] Orange (#FF6B35) has sufficient contrast
- [ ] No color-only information

### 10. Edge Cases Testing

#### Empty States
- [ ] No dishes (if database empty)
- [ ] No reservations
- [ ] Network error while loading

#### Invalid Input
- [ ] Empty chatbot message
- [ ] Very long message (>1000 chars)
- [ ] Special characters in input
- [ ] Unicode characters (accents, emojis)

#### Concurrent Requests
- [ ] Multiple chatbot messages rapidly
- [ ] Multiple API calls simultaneously
- [ ] Tab switching while loading

### 11. Cross-Browser Testing

Test on:
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (if available)
- [ ] Edge (if available)

Verify:
- [ ] Layout renders correctly
- [ ] Styling applied
- [ ] JavaScript works
- [ ] API calls work

## Automated Testing (Future)

### Backend (JUnit/Mockito)
```java
@SpringBootTest
public class DishControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGetAllDishes() throws Exception {
        mockMvc.perform(get("/api/dishes"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(10)));
    }
}
```

### Frontend (Jest/React Testing Library)
```typescript
describe('Chatbot Component', () => {
  it('should send message to API', async () => {
    const { getByText } = render(<Chatbot />);
    const sendButton = getByText('Send');
    
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(mockApi.sendMessage).toHaveBeenCalled();
    });
  });
});
```

## Test Data

### Sample Dishes (Auto-loaded)
1. Foie Gras Terrine - €28
2. Bouillabaisse - €35
3. Coq au Vin - €32
4. Beef Bourguignon - €38
5. Sole Meunière - €36
6. Ratatouille - €18
7. Crème Brûlée - €12
8. Tarte Tatin - €14
9. Escargots de Bourgogne - €22
10. Moules Marinières - €24

### Test Reservation Data
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "+21612345678",
  "reservationDate": "2024-12-25T20:00:00",
  "numberOfGuests": 4,
  "specialRequests": "Window seat preferred"
}
```

## Common Issues & Fixes

| Issue | Symptom | Solution |
|-------|---------|----------|
| CORS Error | API call fails in DevTools | Verify backend running, check CorsConfig |
| API 404 | Endpoint not found | Check spelling, verify controller mapping |
| 500 Error | Server error | Check backend console logs |
| No Chatbot Response | Message sent but no reply | Verify backend running, check network tab |
| Dishes Not Loading | Menu page blank | Confirm data initialized, check network tab |
| Styling Issues | Layout broken | Clear cache (Ctrl+Shift+Delete), restart dev server |

## Test Completion Criteria

✅ All API endpoints respond correctly
✅ Frontend loads without errors
✅ Chatbot communicates with backend
✅ Menu displays all dishes
✅ About and Location sections visible
✅ Footer displays correctly
✅ Responsive design works on all sizes
✅ No console errors or warnings
✅ Network requests succeed
✅ Database properly initialized
✅ Fallback to mock data if API unavailable
✅ All French text displays correctly
✅ Keyboard navigation works
✅ Performance acceptable

## Test Report Template

```
Testing Date: ________
Tester: ________
Browser: ________
OS: ________

RESULTS:
Frontend: [ ] PASS [ ] FAIL
Backend: [ ] PASS [ ] FAIL
Database: [ ] PASS [ ] FAIL
Integration: [ ] PASS [ ] FAIL

ISSUES FOUND:
1. ________
2. ________
3. ________

NOTES:
________
```

---

For detailed technical testing, refer to:
- **Backend README**: `backend/README.md`
- **Architecture**: `ARCHITECTURE.md`
- **Integration Guide**: `INTEGRATION_GUIDE.md`
