package com.fooddelivery.notification.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications", indexes = {
    @Index(name = "idx_user_id", columnList = "userId"),
    @Index(name = "idx_user_role", columnList = "userRole"),
    @Index(name = "idx_is_read", columnList = "isRead"),
    @Index(name = "idx_user_unread", columnList = "userId,isRead")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false, length = 20)
    private String userRole; // CUSTOMER, AGENT, OWNER, ADMIN
    
    @Column(nullable = false, length = 50)
    private String type; // ORDER, PAYMENT, DELIVERY, SYSTEM
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
    
    @Column(length = 20)
    private String priority; // LOW, MEDIUM, HIGH, URGENT
    
    @Column(length = 20)
    private String category; // INFO, SUCCESS, WARNING, ERROR
    
    private Long relatedEntityId; // Order ID, Payment ID, etc.
    
    @Column(length = 50)
    private String relatedEntityType; // ORDER, PAYMENT, DELIVERY
    
    @Column(nullable = false)
    private Boolean isRead = false;
    
    @Column(nullable = false)
    private Boolean isSent = false;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime readAt;
    
    private LocalDateTime sentAt;
    
    @Column(columnDefinition = "JSON")
    private String metadata; // Additional data as JSON string
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (isRead == null) isRead = false;
        if (isSent == null) isSent = false;
    }
}
