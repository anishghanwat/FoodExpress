package com.fooddelivery.notification.consumer;

import com.fooddelivery.notification.entity.Notification;
import com.fooddelivery.notification.event.OrderEvent;
import com.fooddelivery.notification.service.EmailService;
import com.fooddelivery.notification.service.NotificationService;
import com.fooddelivery.notification.template.NotificationTemplates;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderEventConsumer {

    private final NotificationService notificationService;
    private final EmailService emailService;

    @KafkaListener(topics = "order-created", groupId = "notification-service-group", containerFactory = "orderEventKafkaListenerContainerFactory")
    public void handleOrderCreated(OrderEvent event) {
        log.info("Received ORDER_CREATED event: orderId={}, customerId={}",
                event.getOrderId(), event.getUserId());
        try {
            Notification customerNotification = notificationService.createNotification(
                    event.getUserId(), "CUSTOMER", "ORDER",
                    NotificationTemplates.TITLE_ORDER_PLACED,
                    String.format(NotificationTemplates.ORDER_PLACED, event.getOrderId(), event.getTotalAmount()),
                    "HIGH", "SUCCESS", event.getOrderId(), "ORDER");
            notificationService.sendOrderNotification(event.getUserId(), customerNotification);

            // ✉️ Email: Order Placed
            if (event.getCustomerEmail() != null && !event.getCustomerEmail().isBlank()) {
                emailService.sendOrderPlaced(
                        event.getCustomerEmail(),
                        event.getCustomerName(),
                        event.getOrderId(),
                        event.getTotalAmount());
            }

            if (event.getRestaurantId() != null) {
                Notification ownerNotification = notificationService.createNotification(
                        event.getRestaurantId(), "OWNER", "ORDER",
                        NotificationTemplates.TITLE_NEW_ORDER,
                        String.format(NotificationTemplates.NEW_ORDER_RECEIVED, event.getOrderId(),
                                event.getTotalAmount()),
                        "URGENT", "INFO", event.getOrderId(), "ORDER");
                notificationService.sendOrderNotification(event.getRestaurantId(), ownerNotification);
            }
            log.info("Successfully processed ORDER_CREATED event: orderId={}", event.getOrderId());
        } catch (Exception e) {
            log.error("Error processing ORDER_CREATED event: orderId={}", event.getOrderId(), e);
        }
    }

    @KafkaListener(topics = "order-confirmed", groupId = "notification-service-group", containerFactory = "orderEventKafkaListenerContainerFactory")
    public void handleOrderConfirmed(OrderEvent event) {
        log.info("Received ORDER_CONFIRMED event: orderId={}", event.getOrderId());
        try {
            Notification notification = notificationService.createNotification(
                    event.getUserId(), "CUSTOMER", "ORDER",
                    NotificationTemplates.TITLE_ORDER_CONFIRMED,
                    String.format(NotificationTemplates.ORDER_CONFIRMED, event.getOrderId()),
                    "MEDIUM", "SUCCESS", event.getOrderId(), "ORDER");
            notificationService.sendOrderNotification(event.getUserId(), notification);
            // ✉️ Email: Order Confirmed
            emailService.sendOrderConfirmed(
                    event.getCustomerEmail(), event.getCustomerName(), event.getOrderId());
        } catch (Exception e) {
            log.error("Error processing ORDER_CONFIRMED event: orderId={}", event.getOrderId(), e);
        }
    }

    @KafkaListener(topics = "order-preparing", groupId = "notification-service-group", containerFactory = "orderEventKafkaListenerContainerFactory")
    public void handleOrderPreparing(OrderEvent event) {
        log.info("Received ORDER_PREPARING event: orderId={}", event.getOrderId());
        try {
            Notification notification = notificationService.createNotification(
                    event.getUserId(), "CUSTOMER", "ORDER",
                    NotificationTemplates.TITLE_ORDER_PREPARING,
                    String.format(NotificationTemplates.ORDER_PREPARING, event.getOrderId()),
                    "MEDIUM", "INFO", event.getOrderId(), "ORDER");
            notificationService.sendOrderNotification(event.getUserId(), notification);
            // No email for preparing — only in-app notification
        } catch (Exception e) {
            log.error("Error processing ORDER_PREPARING event: orderId={}", event.getOrderId(), e);
        }
    }

    @KafkaListener(topics = "order-ready-for-pickup", groupId = "notification-service-group", containerFactory = "orderEventKafkaListenerContainerFactory")
    public void handleOrderReady(OrderEvent event) {
        log.info("Received ORDER_READY event: orderId={}", event.getOrderId());
        try {
            Notification customerNotification = notificationService.createNotification(
                    event.getUserId(), "CUSTOMER", "ORDER",
                    NotificationTemplates.TITLE_ORDER_READY,
                    String.format(NotificationTemplates.ORDER_READY, event.getOrderId()),
                    "HIGH", "SUCCESS", event.getOrderId(), "ORDER");
            notificationService.sendOrderNotification(event.getUserId(), customerNotification);
            // ✉️ Email: Out for Delivery
            emailService.sendOrderOutForDelivery(
                    event.getCustomerEmail(), event.getCustomerName(), event.getOrderId());
        } catch (Exception e) {
            log.error("Error processing ORDER_READY event: orderId={}", event.getOrderId(), e);
        }
    }

    @KafkaListener(topics = "order-cancelled", groupId = "notification-service-group", containerFactory = "orderEventKafkaListenerContainerFactory")
    public void handleOrderCancelled(OrderEvent event) {
        log.info("Received ORDER_CANCELLED event: orderId={}", event.getOrderId());
        try {
            Notification notification = notificationService.createNotification(
                    event.getUserId(), "CUSTOMER", "ORDER",
                    NotificationTemplates.TITLE_ORDER_CANCELLED,
                    String.format(NotificationTemplates.ORDER_CANCELLED, event.getOrderId()),
                    "HIGH", "WARNING", event.getOrderId(), "ORDER");
            notificationService.sendOrderNotification(event.getUserId(), notification);
            // ✉️ Email: Order Cancelled
            emailService.sendOrderCancelled(
                    event.getCustomerEmail(), event.getCustomerName(), event.getOrderId());
        } catch (Exception e) {
            log.error("Error processing ORDER_CANCELLED event: orderId={}", event.getOrderId(), e);
        }
    }

    @KafkaListener(topics = "order-delivered", groupId = "notification-service-group", containerFactory = "orderEventKafkaListenerContainerFactory")
    public void handleOrderDelivered(OrderEvent event) {
        log.info("Received ORDER_DELIVERED event: orderId={}", event.getOrderId());
        try {
            Notification notification = notificationService.createNotification(
                    event.getUserId(), "CUSTOMER", "ORDER",
                    "Order Delivered! 🎉",
                    String.format("Your order #%d has been delivered. Enjoy your meal!", event.getOrderId()),
                    "HIGH", "SUCCESS", event.getOrderId(), "ORDER");
            notificationService.sendOrderNotification(event.getUserId(), notification);
            // ✉️ Email: Order Delivered
            emailService.sendOrderDelivered(
                    event.getCustomerEmail(), event.getCustomerName(), event.getOrderId());
        } catch (Exception e) {
            log.error("Error processing ORDER_DELIVERED event: orderId={}", event.getOrderId(), e);
        }
    }
}
