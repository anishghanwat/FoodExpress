package com.fooddelivery.notification.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "campaigns")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 20)
    private String type; // PROMOTIONAL, ANNOUNCEMENT, LOYALTY

    @Column(nullable = false, length = 30)
    private String segment; // ALL_CUSTOMERS, ACTIVE_CUSTOMERS, PREMIUM_CUSTOMERS
    private Long templateId; // Link to NotificationTemplate

    @Column(nullable = false, length = 20)
    private String status = "DRAFT"; // DRAFT, SCHEDULED, SENT

    @Column(nullable = false)
    private Integer sentCount = 0;

    @Column(nullable = false)
    private Double openRate = 0.0;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime sentAt;

    private LocalDateTime scheduledAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null)
            status = "DRAFT";
        if (sentCount == null)
            sentCount = 0;
        if (openRate == null)
            openRate = 0.0;
    }
}
