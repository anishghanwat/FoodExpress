package com.fooddelivery.order.repository;

import com.fooddelivery.order.entity.ProcessedEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for tracking processed events
 */
@Repository
public interface ProcessedEventRepository extends JpaRepository<ProcessedEvent, Long> {
    
    /**
     * Check if an event has already been processed
     */
    boolean existsByEventId(String eventId);
    
    /**
     * Find processed event by event ID
     */
    Optional<ProcessedEvent> findByEventId(String eventId);
    
    /**
     * Find processed events by order ID
     */
    java.util.List<ProcessedEvent> findByOrderId(Long orderId);
}
