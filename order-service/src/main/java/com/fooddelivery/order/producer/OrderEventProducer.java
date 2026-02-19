package com.fooddelivery.order.producer;

import com.fooddelivery.order.config.KafkaTopicConfig;
import com.fooddelivery.order.entity.Order;
import com.fooddelivery.order.entity.OrderStatus;
import com.fooddelivery.order.event.OrderEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderEventProducer {
    
    private final KafkaTemplate<String, OrderEvent> kafkaTemplate;
    
    /**
     * Publish ORDER_CREATED event when a new order is placed
     */
    public void publishOrderCreated(Order order) {
        OrderEvent event = new OrderEvent("ORDER_CREATED", order);
        sendEventToTopic(event, KafkaTopicConfig.ORDER_CREATED_TOPIC);
        // Also send to main events topic for centralized monitoring
        sendEventToTopic(event, KafkaTopicConfig.ORDER_EVENTS_TOPIC);
    }
    
    /**
     * Publish ORDER_CONFIRMED event when restaurant confirms the order
     */
    public void publishOrderConfirmed(Order order) {
        OrderEvent event = new OrderEvent("ORDER_CONFIRMED", order);
        sendEventToTopic(event, KafkaTopicConfig.ORDER_CONFIRMED_TOPIC);
        sendEventToTopic(event, KafkaTopicConfig.ORDER_EVENTS_TOPIC);
    }
    
    /**
     * Publish ORDER_PREPARING event when restaurant starts preparing
     */
    public void publishOrderPreparing(Order order) {
        OrderEvent event = new OrderEvent("ORDER_PREPARING", order);
        sendEventToTopic(event, KafkaTopicConfig.ORDER_PREPARING_TOPIC);
        sendEventToTopic(event, KafkaTopicConfig.ORDER_EVENTS_TOPIC);
    }
    
    /**
     * Publish ORDER_READY_FOR_PICKUP event when order is ready
     */
    public void publishOrderReadyForPickup(Order order) {
        OrderEvent event = new OrderEvent("ORDER_READY_FOR_PICKUP", order);
        sendEventToTopic(event, KafkaTopicConfig.ORDER_READY_FOR_PICKUP_TOPIC);
        sendEventToTopic(event, KafkaTopicConfig.ORDER_EVENTS_TOPIC);
    }
    
    /**
     * Publish ORDER_OUT_FOR_DELIVERY event when delivery agent picks up
     */
    public void publishOrderOutForDelivery(Order order) {
        OrderEvent event = new OrderEvent("ORDER_OUT_FOR_DELIVERY", order);
        sendEventToTopic(event, KafkaTopicConfig.ORDER_OUT_FOR_DELIVERY_TOPIC);
        sendEventToTopic(event, KafkaTopicConfig.ORDER_EVENTS_TOPIC);
    }
    
    /**
     * Publish ORDER_DELIVERED event when order is delivered
     */
    public void publishOrderDelivered(Order order) {
        OrderEvent event = new OrderEvent("ORDER_DELIVERED", order);
        sendEventToTopic(event, KafkaTopicConfig.ORDER_DELIVERED_TOPIC);
        sendEventToTopic(event, KafkaTopicConfig.ORDER_EVENTS_TOPIC);
    }
    
    /**
     * Publish ORDER_CANCELLED event when order is cancelled
     */
    public void publishOrderCancelled(Order order) {
        OrderEvent event = new OrderEvent("ORDER_CANCELLED", order);
        sendEventToTopic(event, KafkaTopicConfig.ORDER_CANCELLED_TOPIC);
        sendEventToTopic(event, KafkaTopicConfig.ORDER_EVENTS_TOPIC);
    }
    
    /**
     * Publish generic status change event
     */
    public void publishOrderStatusChanged(Order order, OrderStatus previousStatus) {
        OrderEvent event = new OrderEvent("ORDER_STATUS_CHANGED", order, previousStatus);
        sendEventToTopic(event, KafkaTopicConfig.ORDER_EVENTS_TOPIC);
    }
    
    /**
     * Send event to specific Kafka topic asynchronously
     */
    private void sendEventToTopic(OrderEvent event, String topic) {
        CompletableFuture.runAsync(() -> {
            try {
                CompletableFuture<SendResult<String, OrderEvent>> future = 
                    kafkaTemplate.send(topic, event.getOrderId().toString(), event);
                
                future.whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info("✅ Published {} to topic '{}' | Order: {} | Partition: {}", 
                            event.getEventType(), 
                            topic,
                            event.getOrderId(),
                            result.getRecordMetadata().partition());
                    } else {
                        log.error("❌ Failed to publish {} to topic '{}' | Order: {}", 
                            event.getEventType(), 
                            topic,
                            event.getOrderId(), 
                            ex);
                    }
                });
            } catch (Exception e) {
                log.error("❌ Exception while publishing {} to topic '{}' | Order: {}", 
                    event.getEventType(), 
                    topic,
                    event.getOrderId(), 
                    e);
            }
        });
    }
}
