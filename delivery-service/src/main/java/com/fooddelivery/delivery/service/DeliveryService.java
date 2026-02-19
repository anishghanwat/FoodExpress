package com.fooddelivery.delivery.service;

import com.fooddelivery.delivery.dto.AssignDeliveryRequest;
import com.fooddelivery.delivery.dto.DeliveryDTO;
import com.fooddelivery.delivery.entity.Delivery;
import com.fooddelivery.delivery.entity.DeliveryStatus;
import com.fooddelivery.delivery.producer.DeliveryEventProducer;
import com.fooddelivery.delivery.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeliveryService {
    
    private final DeliveryRepository deliveryRepository;
    private final DeliveryEventProducer deliveryEventProducer;
    
    @Transactional
    public DeliveryDTO assignDelivery(AssignDeliveryRequest request) {
        Delivery delivery = new Delivery();
        delivery.setOrderId(request.getOrderId());
        delivery.setAgentId(request.getAgentId());
        delivery.setStatus(DeliveryStatus.ASSIGNED);
        delivery.setPickupAddress(request.getPickupAddress());
        delivery.setDeliveryAddress(request.getDeliveryAddress());
        
        Delivery saved = deliveryRepository.save(delivery);
        log.info("Delivery assigned: deliveryId={}, orderId={}, agentId={}", 
                saved.getId(), request.getOrderId(), request.getAgentId());
        
        return convertToDTO(saved);
    }
    
    public List<DeliveryDTO> getAvailableDeliveries() {
        // Return deliveries with ASSIGNED status and no agent assigned yet
        return deliveryRepository.findByStatusAndAgentIdIsNullOrderByCreatedAtAsc(DeliveryStatus.ASSIGNED)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<DeliveryDTO> getAgentDeliveries(Long agentId) {
        return deliveryRepository.findByAgentIdOrderByCreatedAtDesc(agentId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<DeliveryDTO> getAgentActiveDeliveries(Long agentId) {
        // Return deliveries that are in progress (not yet delivered or cancelled)
        List<DeliveryStatus> activeStatuses = Arrays.asList(
            DeliveryStatus.ASSIGNED,
            DeliveryStatus.PICKED_UP,
            DeliveryStatus.IN_TRANSIT
        );
        return deliveryRepository.findByAgentIdAndStatusInOrderByCreatedAtDesc(agentId, activeStatuses)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public DeliveryDTO updateDeliveryStatus(Long deliveryId, DeliveryStatus status) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found with id: " + deliveryId));
        
        DeliveryStatus previousStatus = delivery.getStatus();
        delivery.setStatus(status);
        
        if (status == DeliveryStatus.PICKED_UP) {
            delivery.setPickupTime(LocalDateTime.now());
        } else if (status == DeliveryStatus.DELIVERED) {
            delivery.setDeliveryTime(LocalDateTime.now());
        }
        
        Delivery updated = deliveryRepository.save(delivery);
        log.info("Delivery status updated: deliveryId={}, status={}", deliveryId, status);
        
        // Publish events based on status
        switch (status) {
            case PICKED_UP:
                deliveryEventProducer.publishDeliveryPickedUp(updated);
                break;
            case IN_TRANSIT:
                deliveryEventProducer.publishDeliveryInTransit(updated);
                break;
            case DELIVERED:
                deliveryEventProducer.publishDeliveryDelivered(updated);
                break;
            case CANCELLED:
                deliveryEventProducer.publishDeliveryCancelled(updated);
                break;
        }
        
        return convertToDTO(updated);
    }
    
    @Transactional
    public DeliveryDTO acceptDelivery(Long deliveryId, Long agentId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found with id: " + deliveryId));
        
        if (delivery.getAgentId() != null && !delivery.getAgentId().equals(agentId)) {
            throw new RuntimeException("Delivery already assigned to another agent");
        }
        
        delivery.setAgentId(agentId);
        delivery.setStatus(DeliveryStatus.ASSIGNED);
        
        Delivery updated = deliveryRepository.save(delivery);
        log.info("Delivery accepted: deliveryId={}, agentId={}", deliveryId, agentId);
        
        // Publish event
        deliveryEventProducer.publishDeliveryAssigned(updated);
        
        return convertToDTO(updated);
    }
    
    public DeliveryDTO getDeliveryByOrderId(Long orderId) {
        return deliveryRepository.findByOrderId(orderId)
                .map(this::convertToDTO)
                .orElse(null);
    }
    
    @Transactional
    public DeliveryDTO updateAgentLocation(Long deliveryId, Double latitude, Double longitude) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found with id: " + deliveryId));
        
        delivery.setAgentLatitude(latitude);
        delivery.setAgentLongitude(longitude);
        delivery.setLastLocationUpdate(LocalDateTime.now());
        
        // Calculate distance and ETA if delivery location is set
        if (delivery.getDeliveryLatitude() != null && delivery.getDeliveryLongitude() != null) {
            double distance = calculateDistance(
                latitude, longitude,
                delivery.getDeliveryLatitude(), delivery.getDeliveryLongitude()
            );
            delivery.setEstimatedDistanceKm(distance);
            delivery.setEstimatedTimeMinutes(calculateETA(distance));
        }
        
        Delivery updated = deliveryRepository.save(delivery);
        log.info("Agent location updated: deliveryId={}, lat={}, lng={}, distance={}km", 
                deliveryId, latitude, longitude, delivery.getEstimatedDistanceKm());
        
        // Publish location update event
        deliveryEventProducer.publishLocationUpdate(updated);
        
        return convertToDTO(updated);
    }
    
    public DeliveryDTO getDeliveryWithLocation(Long deliveryId) {
        return deliveryRepository.findById(deliveryId)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Delivery not found with id: " + deliveryId));
    }
    
    // Calculate distance between two points using Haversine formula
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth's radius in kilometers
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = R * c;
        
        return Math.round(distance * 100.0) / 100.0; // Round to 2 decimal places
    }
    
    // Calculate ETA based on distance (assuming average speed of 30 km/h)
    private int calculateETA(double distanceKm) {
        final double AVERAGE_SPEED_KMH = 30.0;
        double timeHours = distanceKm / AVERAGE_SPEED_KMH;
        int timeMinutes = (int) Math.ceil(timeHours * 60);
        return timeMinutes;
    }
    
    private DeliveryDTO convertToDTO(Delivery delivery) {
        DeliveryDTO dto = new DeliveryDTO();
        dto.setId(delivery.getId());
        dto.setOrderId(delivery.getOrderId());
        dto.setAgentId(delivery.getAgentId());
        dto.setStatus(delivery.getStatus());
        dto.setPickupAddress(delivery.getPickupAddress());
        dto.setDeliveryAddress(delivery.getDeliveryAddress());
        dto.setPickupTime(delivery.getPickupTime());
        dto.setDeliveryTime(delivery.getDeliveryTime());
        dto.setCurrentLocation(delivery.getCurrentLocation());
        dto.setCreatedAt(delivery.getCreatedAt());
        dto.setUpdatedAt(delivery.getUpdatedAt());
        
        // Location fields
        dto.setPickupLatitude(delivery.getPickupLatitude());
        dto.setPickupLongitude(delivery.getPickupLongitude());
        dto.setDeliveryLatitude(delivery.getDeliveryLatitude());
        dto.setDeliveryLongitude(delivery.getDeliveryLongitude());
        dto.setAgentLatitude(delivery.getAgentLatitude());
        dto.setAgentLongitude(delivery.getAgentLongitude());
        dto.setEstimatedDistanceKm(delivery.getEstimatedDistanceKm());
        dto.setEstimatedTimeMinutes(delivery.getEstimatedTimeMinutes());
        dto.setLastLocationUpdate(delivery.getLastLocationUpdate());
        
        // TODO: Fetch order details to populate orderAmount, customerName, restaurantName, deliveryFee
        // For now, set defaults
        dto.setDeliveryFee(2.99);
        
        return dto;
    }
}
