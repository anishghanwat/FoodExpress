package com.fooddelivery.delivery.consumer;

import com.fooddelivery.delivery.entity.Delivery;
import com.fooddelivery.delivery.entity.DeliveryStatus;
import com.fooddelivery.delivery.event.OrderEvent;
import com.fooddelivery.delivery.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderEventConsumer {
    
    private final DeliveryRepository deliveryRepository;
    
    @KafkaListener(
        topics = "order-ready-for-pickup",
        groupId = "delivery-service-group",
        containerFactory = "orderEventKafkaListenerContainerFactory"
    )
    public void consumeOrderReadyForPickup(OrderEvent event) {
        try {
            log.info("📦 Received ORDER_READY_FOR_PICKUP event: orderId={}, restaurantId={}", 
                    event.getOrderId(), event.getRestaurantId());
            
            // Check if delivery already exists for this order
            if (deliveryRepository.findByOrderId(event.getOrderId()).isPresent()) {
                log.warn("⚠️ Delivery already exists for order: {}", event.getOrderId());
                return;
            }
            
            // Create new delivery record
            Delivery delivery = new Delivery();
            delivery.setOrderId(event.getOrderId());
            delivery.setRestaurantId(event.getRestaurantId());
            delivery.setCustomerId(event.getUserId());
            delivery.setStatus(DeliveryStatus.ASSIGNED);
            delivery.setPickupAddress(event.getRestaurantAddress() != null ? 
                    event.getRestaurantAddress() : "Restaurant Address");
            delivery.setDeliveryAddress(event.getDeliveryAddress());
            delivery.setDeliveryFee(event.getDeliveryFee() != null ? event.getDeliveryFee() : 2.99);
            
            Delivery savedDelivery = deliveryRepository.save(delivery);
            
            log.info("✅ Created delivery record: deliveryId={}, orderId={}, status=ASSIGNED", 
                    savedDelivery.getId(), event.getOrderId());
            
            // TODO: Publish DELIVERY_ASSIGNED event
            
        } catch (Exception e) {
            log.error("❌ Error processing ORDER_READY_FOR_PICKUP event for order: {}", 
                    event.getOrderId(), e);
        }
    }
    
    @KafkaListener(
        topics = "order-cancelled",
        groupId = "delivery-service-group",
        containerFactory = "orderEventKafkaListenerContainerFactory"
    )
    public void consumeOrderCancelled(OrderEvent event) {
        try {
            log.info("🚫 Received ORDER_CANCELLED event: orderId={}", event.getOrderId());
            
            // Find and cancel delivery if it exists
            deliveryRepository.findByOrderId(event.getOrderId()).ifPresent(delivery -> {
                if (delivery.getStatus() == DeliveryStatus.ASSIGNED) {
                    delivery.setStatus(DeliveryStatus.CANCELLED);
                    deliveryRepository.save(delivery);
                    log.info("✅ Cancelled delivery: deliveryId={}, orderId={}", 
                            delivery.getId(), event.getOrderId());
                }
            });
            
        } catch (Exception e) {
            log.error("❌ Error processing ORDER_CANCELLED event for order: {}", 
                    event.getOrderId(), e);
        }
    }
}
