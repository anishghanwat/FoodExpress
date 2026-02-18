# Food Delivery System

A full-stack microservices-based food delivery platform built with Spring Boot and React.

## 🏗️ Architecture

This project follows a microservices architecture with the following components:

### Backend Services
- **API Gateway** (Port 8080) - Entry point for all client requests
- **Eureka Server** (Port 8761) - Service discovery and registration
- **User Service** (Port 8081) - Authentication and user management
- **Restaurant Service** (Port 8082) - Restaurant and menu management
- **Order Service** (Port 8083) - Order processing and management
- **Delivery Service** (Port 8084) - Delivery tracking and assignment
- **Payment Service** (Port 8085) - Payment processing
- **Notification Service** (Port 8086) - Notifications and alerts

### Frontend
- **React Application** (Port 5173) - Modern, responsive UI built with React, Vite, and Tailwind CSS

### Infrastructure
- **MySQL** - Database for each microservice
- **Kafka** - Event streaming and inter-service communication
- **Docker** - Containerization for MySQL and Kafka

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- Node.js 18+
- Docker Desktop
- MySQL (or use Docker)

### 1. Start Infrastructure Services

```bash
# Start Docker containers (MySQL + Kafka)
cd scripts
docker-start.bat
```

### 2. Initialize Databases

```bash
# Run database setup scripts
mysql -u root -p < sql/CREATE_DATABASES.sql
mysql -u root -p < sql/create-admin-user.sql
mysql -u root -p < sql/create-demo-users.sql
```

### 3. Start Backend Services

```bash
# Build all services
scripts/build-all.bat

# Start all services (in separate terminals or use the step-by-step script)
scripts/start-services-step-by-step.bat
```

Services will start in this order:
1. Eureka Server (8761)
2. API Gateway (8080)
3. User Service (8081)
4. Restaurant Service (8082)
5. Order Service (8083)
6. Delivery Service (8084)
7. Payment Service (8085)
8. Notification Service (8086)

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: http://localhost:5173

## 📁 Project Structure

```
├── api-gateway/           # API Gateway service
├── eureka-server/         # Service registry
├── user-service/          # User management
├── restaurant-service/    # Restaurant & menu management
├── order-service/         # Order processing
├── delivery-service/      # Delivery tracking
├── payment-service/       # Payment processing
├── notification-service/  # Notifications
├── frontend/              # React frontend application
├── docker/                # Docker configurations
├── docs/                  # Documentation
├── scripts/               # Build and deployment scripts
└── sql/                   # Database initialization scripts
```

## 🔑 User Roles

The system supports four user roles:

1. **Customer** - Browse restaurants, place orders, track deliveries
2. **Restaurant Owner** - Manage restaurants, menus, and orders
3. **Delivery Agent** - Accept and complete deliveries
4. **Admin** - System administration and monitoring

### Demo Users

After running the setup scripts, you can login with:

- **Admin**: admin@fooddelivery.com / admin123
- **Customer**: customer@example.com / password123
- **Owner**: owner@example.com / password123
- **Agent**: agent@example.com / password123

## 🛠️ Technology Stack

### Backend
- Spring Boot 3.2.0
- Spring Cloud (Gateway, Netflix Eureka)
- Spring Security + JWT
- Spring Data JPA
- MySQL
- Apache Kafka
- Maven

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- shadcn/ui components

### DevOps
- Docker & Docker Compose
- Maven for build automation

## 📚 Documentation

Detailed documentation is available in the `docs/` folder:

- [Backend Architecture](docs/BACKEND_ARCHITECTURE.md)
- [Frontend Architecture](docs/FRONTEND_ARCHITECTURE.md)
- [Setup Instructions](docs/COMPLETE_SETUP_GUIDE.md)
- [Quick Reference](docs/QUICK_REFERENCE.md)
- [Integration Guide](docs/INTEGRATION_TEST_GUIDE.md)

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and update with your configuration:

```bash
cp .env.example .env
```

### Frontend Environment

Copy `frontend/.env.example` to `frontend/.env.development`:

```bash
cd frontend
cp .env.example .env.development
```

## 🧪 Testing

Each service can be tested independently:

```bash
cd <service-name>
mvn test
```

Frontend tests:

```bash
cd frontend
npm test
```

## 📝 API Documentation

Once services are running, API documentation is available at:

- API Gateway: http://localhost:8080
- Eureka Dashboard: http://localhost:8761

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Unsplash](https://unsplash.com) - Images
- Spring Boot community
- React community

## 📧 Support

For issues and questions, please open an issue on GitHub.
