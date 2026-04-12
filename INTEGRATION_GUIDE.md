# Maison Élysia - Frontend & Backend Integration Guide

This guide explains how to run both the Next.js frontend and Spring Boot backend locally and how they communicate.

## Project Structure

```
v0-project/
├── template-spring/          # Next.js Frontend (Port 3000)
│   ├── app/
│   ├── components/
│   ├── lib/
│   │   ├── api/
│   │   │   └── client.ts    # API client for backend communication
│   │   ├── mock-data.ts     # Fallback data
│   │   └── types.ts
│   ├── package.json
│   └── .env.example
└── backend/                  # Spring Boot API (Port 8080)
    ├── src/
    │   └── main/
    │       ├── java/com/maisonelysia/
    │       └── resources/
    ├── pom.xml
    └── README.md
```

## Prerequisites

### For Frontend
- Node.js 18+ and npm/pnpm
- Port 3000 available

### For Backend
- Java 17+
- Maven 3.6.0+
- Port 8080 available

## Step 1: Start the Spring Boot Backend

### Build and Run

```bash
# Navigate to the backend directory
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

Expected output:
```
... 
Tomcat started on port(s): 8080 (http)
Started RestaurantApplication in X seconds
Sample dishes initialized successfully!
```

### Verify Backend

Open your browser and test:
```
http://localhost:8080/api/dishes
```

You should see a JSON array of dishes.

## Step 2: Configure the Frontend

### Setup Environment Variables

```bash
# In template-spring directory
cp .env.example .env.local

# Edit .env.local if needed (default is already set to localhost:8080)
```

### Install Dependencies

```bash
cd template-spring

# Install with pnpm (recommended)
pnpm install

# Or with npm
npm install
```

## Step 3: Start the Next.js Frontend

```bash
# In template-spring directory
pnpm dev

# Or with npm
npm run dev
```

The frontend will start on `http://localhost:3000`

## How They Work Together

### API Client Flow

1. **Frontend Request**: User interacts with the app (e.g., opens chatbot)
2. **API Call**: The component calls methods from `lib/api/client.ts`
3. **Backend Processing**: Spring Boot receives the request, processes it, and returns JSON
4. **Frontend Response**: The component displays the data from the backend
5. **Fallback**: If the backend is unavailable, the app uses mock data gracefully

### Example: Chatbot Message Flow

```
User types message in Chatbot
        ↓
handleSendMessage() is called
        ↓
chatApi.sendMessage(userMessage) 
        ↓
HTTP POST to http://localhost:8080/api/chat
        ↓
ChatController processes the message
        ↓
ChatbotService generates a response
        ↓
Response is returned to frontend
        ↓
Chatbot displays bot's response
```

## Available Endpoints

### Dishes
- **GET** `/api/dishes` - Get all dishes
- **GET** `/api/dishes/{id}` - Get specific dish
- **GET** `/api/dishes/category/{category}` - Get dishes by category

### Reservations
- **GET** `/api/reservations` - Get all reservations
- **POST** `/api/reservations` - Create reservation
- **PUT** `/api/reservations/{id}` - Update reservation
- **DELETE** `/api/reservations/{id}` - Delete reservation

### Chat
- **POST** `/api/chat` - Send message to chatbot

## Troubleshooting

### Backend won't start
- **Port 8080 in use**: Kill the process using port 8080 or change the port in `application.properties`
- **Java version issue**: Ensure Java 17+ is installed: `java -version`
- **Maven not found**: Ensure Maven is installed and in PATH: `mvn -v`

### Frontend can't connect to backend
- **CORS Error**: This is normal during development. The backend allows `http://localhost:3000`
- **Connection refused**: Ensure backend is running on port 8080
- **Check API URL**: Verify `NEXT_PUBLIC_API_URL` in `.env.local` is `http://localhost:8080/api`

### Database errors
- **H2 Console**: Access at `http://localhost:8080/h2-console`
- **Data not persisting**: H2 in-memory database resets on restart - this is normal
- **Sample data not loaded**: Check console for "Sample dishes initialized successfully!"

### Port conflicts

If ports are in use:

**For Backend (change port 8080)**:
Edit `backend/src/main/resources/application.properties`:
```properties
server.port=8081
```

**For Frontend (change port 3000)**:
```bash
pnpm dev -- -p 3001
```

Then update `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8081/api
```

## Development Workflow

1. **Start Backend**: `cd backend && mvn spring-boot:run`
2. **Start Frontend**: `cd template-spring && pnpm dev`
3. **Make changes**: Edit files in either project
4. **Hot Reload**: Both projects support auto-reload
5. **Test**: Open `http://localhost:3000` and test features

## Features

### Frontend (Next.js)
- Modern restaurant website
- Complete French localization
- Floating chatbot
- Responsive design
- Menu browsing
- About section with restaurant info
- Location/map section

### Backend (Spring Boot)
- RESTful API endpoints
- Dish management
- Reservation system
- Chatbot with French responses
- CORS enabled for local development
- In-memory H2 database with sample data

### API Integration
- Fallback to mock data if backend unavailable
- Error handling with console logs
- Request/response logging
- Axios-based HTTP client

## Deployment Notes

When deploying to production:

1. **Backend**: Deploy to a Java hosting service (e.g., Heroku, AWS Elastic Beanstalk)
2. **Frontend**: Deploy to Vercel or any Node.js hosting
3. **Update API URL**: Change `NEXT_PUBLIC_API_URL` to production backend URL
4. **Database**: Replace H2 with a production database (PostgreSQL, MySQL)
5. **Security**: Implement proper authentication, rate limiting, and CORS policies

## Next Steps

### To add new features:

1. **Backend**: Add new controller, service, and repository in the appropriate packages
2. **Frontend**: Create API methods in `lib/api/client.ts` and use them in components
3. **Test**: Verify both frontend and backend work together

### To customize:

- **Chatbot responses**: Edit `ChatbotService.java`
- **Sample data**: Edit `DataInitializer.java`
- **API base URL**: Update environment variables
- **CORS settings**: Modify `CorsConfig.java`

## Support

For issues:
1. Check console logs in both frontend and backend
2. Ensure both services are running on correct ports
3. Verify environment variables are set correctly
4. Check that network connectivity exists between frontend and backend
