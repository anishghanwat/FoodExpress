import api from './api';

const NOTIFICATION_BASE_URL = 'http://localhost:8086/api/notifications';

export const notificationApiService = {
    /**
     * Get user notifications (paginated)
     */
    async getNotifications(userId, page = 0, size = 20) {
        try {
            const response = await fetch(
                `${NOTIFICATION_BASE_URL}?userId=${userId}&page=${page}&size=${size}`
            );
            if (!response.ok) throw new Error('Failed to fetch notifications');
            return await response.json();
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    },

    /**
     * Get unread notifications
     */
    async getUnreadNotifications(userId) {
        try {
            const response = await fetch(
                `${NOTIFICATION_BASE_URL}/unread?userId=${userId}`
            );
            if (!response.ok) throw new Error('Failed to fetch unread notifications');
            return await response.json();
        } catch (error) {
            console.error('Error fetching unread notifications:', error);
            throw error;
        }
    },

    /**
     * Get unread count
     */
    async getUnreadCount(userId) {
        try {
            const response = await fetch(
                `${NOTIFICATION_BASE_URL}/count?userId=${userId}`
            );
            if (!response.ok) throw new Error('Failed to fetch unread count');
            return await response.json();
        } catch (error) {
            console.error('Error fetching unread count:', error);
            throw error;
        }
    },

    /**
     * Mark notification as read
     */
    async markAsRead(notificationId) {
        try {
            const response = await fetch(
                `${NOTIFICATION_BASE_URL}/${notificationId}/read`,
                { method: 'PUT' }
            );
            if (!response.ok) throw new Error('Failed to mark as read');
            return await response.json();
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    },

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(userId) {
        try {
            const response = await fetch(
                `${NOTIFICATION_BASE_URL}/read-all?userId=${userId}`,
                { method: 'PUT' }
            );
            if (!response.ok) throw new Error('Failed to mark all as read');
            return await response.json();
        } catch (error) {
            console.error('Error marking all as read:', error);
            throw error;
        }
    },

    /**
     * Delete notification
     */
    async deleteNotification(notificationId) {
        try {
            const response = await fetch(
                `${NOTIFICATION_BASE_URL}/${notificationId}`,
                { method: 'DELETE' }
            );
            if (!response.ok) throw new Error('Failed to delete notification');
            return await response.json();
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    }
};

export default notificationApiService;
