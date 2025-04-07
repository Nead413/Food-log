# Healthy Habits

## 🚀 Project Overview
Healthy Habits is a comprehensive health and fitness tracking application designed to help users maintain a healthy lifestyle. The application allows users to track their meals, exercise routines, set health goals, and monitor their progress over time.

## 👥 Contributors (GROUP 35)
- **Tehj Patel (2312980)** - [t3hj](https://github.com/t3hj)
- **Yazid Belghar (221680)** - [plainsbison](https://github.com/plainsbison)
- **Allireza Kasiri (2376570)** - GitHub
- **Dean Gurung (2320522)** - [Nead13](https://github.com/Nead13)
- **Kris Sah (2383758)** - (https://github.com/shahaman098)
- **Zain Chaudhry (2376797)** - [z1c12](https://github.com/z1c12)
- **Abdul Wahed Mohammad (2343304)** - GitHub Account
- **Agustin Rosario Aurther (2270311)** - GitHub Account

## ✨ Features
✅ **User Authentication** - Secure sign-up and login functionality  
✅ **Food Tracking** - Log and monitor daily food intake with nutritional information  
✅ **Exercise Logging** - Record workouts and physical activities  
✅ **Weight Monitoring** - Track weight changes and progress towards goals  
✅ **Personalized Recommendations** - Receive workout and meal suggestions based on preferences  
✅ **Profile Management** - Update personal health metrics and goals  

## 🛠 Tech Stack
- **Frontend**: React.js, CSS
- **Backend**: Spring Boot, Java
- **Database**: H2 Database
- **Authentication**: BCrypt password hashing
- **API**: RESTful API architecture

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Java 17 or higher
- Maven

### Installation

#### Frontend
```bash
# Navigate to the frontend directory
cd TehjRegistration

# Install dependencies
npm install

# Start the development server
npm start
```

#### Backend
```bash
# Navigate to the backend directory
cd demo

# Build the application
mvn clean install

# Run the application
mvn spring-boot:run
```

## Usage
1. Register a new account with your email and personal details
2. Set up your profile with health metrics and goals
3. Start logging your meals and exercises
4. Track your progress through the dashboard
5. Get personalized workout and nutrition recommendations

## API Endpoints

### User Endpoints
- `POST /users` - Register a new user
- `POST /users/login` - Authenticate user
- `GET /users/{id}` - Get user by ID
- `GET /users/findByEmail` - Find user by email
- `DELETE /users/{id}` - Delete user

### Exercise Log Endpoints
- `GET /exercise-logs/user/{userId}` - Get all exercise logs for a user
- `POST /exercise-logs` - Add a new exercise log
- `GET /exercise-logs/{id}` - Get a specific exercise log
- `PUT /exercise-logs/{id}` - Update an exercise log
- `DELETE /exercise-logs/{id}` - Delete an exercise log

### Food Log Endpoints
- `GET /food-logs/user/{userId}` - Get all food logs for a user
- `POST /food-logs` - Add a new food log
- `GET /food-logs/daily/{userId}/{date}` - Get food logs for a specific date
