package com.fooddelivery.payment.service;

import com.fooddelivery.payment.entity.Payment;
import com.fooddelivery.payment.entity.PaymentStatus;
import com.fooddelivery.payment.producer.PaymentEventProducer;
import com.fooddelivery.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final RazorpayService razorpayService;
    private final PaymentEventProducer paymentEventProducer;

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    /**
     * Initiate payment - creates Razorpay order
     */
    @Transactional
    public Payment initiatePayment(Payment payment) throws Exception {
        log.info("Initiating payment for order: {}", payment.getOrderId());

        // Create Razorpay order
        com.razorpay.Order razorpayOrder = razorpayService.createOrder(
                payment.getAmount(),
                payment.getCurrency(),
                payment.getOrderId());

        // Update payment with Razorpay details
        payment.setRazorpayOrderId(razorpayOrder.get("id"));
        payment.setStatus(PaymentStatus.PENDING);
        payment.setTransactionId(razorpayOrder.get("id"));

        Payment savedPayment = paymentRepository.save(payment);
        log.info("Payment initiated with ID: {}", savedPayment.getId());

        // Publish PAYMENT_INITIATED event
        paymentEventProducer.publishPaymentInitiated(savedPayment);

        return savedPayment;
    }

    /**
     * Handle successful payment verification
     */
    @Transactional
    public Payment verifyPayment(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature)
            throws Exception {
        log.info("Verifying payment for Razorpay order: {}", razorpayOrderId);

        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for order: " + razorpayOrderId));

        // Verify signature
        boolean isValid = razorpayService.verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

        if (!isValid) {
            log.error("Invalid Razorpay signature for order: {}", razorpayOrderId);
            handlePaymentFailure(razorpayOrderId, "Invalid signature");
            throw new RuntimeException("Invalid payment signature");
        }

        // Update payment status
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setRazorpaySignature(razorpaySignature);
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setPaidAt(LocalDateTime.now());

        Payment updatedPayment = paymentRepository.save(payment);
        log.info("Payment marked as completed: {}", updatedPayment.getId());

        // Publish PAYMENT_COMPLETED event
        paymentEventProducer.publishPaymentCompleted(updatedPayment);

        return updatedPayment;
    }

    /**
     * Handle failed payment
     */
    @Transactional
    public Payment handlePaymentFailure(String razorpayOrderId, String reason) {
        log.info("Handling payment failure for order: {}", razorpayOrderId);

        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for order: " + razorpayOrderId));

        payment.setStatus(PaymentStatus.FAILED);
        payment.setFailureReason(reason);

        Payment updatedPayment = paymentRepository.save(payment);
        log.info("Payment marked as failed: {}", updatedPayment.getId());

        // Publish PAYMENT_FAILED event
        paymentEventProducer.publishPaymentFailed(updatedPayment, reason);

        return updatedPayment;
    }

    /**
     * Refund payment (Placeholder for now)
     */
    @Transactional
    public Payment refundPayment(Long paymentId, Double amount, String reason) throws Exception {
        log.info("Refunding payment: {} with amount: {}", paymentId, amount);

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + paymentId));

        if (payment.getStatus() != PaymentStatus.COMPLETED) {
            throw new RuntimeException("Can only refund completed payments");
        }

        // Publish REFUND_INITIATED event
        paymentEventProducer.publishRefundInitiated(payment, amount, reason);

        // Update payment status
        payment.setStatus(PaymentStatus.REFUNDED);
        payment.setFailureReason(reason);

        Payment updatedPayment = paymentRepository.save(payment);
        log.info("Payment refunded: {}", updatedPayment.getId());

        // Publish PAYMENT_REFUNDED event
        paymentEventProducer.publishRefundCompleted(updatedPayment, "REFUND_" + payment.getRazorpayPaymentId(), amount);

        return updatedPayment;
    }

    public String getRazorpayKeyId() {
        return razorpayKeyId;
    }

    /**
     * Get payment by ID
     */
    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    /**
     * Get payment by order ID
     */
    public Optional<Payment> getPaymentByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId);
    }

    /**
     * Get payments by customer ID
     */
    public List<Payment> getPaymentsByCustomerId(Long customerId) {
        return paymentRepository.findByCustomerId(customerId);
    }

    /**
     * Get all payments
     */
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
}
