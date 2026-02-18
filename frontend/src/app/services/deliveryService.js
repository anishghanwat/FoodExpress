import { apiHelper } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { buildQueryString } from '../utils/helpers';

const deliveryService = {
    // Get all deliveries (admin)
    getAll: async (params = {}) => {
        const queryString = buildQueryString(params);
        const url = queryString ? `${API_ENDPOINTS.DELIVERY.BASE}?${queryString}` : API_ENDPOINTS.DELIVERY.BASE;
        return await apiHelper.get(url);
    },

    // Get delivery by order ID
    getByOrderId: async (orderId) => {
        return await apiHelper.get(`${API_ENDPOINTS.DELIVERY.BASE}/order/${orderId}`);
    },

    // Get agent deliveries
    getAgentDeliveries: async (agentId, params = {}) => {
        const queryString = buildQueryString(params);
        const url = queryString
            ? `${API_ENDPOINTS.DELIVERY.BASE}/agent/${agentId}?${queryString}`
            : `${API_ENDPOINTS.DELIVERY.BASE}/agent/${agentId}`;
        return await apiHelper.get(url);
    },

    // Get available deliveries for agent
    getAvailable: async () => {
        return await apiHelper.get(API_ENDPOINTS.DELIVERY.AVAILABLE);
    },

    // Get active deliveries for agent
    getActive: async () => {
        return await apiHelper.get(API_ENDPOINTS.DELIVERY.ACTIVE);
    },

    // Get delivery history
    getHistory: async (params = {}) => {
        const queryString = buildQueryString(params);
        const url = queryString
            ? `${API_ENDPOINTS.DELIVERY.HISTORY}?${queryString}`
            : API_ENDPOINTS.DELIVERY.HISTORY;
        return await apiHelper.get(url);
    },

    // Create delivery
    create: async (deliveryData) => {
        return await apiHelper.post(API_ENDPOINTS.DELIVERY.BASE, deliveryData);
    },

    // Assign delivery to agent
    assignDelivery: async (deliveryData) => {
        return await apiHelper.post(`${API_ENDPOINTS.DELIVERY.BASE}/assign`, deliveryData);
    },

    // Accept delivery
    accept: async (id) => {
        return await apiHelper.post(API_ENDPOINTS.DELIVERY.ACCEPT(id), {});
    },

    // Update delivery status
    updateStatus: async (id, status) => {
        return await apiHelper.patch(`${API_ENDPOINTS.DELIVERY.BASE}/${id}/status?status=${status}`);
    },

    // Complete delivery
    complete: async (id) => {
        return await apiHelper.post(API_ENDPOINTS.DELIVERY.COMPLETE(id));
    },

    // Update delivery location
    updateLocation: async (id, location) => {
        return await apiHelper.put(`${API_ENDPOINTS.DELIVERY.BASE}/${id}/location`, location);
    },
};

export default deliveryService;
