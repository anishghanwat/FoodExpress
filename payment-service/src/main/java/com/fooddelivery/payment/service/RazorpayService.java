package com.fooddelivery.payment.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
@Slf4j
public class RazorpayService {

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    private RazorpayClient client;

    @PostConstruct
    public void init() throws RazorpayException {
        this.client = new RazorpayClient(keyId, keySecret);
    }

    /**
     * Create a Razorpay order
     */
    public Order createOrder(Double amount, String currency, Long orderId) throws RazorpayException {
        log.info("Creating Razorpay order for local order ID: {} with amount: {}", orderId, amount);

        JSONObject orderRequest = new JSONObject();
        // Razorpay expect amount in paise (1 INR = 100 Paise)
        orderRequest.put("amount", (int) (amount * 100));
        orderRequest.put("currency", currency != null ? currency.toUpperCase() : "INR");
        orderRequest.put("receipt", "order_rcptid_" + orderId);

        JSONObject notes = new JSONObject();
        notes.put("orderId", orderId.toString());
        orderRequest.put("notes", notes);

        return client.orders.create(orderRequest);
    }

    /**
     * Verify the payment signature returned by Razorpay
     */
    public boolean verifySignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);

            return Utils.verifyPaymentSignature(options, keySecret);
        } catch (RazorpayException e) {
            log.error("Error verifying Razorpay signature", e);
            return false;
        }
    }
}
