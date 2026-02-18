package com.fooddelivery.delivery.controller;

import com.fooddelivery.delivery.dto.AssignDeliveryRequest;
import com.fooddelivery.delivery.dto.DeliveryDTO;
import com.fooddelivery.delivery.dto.LocationUpdateRequest;
import com.fooddelivery.delivery.entity.DeliveryStatus;
import com.fooddelivery.delivery.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
public class DeliveryController {
    
    private final DeliveryService deliveryService;
    
    @PostMapping("/assign")
    public ResponseEntity<Map<String, Object>> assignDelivery(@RequestBody AssignDeliveryRequest request) {
        try {
            DeliveryDTO delivery = deliveryService.assignDelivery(request);
            return ResponseEntity.ok(createResponse(true, delivery, "Delivery assigned successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(createResponse(false, null, e.getMessage()));
        }
    }
    
    @GetMapping("/available")
    public ResponseEntity<Map<String, Object>> getAvailableDeliveries() {
        List<DeliveryDTO> deliveries = deliveryService.getAvailableDeliveries();
        return ResponseEntity.ok(createResponse(true, deliveries, "Available deliveries retrieved successfully"));
    }
    
    @GetMapping("/active")
    public ResponseEntity<Map<String, Object>> getActiveDeliveries(@RequestHeader("X-User-Id") Long agentId) {
        List<DeliveryDTO> deliveries = deliveryService.getAgentActiveDeliveries(agentId);
        return ResponseEntity.ok(createResponse(true, deliveries, "Active deliveries retrieved successfully"));
    }
    
    @GetMapping("/agent/{agentId}")
    public ResponseEntity<Map<String, Object>> getAgentDeliveries(@PathVariable Long agentId) {
        List<DeliveryDTO> deliveries = deliveryService.getAgentDeliveries(agentId);
        return ResponseEntity.ok(createResponse(true, deliveries, "Agent deliveries retrieved successfully"));
    }
    
    @GetMapping("/agent/{agentId}/active")
    public ResponseEntity<Map<String, Object>> getAgentActiveDeliveries(@PathVariable Long agentId) {
        List<DeliveryDTO> deliveries = deliveryService.getAgentActiveDeliveries(agentId);
        return ResponseEntity.ok(createResponse(true, deliveries, "Active deliveries retrieved successfully"));
    }
    
    @PatchMapping("/{deliveryId}/status")
    public ResponseEntity<Map<String, Object>> updateDeliveryStatus(
            @PathVariable Long deliveryId,
            @RequestParam String status) {
        try {
            DeliveryStatus deliveryStatus = DeliveryStatus.valueOf(status.toUpperCase());
            DeliveryDTO delivery = deliveryService.updateDeliveryStatus(deliveryId, deliveryStatus);
            return ResponseEntity.ok(createResponse(true, delivery, "Delivery status updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(createResponse(false, null, "Invalid status: " + status));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(createResponse(false, null, e.getMessage()));
        }
    }
    
    @PostMapping("/{deliveryId}/accept")
    public ResponseEntity<Map<String, Object>> acceptDelivery(
            @PathVariable Long deliveryId,
            @RequestHeader("X-User-Id") Long agentId) {
        try {
            DeliveryDTO delivery = deliveryService.acceptDelivery(deliveryId, agentId);
            return ResponseEntity.ok(createResponse(true, delivery, "Delivery accepted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(createResponse(false, null, e.getMessage()));
        }
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Map<String, Object>> getDeliveryByOrderId(@PathVariable Long orderId) {
        DeliveryDTO delivery = deliveryService.getDeliveryByOrderId(orderId);
        if (delivery != null) {
            return ResponseEntity.ok(createResponse(true, delivery, "Delivery retrieved successfully"));
        } else {
            return ResponseEntity.status(404).body(createResponse(false, null, "Delivery not found for order"));
        }
    }
    
    @PostMapping("/{deliveryId}/location")
    public ResponseEntity<Map<String, Object>> updateAgentLocation(
            @PathVariable Long deliveryId,
            @RequestBody LocationUpdateRequest request,
            @RequestHeader("X-User-Id") Long agentId) {
        try {
            DeliveryDTO delivery = deliveryService.updateAgentLocation(
                    deliveryId, 
                    request.getLatitude(), 
                    request.getLongitude()
            );
            return ResponseEntity.ok(createResponse(true, delivery, "Location updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(createResponse(false, null, e.getMessage()));
        }
    }
    
    @GetMapping("/{deliveryId}/location")
    public ResponseEntity<Map<String, Object>> getDeliveryWithLocation(@PathVariable Long deliveryId) {
        try {
            DeliveryDTO delivery = deliveryService.getDeliveryWithLocation(deliveryId);
            return ResponseEntity.ok(createResponse(true, delivery, "Delivery location retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(createResponse(false, null, e.getMessage()));
        }
    }
    
    private Map<String, Object> createResponse(boolean success, Object data, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("data", data);
        response.put("message", message);
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }
}
