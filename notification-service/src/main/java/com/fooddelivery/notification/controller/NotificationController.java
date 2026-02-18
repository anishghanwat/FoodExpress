package com.fooddelivery.notification.controller;

import com.fooddelivery.notification.entity.Notification;
import com.fooddelivery.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RequiredArgsConstructor
public class NotificationController {
    
    private final NotificationService notificationService;
    
    /**
     * Get user notifications (paginated)
     */
    @GetMapping
    public ResponseEntity<Page<Notification>> getUserNotifications(
        @RequestParam Long userId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications = notificationService.getUserNotifications(userId, pageable);
        return ResponseEntity.ok(notifications);
    }
    
    /**
     * Get unread notifications
     */
    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@RequestParam Long userId) {
        List<Notification> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications);
    }
    
    /**
     * Get unread count
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Object>> getUnreadCount(@RequestParam Long userId) {
        Long count = notificationService.getUnreadCount(userId);
        Map<String, Object> response = new HashMap<>();
        response.put("userId", userId);
        response.put("unreadCount", count);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Mark notification as read
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<Map<String, Object>> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Notification marked as read");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Mark all notifications as read
     */
    @PutMapping("/read-all")
    public ResponseEntity<Map<String, Object>> markAllAsRead(@RequestParam Long userId) {
        notificationService.markAllAsRead(userId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "All notifications marked as read");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Delete notification
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Notification deleted");
        return ResponseEntity.ok(response);
    }
}
