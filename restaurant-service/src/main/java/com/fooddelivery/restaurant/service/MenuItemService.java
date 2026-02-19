package com.fooddelivery.restaurant.service;

import com.fooddelivery.restaurant.dto.MenuItemDTO;
import com.fooddelivery.restaurant.entity.MenuItem;
import com.fooddelivery.restaurant.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuItemService {
    
    private final MenuItemRepository menuItemRepository;
    
    public List<MenuItemDTO> getMenuItemsByRestaurant(Long restaurantId) {
        return menuItemRepository.findByRestaurantIdAndIsAvailableTrue(restaurantId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<MenuItemDTO> getMenuItemsByCategory(Long restaurantId, String category) {
        return menuItemRepository.findByRestaurantIdAndCategory(restaurantId, category)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public MenuItemDTO getMenuItemById(Long id) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));
        return convertToDTO(menuItem);
    }
    
    @Transactional
    public MenuItemDTO createMenuItem(MenuItemDTO menuItemDTO) {
        MenuItem menuItem = convertToEntity(menuItemDTO);
        menuItem.setIsAvailable(true);
        MenuItem saved = menuItemRepository.save(menuItem);
        return convertToDTO(saved);
    }
    
    @Transactional
    public MenuItemDTO updateMenuItem(Long id, MenuItemDTO menuItemDTO) {
        MenuItem existing = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));
        
        existing.setName(menuItemDTO.getName());
        existing.setDescription(menuItemDTO.getDescription());
        existing.setPrice(menuItemDTO.getPrice());
        existing.setImageUrl(menuItemDTO.getImageUrl());
        existing.setCategory(menuItemDTO.getCategory());
        existing.setIsVegetarian(menuItemDTO.getIsVegetarian());
        existing.setIsAvailable(menuItemDTO.getIsAvailable());
        
        MenuItem updated = menuItemRepository.save(existing);
        return convertToDTO(updated);
    }
    
    @Transactional
    public void deleteMenuItem(Long id) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));
        menuItem.setIsAvailable(false);
        menuItemRepository.save(menuItem);
    }
    
    private MenuItemDTO convertToDTO(MenuItem menuItem) {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setId(menuItem.getId());
        dto.setRestaurantId(menuItem.getRestaurantId());
        dto.setName(menuItem.getName());
        dto.setDescription(menuItem.getDescription());
        dto.setPrice(menuItem.getPrice());
        dto.setImageUrl(menuItem.getImageUrl());
        dto.setCategory(menuItem.getCategory());
        dto.setIsVegetarian(menuItem.getIsVegetarian());
        dto.setIsAvailable(menuItem.getIsAvailable());
        dto.setCreatedAt(menuItem.getCreatedAt());
        dto.setUpdatedAt(menuItem.getUpdatedAt());
        return dto;
    }
    
    private MenuItem convertToEntity(MenuItemDTO dto) {
        MenuItem menuItem = new MenuItem();
        menuItem.setRestaurantId(dto.getRestaurantId());
        menuItem.setName(dto.getName());
        menuItem.setDescription(dto.getDescription());
        menuItem.setPrice(dto.getPrice());
        menuItem.setImageUrl(dto.getImageUrl());
        menuItem.setCategory(dto.getCategory());
        menuItem.setIsVegetarian(dto.getIsVegetarian());
        return menuItem;
    }
}
