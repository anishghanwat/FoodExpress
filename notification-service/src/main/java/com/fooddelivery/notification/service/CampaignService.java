package com.fooddelivery.notification.service;

import com.fooddelivery.notification.entity.Campaign;
import com.fooddelivery.notification.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final EmailService emailService;
    private final RestTemplate restTemplate;

    public List<Campaign> getAllCampaigns() {
        return campaignRepository.findAll();
    }

    public Campaign createCampaign(Campaign campaign) {
        log.info("Creating campaign: {}", campaign.getName());
        return campaignRepository.save(campaign);
    }

    public Campaign sendCampaign(Long id) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found: " + id));

        campaign.setStatus("SENT");
        campaign.setSentAt(LocalDateTime.now());
        log.info("Sending campaign: {}", campaign.getName());

        // Fetch user emails and send in background
        sendCampaignEmails(campaign);

        return campaignRepository.save(campaign);
    }

    @Async
    protected void sendCampaignEmails(Campaign campaign) {
        try {
            // Fetch customers from user-service via Eureka (load-balanced)
            String role = mapSegmentToRole(campaign.getSegment());
            String url = "http://user-service/api/admin/users?role=" + role + "&size=10000";

            log.info("Fetching users for campaign '{}' from: {}", campaign.getName(), url);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response == null || !Boolean.TRUE.equals(response.get("success"))) {
                log.error("Failed to fetch users for campaign: {}", campaign.getName());
                return;
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> data = (Map<String, Object>) response.get("data");
            if (data == null) {
                log.error("No data in response for campaign: {}", campaign.getName());
                return;
            }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> users = (List<Map<String, Object>>) data.get("users");

            if (users == null || users.isEmpty()) {
                log.warn("No users found for segment: {}", campaign.getSegment());
                return;
            }

            int sentCount = 0;
            for (Map<String, Object> user : users) {
                String email = (String) user.get("email");
                if (email != null && !email.isBlank()) {
                    emailService.sendCampaignEmail(email, campaign.getName(), buildCampaignContent(campaign));
                    sentCount++;
                }
            }

            // Update sent count
            campaign.setSentCount(sentCount);
            campaignRepository.save(campaign);
            log.info("Campaign '{}' sent to {} users", campaign.getName(), sentCount);

        } catch (Exception e) {
            log.error("Error sending campaign emails for '{}': {}", campaign.getName(), e.getMessage(), e);
        }
    }

    private String mapSegmentToRole(String segment) {
        // ALL_CUSTOMERS → CUSTOMER (fetches all customers)
        // ACTIVE_CUSTOMERS → CUSTOMER (same endpoint, all are active customers)
        // PREMIUM_CUSTOMERS → CUSTOMER (same pool, no premium distinction yet)
        return "CUSTOMER";
    }

    private String buildCampaignContent(Campaign campaign) {
        String typeLabel;
        switch (campaign.getType()) {
            case "PROMOTIONAL":
                typeLabel = "🎉 Special Offer!";
                break;
            case "ANNOUNCEMENT":
                typeLabel = "📣 Announcement";
                break;
            case "LOYALTY":
                typeLabel = "⭐ Loyalty Reward";
                break;
            default:
                typeLabel = "📢 Update";
        }
        return typeLabel + "<br><br>" +
                "We have something exciting for you! Check out <strong>" + campaign.getName()
                + "</strong> on FoodExpress.";
    }

    public Map<String, Object> getCampaignAnalytics(Long id) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found: " + id));

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("campaignId", campaign.getId());
        analytics.put("sentCount", campaign.getSentCount());
        analytics.put("openRate", campaign.getOpenRate());
        analytics.put("clickRate", 0);
        analytics.put("conversionRate", 0);
        analytics.put("revenue", 0);
        return analytics;
    }

    public void deleteCampaign(Long id) {
        log.info("Deleting campaign: {}", id);
        campaignRepository.deleteById(id);
    }
}
