# Eureka Server - Service Registry

## Description
Service discovery and registration server for the Food Delivery System microservices.

## Port
8761

## Build and Run

### Build
```bash
mvn clean install
```

### Run
```bash
mvn spring-boot:run
```

### Verify
Open browser: http://localhost:8761

You should see the Eureka Dashboard.

## Configuration
- **Port**: 8761
- **Self-preservation**: Disabled (for development)
- **Eviction interval**: 4 seconds

## Registered Services
Once other services start, they will appear here:
- user-service
- restaurant-service
- order-service
- delivery-service
- payment-service
- notification-service
- api-gateway
