package com.fooddelivery.notification.controller;

import com.fooddelivery.notification.entity.Campaign;
import com.fooddelivery.notification.service.CampaignService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications/campaigns")
@RequiredArgsConstructor
@Slf4j
public class CampaignController {

    private final CampaignService campaignService;

    @GetMapping
    public ResponseEntity<List<Campaign>> getAllCampaigns() {
        return ResponseEntity.ok(campaignService.getAllCampaigns());
    }

    @PostMapping
    public ResponseEntity<Campaign> createCampaign(@RequestBody Campaign campaign) {
        return ResponseEntity.status(HttpStatus.CREATED).body(campaignService.createCampaign(campaign));
    }

    @PostMapping("/{id}/send")
    public ResponseEntity<Campaign> sendCampaign(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(campaignService.sendCampaign(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/analytics")
    public ResponseEntity<Map<String, Object>> getCampaignAnalytics(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(campaignService.getCampaignAnalytics(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteCampaign(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("id", id);
        return ResponseEntity.ok(response);
    }
}
