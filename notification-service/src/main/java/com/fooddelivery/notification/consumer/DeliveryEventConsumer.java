package com.fooddelivery.notification.consumer;

import com.fooddelivery.notification.entity.Notification;
import com.fooddelivery.notification.event.DeliveryEvent;
import com.fooddelivery.notification.service.NotificationService;
import com.fooddelivery.notification.template.NotificationTemplates;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeliveryEventConsumer {
    
    private final NotificationService notificationService;
    
    @KafkaListener(
        topics = "delivery-assigned",
        groupId = "notification-service-group",
        containerFactory = "deliveryEventKafkaListenerContainerFactory"
    )
    public void handleDeliveryAssigned(DeliveryEvent event) {
        log.info("Received DELIVERY_ASSIGNED event: deliveryId={}, orderId={}, agentId={}", 
            event.getDeliveryId(), event.getOrderId(), event.getAgentId());
        
        try {
            // Notify customer
            Notification customerNotification = notificationService.createNotification(
                event.getCustomerId(),
                "CUSTOMER",
                "DELIVERY",
                "Delivery Agent Assigned",
                "A delivery agent has been assigned to your order #" + event.getOrderId(),
                "MEDIUM",
                "INFO",
                event.getDeliveryId(),
                "DELIVERY"
            );
            notificationService.sendDeliveryNotification(event.getCustomerId(), customerNotification);
            
            // Notify agent
            if (event.getAgentId() != null) {
                Notification agentNotification = notificationService.createNotification(
                    event.getAgentId(),
                    "AGENT",
                    "DELIVERY",
                    NotificationTemplates.TITLE_DELIVERY_ASSIGNED,
                    String.format(NotificationTemplates.DELIVERY_ASSIGNED, event.getDeliveryId()),
                    "HIGH",
                    "INFO",
                    event.getDeliveryId(),
                    "DELIVERY"
                );
                notificationService.sendDeliveryNotification(event.getAgentId(), agentNotification);
            }
            
        } catch (Exception e) {
            log.error("Error processing DELIVERY_ASSIGNED event: deliveryId={}", event.getDeliveryId(), e);
        }
    }
    
    @KafkaListener(
        topics = "delivery-picked-up",
        groupId = "notification-service-group",
        containerFactory = "deliveryEventKafkaListenerContainerFactory"
    )
    public void handleDeliveryPickedUp(DeliveryEvent event) {
        log.info("Received DELIVERY_PICKED_UP event: deliveryId={}, orderId={}", 
            event.getDeliveryId(), event.getOrderId());
        
        try {
            // Notify customer
            Notification customerNotification = notificationService.createNotification(
                event.getCustomerId(),
                "CUSTOMER",
                "DELIVERY",
                NotificationTemplates.TITLE_ORDER_PICKED_UP,
                String.format(NotificationTemplates.ORDER_PICKED_UP, event.getOrderId()),
                "MEDIUM",
                "INFO",
                event.getDeliveryId(),
                "DELIVERY"
            );
            notificationService.sendDeliveryNotification(event.getCustomerId(), customerNotification);
            
        } catch (Exception e) {
            log.error("Error processing DELIVERY_PICKED_UP event: deliveryId={}", event.getDeliveryId(), e);
        }
    }
    
    @KafkaListener(
        topics = "delivery-in-transit",
        groupId = "notification-service-group",
        containerFactory = "deliveryEventKafkaListenerContainerFactory"
    )
    public void handleDeliveryInTransit(DeliveryEvent event) {
        log.info("Received DELIVERY_IN_TRANSIT event: deliveryId={}, orderId={}", 
            event.getDeliveryId(), event.getOrderId());
        
        try {
            Notification notification = notificationService.createNotification(
                event.getCustomerId(),
                "CUSTOMER",
                "DELIVERY",
                NotificationTemplates.TITLE_ORDER_ON_THE_WAY,
                String.format(NotificationTemplates.ORDER_ON_THE_WAY, event.getOrderId()),
                "HIGH",
                "INFO",
                event.getDeliveryId(),
                "DELIVERY"
            );
            notificationService.sendDeliveryNotification(event.getCustomerId(), notification);
            
        } catch (Exception e) {
            log.error("Error processing DELIVERY_IN_TRANSIT event: deliveryId={}", event.getDeliveryId(), e);
        }
    }
    
    @KafkaListener(
        topics = "delivery-delivered",
        groupId = "notification-service-group",
        containerFactory = "deliveryEventKafkaListenerContainerFactory"
    )
    public void handleDeliveryDelivered(DeliveryEvent event) {
        log.info("Received DELIVERY_DELIVERED event: deliveryId={}, orderId={}", 
            event.getDeliveryId(), event.getOrderId());
        
        try {
            // Notify customer
            Notification customerNotification = notificationService.createNotification(
                event.getCustomerId(),
                "CUSTOMER",
                "DELIVERY",
                NotificationTemplates.TITLE_ORDER_DELIVERED,
                String.format(NotificationTemplates.ORDER_DELIVERED, event.getOrderId()),
                "HIGH",
                "SUCCESS",
                event.getDeliveryId(),
                "DELIVERY"
            );
            notificationService.sendDeliveryNotification(event.getCustomerId(), customerNotification);
            
            // Notify agent
            if (event.getAgentId() != null) {
                Notification agentNotification = notificationService.createNotification(
                    event.getAgentId(),
                    "AGENT",
                    "DELIVERY",
                    NotificationTemplates.TITLE_DELIVERY_COMPLETED,
                    String.format(NotificationTemplates.DELIVERY_COMPLETED, event.getDeliveryId(), 5.00),
                    "HIGH",
                    "SUCCESS",
                    event.getDeliveryId(),
                    "DELIVERY"
                );
                notificationService.sendDeliveryNotification(event.getAgentId(), agentNotification);
            }
            
        } catch (Exception e) {
            log.error("Error processing DELIVERY_DELIVERED event: deliveryId={}", event.getDeliveryId(), e);
        }
    }
}
