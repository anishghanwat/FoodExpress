# Service-by-Service Implementation Guide

## 🎯 Implementation Strategy

We'll build and integrate one service at a time:
1. **Eureka Server** → Service Registry
2. **User Service** → Authentication & User Management
3. **API Gateway** → Route requests
4. **Integrate with Frontend** → Test authentication
5. **Restaurant Service** → Next iteration
6. Continue...

---

## 📦 Service 1: Eureka Server

### Step 1: Create Eureka Server Project

#### Using Spring Initializr (Recommended)
1. Go to https://start.spring.io/
2. Configure:
   - Project: Maven
   - Language: Java
   - Spring Boot: 3.2.2
   - Group: com.fooddelivery
   - Artifact: eureka-server
   - Name: eureka-server
   - Package name: com.fooddelivery.eureka
   - Packaging: Jar
   - Java: 17

3. Dependencies:
   - Eureka Server
   - Spring Boot Actuator

4. Generate and extract to `eureka-server/` folder

#### Manual Setup (Alternative)
Create the following structure in `eureka-server/`:

```
eureka-server/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── fooddelivery/
│       │           └── eureka/
│       │               └── EurekaServerApplication.java
│       └── resources/
│           └── application.yml
├── pom.xml
└── README.md
```

### Step 2: Configure pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.2</version>
        <relativePath/>
    </parent>
    
    <groupId>com.fooddelivery</groupId>
    <artifactId>eureka-server</artifactId>
    <version>1.0.0</version>
    <name>eureka-server</name>
    <description>Service Registry for Food Delivery System</description>
    
    <properties>
        <java.version>17</java.version>
        <spring-cloud.version>2023.0.0</spring-cloud.version>
    </properties>
    
    <dependencies>
        <!-- Eureka Server -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
        </dependency>
        
        <!-- Actuator for health checks -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        
        <!-- Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### Step 3: Create Main Application Class

**File**: `src/main/java/com/fooddelivery/eureka/EurekaServerApplication.java`

```java
package com.fooddelivery.eureka;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
```

### Step 4: Configure application.yml

**File**: `src/main/resources/application.yml`

```yaml
server:
  port: 8761

spring:
  application:
    name: eureka-server

eureka:
  instance:
    hostname: localhost
  client:
    register-with-eureka: false
    fetch-registry: false
    service-url:
      defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka/
  server:
    enable-self-preservation: false
    eviction-interval-timer-in-ms: 4000

management:
  endpoints:
    web:
      exposure:
        include: health,info
  endpoint:
    health:
      show-details: always

logging:
  level:
    com.netflix.eureka: INFO
    com.netflix.discovery: INFO
```

### Step 5: Build and Run

```bash
cd eureka-server
mvn clean install
mvn spring-boot:run
```

### Step 6: Verify

Open browser: http://localhost:8761

You should see the Eureka Dashboard with no services registered yet.

---

## 📦 Service 2: User Service

### Step 1: Create User Service Project

#### Using Spring Initializr
1. Go to https://start.spring.io/
2. Configure:
   - Project: Maven
   - Language: Java
   - Spring Boot: 3.2.2
   - Group: com.fooddelivery
   - Artifact: user-service
   - Name: user-service
   - Package name: com.fooddelivery.user
   - Packaging: Jar
   - Java: 17

3. Dependencies:
   - Spring Web
   - Spring Data JPA
   - Spring Security
   - MySQL Driver
   - Eureka Discovery Client
   - Spring Boot Actuator
   - Validation
   - Lombok
   - Spring Boot DevTools

4. Generate and extract to `user-service/` folder

### Step 2: Project Structure

```
user-service/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── fooddelivery/
│       │           └── user/
│       │               ├── UserServiceApplication.java
│       │               ├── config/
│       │               │   ├── SecurityConfig.java
│       │               │   └── JwtConfig.java
│       │               ├── controller/
│       │               │   ├── AuthController.java
│       │               │   └── UserController.java
│       │               ├── dto/
│       │               │   ├── LoginRequest.java
│       │               │   ├── RegisterRequest.java
│       │               │   ├── AuthResponse.java
│       │               │   └── UserDTO.java
│       │               ├── entity/
│       │               │   ├── User.java
│       │               │   ├── Address.java
│       │               │   └── RefreshToken.java
│       │               ├── repository/
│       │               │   ├── UserRepository.java
│       │               │   ├── AddressRepository.java
│       │               │   └── RefreshTokenRepository.java
│       │               ├── service/
│       │               │   ├── AuthService.java
│       │               │   ├── UserService.java
│       │               │   └── JwtService.java
│       │               ├── security/
│       │               │   ├── JwtAuthenticationFilter.java
│       │               │   └── UserDetailsServiceImpl.java
│       │               ├── exception/
│       │               │   ├── GlobalExceptionHandler.java
│       │               │   └── CustomExceptions.java
│       │               └── util/
│       │                   ├── ApiResponse.java
│       │                   └── Constants.java
│       └── resources/
│           ├── application.yml
│           └── application-dev.yml
├── pom.xml
└── README.md
```

### Step 3: Configure pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.2</version>
        <relativePath/>
    </parent>
    
    <groupId>com.fooddelivery</groupId>
    <artifactId>user-service</artifactId>
    <version>1.0.0</version>
    <name>user-service</name>
    <description>User Management and Authentication Service</description>
    
    <properties>
        <java.version>17</java.version>
        <spring-cloud.version>2023.0.0</spring-cloud.version>
        <jwt.version>0.12.3</jwt.version>
    </properties>
    
    <dependencies>
        <!-- Spring Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <!-- Spring Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <!-- Spring Security -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <!-- MySQL Driver -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Eureka Client -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        
        <!-- Actuator -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        
        <!-- Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- DevTools -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        
        <!-- Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### Step 4: Configure application.yml

**File**: `src/main/resources/application.yml`

```yaml
server:
  port: 8081

spring:
  application:
    name: user-service
  
  datasource:
    url: jdbc:mysql://localhost:3306/user_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
    username: root
    password: root123
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
        format_sql: true
  
  profiles:
    active: dev

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
    register-with-eureka: true
    fetch-registry: true
  instance:
    prefer-ip-address: true
    instance-id: ${spring.application.name}:${server.port}

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: always

# JWT Configuration
jwt:
  secret: 404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
  expiration: 86400000  # 24 hours in milliseconds
  refresh-expiration: 604800000  # 7 days in milliseconds

logging:
  level:
    com.fooddelivery.user: DEBUG
    org.springframework.security: DEBUG
```

---

## 🔄 Next Steps

After creating these files, I'll provide:
1. Complete Java code for all classes
2. Database setup scripts
3. Testing instructions
4. Frontend integration steps

**Ready to proceed with the implementation?**
