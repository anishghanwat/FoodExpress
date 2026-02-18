package com.fooddelivery.payment.controller;

import com.fooddelivery.payment.dto.CreatePaymentIntentRequest;
import com.fooddelivery.payment.dto.PaymentIntentResponse;
import com.fooddelivery.payment.dto.RefundRequest;
import com.fooddelivery.payment.entity.Payment;
import com.fooddelivery.payment.entity.PaymentMethod;
import com.fooddelivery.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Create a payment for an order
     */
    @PostMapping("/create")
    public ResponseEntity<PaymentIntentResponse> createPayment(@RequestBody CreatePaymentIntentRequest request) {
        log.info("Received request to create payment for order: {}", request.getOrderId());
        try {
            Payment payment = new Payment();
            payment.setOrderId(request.getOrderId());
            payment.setCustomerId(request.getCustomerId());
            payment.setAmount(request.getAmount());
            payment.setCurrency(request.getCurrency() != null ? request.getCurrency() : "INR");
            payment.setPaymentMethod(PaymentMethod.CARD);

            Payment initiatedPayment = paymentService.initiatePayment(payment);

            PaymentIntentResponse response = PaymentIntentResponse.builder()
                    .paymentId(initiatedPayment.getId())
                    .razorpayOrderId(initiatedPayment.getRazorpayOrderId())
                    .razorpayKeyId(paymentService.getRazorpayKeyId())
                    .amount(initiatedPayment.getAmount())
                    .currency(initiatedPayment.getCurrency())
                    .status(initiatedPayment.getStatus().name())
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error creating payment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Verify a Razorpay payment
     */
    @PostMapping("/verify")
    public ResponseEntity<Payment> verifyPayment(
            @RequestParam String razorpayOrderId,
            @RequestParam String razorpayPaymentId,
            @RequestParam String razorpaySignature) {
        log.info("Received request to verify payment for Razorpay order: {}", razorpayOrderId);
        try {
            Payment verifiedPayment = paymentService.verifyPayment(razorpayOrderId, razorpayPaymentId,
                    razorpaySignature);
            return ResponseEntity.ok(verifiedPayment);
        } catch (Exception e) {
            log.error("Error verifying payment", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Handle payment failure
     */
    @PostMapping("/fail")
    public ResponseEntity<Payment> failPayment(
            @RequestParam String razorpayOrderId,
            @RequestParam String reason) {
        log.info("Received request to fail payment for order: {}", razorpayOrderId);
        Payment payment = paymentService.handlePaymentFailure(razorpayOrderId, reason);
        return ResponseEntity.ok(payment);
    }

    /**
     * Refund payment
     */
    @PostMapping("/{id}/refund")
    public ResponseEntity<?> refundPayment(@PathVariable Long id, @RequestBody RefundRequest request) {
        try {
            log.info("Refunding payment: {}", id);

            Payment payment = paymentService.refundPayment(id, request.getAmount(), request.getReason());

            return ResponseEntity.ok(buildSuccessResponse(payment, "Payment refunded successfully"));

        } catch (Exception e) {
            log.error("Error refunding payment", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(buildErrorResponse("Failed to refund payment: " + e.getMessage()));
        }
    }

    /**
     * Get all payments (admin)
     */
    @GetMapping
    public ResponseEntity<?> getAllPayments() {
        try {
            List<Payment> payments = paymentService.getAllPayments();
            return ResponseEntity.ok(buildSuccessResponse(payments, "Payments retrieved successfully"));
        } catch (Exception e) {
            log.error("Error getting payments", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(buildErrorResponse("Internal server error"));
        }
    }

    /**
     * Get payment by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentById(@PathVariable Long id) {
        try {
            return paymentService.getPaymentById(id)
                    .map(payment -> ResponseEntity.ok(buildSuccessResponse(payment, "Payment retrieved successfully")))
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(buildErrorResponse("Payment not found")));
        } catch (Exception e) {
            log.error("Error getting payment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(buildErrorResponse("Internal server error"));
        }
    }

    /**
     * Get payment by order ID
     */
    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getPaymentByOrder(@PathVariable Long orderId) {
        try {
            return paymentService.getPaymentByOrderId(orderId)
                    .map(payment -> ResponseEntity.ok(buildSuccessResponse(payment, "Payment retrieved successfully")))
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(buildErrorResponse("Payment not found for order")));
        } catch (Exception e) {
            log.error("Error getting payment by order", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(buildErrorResponse("Internal server error"));
        }
    }

    /**
     * Get payments by customer ID
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getPaymentsByCustomer(@PathVariable Long customerId) {
        try {
            List<Payment> payments = paymentService.getPaymentsByCustomerId(customerId);
            return ResponseEntity.ok(buildSuccessResponse(payments, "Payments retrieved successfully"));
        } catch (Exception e) {
            log.error("Error getting customer payments", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(buildErrorResponse("Internal server error"));
        }
    }

    // Helper methods for consistent response format
    private Map<String, Object> buildSuccessResponse(Object data, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", data);
        response.put("message", message);
        return response;
    }

    private Map<String, Object> buildErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }
}
