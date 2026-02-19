package com.fooddelivery.order.controller;

import com.fooddelivery.order.dto.CreateOrderRequest;
import com.fooddelivery.order.dto.OrderDTO;
import com.fooddelivery.order.entity.OrderStatus;
import com.fooddelivery.order.service.OrderService;
import com.fooddelivery.order.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<OrderDTO>> createOrder(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody CreateOrderRequest request) {
        try {
            OrderDTO order = orderService.createOrder(userId, request);
            return ResponseEntity.ok(ApiResponse.success(order, "Order created successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getAllOrders() {
        // This endpoint can be used by agents to see available orders
        // In production, you'd want to add filtering and pagination
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success(orders, "Orders retrieved successfully"));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getUserOrders(@PathVariable Long userId) {
        List<OrderDTO> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(ApiResponse.success(orders, "Orders retrieved successfully"));
    }
    
    @GetMapping("/customer")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getCustomerOrders(
            @RequestHeader("X-User-Id") Long userId) {
        List<OrderDTO> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(ApiResponse.success(orders, "Orders retrieved successfully"));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDTO>> getOrderById(@PathVariable Long id) {
        try {
            OrderDTO order = orderService.getOrderById(id);
            return ResponseEntity.ok(ApiResponse.success(order, "Order retrieved successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getRestaurantOrders(@PathVariable Long restaurantId) {
        List<OrderDTO> orders = orderService.getRestaurantOrders(restaurantId);
        return ResponseEntity.ok(ApiResponse.success(orders, "Orders retrieved successfully"));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderDTO>> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {
        try {
            OrderDTO order = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(ApiResponse.success(order, "Order status updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDTO>> patchOrderStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest request) {
        try {
            OrderStatus orderStatus = OrderStatus.valueOf(request.getStatus().toUpperCase());
            OrderDTO order = orderService.updateOrderStatus(id, orderStatus);
            return ResponseEntity.ok(ApiResponse.success(order, "Order status updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(ApiResponse.error("Invalid status: " + request.getStatus()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderDTO>> cancelOrder(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody(required = false) CancelOrderRequest request) {
        try {
            String reason = request != null ? request.getReason() : "Customer requested cancellation";
            OrderDTO order = orderService.cancelOrder(id, userId, reason);
            return ResponseEntity.ok(ApiResponse.success(order, "Order cancelled successfully"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(400).body(ApiResponse.error(e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Simple DTO for cancel request
    @lombok.Data
    static class CancelOrderRequest {
        private String reason;
    }
    
    // Simple DTO for status update
    @lombok.Data
    static class UpdateStatusRequest {
        private String status;
    }
}
