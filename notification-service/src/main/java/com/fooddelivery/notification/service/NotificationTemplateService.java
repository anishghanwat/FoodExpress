package com.fooddelivery.notification.service;

import com.fooddelivery.notification.entity.NotificationTemplate;
import com.fooddelivery.notification.repository.NotificationTemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationTemplateService {

    private final NotificationTemplateRepository templateRepository;

    public List<NotificationTemplate> getAllTemplates() {
        return templateRepository.findAll();
    }

    public NotificationTemplate createTemplate(NotificationTemplate template) {
        log.info("Creating template: {}", template.getName());
        return templateRepository.save(template);
    }

    public NotificationTemplate updateTemplate(Long id, NotificationTemplate templateData) {
        NotificationTemplate existing = templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found: " + id));

        existing.setName(templateData.getName());
        existing.setType(templateData.getType());
        existing.setSubject(templateData.getSubject());
        existing.setContent(templateData.getContent());

        log.info("Updating template: {}", existing.getName());
        return templateRepository.save(existing);
    }

    public void deleteTemplate(Long id) {
        log.info("Deleting template: {}", id);
        templateRepository.deleteById(id);
    }
}
