package com.fooddelivery.delivery.producer;

import com.fooddelivery.delivery.config.KafkaTopicConfig;
import com.fooddelivery.delivery.entity.Delivery;
import com.fooddelivery.delivery.entity.DeliveryStatus;
import com.fooddelivery.delivery.event.DeliveryEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeliveryEventProducer {
    
    private final KafkaTemplate<String, DeliveryEvent> kafkaTemplate;
    
    public void publishDeliveryAssigned(Delivery delivery) {
        DeliveryEvent event = new DeliveryEvent(
                "DELIVERY_ASSIGNED",
                delivery.getId(),
                delivery.getOrderId(),
                delivery.getAgentId(),
                delivery.getStatus()
        );
        event.setDeliveryAddress(delivery.getDeliveryAddress());
        event.setPickupAddress(delivery.getPickupAddress());
        event.setDeliveryFee(delivery.getDeliveryFee());
        
        sendEventToTopic(event, KafkaTopicConfig.DELIVERY_ASSIGNED_TOPIC);
        sendEventToTopic(event, KafkaTopicConfig.DELIVERY_EVENTS_TOPIC);
    }
    
    public void publishDeliveryPickedUp(Delivery delivery) {
        DeliveryEvent event = new DeliveryEvent(
                "DELIVERY_PICKED_UP",
                delivery.getId(),
                delivery.getOrderId(),
                delivery.getAgentId(),
                delivery.getStatus()
        );
        event.setDeliveryAddress(delivery.getDeliveryAddress());
        
        sendEventToTopic(event, KafkaTopicConfig.DELIVERY_PICKED_UP_TOPIC);
        sendEventToTopic(event, KafkaTopicConfig.DELIVERY_EVENTS_TOPIC);
    }
    
    public void publishDeliveryInTransit(Delivery delivery) {
        DeliveryEvent event = new DeliveryEvent(
                "DELIVERY_IN_TRANSIT",
                delivery.getId(),
                delivery.getOrderId(),
                delivery.getAgentId(),
                delivery.getStatus()
        );
        event.setDeliveryAddress(delivery.getDeliveryAddress());
        
        sendEventToTopic(event, KafkaTopicConfig.DELIVERY_IN_TRANSIT_TOPIC);
        sendEventToTopic(event, KafkaTopicConfig.DELIVERY_EVENTS_TOPIC);
    }
    
    public void publishDeliveryDelivered(Delivery delivery) {
        DeliveryEvent event = new DeliveryEvent(
                "DELIVERY_DELIVERED",
                delivery.getId(),
                delivery.getOrderId(),
                delivery.getAgentId(),
                delivery.getStatus()
        );
        event.setDeliveryAddress(delivery.getDeliveryAddress());
        
        sendEventToTopic(event, KafkaTopicConfig.DELIVERY_DELIVERED_TOPIC);
        sendEventToTopic(event, KafkaTopicConfig.DELIVERY_EVENTS_TOPIC);
    }
    
    public void publishDeliveryCancelled(Delivery delivery) {
        DeliveryEvent event = new DeliveryEvent(
                "DELIVERY_CANCELLED",
                delivery.getId(),
                delivery.getOrderId(),
                delivery.getAgentId(),
                delivery.getStatus()
        );
        
        sendEventToTopic(event, KafkaTopicConfig.DELIVERY_CANCELLED_TOPIC);
        sendEventToTopic(event, KafkaTopicConfig.DELIVERY_EVENTS_TOPIC);
    }
    
    public void publishLocationUpdate(Delivery delivery) {
        DeliveryEvent event = new DeliveryEvent(
                "DELIVERY_LOCATION_UPDATED",
                delivery.getId(),
                delivery.getOrderId(),
                delivery.getAgentId(),
                delivery.getStatus()
        );
        event.setDeliveryAddress(delivery.getDeliveryAddress());
        event.setAgentLatitude(delivery.getAgentLatitude());
        event.setAgentLongitude(delivery.getAgentLongitude());
        event.setEstimatedDistanceKm(delivery.getEstimatedDistanceKm());
        event.setEstimatedTimeMinutes(delivery.getEstimatedTimeMinutes());
        
        sendEventToTopic(event, KafkaTopicConfig.DELIVERY_LOCATION_UPDATED_TOPIC);
        sendEventToTopic(event, KafkaTopicConfig.DELIVERY_EVENTS_TOPIC);
    }
    
    private void sendEventToTopic(DeliveryEvent event, String topic) {
        CompletableFuture.runAsync(() -> {
            try {
                CompletableFuture<SendResult<String, DeliveryEvent>> future = 
                    kafkaTemplate.send(topic, event.getDeliveryId().toString(), event);
                
                future.whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info("✅ Published {} to topic '{}' | Delivery: {} | Partition: {}", 
                            event.getEventType(), 
                            topic,
                            event.getDeliveryId(),
                            result.getRecordMetadata().partition());
                    } else {
                        log.error("❌ Failed to publish {} to topic '{}' | Delivery: {}", 
                            event.getEventType(), 
                            topic,
                            event.getDeliveryId(), 
                            ex);
                    }
                });
            } catch (Exception e) {
                log.error("❌ Exception while publishing {} to topic '{}' | Delivery: {}", 
                    event.getEventType(), 
                    topic,
                    event.getDeliveryId(), 
                    e);
            }
        });
    }
}
