package com.fooddelivery.restaurant.controller;

import com.fooddelivery.restaurant.dto.RestaurantDTO;
import com.fooddelivery.restaurant.service.RestaurantService;
import com.fooddelivery.restaurant.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {
    
    private final RestaurantService restaurantService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<RestaurantDTO>>> getAllRestaurants(
            @RequestParam(required = false) String cuisineType,
            @RequestParam(required = false, defaultValue = "0") Double minRating,
            @RequestParam(required = false, defaultValue = "120") Integer maxDeliveryTime,
            @RequestParam(required = false, defaultValue = "false") Boolean onlyOpen,
            @RequestParam(required = false, defaultValue = "rating") String sortBy) {
        List<RestaurantDTO> restaurants = restaurantService.getFilteredRestaurants(
                cuisineType, minRating, maxDeliveryTime, onlyOpen, sortBy);
        return ResponseEntity.ok(ApiResponse.success(restaurants, "Restaurants retrieved successfully"));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RestaurantDTO>> getRestaurantById(@PathVariable Long id) {
        try {
            RestaurantDTO restaurant = restaurantService.getRestaurantById(id);
            return ResponseEntity.ok(ApiResponse.success(restaurant, "Restaurant retrieved successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<ApiResponse<List<RestaurantDTO>>> getRestaurantsByOwner(@PathVariable Long ownerId) {
        List<RestaurantDTO> restaurants = restaurantService.getRestaurantsByOwner(ownerId);
        return ResponseEntity.ok(ApiResponse.success(restaurants, "Owner restaurants retrieved successfully"));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<RestaurantDTO>>> searchRestaurants(@RequestParam String query) {
        List<RestaurantDTO> restaurants = restaurantService.searchRestaurants(query);
        return ResponseEntity.ok(ApiResponse.success(restaurants, "Search results retrieved successfully"));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<RestaurantDTO>> createRestaurant(@RequestBody RestaurantDTO restaurantDTO) {
        try {
            RestaurantDTO created = restaurantService.createRestaurant(restaurantDTO);
            return ResponseEntity.ok(ApiResponse.success(created, "Restaurant created successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RestaurantDTO>> updateRestaurant(@PathVariable Long id, @RequestBody RestaurantDTO restaurantDTO) {
        try {
            RestaurantDTO updated = restaurantService.updateRestaurant(id, restaurantDTO);
            return ResponseEntity.ok(ApiResponse.success(updated, "Restaurant updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRestaurant(@PathVariable Long id) {
        try {
            restaurantService.deleteRestaurant(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Restaurant deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }
}
