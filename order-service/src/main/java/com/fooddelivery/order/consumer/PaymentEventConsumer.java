package com.fooddelivery.order.consumer;

import com.fooddelivery.order.entity.Order;
import com.fooddelivery.order.entity.OrderStatus;
import com.fooddelivery.order.entity.ProcessedEvent;
import com.fooddelivery.order.event.PaymentEvent;
import com.fooddelivery.order.producer.OrderEventProducer;
import com.fooddelivery.order.repository.OrderRepository;
import com.fooddelivery.order.repository.ProcessedEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Consumer for payment events from payment-service
 * Handles payment lifecycle and updates order status accordingly
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentEventConsumer {
    
    private final OrderRepository orderRepository;
    private final ProcessedEventRepository processedEventRepository;
    private final OrderEventProducer orderEventProducer;
    
    /**
     * Handle PAYMENT_INITIATED event
     * This is published when payment intent is created
     */
    @KafkaListener(
        topics = "payment-initiated",
        groupId = "order-service-payment-group",
        containerFactory = "paymentEventKafkaListenerContainerFactory"
    )
    @Transactional
    public void handlePaymentInitiated(PaymentEvent event) {
        log.info("Received PAYMENT_INITIATED event: eventId={}, orderId={}, paymentId={}", 
            event.getEventId(), event.getOrderId(), event.getPaymentId());
        
        // Check if already processed (idempotency)
        if (processedEventRepository.existsByEventId(event.getEventId())) {
            log.info("Event already processed, skipping: eventId={}", event.getEventId());
            return;
        }
        
        try {
            // Find or create order with PAYMENT_PENDING status
            Order order = orderRepository.findById(event.getOrderId())
                .orElse(null);
            
            if (order != null) {
                // Update existing order
                order.setStatus(OrderStatus.PAYMENT_PENDING);
                order.setPaymentId(event.getPaymentId());
                order.setPaymentStatus("PENDING");
                orderRepository.save(order);
                log.info("Updated order {} to PAYMENT_PENDING status", order.getId());
            } else {
                log.warn("Order {} not found for PAYMENT_INITIATED event", event.getOrderId());
            }
            
            // Mark event as processed
            processedEventRepository.save(new ProcessedEvent(
                event.getEventId(),
                event.getEventType(),
                event.getOrderId(),
                event.getPaymentId()
            ));
            
            log.info("Successfully processed PAYMENT_INITIATED event: eventId={}", event.getEventId());
            
        } catch (Exception e) {
            log.error("Error processing PAYMENT_INITIATED event: eventId={}", event.getEventId(), e);
            throw e; // Rethrow to trigger retry
        }
    }
    
    /**
     * Handle PAYMENT_COMPLETED event
     * This is the critical event - payment succeeded, order can proceed
     */
    @KafkaListener(
        topics = "payment-completed",
        groupId = "order-service-payment-group",
        containerFactory = "paymentEventKafkaListenerContainerFactory"
    )
    @Transactional
    public void handlePaymentCompleted(PaymentEvent event) {
        log.info("Received PAYMENT_COMPLETED event: eventId={}, orderId={}, paymentId={}, amount={}", 
            event.getEventId(), event.getOrderId(), event.getPaymentId(), event.getAmount());
        
        // Check if already processed (idempotency)
        if (processedEventRepository.existsByEventId(event.getEventId())) {
            log.info("Event already processed, skipping: eventId={}", event.getEventId());
            return;
        }
        
        try {
            // Find order
            Order order = orderRepository.findById(event.getOrderId())
                .orElse(null);
            
            if (order == null) {
                log.warn("Order {} not found for PAYMENT_COMPLETED event, skipping", event.getOrderId());
                // Mark as processed to avoid retrying
                processedEventRepository.save(new ProcessedEvent(
                    event.getEventId(),
                    event.getEventType(),
                    event.getOrderId(),
                    event.getPaymentId()
                ));
                return;
            }
            
            // Update order status to PENDING (payment successful, waiting for restaurant)
            order.setStatus(OrderStatus.PENDING);
            order.setPaymentId(event.getPaymentId());
            order.setPaymentStatus("COMPLETED");
            order.setPaymentMethod(event.getPaymentMethod());
            
            Order updatedOrder = orderRepository.save(order);
            log.info("Updated order {} to PENDING status after payment completion", updatedOrder.getId());
            
            // Mark event as processed
            processedEventRepository.save(new ProcessedEvent(
                event.getEventId(),
                event.getEventType(),
                event.getOrderId(),
                event.getPaymentId()
            ));
            
            // Publish ORDER_CREATED event to trigger delivery flow
            orderEventProducer.publishOrderCreated(updatedOrder);
            log.info("Published ORDER_CREATED event for order {}", updatedOrder.getId());
            
            log.info("Successfully processed PAYMENT_COMPLETED event: eventId={}", event.getEventId());
            
        } catch (Exception e) {
            log.error("Error processing PAYMENT_COMPLETED event: eventId={}", event.getEventId(), e);
            throw e; // Rethrow to trigger retry
        }
    }
    
    /**
     * Handle PAYMENT_FAILED event
     * Payment failed, mark order as failed
     */
    @KafkaListener(
        topics = "payment-failed",
        groupId = "order-service-payment-group",
        containerFactory = "paymentEventKafkaListenerContainerFactory"
    )
    @Transactional
    public void handlePaymentFailed(PaymentEvent event) {
        log.info("Received PAYMENT_FAILED event: eventId={}, orderId={}, reason={}", 
            event.getEventId(), event.getOrderId(), event.getFailureReason());
        
        // Check if already processed (idempotency)
        if (processedEventRepository.existsByEventId(event.getEventId())) {
            log.info("Event already processed, skipping: eventId={}", event.getEventId());
            return;
        }
        
        try {
            // Find order
            Order order = orderRepository.findById(event.getOrderId())
                .orElse(null);
            
            if (order != null) {
                // Update order status to PAYMENT_FAILED
                order.setStatus(OrderStatus.PAYMENT_FAILED);
                order.setPaymentId(event.getPaymentId());
                order.setPaymentStatus("FAILED");
                orderRepository.save(order);
                log.info("Updated order {} to PAYMENT_FAILED status", order.getId());
            } else {
                log.warn("Order {} not found for PAYMENT_FAILED event", event.getOrderId());
            }
            
            // Mark event as processed
            processedEventRepository.save(new ProcessedEvent(
                event.getEventId(),
                event.getEventType(),
                event.getOrderId(),
                event.getPaymentId()
            ));
            
            log.info("Successfully processed PAYMENT_FAILED event: eventId={}", event.getEventId());
            
        } catch (Exception e) {
            log.error("Error processing PAYMENT_FAILED event: eventId={}", event.getEventId(), e);
            throw e; // Rethrow to trigger retry
        }
    }
    
    /**
     * Handle PAYMENT_REFUNDED event
     * Payment was refunded, update order status
     */
    @KafkaListener(
        topics = "payment-refunded",
        groupId = "order-service-payment-group",
        containerFactory = "paymentEventKafkaListenerContainerFactory"
    )
    @Transactional
    public void handlePaymentRefunded(PaymentEvent event) {
        log.info("Received PAYMENT_REFUNDED event: eventId={}, orderId={}, refundAmount={}", 
            event.getEventId(), event.getOrderId(), event.getRefundAmount());
        
        // Check if already processed (idempotency)
        if (processedEventRepository.existsByEventId(event.getEventId())) {
            log.info("Event already processed, skipping: eventId={}", event.getEventId());
            return;
        }
        
        try {
            // Find order
            Order order = orderRepository.findById(event.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found: " + event.getOrderId()));
            
            // Update order status to REFUNDED
            order.setStatus(OrderStatus.REFUNDED);
            order.setPaymentStatus("REFUNDED");
            orderRepository.save(order);
            log.info("Updated order {} to REFUNDED status", order.getId());
            
            // Mark event as processed
            processedEventRepository.save(new ProcessedEvent(
                event.getEventId(),
                event.getEventType(),
                event.getOrderId(),
                event.getPaymentId()
            ));
            
            log.info("Successfully processed PAYMENT_REFUNDED event: eventId={}", event.getEventId());
            
        } catch (Exception e) {
            log.error("Error processing PAYMENT_REFUNDED event: eventId={}", event.getEventId(), e);
            throw e; // Rethrow to trigger retry
        }
    }
}
