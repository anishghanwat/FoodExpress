import { apiHelper } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { buildQueryString } from '../utils/helpers';

const orderService = {
    // Create order
    create: async (orderData) => {
        return await apiHelper.post(API_ENDPOINTS.ORDERS.BASE, orderData);
    },

    // Get order by ID
    getById: async (id) => {
        return await apiHelper.get(API_ENDPOINTS.ORDERS.BY_ID(id));
    },

    // Get customer orders
    getCustomerOrders: async (params = {}) => {
        const queryString = buildQueryString(params);
        const url = queryString
            ? `${API_ENDPOINTS.ORDERS.CUSTOMER}?${queryString}`
            : API_ENDPOINTS.ORDERS.CUSTOMER;
        return await apiHelper.get(url);
    },

    // Get all orders (for agents to see available ones)
    getAll: async () => {
        return await apiHelper.get(API_ENDPOINTS.ORDERS.BASE);
    },

    // Get restaurant orders
    getRestaurantOrders: async (restaurantId) => {
        if (restaurantId) {
            return await apiHelper.get(`${API_ENDPOINTS.ORDERS.BASE}/restaurant/${restaurantId}`);
        }
        // If no restaurantId provided, call the generic endpoint (may not exist)
        const queryString = buildQueryString({});
        const url = queryString
            ? `${API_ENDPOINTS.ORDERS.RESTAURANT}?${queryString}`
            : API_ENDPOINTS.ORDERS.RESTAURANT;
        return await apiHelper.get(url);
    },

    // Get agent orders
    getAgentOrders: async (params = {}) => {
        const queryString = buildQueryString(params);
        const url = queryString
            ? `${API_ENDPOINTS.ORDERS.AGENT}?${queryString}`
            : API_ENDPOINTS.ORDERS.AGENT;
        return await apiHelper.get(url);
    },

    // Track order
    track: async (id) => {
        return await apiHelper.get(API_ENDPOINTS.ORDERS.TRACK(id));
    },

    // Update order status
    updateStatus: async (id, status) => {
        return await apiHelper.patch(API_ENDPOINTS.ORDERS.BY_ID(id), { status });
    },

    // Cancel order
    cancel: async (id, reason) => {
        return await apiHelper.post(API_ENDPOINTS.ORDERS.CANCEL(id), { reason });
    },

    // Rate order
    rate: async (id, rating, review) => {
        return await apiHelper.post(`${API_ENDPOINTS.ORDERS.BY_ID(id)}/rate`, {
            rating,
            review,
        });
    },
};

export default orderService;
