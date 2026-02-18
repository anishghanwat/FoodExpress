package com.fooddelivery.notification.repository;

import com.fooddelivery.notification.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);
    
    Page<Notification> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    Long countByUserIdAndIsReadFalse(Long userId);
    
    List<Notification> findByUserIdAndUserRole(Long userId, String userRole);
    
    Page<Notification> findByUserRoleOrderByCreatedAtDesc(String userRole, Pageable pageable);
}
