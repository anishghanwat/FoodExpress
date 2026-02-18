package com.fooddelivery.delivery.repository;

import com.fooddelivery.delivery.entity.Delivery;
import com.fooddelivery.delivery.entity.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    
    List<Delivery> findByAgentIdOrderByCreatedAtDesc(Long agentId);
    
    List<Delivery> findByAgentIdAndStatusOrderByCreatedAtDesc(Long agentId, DeliveryStatus status);
    
    List<Delivery> findByAgentIdAndStatusInOrderByCreatedAtDesc(Long agentId, List<DeliveryStatus> statuses);
    
    Optional<Delivery> findByOrderId(Long orderId);
    
    List<Delivery> findByStatusOrderByCreatedAtAsc(DeliveryStatus status);
    
    List<Delivery> findByStatusAndAgentIdIsNullOrderByCreatedAtAsc(DeliveryStatus status);
}
