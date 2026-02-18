package com.fooddelivery.restaurant.controller;

import com.fooddelivery.restaurant.dto.MenuItemDTO;
import com.fooddelivery.restaurant.service.MenuItemService;
import com.fooddelivery.restaurant.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuItemController {
    
    private final MenuItemService menuItemService;
    
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<ApiResponse<List<MenuItemDTO>>> getMenuByRestaurant(@PathVariable Long restaurantId) {
        List<MenuItemDTO> menuItems = menuItemService.getMenuItemsByRestaurant(restaurantId);
        return ResponseEntity.ok(ApiResponse.success(menuItems, "Menu items retrieved successfully"));
    }
    
    @GetMapping("/restaurant/{restaurantId}/category/{category}")
    public ResponseEntity<ApiResponse<List<MenuItemDTO>>> getMenuByCategory(
            @PathVariable Long restaurantId, 
            @PathVariable String category) {
        List<MenuItemDTO> menuItems = menuItemService.getMenuItemsByCategory(restaurantId, category);
        return ResponseEntity.ok(ApiResponse.success(menuItems, "Menu items retrieved successfully"));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemDTO>> getMenuItemById(@PathVariable Long id) {
        try {
            MenuItemDTO menuItem = menuItemService.getMenuItemById(id);
            return ResponseEntity.ok(ApiResponse.success(menuItem, "Menu item retrieved successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<MenuItemDTO>> createMenuItem(@RequestBody MenuItemDTO menuItemDTO) {
        try {
            MenuItemDTO created = menuItemService.createMenuItem(menuItemDTO);
            return ResponseEntity.ok(ApiResponse.success(created, "Menu item created successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemDTO>> updateMenuItem(@PathVariable Long id, @RequestBody MenuItemDTO menuItemDTO) {
        try {
            MenuItemDTO updated = menuItemService.updateMenuItem(id, menuItemDTO);
            return ResponseEntity.ok(ApiResponse.success(updated, "Menu item updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable Long id) {
        try {
            menuItemService.deleteMenuItem(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Menu item deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }
}
