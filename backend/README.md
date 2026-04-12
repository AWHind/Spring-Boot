# Maison Élysia Restaurant API

A Spring Boot REST API for the Maison Élysia restaurant management system.

## Prerequisites

- Java 17 or higher
- Maven 3.6.0 or higher

## Getting Started

### 1. Build the Project

```bash
cd backend
mvn clean install
```

### 2. Run the Application

```bash
mvn spring-boot:run
```

The API will start on `http://localhost:8080`

### 3. Verify the API

Open your browser and visit:
- `http://localhost:8080/api/dishes` - Get all dishes
- `http://localhost:8080/h2-console` - H2 Database Console (optional)

## API Endpoints

### Dishes

- `GET /api/dishes` - Get all dishes
- `GET /api/dishes/{id}` - Get dish by ID
- `GET /api/dishes/category/{category}` - Get dishes by category
- `POST /api/dishes` - Create a new dish
- `PUT /api/dishes/{id}` - Update a dish
- `DELETE /api/dishes/{id}` - Delete a dish

### Reservations

- `GET /api/reservations` - Get all reservations
- `GET /api/reservations/{id}` - Get reservation by ID
- `POST /api/reservations` - Create a new reservation
- `PUT /api/reservations/{id}` - Update a reservation
- `DELETE /api/reservations/{id}` - Delete a reservation

### Chat

- `POST /api/chat` - Send a message to the chatbot

## Database

The application uses an in-memory H2 database. Data is initialized on startup with sample dishes.

To access the H2 console:
1. Start the application
2. Navigate to `http://localhost:8080/h2-console`
3. JDBC URL: `jdbc:h2:mem:testdb`
4. Username: `sa`
5. Password: (leave blank)

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000` (Next.js frontend)
- `http://localhost:3001`

To modify CORS settings, edit `src/main/java/com/maisonelysia/config/CorsConfig.java`

## Frontend Integration

The Next.js frontend connects to this API using the API client at:
- `lib/api/client.ts`

Set the `NEXT_PUBLIC_API_URL` environment variable to configure the API base URL:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Project Structure

```
backend/
├── src/main/java/com/maisonelysia/
│   ├── RestaurantApplication.java        # Main application class
│   ├── config/
│   │   ├── CorsConfig.java              # CORS configuration
│   │   └── DataInitializer.java         # Sample data initialization
│   ├── controller/
│   │   ├── DishController.java          # Dish endpoints
│   │   ├── ReservationController.java   # Reservation endpoints
│   │   └── ChatController.java          # Chat endpoints
│   ├── service/
│   │   ├── DishService.java             # Dish business logic
│   │   ├── ReservationService.java      # Reservation business logic
│   │   └── ChatbotService.java          # Chatbot logic
│   ├── model/
│   │   ├── Dish.java                    # Dish entity
│   │   ├── Reservation.java             # Reservation entity
│   │   └── ChatMessage.java             # Chat message entity
│   ├── dto/
│   │   ├── DishDTO.java                 # Dish DTO
│   │   ├── ReservationDTO.java          # Reservation DTO
│   │   └── ChatMessageDTO.java          # Chat message DTO
│   └── repository/
│       ├── DishRepository.java          # Dish repository
│       ├── ReservationRepository.java   # Reservation repository
│       └── ChatMessageRepository.java   # Chat message repository
├── src/main/resources/
│   └── application.properties           # Application configuration
└── pom.xml                              # Maven configuration
```

## Technologies Used

- **Spring Boot 3.2.0** - Framework
- **Spring Data JPA** - ORM
- **H2 Database** - In-memory database
- **Lombok** - Boilerplate reduction
- **Maven** - Build tool

## Notes

- The H2 database is reset on every application restart
- Sample dishes are automatically loaded on startup
- The chatbot uses keyword matching for responses (backend-driven)
- CORS is enabled for local development

## Development

To modify the sample data, edit `src/main/java/com/maisonelysia/config/DataInitializer.java`

To add new endpoints, create a new controller in `src/main/java/com/maisonelysia/controller/`

## Troubleshooting

If you encounter CORS errors:
1. Ensure the frontend is running on `http://localhost:3000`
2. Check that the backend is running on `http://localhost:8080`
3. Verify the `NEXT_PUBLIC_API_URL` is set correctly in the frontend

If the API is not responding:
1. Check that port 8080 is available
2. Ensure Java 17+ is installed: `java -version`
3. Check for any error messages in the console output
