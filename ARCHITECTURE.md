# System Architecture - Maison Élysia

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Browser / Client                             │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Next.js Frontend (Port 3000)                  │  │
│  │                                                          │  │
│  │  - React Components                                    │  │
│  │  - Chatbot UI                                          │  │
│  │  - Menu Pages                                          │  │
│  │  - About Section                                       │  │
│  │  - Location Map                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                      HTTP/CORS                                   │
│                            │                                     │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        Axios API Client (lib/api/client.ts)             │  │
│  │                                                          │  │
│  │  - Request Interceptors                                │  │
│  │  - Response Interceptors                               │  │
│  │  - Error Handling                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            │
                      http://localhost:8080/api
                            │
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                  Spring Boot Backend (Port 8080)               │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               REST Controllers                           │  │
│  │                                                          │  │
│  │  - DishController (/api/dishes)                        │  │
│  │  - ReservationController (/api/reservations)           │  │
│  │  - ChatController (/api/chat)                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               Business Services                          │  │
│  │                                                          │  │
│  │  - DishService                                         │  │
│  │  - ReservationService                                 │  │
│  │  - ChatbotService                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Data Repositories (JPA)                    │  │
│  │                                                          │  │
│  │  - DishRepository                                      │  │
│  │  - ReservationRepository                              │  │
│  │  - ChatMessageRepository                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           H2 In-Memory Database                         │  │
│  │                                                          │  │
│  │  - Dishes Table                                        │  │
│  │  - Reservations Table                                 │  │
│  │  - Chat Messages Table                                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Layer Architecture

### Frontend Layer (Next.js)

```
┌─────────────────────────────────────────┐
│         Pages & Components              │
│  ┌──────────────────────────────────┐  │
│  │  Home Page (page.tsx)            │  │
│  │  - Hero Section                  │  │
│  │  - Featured Dishes               │  │
│  │  - About Section                 │  │
│  │  - Location Section              │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │  Menu Components                 │  │
│  │  - DishList                      │  │
│  │  - DishCard                      │  │
│  │  - CategoryFilter                │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │  Layout Components               │  │
│  │  - Header                        │  │
│  │  - Footer                        │  │
│  │  - Navigation                    │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │  Chatbot Component               │  │
│  │  - Chat UI                       │  │
│  │  - Message Handler               │  │
│  │  - Fallback Responses            │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│      API Client Layer                   │
│  ┌──────────────────────────────────┐  │
│  │  lib/api/client.ts               │  │
│  │  - Axios Instance                │  │
│  │  - dishApi                       │  │
│  │  - reservationApi                │  │
│  │  - chatApi                       │  │
│  │  - Interceptors                  │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│      Utilities & Types                  │
│  - types.ts (TypeScript interfaces)    │
│  - mock-data.ts (Fallback data)        │
│  - Styling & Constants                 │
└─────────────────────────────────────────┘
```

### Backend Layer (Spring Boot)

```
┌──────────────────────────────────────────────┐
│        REST Controllers                      │
│  ┌──────────────────────────────────────┐   │
│  │  @RestController                     │   │
│  │  @RequestMapping("/api/...")        │   │
│  │  - GET/POST/PUT/DELETE methods      │   │
│  │  - Request/Response mapping         │   │
│  │  - HTTP status codes                │   │
│  └──────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
             ↓
┌──────────────────────────────────────────────┐
│        Service Layer                         │
│  ┌──────────────────────────────────────┐   │
│  │  @Service Classes                    │   │
│  │  - Business Logic                   │   │
│  │  - Validation                       │   │
│  │  - Data Transformation              │   │
│  │  - DTOs ↔ Entities                  │   │
│  └──────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
             ↓
┌──────────────────────────────────────────────┐
│        Data Access Layer (JPA)              │
│  ┌──────────────────────────────────────┐   │
│  │  @Repository                         │   │
│  │  extends JpaRepository               │   │
│  │  - CRUD Operations                  │   │
│  │  - Custom Queries                   │   │
│  │  - Database Abstraction             │   │
│  └──────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
             ↓
┌──────────────────────────────────────────────┐
│      JPA Entities / Models                   │
│  ┌──────────────────────────────────────┐   │
│  │  @Entity Classes                     │   │
│  │  - Dish                             │   │
│  │  - Reservation                      │   │
│  │  - ChatMessage                      │   │
│  │  - Database Mapping                 │   │
│  └──────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
             ↓
┌──────────────────────────────────────────────┐
│         Database (H2)                        │
│  - In-Memory RDBMS                          │
│  - Tables: dishes, reservations, etc.       │
│  - Sample data loaded on startup            │
└──────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Chatbot Message Flow

```
User Input
    │
    ↓
[Chatbot.tsx Component]
    │
    ├→ setMessages(userMessage)
    │
    ├→ Call: chatApi.sendMessage(input)
    │
    ↓
[API Client - Interceptor]
    │
    ├→ Log: "[v0] API Request: POST /api/chat"
    │
    ↓
[HTTP POST]
    │ http://localhost:8080/api/chat
    │ Content-Type: application/json
    │ Body: { userMessage: "..." }
    │
    ↓
[ChatController]
    │
    ├→ Receive POST request
    │
    ├→ Extract userMessage
    │
    ↓
[ChatbotService.processMessage()]
    │
    ├→ convertToLowerCase
    │
    ├→ Check keywords:
    │   - "menu" → menu response
    │   - "contact" → contact info
    │   - "hours" → business hours
    │   - etc.
    │
    ├→ generateBotResponse()
    │
    ↓
[Save to Database]
    │
    ├→ ChatMessage entity
    │
    ├→ ChatMessageRepository.save()
    │
    ↓
[Return Response]
    │
    ├→ ChatMessageDTO
    │
    ├→ JSON: { userMessage: "...", botResponse: "..." }
    │
    ↓
[API Client - Interceptor]
    │
    ├→ Log: "[v0] API Response: 200"
    │
    ↓
[Chatbot.tsx Component]
    │
    ├→ setMessages(botResponse)
    │
    ↓
[Display Message]
    │
    ├→ Render in chat window
```

### 2. Menu Dishes Flow

```
User Clicks "Menu"
    │
    ↓
[Menu Page Component]
    │
    ├→ useEffect(() => fetchDishes)
    │
    ↓
[API Call]
    │
    ├→ dishApi.getAll()
    │
    ↓
[Axios Request]
    │
    ├→ GET http://localhost:8080/api/dishes
    │
    ↓
[DishController.getAllDishes()]
    │
    ├→ Call dishService.getAllDishes()
    │
    ├→ dishRepository.findAll()
    │
    ↓
[Database Query]
    │
    ├→ SELECT * FROM dishes
    │
    ↓
[DishService - DTO Conversion]
    │
    ├→ Convert Dish → DishDTO
    │
    ↓
[Response]
    │
    ├→ JSON Array of DishDTOs
    │
    ├→ HTTP 200 OK
    │
    ↓
[Frontend State Update]
    │
    ├→ setDishes(response)
    │
    ↓
[Render DishCards]
    │
    ├→ Map over dishes
    │
    ├→ Display: name, price, image, rating
```

### 3. Reservation Creation Flow

```
User Submits Form
    │
    ↓
[Reservation Form Component]
    │
    ├→ Validate form data
    │
    ├→ Call: reservationApi.create(data)
    │
    ↓
[Axios POST Request]
    │
    ├→ POST http://localhost:8080/api/reservations
    │
    ├→ Body: ReservationDTO
    │
    ↓
[ReservationController.createReservation()]
    │
    ├→ Call reservationService.createReservation()
    │
    ↓
[ReservationService]
    │
    ├→ Convert DTO → Entity
    │
    ├→ Set createdAt timestamp
    │
    ├→ Call repository.save()
    │
    ↓
[Database Insert]
    │
    ├→ INSERT INTO reservations (...)
    │
    ├→ Generate ID
    │
    ↓
[Return Response]
    │
    ├→ HTTP 201 Created
    │
    ├→ Body: ReservationDTO (with ID)
    │
    ↓
[Frontend Success Handler]
    │
    ├→ Show success message
    │
    ├→ Clear form
    │
    ├→ Redirect or update state
```

## Component Interactions

```
┌──────────────────────────────────────────────────────────┐
│                    Chatbot Component                     │
│  - Maintains message state                              │
│  - Handles user input                                   │
│  - Calls chatApi.sendMessage()                          │
│  - Falls back to mock responses if API fails            │
│  - Displays bot responses                               │
│  - Auto-scrolls to latest message                       │
└──────────────────────────────────────────────────────────┘
            ↑ Listens for events
            │
┌──────────────────────────────────────────────────────────┐
│                    Layout (header/footer)               │
│  - Navigation menu                                      │
│  - Links to pages                                       │
│  - Social media links                                   │
│  - Static contact information                           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                    Menu Page                            │
│  - Fetches dishes from API (dishApi.getAll)            │
│  - Displays dish cards                                  │
│  - Supports category filtering                         │
│  - Shows loading state                                 │
│  - Error handling with fallback                        │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                    Home Page                            │
│  - Hero section                                        │
│  - Featured dishes section                             │
│  - About section                                       │
│  - Location/Map section                                │
│  - CTA buttons                                         │
└──────────────────────────────────────────────────────────┘
```

## Database Schema

```
┌─────────────────────┐
│      DISHES         │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ description         │
│ price               │
│ category            │
│ image               │
│ rating              │
│ reviews             │
│ vegetarian          │
│ gluten_free         │
└─────────────────────┘

┌─────────────────────┐
│   RESERVATIONS      │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ email               │
│ phone               │
│ reservation_date    │
│ number_of_guests    │
│ special_requests    │
│ created_at          │
└─────────────────────┘

┌─────────────────────┐
│   CHAT_MESSAGES     │
├─────────────────────┤
│ id (PK)             │
│ user_message        │
│ bot_response        │
│ timestamp           │
└─────────────────────┘
```

## Deployment Architecture (Future)

```
┌─────────────────────────────────────────────┐
│          Internet / Users                   │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ↓                     ↓
    ┌───────┐            ┌──────────┐
    │Vercel │            │  AWS EC2 │
    │(Front)│            │ (Backend)│
    ├───────┤            ├──────────┤
    │Next.js│            │Spring    │
    │Build  │            │Boot App  │
    │Deploy │            │Container │
    └───────┘            └────┬─────┘
                               │
                               ↓
                          ┌──────────┐
                          │PostgreSQL│
                          │(RDS)     │
                          │Database  │
                          └──────────┘
```

## API Communication Protocol

```
REQUEST:
{
  method: "POST",
  url: "http://localhost:8080/api/chat",
  headers: {
    "Content-Type": "application/json"
  },
  body: {
    "userMessage": "Hello"
  }
}

RESPONSE:
{
  status: 200,
  headers: {
    "Content-Type": "application/json"
  },
  body: {
    "userMessage": "Hello",
    "botResponse": "Bonjour! Comment puis-je vous aider?"
  }
}
```

## Configuration Management

```
Frontend:
  .env.local
  ├── NEXT_PUBLIC_API_URL=http://localhost:8080/api
  └── NEXT_PUBLIC_APP_NAME=Maison Élysia

Backend:
  application.properties
  ├── server.port=8080
  ├── spring.datasource.url=jdbc:h2:mem:testdb
  ├── spring.jpa.hibernate.ddl-auto=create-drop
  └── logging.level.com.maisonelysia=DEBUG
```

This architecture ensures clean separation of concerns, scalability, and maintainability of the Maison Élysia restaurant management system.
