package com.fooddelivery.payment.producer;

import com.fooddelivery.payment.config.KafkaTopicConfig;
import com.fooddelivery.payment.entity.Payment;
import com.fooddelivery.payment.entity.PaymentStatus;
import com.fooddelivery.payment.event.PaymentEvent;
import com.fooddelivery.payment.event.PaymentEventType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

/**
 * Producer service for publishing payment events to Kafka
 * Handles all payment lifecycle event publishing
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentEventProducer {
    
    private final KafkaTemplate<String, PaymentEvent> kafkaTemplate;
    
    /**
     * Publish payment initiated event
     * Called when payment intent is created
     */
    public void publishPaymentInitiated(Payment payment) {
        PaymentEvent event = new PaymentEvent(PaymentEventType.PAYMENT_INITIATED, payment);
        publishEvent(KafkaTopicConfig.PAYMENT_INITIATED_TOPIC, event);
        publishToGeneralTopic(event);
    }
    
    /**
     * Publish payment processing event
     * Called when payment is being processed by Stripe
     */
    public void publishPaymentProcessing(Payment payment) {
        PaymentEvent event = new PaymentEvent(PaymentEventType.PAYMENT_PROCESSING, payment);
        publishEvent(KafkaTopicConfig.PAYMENT_PROCESSING_TOPIC, event);
        publishToGeneralTopic(event);
    }
    
    /**
     * Publish payment completed event
     * Called when payment is successfully completed
     */
    public void publishPaymentCompleted(Payment payment) {
        PaymentEvent event = new PaymentEvent(
            PaymentEventType.PAYMENT_COMPLETED, 
            payment, 
            PaymentStatus.PENDING
        );
        publishEvent(KafkaTopicConfig.PAYMENT_COMPLETED_TOPIC, event);
        publishToGeneralTopic(event);
    }
    
    /**
     * Publish payment failed event
     * Called when payment fails
     */
    public void publishPaymentFailed(Payment payment, String reason) {
        PaymentEvent event = new PaymentEvent(PaymentEventType.PAYMENT_FAILED, payment);
        event.setFailureReason(reason);
        publishEvent(KafkaTopicConfig.PAYMENT_FAILED_TOPIC, event);
        publishToGeneralTopic(event);
    }
    
    /**
     * Publish payment cancelled event
     * Called when payment is cancelled by user
     */
    public void publishPaymentCancelled(Payment payment, String reason) {
        PaymentEvent event = new PaymentEvent(PaymentEventType.PAYMENT_CANCELLED, payment);
        event.setCancelReason(reason);
        publishEvent(KafkaTopicConfig.PAYMENT_CANCELLED_TOPIC, event);
        publishToGeneralTopic(event);
    }
    
    /**
     * Publish refund initiated event
     * Called when refund process starts
     */
    public void publishRefundInitiated(Payment payment, Double refundAmount, String reason) {
        PaymentEvent event = new PaymentEvent(
            PaymentEventType.PAYMENT_REFUND_INITIATED, 
            payment, 
            refundAmount, 
            reason
        );
        publishEvent(KafkaTopicConfig.PAYMENT_REFUND_INITIATED_TOPIC, event);
        publishToGeneralTopic(event);
    }
    
    /**
     * Publish refund completed event
     * Called when refund is successfully processed
     */
    public void publishRefundCompleted(Payment payment, String refundId, Double refundAmount) {
        PaymentEvent event = new PaymentEvent(
            PaymentEventType.PAYMENT_REFUNDED, 
            payment, 
            refundId, 
            refundAmount
        );
        publishEvent(KafkaTopicConfig.PAYMENT_REFUNDED_TOPIC, event);
        publishToGeneralTopic(event);
    }
    
    /**
     * Publish webhook received event
     * Called when Stripe webhook is received
     */
    public void publishWebhookReceived(String webhookId, String eventType, Payment payment) {
        PaymentEvent event = new PaymentEvent(PaymentEventType.PAYMENT_WEBHOOK_RECEIVED, payment);
        event.setEventId(webhookId);
        publishEvent(KafkaTopicConfig.PAYMENT_WEBHOOK_RECEIVED_TOPIC, event);
    }
    
    /**
     * Publish event to specific topic
     */
    private void publishEvent(String topic, PaymentEvent event) {
        try {
            // Use orderId as partition key to ensure ordering
            String key = event.getOrderId() != null ? event.getOrderId().toString() : event.getPaymentId().toString();
            
            CompletableFuture<SendResult<String, PaymentEvent>> future = 
                kafkaTemplate.send(topic, key, event);
            
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("Published {} event to topic {}: eventId={}, paymentId={}, orderId={}", 
                        event.getEventType(), topic, event.getEventId(), 
                        event.getPaymentId(), event.getOrderId());
                } else {
                    log.error("Failed to publish {} event to topic {}: eventId={}, paymentId={}, orderId={}", 
                        event.getEventType(), topic, event.getEventId(), 
                        event.getPaymentId(), event.getOrderId(), ex);
                }
            });
        } catch (Exception e) {
            log.error("Error publishing event to topic {}: {}", topic, e.getMessage(), e);
        }
    }
    
    /**
     * Publish to general payment-events topic for analytics/monitoring
     */
    private void publishToGeneralTopic(PaymentEvent event) {
        try {
            String key = event.getOrderId() != null ? event.getOrderId().toString() : event.getPaymentId().toString();
            kafkaTemplate.send(KafkaTopicConfig.PAYMENT_EVENTS_TOPIC, key, event);
        } catch (Exception e) {
            log.error("Error publishing to general topic: {}", e.getMessage(), e);
        }
    }
}
