package com.fooddelivery.user.controller;

import com.fooddelivery.user.dto.UserDTO;
import com.fooddelivery.user.entity.User;
import com.fooddelivery.user.entity.UserRole;
import com.fooddelivery.user.repository.UserRepository;
import com.fooddelivery.user.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String role) {

        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            Page<User> userPage;

            if (role != null && !role.equals("ALL")) {
                UserRole userRole = UserRole.valueOf(role);
                userPage = userRepository.findByRole(userRole, pageable);
            } else {
                userPage = userRepository.findAll(pageable);
            }

            List<UserDTO> users = userPage.getContent().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("users", users);
            response.put("currentPage", userPage.getNumber());
            response.put("totalPages", userPage.getTotalPages());
            response.put("totalItems", userPage.getTotalElements());

            return ResponseEntity.ok(ApiResponse.success(response, "Users retrieved successfully"));
        } catch (Exception e) {
            log.error("Error retrieving users", e);
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Failed to retrieve users: " + e.getMessage()));
        }
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(ApiResponse.success(convertToDTO(user), "User retrieved successfully")))
                .orElse(ResponseEntity.status(404)
                        .body(ApiResponse.error("User not found")));
    }

    @GetMapping("/users/search")
    public ResponseEntity<ApiResponse<List<UserDTO>>> searchUsers(
            @RequestParam String query,
            @RequestParam(required = false) String role) {

        try {
            List<User> users;

            if (role != null && !role.equals("ALL")) {
                UserRole userRole = UserRole.valueOf(role);
                users = userRepository.searchUsersByRole(query, userRole);
            } else {
                users = userRepository.searchUsers(query);
            }

            List<UserDTO> userDTOs = users.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ApiResponse.success(userDTOs, "Search completed successfully"));
        } catch (Exception e) {
            log.error("Error searching users", e);
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Failed to search users: " + e.getMessage()));
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> updateUser(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {

        return userRepository.findById(id)
                .map(user -> {
                    if (updates.containsKey("name")) {
                        user.setName((String) updates.get("name"));
                    }
                    if (updates.containsKey("email")) {
                        user.setEmail((String) updates.get("email"));
                    }
                    if (updates.containsKey("phone")) {
                        user.setPhone((String) updates.get("phone"));
                    }
                    if (updates.containsKey("role")) {
                        user.setRole(UserRole.valueOf((String) updates.get("role")));
                    }
                    if (updates.containsKey("active")) {
                        user.setIsActive((Boolean) updates.get("active"));
                    }

                    User updated = userRepository.save(user);
                    log.info("User updated: userId={}", id);

                    return ResponseEntity.ok(ApiResponse.success(convertToDTO(updated), "User updated successfully"));
                })
                .orElse(ResponseEntity.status(404)
                        .body(ApiResponse.error("User not found")));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    log.info("User deleted: userId={}", id);
                    return ResponseEntity.ok(ApiResponse.<Void>success(null, "User deleted successfully"));
                })
                .orElse(ResponseEntity.status(404)
                        .body(ApiResponse.error("User not found")));
    }

    @PostMapping("/users/{id}/suspend")
    public ResponseEntity<ApiResponse<UserDTO>> suspendUser(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {

        return userRepository.findById(id)
                .map(user -> {
                    user.setIsActive(false);
                    User updated = userRepository.save(user);
                    log.info("User suspended: userId={}, reason={}", id, body != null ? body.get("reason") : "N/A");

                    return ResponseEntity.ok(ApiResponse.success(convertToDTO(updated), "User suspended successfully"));
                })
                .orElse(ResponseEntity.status(404)
                        .body(ApiResponse.error("User not found")));
    }

    @PostMapping("/users/{id}/activate")
    public ResponseEntity<ApiResponse<UserDTO>> activateUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setIsActive(true);
                    User updated = userRepository.save(user);
                    log.info("User activated: userId={}", id);

                    return ResponseEntity.ok(ApiResponse.success(convertToDTO(updated), "User activated successfully"));
                })
                .orElse(ResponseEntity.status(404)
                        .body(ApiResponse.error("User not found")));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        try {
            Map<String, Object> stats = new HashMap<>();

            // Total users
            long totalUsers = userRepository.count();
            stats.put("totalUsers", totalUsers);

            // Users by role
            Map<String, Long> usersByRole = new HashMap<>();
            for (UserRole role : UserRole.values()) {
                long count = userRepository.countByRole(role);
                usersByRole.put(role.name(), count);
            }
            stats.put("usersByRole", usersByRole);

            // Active users
            long activeUsers = userRepository.countByIsActive(true);
            stats.put("activeUsers", activeUsers);

            return ResponseEntity.ok(ApiResponse.success(stats, "Stats retrieved successfully"));
        } catch (Exception e) {
            log.error("Error retrieving stats", e);
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Failed to retrieve stats: " + e.getMessage()));
        }
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        dto.setActive(user.getIsActive());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
