# PSGS-DXC

# ⚙️ Backend

<div align="center">
    <img src="https://skillicons.dev/icons?i=nodejs,javascript,express,mongodb,java,rabbitmq,mysql,npm,spring,docker,github" /><br>
</div>

This is a backend architecture based on microservices. It includes multiple services built using **Java Spring Boot** and **Node.js (Express.js)**, and leverages **Docker** and **Docker Compose** for orchestration.

---

## 📦 Project Structure

backend-microservices-template/
- ├── services/
- │ ├── auth-service/ # Spring Boot (Java) - Authentication
- │ ├── evaluation-service/ # Spring Boot (Java) - Intern Evaluation
- │ ├── intern-management/ # Node.js (Express) - Intern CRUD management
- │ ├── file-service/ # Node.js (Express) - File Upload/Download
- │ └── notification-service/ # Node.js (Express) - Email/SMS Notifications
- ├── docker-compose.yml # Docker Compose orchestration
- ├── .env # Environment variables (example)
- └── README.md # Project documentation



---

### 🧱 Technologies Used


| Technology        | Description                                |
|-------------------|--------------------------------------------|
| **Spring Boot**   | Java-based framework for microservices     |
| **Express.js**    | Fast and minimalist Node.js web framework  |
| **MongoDB**       | NoSQL document database                    |
| **MySQL**         | Relational database for structured data    |
| **RabbitMQ**      | Message broker for async service comms     |
| **Docker**        | Containerization of services               |
| **Docker Compose**| Multi-service orchestration                |

---

## 🚀 Services Overview

### 🔐 `auth-service`
- Handles **user authentication**, **JWT token generation**, and **role management**.
- Developed using **Spring Boot**.

### 📊 `evaluation-service`
- Manages intern **evaluations**, scores, and review history.
- Built using **Spring Boot**.

### 👨‍💼 `intern-management`
- Provides **CRUD operations** for intern profiles.
- Developed using **Express.js (Node.js)**.

### 📁 `file-service`
- Handles **file uploads**, downloads, and storage.
- Built with **Express.js (Node.js)**.

### 📢 `notification-service`
- Sends **email** and **SMS notifications**.
- Developed with **Express.js**.

---

## 🐳 Running the Project with Docker

### Prerequisites:
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### 🧪 Start all services:
```bash
docker-compose up --build
