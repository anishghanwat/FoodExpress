import { apiHelper } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { buildQueryString } from '../utils/helpers';

const notificationService = {
    // Get all notifications
    getAll: async (params = {}) => {
        const queryString = buildQueryString(params);
        const url = queryString ? `${API_ENDPOINTS.NOTIFICATIONS.BASE}?${queryString}` : API_ENDPOINTS.NOTIFICATIONS.BASE;
        return await apiHelper.get(url);
    },

    // Get unread notifications
    getUnread: async () => {
        return await apiHelper.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD);
    },

    // Mark notification as read
    markAsRead: async (id) => {
        return await apiHelper.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
    },

    // Mark all as read
    markAllAsRead: async () => {
        return await apiHelper.put(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/read-all`);
    },

    // Delete notification
    delete: async (id) => {
        return await apiHelper.delete(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/${id}`);
    },

    // Send notification (admin)
    send: async (notificationData) => {
        return await apiHelper.post(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/send`, notificationData);
    },
};

export default notificationService;
