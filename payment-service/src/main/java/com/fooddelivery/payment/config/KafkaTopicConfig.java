package com.fooddelivery.payment.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

/**
 * Kafka topic configuration for payment events
 * Creates all payment-related topics on application startup
 */
@Configuration
public class KafkaTopicConfig {
    
    // Topic names
    public static final String PAYMENT_EVENTS_TOPIC = "payment-events";
    public static final String PAYMENT_INITIATED_TOPIC = "payment-initiated";
    public static final String PAYMENT_PROCESSING_TOPIC = "payment-processing";
    public static final String PAYMENT_COMPLETED_TOPIC = "payment-completed";
    public static final String PAYMENT_FAILED_TOPIC = "payment-failed";
    public static final String PAYMENT_CANCELLED_TOPIC = "payment-cancelled";
    public static final String PAYMENT_REFUND_INITIATED_TOPIC = "payment-refund-initiated";
    public static final String PAYMENT_REFUNDED_TOPIC = "payment-refunded";
    public static final String PAYMENT_WEBHOOK_RECEIVED_TOPIC = "payment-webhook-received";
    
    @Bean
    public NewTopic paymentEventsTopic() {
        return TopicBuilder.name(PAYMENT_EVENTS_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
    
    @Bean
    public NewTopic paymentInitiatedTopic() {
        return TopicBuilder.name(PAYMENT_INITIATED_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
    
    @Bean
    public NewTopic paymentProcessingTopic() {
        return TopicBuilder.name(PAYMENT_PROCESSING_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
    
    @Bean
    public NewTopic paymentCompletedTopic() {
        return TopicBuilder.name(PAYMENT_COMPLETED_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
    
    @Bean
    public NewTopic paymentFailedTopic() {
        return TopicBuilder.name(PAYMENT_FAILED_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
    
    @Bean
    public NewTopic paymentCancelledTopic() {
        return TopicBuilder.name(PAYMENT_CANCELLED_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
    
    @Bean
    public NewTopic paymentRefundInitiatedTopic() {
        return TopicBuilder.name(PAYMENT_REFUND_INITIATED_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
    
    @Bean
    public NewTopic paymentRefundedTopic() {
        return TopicBuilder.name(PAYMENT_REFUNDED_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
    
    @Bean
    public NewTopic paymentWebhookReceivedTopic() {
        return TopicBuilder.name(PAYMENT_WEBHOOK_RECEIVED_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
