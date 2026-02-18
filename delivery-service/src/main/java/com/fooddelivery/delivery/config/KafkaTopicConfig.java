package com.fooddelivery.delivery.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {
    
    // Topic names
    public static final String DELIVERY_EVENTS_TOPIC = "delivery-events";
    public static final String DELIVERY_ASSIGNED_TOPIC = "delivery-assigned";
    public static final String DELIVERY_PICKED_UP_TOPIC = "delivery-picked-up";
    public static final String DELIVERY_IN_TRANSIT_TOPIC = "delivery-in-transit";
    public static final String DELIVERY_DELIVERED_TOPIC = "delivery-delivered";
    public static final String DELIVERY_CANCELLED_TOPIC = "delivery-cancelled";
    public static final String DELIVERY_LOCATION_UPDATED_TOPIC = "delivery-location-updated";
    
    @Bean
    public NewTopic deliveryEventsTopic() {
        return TopicBuilder.name(DELIVERY_EVENTS_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
    
    @Bean
    public NewTopic deliveryAssignedTopic() {
        return TopicBuilder.name(DELIVERY_ASSIGNED_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
    
    @Bean
    public NewTopic deliveryPickedUpTopic() {
        return TopicBuilder.name(DELIVERY_PICKED_UP_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
    
    @Bean
    public NewTopic deliveryInTransitTopic() {
        return TopicBuilder.name(DELIVERY_IN_TRANSIT_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
    
    @Bean
    public NewTopic deliveryDeliveredTopic() {
        return TopicBuilder.name(DELIVERY_DELIVERED_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
    
    @Bean
    public NewTopic deliveryCancelledTopic() {
        return TopicBuilder.name(DELIVERY_CANCELLED_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
    
    @Bean
    public NewTopic deliveryLocationUpdatedTopic() {
        return TopicBuilder.name(DELIVERY_LOCATION_UPDATED_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
