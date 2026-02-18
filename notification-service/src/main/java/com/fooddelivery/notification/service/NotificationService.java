package com.fooddelivery.notification.service;

import com.fooddelivery.notification.entity.Notification;
import com.fooddelivery.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final WebSocketNotificationService webSocketService;
    
    /**
     * Create and save notification
     */
    @Transactional
    public Notification createNotification(
        Long userId,
        String userRole,
        String type,
        String title,
        String message,
        String priority,
        String category,
        Long relatedEntityId,
        String relatedEntityType
    ) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setUserRole(userRole);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setPriority(priority);
        notification.setCategory(category);
        notification.setRelatedEntityId(relatedEntityId);
        notification.setRelatedEntityType(relatedEntityType);
        notification.setIsRead(false);
        notification.setIsSent(false);
        
        Notification saved = notificationRepository.save(notification);
        log.info("Created notification: id={}, userId={}, type={}", 
            saved.getId(), userId, type);
        
        return saved;
    }
    
    /**
     * Send notification to user via WebSocket
     */
    @Transactional
    public void sendToUser(Long userId, Notification notification) {
        // Send via WebSocket
        webSocketService.sendToUser(userId, notification);
        
        // Mark as sent
        notification.setIsSent(true);
        notification.setSentAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }
    
    /**
     * Send order notification
     */
    @Transactional
    public void sendOrderNotification(Long userId, Notification notification) {
        webSocketService.sendOrderUpdate(userId, notification);
        notification.setIsSent(true);
        notification.setSentAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }
    
    /**
     * Send payment notification
     */
    @Transactional
    public void sendPaymentNotification(Long userId, Notification notification) {
        webSocketService.sendPaymentUpdate(userId, notification);
        notification.setIsSent(true);
        notification.setSentAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }
    
    /**
     * Send delivery notification
     */
    @Transactional
    public void sendDeliveryNotification(Long userId, Notification notification) {
        webSocketService.sendDeliveryUpdate(userId, notification);
        notification.setIsSent(true);
        notification.setSentAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }
    
    /**
     * Mark notification as read
     */
    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setIsRead(true);
            notification.setReadAt(LocalDateTime.now());
            notificationRepository.save(notification);
            log.info("Marked notification {} as read", notificationId);
        });
    }
    
    /**
     * Mark all notifications as read for user
     */
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = 
            notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        
        unreadNotifications.forEach(notification -> {
            notification.setIsRead(true);
            notification.setReadAt(LocalDateTime.now());
        });
        
        notificationRepository.saveAll(unreadNotifications);
        log.info("Marked {} notifications as read for user {}", unreadNotifications.size(), userId);
    }
    
    /**
     * Get unread count for user
     */
    public Long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }
    
    /**
     * Get user notifications (paginated)
     */
    public Page<Notification> getUserNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }
    
    /**
     * Get unread notifications for user
     */
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }
    
    /**
     * Delete notification
     */
    @Transactional
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
        log.info("Deleted notification {}", notificationId);
    }
}
