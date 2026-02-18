package com.fooddelivery.restaurant.service;

import com.fooddelivery.restaurant.dto.RestaurantDTO;
import com.fooddelivery.restaurant.entity.Restaurant;
import com.fooddelivery.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {
    
    private final RestaurantRepository restaurantRepository;
    
    public List<RestaurantDTO> getAllActiveRestaurants() {
        return restaurantRepository.findByIsActiveTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<RestaurantDTO> getFilteredRestaurants(String cuisineType, Double minRating, 
                                                       Integer maxDeliveryTime, Boolean onlyOpen, String sortBy) {
        List<Restaurant> restaurants = restaurantRepository.findByIsActiveTrue();
        
        // Apply filters
        return restaurants.stream()
                .filter(r -> cuisineType == null || cuisineType.isEmpty() || r.getCuisine().equalsIgnoreCase(cuisineType))
                .filter(r -> r.getRating() != null && r.getRating() >= minRating)
                .filter(r -> r.getEstimatedDeliveryTime() != null && r.getEstimatedDeliveryTime() <= maxDeliveryTime)
                .sorted((r1, r2) -> {
                    switch (sortBy.toLowerCase()) {
                        case "rating":
                            Double rating1 = r1.getRating() != null ? r1.getRating() : 0.0;
                            Double rating2 = r2.getRating() != null ? r2.getRating() : 0.0;
                            return Double.compare(rating2, rating1); // Descending
                        case "deliverytime":
                            Integer time1 = r1.getEstimatedDeliveryTime() != null ? r1.getEstimatedDeliveryTime() : 999;
                            Integer time2 = r2.getEstimatedDeliveryTime() != null ? r2.getEstimatedDeliveryTime() : 999;
                            return Integer.compare(time1, time2); // Ascending
                        case "name":
                            return r1.getName().compareToIgnoreCase(r2.getName());
                        default:
                            Double defRating1 = r1.getRating() != null ? r1.getRating() : 0.0;
                            Double defRating2 = r2.getRating() != null ? r2.getRating() : 0.0;
                            return Double.compare(defRating2, defRating1);
                    }
                })
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public RestaurantDTO getRestaurantById(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
        return convertToDTO(restaurant);
    }
    
    public List<RestaurantDTO> getRestaurantsByOwner(Long ownerId) {
        return restaurantRepository.findByOwnerId(ownerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<RestaurantDTO> searchRestaurants(String query) {
        return restaurantRepository.findByNameContainingIgnoreCase(query)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public RestaurantDTO createRestaurant(RestaurantDTO restaurantDTO) {
        Restaurant restaurant = convertToEntity(restaurantDTO);
        restaurant.setIsActive(true);
        restaurant.setRating(0.0);
        restaurant.setTotalReviews(0);
        Restaurant saved = restaurantRepository.save(restaurant);
        return convertToDTO(saved);
    }
    
    @Transactional
    public RestaurantDTO updateRestaurant(Long id, RestaurantDTO restaurantDTO) {
        Restaurant existing = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
        
        existing.setName(restaurantDTO.getName());
        existing.setDescription(restaurantDTO.getDescription());
        existing.setAddress(restaurantDTO.getAddress());
        existing.setPhone(restaurantDTO.getPhone());
        existing.setEmail(restaurantDTO.getEmail());
        existing.setImageUrl(restaurantDTO.getImageUrl());
        existing.setCuisine(restaurantDTO.getCuisine());
        existing.setOpeningTime(restaurantDTO.getOpeningTime());
        existing.setClosingTime(restaurantDTO.getClosingTime());
        existing.setDeliveryFee(restaurantDTO.getDeliveryFee());
        existing.setEstimatedDeliveryTime(restaurantDTO.getEstimatedDeliveryTime());
        
        // Update isActive if provided
        if (restaurantDTO.getIsActive() != null) {
            existing.setIsActive(restaurantDTO.getIsActive());
        }
        
        Restaurant updated = restaurantRepository.save(existing);
        return convertToDTO(updated);
    }
    
    @Transactional
    public void deleteRestaurant(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
        restaurant.setIsActive(false);
        restaurantRepository.save(restaurant);
    }
    
    private RestaurantDTO convertToDTO(Restaurant restaurant) {
        RestaurantDTO dto = new RestaurantDTO();
        dto.setId(restaurant.getId());
        dto.setOwnerId(restaurant.getOwnerId());
        dto.setName(restaurant.getName());
        dto.setDescription(restaurant.getDescription());
        dto.setAddress(restaurant.getAddress());
        dto.setPhone(restaurant.getPhone());
        dto.setEmail(restaurant.getEmail());
        dto.setImageUrl(restaurant.getImageUrl());
        dto.setCuisine(restaurant.getCuisine());
        dto.setRating(restaurant.getRating());
        dto.setTotalReviews(restaurant.getTotalReviews());
        dto.setIsActive(restaurant.getIsActive());
        dto.setOpeningTime(restaurant.getOpeningTime());
        dto.setClosingTime(restaurant.getClosingTime());
        dto.setDeliveryFee(restaurant.getDeliveryFee());
        dto.setEstimatedDeliveryTime(restaurant.getEstimatedDeliveryTime());
        dto.setCreatedAt(restaurant.getCreatedAt());
        dto.setUpdatedAt(restaurant.getUpdatedAt());
        return dto;
    }
    
    private Restaurant convertToEntity(RestaurantDTO dto) {
        Restaurant restaurant = new Restaurant();
        restaurant.setOwnerId(dto.getOwnerId());
        restaurant.setName(dto.getName());
        restaurant.setDescription(dto.getDescription());
        restaurant.setAddress(dto.getAddress());
        restaurant.setPhone(dto.getPhone());
        restaurant.setEmail(dto.getEmail());
        restaurant.setImageUrl(dto.getImageUrl());
        restaurant.setCuisine(dto.getCuisine());
        restaurant.setOpeningTime(dto.getOpeningTime());
        restaurant.setClosingTime(dto.getClosingTime());
        restaurant.setDeliveryFee(dto.getDeliveryFee());
        restaurant.setEstimatedDeliveryTime(dto.getEstimatedDeliveryTime());
        return restaurant;
    }
}
