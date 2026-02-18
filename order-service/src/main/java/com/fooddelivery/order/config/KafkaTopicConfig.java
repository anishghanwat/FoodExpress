package com.fooddelivery.order.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {
    
    // Topic names
    public static final String ORDER_EVENTS_TOPIC = "order-events";
    public static final String ORDER_CREATED_TOPIC = "order-created";
    public static final String ORDER_CONFIRMED_TOPIC = "order-confirmed";
    public static final String ORDER_PREPARING_TOPIC = "order-preparing";
    public static final String ORDER_READY_FOR_PICKUP_TOPIC = "order-ready-for-pickup";
    public static final String ORDER_OUT_FOR_DELIVERY_TOPIC = "order-out-for-delivery";
    public static final String ORDER_DELIVERED_TOPIC = "order-delivered";
    public static final String ORDER_CANCELLED_TOPIC = "order-cancelled";
    
    @Bean
    public NewTopic orderEventsTopic() {
        return TopicBuilder.name(ORDER_EVENTS_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
    
    @Bean
    public NewTopic orderCreatedTopic() {
        return TopicBuilder.name(ORDER_CREATED_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
    
    @Bean
    public NewTopic orderConfirmedTopic() {
        return TopicBuilder.name(ORDER_CONFIRMED_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
    
    @Bean
    public NewTopic orderPreparingTopic() {
        return TopicBuilder.name(ORDER_PREPARING_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
    
    @Bean
    public NewTopic orderReadyForPickupTopic() {
        return TopicBuilder.name(ORDER_READY_FOR_PICKUP_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
    
    @Bean
    public NewTopic orderOutForDeliveryTopic() {
        return TopicBuilder.name(ORDER_OUT_FOR_DELIVERY_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
    
    @Bean
    public NewTopic orderDeliveredTopic() {
        return TopicBuilder.name(ORDER_DELIVERED_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
    
    @Bean
    public NewTopic orderCancelledTopic() {
        return TopicBuilder.name(ORDER_CANCELLED_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
