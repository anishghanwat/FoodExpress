import { apiHelper } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { buildQueryString } from '../utils/helpers';

const adminService = {
    // User Management
    users: {
        getAll: async (params = {}) => {
            const queryString = buildQueryString(params);
            const url = queryString ? `${API_ENDPOINTS.ADMIN.USERS}?${queryString}` : API_ENDPOINTS.ADMIN.USERS;
            return await apiHelper.get(url);
        },

        getById: async (id) => {
            return await apiHelper.get(`${API_ENDPOINTS.ADMIN.USERS}/${id}`);
        },

        update: async (id, userData) => {
            return await apiHelper.put(`${API_ENDPOINTS.ADMIN.USERS}/${id}`, userData);
        },

        delete: async (id) => {
            return await apiHelper.delete(`${API_ENDPOINTS.ADMIN.USERS}/${id}`);
        },

        suspend: async (id, reason) => {
            return await apiHelper.post(`${API_ENDPOINTS.ADMIN.USERS}/${id}/suspend`, { reason });
        },

        activate: async (id) => {
            return await apiHelper.post(`${API_ENDPOINTS.ADMIN.USERS}/${id}/activate`);
        },
    },

    // Restaurant Management
    restaurants: {
        getAll: async (params = {}) => {
            const queryString = buildQueryString(params);
            const url = queryString ? `${API_ENDPOINTS.ADMIN.RESTAURANTS}?${queryString}` : API_ENDPOINTS.ADMIN.RESTAURANTS;
            return await apiHelper.get(url);
        },

        getById: async (id) => {
            return await apiHelper.get(`${API_ENDPOINTS.ADMIN.RESTAURANTS}/${id}`);
        },

        approve: async (id) => {
            return await apiHelper.post(`${API_ENDPOINTS.ADMIN.RESTAURANTS}/${id}/approve`);
        },

        reject: async (id, reason) => {
            return await apiHelper.post(`${API_ENDPOINTS.ADMIN.RESTAURANTS}/${id}/reject`, { reason });
        },

        suspend: async (id, reason) => {
            return await apiHelper.post(`${API_ENDPOINTS.ADMIN.RESTAURANTS}/${id}/suspend`, { reason });
        },

        activate: async (id) => {
            return await apiHelper.post(`${API_ENDPOINTS.ADMIN.RESTAURANTS}/${id}/activate`);
        },

        delete: async (id) => {
            return await apiHelper.delete(`${API_ENDPOINTS.ADMIN.RESTAURANTS}/${id}`);
        },
    },

    // Order Management
    orders: {
        getAll: async (params = {}) => {
            const queryString = buildQueryString(params);
            const url = queryString ? `${API_ENDPOINTS.ADMIN.ORDERS}?${queryString}` : API_ENDPOINTS.ADMIN.ORDERS;
            return await apiHelper.get(url);
        },

        getById: async (id) => {
            return await apiHelper.get(`${API_ENDPOINTS.ADMIN.ORDERS}/${id}`);
        },

        updateStatus: async (id, status) => {
            return await apiHelper.put(`${API_ENDPOINTS.ADMIN.ORDERS}/${id}/status`, { status });
        },

        cancel: async (id, reason) => {
            return await apiHelper.post(`${API_ENDPOINTS.ADMIN.ORDERS}/${id}/cancel`, { reason });
        },

        refund: async (id, refundData) => {
            return await apiHelper.post(`${API_ENDPOINTS.ADMIN.ORDERS}/${id}/refund`, refundData);
        },
    },

    // Analytics
    analytics: {
        getDashboard: async () => {
            return await apiHelper.get(API_ENDPOINTS.ADMIN.ANALYTICS);
        },

        getRevenue: async (params = {}) => {
            const queryString = buildQueryString(params);
            const url = queryString
                ? `${API_ENDPOINTS.ADMIN.ANALYTICS}/revenue?${queryString}`
                : `${API_ENDPOINTS.ADMIN.ANALYTICS}/revenue`;
            return await apiHelper.get(url);
        },

        getOrders: async (params = {}) => {
            const queryString = buildQueryString(params);
            const url = queryString
                ? `${API_ENDPOINTS.ADMIN.ANALYTICS}/orders?${queryString}`
                : `${API_ENDPOINTS.ADMIN.ANALYTICS}/orders`;
            return await apiHelper.get(url);
        },

        getUsers: async (params = {}) => {
            const queryString = buildQueryString(params);
            const url = queryString
                ? `${API_ENDPOINTS.ADMIN.ANALYTICS}/users?${queryString}`
                : `${API_ENDPOINTS.ADMIN.ANALYTICS}/users`;
            return await apiHelper.get(url);
        },

        getRestaurants: async (params = {}) => {
            const queryString = buildQueryString(params);
            const url = queryString
                ? `${API_ENDPOINTS.ADMIN.ANALYTICS}/restaurants?${queryString}`
                : `${API_ENDPOINTS.ADMIN.ANALYTICS}/restaurants`;
            return await apiHelper.get(url);
        },
    },
};

export default adminService;
