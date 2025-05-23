# PSGS-DXC

# 🧩 Backend Microservices Template

This is a backend architecture based on microservices. It includes multiple services built using **Java Spring Boot** and **Node.js (Express.js)**, and leverages **Docker** and **Docker Compose** for orchestration.

---

## 📦 Project Structure

backend-microservices-template/
├── services/
│ ├── auth-service/ # Spring Boot (Java) - Authentication
│ ├── evaluation-service/ # Spring Boot (Java) - Intern Evaluation
│ ├── intern-management/ # Node.js (Express) - Intern CRUD management
│ ├── file-service/ # Node.js (Express) - File Upload/Download
│ └── notification-service/ # Node.js (Express) - Email/SMS Notifications
├── docker-compose.yml # Docker Compose orchestration
├── .env # Environment variables (example)
└── README.md # Project documentation



---

## 🧱 Technologies Used

| Technology       | Purpose                          |
|------------------|----------------------------------|
| **Spring Boot**  | Java-based microservices         |
| **Express.js**   | Lightweight Node.js services     |
| **MongoDB**      | NoSQL database                   |
| **MySQL**        | Relational database              |
| **RabbitMQ**     | Messaging between services       |
| **Docker**       | Containerization                 |
| **Docker Compose** | Multi-container orchestration  |

---

## 🚀 Services Overview

### 1. `auth-service`
- Handles user registration, login, JWT authentication
- Built using **Spring Boot**

### 2. `evaluation-service`
- Manages evaluations of interns
- Built using **Spring Boot**

### 3. `intern-management`
- CRUD operations for interns
- Built using **Express.js**

### 4. `file-service`
- Handles file uploads/downloads
- Built using **Express.js**

### 5. `notification-service`
- Sends notifications via email or SMS
- Built using **Express.js**

---

## 🐳 Running the Project with Docker

Make sure you have **Docker** and **Docker Compose** installed.

```bash
docker-compose up --build
