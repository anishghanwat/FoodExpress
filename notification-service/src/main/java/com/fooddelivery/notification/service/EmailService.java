package com.fooddelivery.notification.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.mail.from-name}")
    private String fromName;

    @Async
    public void sendEmail(String to, String subject, String htmlBody) {
        if (to == null || to.isBlank()) {
            log.warn("Skipping email — no recipient address provided. Subject: {}", subject);
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.info("Email sent to {} | Subject: {}", to, subject);
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    // ─── Order Placed ────────────────────────────────────────────────────────────
    public void sendOrderPlaced(String to, String name, Long orderId, Double total) {
        String subject = "✅ Order #" + orderId + " Confirmed — FoodExpress";
        String body = baseTemplate(name,
                "Your order has been placed!",
                "🎉 We've received your order and the restaurant is getting started.",
                "<table style='width:100%;border-collapse:collapse;margin:16px 0'>" +
                        "<tr><td style='padding:8px 0;color:#999;font-size:14px'>Order ID</td>" +
                        "<td style='padding:8px 0;color:#fff;font-size:14px;text-align:right'>#" + orderId
                        + "</td></tr>" +
                        "<tr><td style='padding:8px 0;color:#999;font-size:14px'>Total Amount</td>" +
                        "<td style='padding:8px 0;color:#FF6B35;font-size:16px;font-weight:bold;text-align:right'>₹"
                        + String.format("%.2f", total) + "</td></tr>" +
                        "</table>",
                "Track Your Order", "http://localhost:5173/orders/history");
        sendEmail(to, subject, body);
    }

    // ─── Order Confirmed ─────────────────────────────────────────────────────────
    public void sendOrderConfirmed(String to, String name, Long orderId) {
        String subject = "👨‍🍳 Order #" + orderId + " Accepted — FoodExpress";
        String body = baseTemplate(name,
                "Restaurant accepted your order!",
                "Your order <strong>#" + orderId
                        + "</strong> has been accepted and the kitchen is preparing your food.",
                "", "Track Order", "http://localhost:5173/orders/history");
        sendEmail(to, subject, body);
    }

    // ─── Order Preparing ─────────────────────────────────────────────────────────
    public void sendOrderPreparing(String to, String name, Long orderId) {
        String subject = "🍳 Your food is being prepared — Order #" + orderId;
        String body = baseTemplate(name,
                "Your food is being prepared!",
                "Order <strong>#" + orderId + "</strong> is in the kitchen. Hang tight — it'll be ready soon!",
                "", "Track Order", "http://localhost:5173/orders/history");
        sendEmail(to, subject, body);
    }

    // ─── Order Out for Delivery
    // ───────────────────────────────────────────────────
    public void sendOrderOutForDelivery(String to, String name, Long orderId) {
        String subject = "🛵 Your order is on the way! — Order #" + orderId;
        String body = baseTemplate(name,
                "Your order is out for delivery!",
                "Order <strong>#" + orderId + "</strong> has been picked up and is heading your way. Get ready!",
                "", "Track Delivery", "http://localhost:5173/orders/history");
        sendEmail(to, subject, body);
    }

    // ─── Order Delivered ─────────────────────────────────────────────────────────
    public void sendOrderDelivered(String to, String name, Long orderId) {
        String subject = "🎉 Order #" + orderId + " Delivered — Enjoy your meal!";
        String body = baseTemplate(name,
                "Your order has been delivered!",
                "Order <strong>#" + orderId + "</strong> has been delivered. We hope you enjoy your meal! 😋",
                "", "View Order History", "http://localhost:5173/orders/history");
        sendEmail(to, subject, body);
    }

    // ─── Order Cancelled ─────────────────────────────────────────────────────────
    public void sendOrderCancelled(String to, String name, Long orderId) {
        String subject = "❌ Order #" + orderId + " Cancelled — FoodExpress";
        String body = baseTemplate(name,
                "Your order has been cancelled",
                "Unfortunately, order <strong>#" + orderId
                        + "</strong> has been cancelled. If you were charged, a refund will be processed within 3-5 business days.",
                "", "Browse Restaurants", "http://localhost:5173/restaurants");
        sendEmail(to, subject, body);
    }

    // ─── Payment Success
    // ──────────────────────────────────────────────────────────
    public void sendPaymentSuccess(String to, String name, Long orderId, Double amount) {
        String subject = "💳 Payment Confirmed — ₹" + String.format("%.2f", amount);
        String body = baseTemplate(name,
                "Payment successful!",
                "Your payment of <strong>₹" + String.format("%.2f", amount) + "</strong> for order <strong>#" + orderId
                        + "</strong> was received successfully.",
                "", "View Order", "http://localhost:5173/orders/history");
        sendEmail(to, subject, body);
    }

    // ─── Payment Failed
    // ───────────────────────────────────────────────────────────
    public void sendPaymentFailed(String to, String name, Long orderId) {
        String subject = "⚠️ Payment Failed — Order #" + orderId;
        String body = baseTemplate(name,
                "Payment could not be processed",
                "We were unable to process your payment for order <strong>#" + orderId
                        + "</strong>. Please try again or use a different payment method.",
                "", "Try Again", "http://localhost:5173/checkout");
        sendEmail(to, subject, body);
    }

    // ─── Base HTML Template
    // ───────────────────────────────────────────────────────
    private String baseTemplate(String name, String heading, String body, String extraHtml, String ctaText,
            String ctaUrl) {
        String displayName = (name != null && !name.isBlank()) ? name : "there";
        return "<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body style='margin:0;padding:0;background:#0f0f0f;font-family:Inter,Arial,sans-serif'>"
                +
                "<table width='100%' cellpadding='0' cellspacing='0' style='background:#0f0f0f;padding:40px 0'><tr><td align='center'>"
                +
                "<table width='560' cellpadding='0' cellspacing='0' style='background:#1a1a1a;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08)'>"
                +
                // Header
                "<tr><td style='background:linear-gradient(135deg,#FF6B35,#ff8a5c);padding:28px 32px;text-align:center'>"
                +
                "<span style='font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px'>🍔 FoodExpress</span>" +
                "</td></tr>" +
                // Body
                "<tr><td style='padding:32px'>" +
                "<p style='color:#aaa;font-size:14px;margin:0 0 8px'>Hi " + displayName + ",</p>" +
                "<h1 style='color:#fff;font-size:22px;font-weight:700;margin:0 0 16px'>" + heading + "</h1>" +
                "<p style='color:#bbb;font-size:15px;line-height:1.6;margin:0 0 20px'>" + body + "</p>" +
                extraHtml +
                // CTA Button
                "<div style='text-align:center;margin:28px 0 8px'>" +
                "<a href='" + ctaUrl
                + "' style='display:inline-block;background:#FF6B35;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px'>"
                + ctaText + "</a>" +
                "</div>" +
                "</td></tr>" +
                // Footer
                "<tr><td style='padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center'>" +
                "<p style='color:#555;font-size:12px;margin:0'>© 2025 FoodExpress · You're receiving this because you placed an order.</p>"
                +
                "</td></tr>" +
                "</table></td></tr></table></body></html>";
    }
}
