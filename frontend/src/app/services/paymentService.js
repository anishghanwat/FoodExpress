import { apiHelper } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { buildQueryString } from '../utils/helpers';

const paymentService = {
    /**
     * Create a razorpay order
     * @param {Object} paymentData 
     * @returns {Promise}
     */
    createPayment: async (paymentData) => {
        try {
            const response = await apiHelper.post(`${API_ENDPOINTS.PAYMENTS.BASE}/create`, paymentData);
            return response;
        } catch (error) {
            console.error('Error creating payment:', error);
            throw error;
        }
    },

    /**
     * Verify razorpay payment
     * @param {Object} verificationData 
     * @returns {Promise}
     */
    verifyPayment: async (verificationData) => {
        try {
            const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = verificationData;
            const response = await apiHelper.post(`${API_ENDPOINTS.PAYMENTS.BASE}/verify?razorpayOrderId=${razorpayOrderId}&razorpayPaymentId=${razorpayPaymentId}&razorpaySignature=${razorpaySignature}`);
            return response;
        } catch (error) {
            console.error('Error verifying payment:', error);
            throw error;
        }
    },

    /**
     * Get payment by order ID
     * @param {string} orderId 
     * @returns {Promise}
     */
    getPaymentByOrder: async (orderId) => {
        try {
            const response = await apiHelper.get(`${API_ENDPOINTS.PAYMENTS.BASE}/order/${orderId}`);
            return response;
        } catch (error) {
            console.error('Error getting payment:', error);
            throw error;
        }
    },

    // Create payment intent (Stripe)
    createIntent: async (paymentData) => {
        return await apiHelper.post(`${API_ENDPOINTS.PAYMENTS.BASE}/create-intent`, paymentData);
    },

    // Confirm payment
    confirmPayment: async (paymentIntentId) => {
        return await apiHelper.post(`${API_ENDPOINTS.PAYMENTS.BASE}/confirm`, null, {
            params: { paymentIntentId }
        });
    },

    // Get all payments (admin)
    getAll: async (params = {}) => {
        const queryString = buildQueryString(params);
        const url = queryString ? `${API_ENDPOINTS.PAYMENTS.BASE}?${queryString}` : API_ENDPOINTS.PAYMENTS.BASE;
        return await apiHelper.get(url);
    },

    // Get payment by ID
    getById: async (paymentId) => {
        return await apiHelper.get(`${API_ENDPOINTS.PAYMENTS.BASE}/${paymentId}`);
    },

    // Get payment by order ID
    getByOrderId: async (orderId) => {
        return await apiHelper.get(`${API_ENDPOINTS.PAYMENTS.BASE}/order/${orderId}`);
    },

    // Get payment history for customer
    getHistory: async (customerId) => {
        return await apiHelper.get(`${API_ENDPOINTS.PAYMENTS.BASE}/customer/${customerId}`);
    },

    // Refund payment
    refund: async (paymentId, refundData) => {
        return await apiHelper.post(`${API_ENDPOINTS.PAYMENTS.BASE}/${paymentId}/refund`, refundData);
    },
};

export default paymentService;
