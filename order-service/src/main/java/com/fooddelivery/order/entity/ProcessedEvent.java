package com.fooddelivery.order.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity to track processed Kafka events for idempotency
 * Prevents duplicate processing of the same event
 */
@Entity
@Table(name = "processed_events", indexes = {
    @Index(name = "idx_event_id", columnList = "eventId", unique = true)
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProcessedEvent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String eventId;
    
    @Column(nullable = false)
    private String eventType;
    
    @Column(nullable = false)
    private LocalDateTime processedAt;
    
    private Long orderId;
    private Long paymentId;
    
    public ProcessedEvent(String eventId, String eventType, Long orderId, Long paymentId) {
        this.eventId = eventId;
        this.eventType = eventType;
        this.orderId = orderId;
        this.paymentId = paymentId;
        this.processedAt = LocalDateTime.now();
    }
}
