# 🚀 MyWorkFlow - Project Task Management System

<div align="center">


**A modern, full-stack project task management application built with Spring Boot and React**

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

 [Features](#-features) • [Installation](#-quick-start) • [Documentation](#-api-endpoints) 

</div>

---


## ✨ Features

### 🔐 Authentication & User Management
- ✅ Secure JWT-based authentication
- ✅ User registration and login
- ✅ Profile management with image upload
- ✅ Protected routes and API endpoints

### 📊 Projects Management
- ✅ Create, read, update, and delete projects
- ✅ Project listing with pagination and search
- ✅ Detailed project view with progress statistics
- ✅ Responsive project cards with visual progress indicators

### ✅ Tasks Management
- ✅ Full CRUD operations for tasks
- ✅ Task status management (TODO, IN_PROGRESS, DONE)
- ✅ Due date tracking with overdue notifications
- ✅ Advanced filtering and search capabilities
- ✅ Drag-and-drop task reordering

### 📈 Progress Tracking
- ✅ Real-time progress percentage calculation
- ✅ Visual progress bars and charts
- ✅ Dashboard with comprehensive statistics
- ✅ Task completion trends and analytics

### 🎨 User Interface
- ✅ Modern, responsive design with Bootstrap
- ✅ Interactive charts using Chart.js
- ✅ Intuitive navigation and user experience

---

## 🛠️ Technology Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Spring Boot | 3.2.5 | Framework |
| Spring Security | - | JWT Authentication |
| PostgreSQL | 15+ | Database |
| JPA/Hibernate | - | ORM |
| Maven | 3.8+ | Build Tool |
| Java | 17 | Language |
| Swagger/OpenAPI | 3.0 | API Documentation |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2 | UI Framework |
| TypeScript | 5.0 | Type Safety |
| Vite | - | Build Tool |
| Bootstrap | 5 | CSS Framework |
| Axios | - | HTTP Client |
| Chart.js | - | Data Visualization |
| React Router | 6 | Routing |
| React Hook Form | - | Form Management |
| Yup | - | Validation |
| React Hot Toast | - | Notifications |

---

## 📁 Project Structure

```
MyWorkFlow/
├── backend/                      # Spring Boot Application
│   ├── src/
│   │   ├── main/java/com/myworkflow/
│   │   │   ├── config/              # Configuration classes
│   │   │   ├── domain/              # Domain layer (DDD)
│   │   │   │   ├── model/           # Entities
│   │   │   │   └── repository/      # Repository interfaces
│   │   │   ├── application/         # Application layer
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   └── service/         # Business services
│   │   │   ├── infrastructure/      # Infrastructure layer
│   │   │   │   ├── security/        # Security configuration
│   │   │   │   ├── exception/       # Exception handling
│   │   │   │   └── persistence/     # Database configuration
│   │   │   └── presentation/        # Presentation layer
│   │   │       └── controller/      # REST controllers
│   │   └── resources/
│   │       ├── application.properties
│   │       └── data.sql
│   ├── pom.xml
│   └── .env.example
│
└── frontend/                     # React Application
    ├── src/
    │   ├── components/              # Reusable components
    │   │   ├── auth/                # Authentication
    │   │   ├── projects/            # Projects
    │   │   ├── tasks/               # Tasks
    │   │   ├── dashboard/           # Dashboard
    │   │   ├── layout/              # Layout
    │   │   └── common/              # Common UI
    │   ├── pages/                   # Page components
    │   ├── services/                # API services
    │   ├── hooks/                   # Custom hooks
    │   ├── context/                 # Context providers
    │   ├── types/                   # TypeScript types
    │   ├── utils/                   # Utilities
    │   └── assets/                  # Static assets
    ├── package.json
    └── vite.config.ts
```

---

## 🚀 Quick Start

### Prerequisites

Make sure you have the following tools installed:

- ✅ **Java 17+** - [Download](https://www.oracle.com/java/technologies/downloads/)
- ✅ **Node.js 18+** - [Download](https://nodejs.org/)
- ✅ **PostgreSQL 15+** - [Download](https://www.postgresql.org/download/)
- ✅ **Maven 3.8+** - [Download](https://maven.apache.org/download.cgi)
- ✅ **Git** - [Download](https://git-scm.com/downloads)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/imanebahamd/myworkflow.git
cd myworkflow
```

### 2️⃣ Database Setup

#### Option A: Using Aiven Cloud (Recommended) ☁️

1. Create an account at [Aiven.io](https://aiven.io)
2. Create a new PostgreSQL service
3. Note down the connection details

#### Option B: Local PostgreSQL 💻

```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
```

```sql
CREATE DATABASE myworkflow;
CREATE USER myworkflow_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE myworkflow TO myworkflow_user;
\q
```

### 3️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create environment file
cp .env.example .env
```

**Edit `.env` file:**

```env
# Database Configuration
DB_URL=jdbc:postgresql://your-host:your-port/your-database?sslmode=require
DB_USERNAME=your-username
DB_PASSWORD=your-password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=86400000

# Application Configuration
SERVER_PORT=8080
```

**Install and run:**

```bash
# Clean and install dependencies
mvn clean install

# Run the application
mvn spring-boot:run

# Or build and run JAR
mvn clean package
java -jar target/myworkflow-0.0.1-SNAPSHOT.jar
```

✅ **Backend is running on:** `http://localhost:8080`  
📚 **API Documentation:** `http://localhost:8080/swagger-ui.html`

### 4️⃣ Frontend Setup

```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.development
```

**Edit `.env.development` file:**

```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=MyWorkFlow
```

**Run the application:**

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

✅ **Frontend is running on:** `http://localhost:5173`

---

## 🌐 Access the Application

| Service | URL | Description |
|---------|-----|-------------|
| 🖥️ **Frontend** | http://localhost:5173 | React Application |
| 🔧 **Backend API** | http://localhost:8080 | Spring Boot API |
| 📖 **API Docs** | http://localhost:8080/swagger-ui.html | Swagger UI |



---

## 📚 API Endpoints

### 🔐 Authentication
```http
POST   /api/auth/register     # Register new user
POST   /api/auth/login        # Login user
```

### 👤 Users
```http
GET    /api/users/me          # Get current user profile
PUT    /api/users/me          # Update profile
PATCH  /api/users/me/profile-image  # Upload profile image
```

### 📊 Projects
```http
GET    /api/projects          # List user projects (with pagination)
POST   /api/projects          # Create new project
GET    /api/projects/{id}     # Get project details
PUT    /api/projects/{id}     # Update project
DELETE /api/projects/{id}     # Delete project
GET    /api/projects/search   # Search projects
```

### ✅ Tasks
```http
GET    /api/projects/{id}/tasks      # List project tasks
POST   /api/projects/{id}/tasks      # Create new task
GET    /api/tasks/{id}               # Get task details
PUT    /api/tasks/{id}               # Update task
PATCH  /api/tasks/{id}/complete      # Mark task as completed
DELETE /api/tasks/{id}               # Delete task
GET    /api/tasks/search             # Search tasks
```

### 📈 Dashboard
```http
GET    /api/dashboard         # Get dashboard data
GET    /api/dashboard/stats   # Get statistics
```

---

## 📊 Database Schema

```sql
-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    profile_image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'TODO',
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
```

## 👨‍💻 Author

**Bahamd Imane**

---

## 🙏 Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot) team for the amazing framework
- [React](https://reactjs.org/) team for the frontend library
- [Bootstrap](https://getbootstrap.com/) team for the CSS framework
- [Chart.js](https://www.chartjs.org/) for data visualization
- All open-source contributors whose libraries made this project possible

---

<div align="center">

**Built with ❤️ by Bahamd Imane**

</div>
