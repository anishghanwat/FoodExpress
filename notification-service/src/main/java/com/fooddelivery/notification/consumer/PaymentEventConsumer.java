package com.fooddelivery.notification.consumer;

import com.fooddelivery.notification.entity.Notification;
import com.fooddelivery.notification.event.PaymentEvent;
import com.fooddelivery.notification.service.NotificationService;
import com.fooddelivery.notification.template.NotificationTemplates;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(topics = "payment-initiated", groupId = "notification-service-group", containerFactory = "paymentEventKafkaListenerContainerFactory")
    public void handlePaymentInitiated(PaymentEvent event) {
        log.info("Received PAYMENT_INITIATED event: paymentId={}, orderId={}",
                event.getPaymentId(), event.getOrderId());
        try {
            Notification notification = notificationService.createNotification(
                    event.getUserId(), "CUSTOMER", "PAYMENT",
                    NotificationTemplates.TITLE_PAYMENT_PROCESSING,
                    String.format(NotificationTemplates.PAYMENT_PROCESSING, event.getAmount(), event.getOrderId()),
                    "MEDIUM", "INFO", event.getPaymentId(), "PAYMENT");
            notificationService.sendPaymentNotification(event.getUserId(), notification);
        } catch (Exception e) {
            log.error("Error processing PAYMENT_INITIATED event: paymentId={}", event.getPaymentId(), e);
        }
    }

    @KafkaListener(topics = "payment-completed", groupId = "notification-service-group", containerFactory = "paymentEventKafkaListenerContainerFactory")
    public void handlePaymentCompleted(PaymentEvent event) {
        log.info("Received PAYMENT_COMPLETED event: paymentId={}, orderId={}, amount={}",
                event.getPaymentId(), event.getOrderId(), event.getAmount());
        try {
            Notification notification = notificationService.createNotification(
                    event.getUserId(), "CUSTOMER", "PAYMENT",
                    NotificationTemplates.TITLE_PAYMENT_SUCCESS,
                    String.format(NotificationTemplates.PAYMENT_SUCCESS, event.getAmount(), event.getOrderId()),
                    "HIGH", "SUCCESS", event.getPaymentId(), "PAYMENT");
            notificationService.sendPaymentNotification(event.getUserId(), notification);
            // No email for payment — only in-app notification
        } catch (Exception e) {
            log.error("Error processing PAYMENT_COMPLETED event: paymentId={}", event.getPaymentId(), e);
        }
    }

    @KafkaListener(topics = "payment-failed", groupId = "notification-service-group", containerFactory = "paymentEventKafkaListenerContainerFactory")
    public void handlePaymentFailed(PaymentEvent event) {
        log.info("Received PAYMENT_FAILED event: paymentId={}, orderId={}, reason={}",
                event.getPaymentId(), event.getOrderId(), event.getFailureReason());
        try {
            Notification notification = notificationService.createNotification(
                    event.getUserId(), "CUSTOMER", "PAYMENT",
                    NotificationTemplates.TITLE_PAYMENT_FAILED,
                    String.format(NotificationTemplates.PAYMENT_FAILED, event.getOrderId()),
                    "URGENT", "ERROR", event.getPaymentId(), "PAYMENT");
            notificationService.sendPaymentNotification(event.getUserId(), notification);
            // No email for payment failed — only in-app notification
        } catch (Exception e) {
            log.error("Error processing PAYMENT_FAILED event: paymentId={}", event.getPaymentId(), e);
        }
    }

    @KafkaListener(topics = "payment-refunded", groupId = "notification-service-group", containerFactory = "paymentEventKafkaListenerContainerFactory")
    public void handlePaymentRefunded(PaymentEvent event) {
        log.info("Received PAYMENT_REFUNDED event: paymentId={}, orderId={}, refundAmount={}",
                event.getPaymentId(), event.getOrderId(), event.getRefundAmount());
        try {
            Notification notification = notificationService.createNotification(
                    event.getUserId(), "CUSTOMER", "PAYMENT",
                    NotificationTemplates.TITLE_PAYMENT_REFUNDED,
                    String.format(NotificationTemplates.PAYMENT_REFUNDED, event.getRefundAmount(), event.getOrderId()),
                    "HIGH", "INFO", event.getPaymentId(), "PAYMENT");
            notificationService.sendPaymentNotification(event.getUserId(), notification);
        } catch (Exception e) {
            log.error("Error processing PAYMENT_REFUNDED event: paymentId={}", event.getPaymentId(), e);
        }
    }
}
