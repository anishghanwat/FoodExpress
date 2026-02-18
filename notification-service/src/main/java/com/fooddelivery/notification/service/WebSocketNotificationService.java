package com.fooddelivery.notification.service;

import com.fooddelivery.notification.entity.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketNotificationService {
    
    private final SimpMessagingTemplate messagingTemplate;
    
    /**
     * Send notification to specific user
     */
    public void sendToUser(Long userId, Notification notification) {
        try {
            Map<String, Object> message = buildNotificationMessage(notification);
            
            messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/notifications",
                message
            );
            
            log.info("Sent notification to user {}: type={}, title={}", 
                userId, notification.getType(), notification.getTitle());
                
        } catch (Exception e) {
            log.error("Error sending notification to user {}: {}", userId, e.getMessage(), e);
        }
    }
    
    /**
     * Send order update to user
     */
    public void sendOrderUpdate(Long userId, Notification notification) {
        try {
            Map<String, Object> message = buildNotificationMessage(notification);
            
            messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/orders",
                message
            );
            
            log.info("Sent order update to user {}: orderId={}", 
                userId, notification.getRelatedEntityId());
                
        } catch (Exception e) {
            log.error("Error sending order update to user {}: {}", userId, e.getMessage(), e);
        }
    }
    
    /**
     * Send payment update to user
     */
    public void sendPaymentUpdate(Long userId, Notification notification) {
        try {
            Map<String, Object> message = buildNotificationMessage(notification);
            
            messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/payments",
                message
            );
            
            log.info("Sent payment update to user {}: paymentId={}", 
                userId, notification.getRelatedEntityId());
                
        } catch (Exception e) {
            log.error("Error sending payment update to user {}: {}", userId, e.getMessage(), e);
        }
    }
    
    /**
     * Send delivery update to user
     */
    public void sendDeliveryUpdate(Long userId, Notification notification) {
        try {
            Map<String, Object> message = buildNotificationMessage(notification);
            
            messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/deliveries",
                message
            );
            
            log.info("Sent delivery update to user {}: deliveryId={}", 
                userId, notification.getRelatedEntityId());
                
        } catch (Exception e) {
            log.error("Error sending delivery update to user {}: {}", userId, e.getMessage(), e);
        }
    }
    
    /**
     * Broadcast to all users with specific role
     */
    public void broadcastToRole(String role, Notification notification) {
        try {
            Map<String, Object> message = buildNotificationMessage(notification);
            
            messagingTemplate.convertAndSend(
                "/topic/notifications/" + role.toLowerCase(),
                message
            );
            
            log.info("Broadcast notification to role {}: type={}, title={}", 
                role, notification.getType(), notification.getTitle());
                
        } catch (Exception e) {
            log.error("Error broadcasting to role {}: {}", role, e.getMessage(), e);
        }
    }
    
    /**
     * Build notification message map
     */
    private Map<String, Object> buildNotificationMessage(Notification notification) {
        Map<String, Object> message = new HashMap<>();
        message.put("id", notification.getId());
        message.put("userId", notification.getUserId());
        message.put("userRole", notification.getUserRole());
        message.put("type", notification.getType());
        message.put("title", notification.getTitle());
        message.put("message", notification.getMessage());
        message.put("priority", notification.getPriority());
        message.put("category", notification.getCategory());
        message.put("relatedEntityId", notification.getRelatedEntityId());
        message.put("relatedEntityType", notification.getRelatedEntityType());
        message.put("isRead", notification.getIsRead());
        message.put("createdAt", notification.getCreatedAt());
        message.put("timestamp", LocalDateTime.now());
        return message;
    }
}
