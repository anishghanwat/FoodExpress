import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import websocketService from '../services/websocketService';
import notificationApiService from '../services/notificationApiService';
import { toast } from 'sonner';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user, token } = useAuth();

    // Fetch notifications from API
    const fetchNotifications = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        try {
            const data = await notificationApiService.getNotifications(user.id, 0, 20);
            setNotifications(data.content || []);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Fetch unread count
    const fetchUnreadCount = useCallback(async () => {
        if (!user) return;

        try {
            const data = await notificationApiService.getUnreadCount(user.id);
            setUnreadCount(data.unreadCount || 0);
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    }, [user]);

    // Handle new notification from WebSocket
    const handleNewNotification = useCallback((event) => {
        const notification = event.detail;
        console.log('New notification received:', notification);

        // Add to notifications list
        setNotifications(prev => [notification, ...prev]);

        // Increment unread count
        setUnreadCount(prev => prev + 1);

        // Show toast notification
        showToast(notification);
    }, []);

    // Show toast notification
    const showToast = (notification) => {
        const toastOptions = {
            duration: 5000,
            action: notification.relatedEntityId ? {
                label: 'View',
                onClick: () => handleNotificationClick(notification)
            } : undefined
        };

        switch (notification.category) {
            case 'SUCCESS':
                toast.success(notification.title, {
                    description: notification.message,
                    ...toastOptions
                });
                break;
            case 'ERROR':
                toast.error(notification.title, {
                    description: notification.message,
                    ...toastOptions
                });
                break;
            case 'WARNING':
                toast.warning(notification.title, {
                    description: notification.message,
                    ...toastOptions
                });
                break;
            default:
                toast.info(notification.title, {
                    description: notification.message,
                    ...toastOptions
                });
        }
    };

    // Handle notification click
    const handleNotificationClick = (notification) => {
        // Mark as read
        if (!notification.isRead) {
            markAsRead(notification.id);
        }

        // Navigate based on type
        if (notification.relatedEntityType === 'ORDER' && notification.relatedEntityId) {
            window.location.href = `/order-tracking/${notification.relatedEntityId}`;
        }
    };

    // Mark notification as read
    const markAsRead = async (notificationId) => {
        try {
            await notificationApiService.markAsRead(notificationId);

            // Update local state
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
            );

            // Decrement unread count
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        if (!user) return;

        try {
            await notificationApiService.markAllAsRead(user.id);

            // Update local state
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);

            toast.success('All notifications marked as read');
        } catch (error) {
            console.error('Failed to mark all as read:', error);
            toast.error('Failed to mark all as read');
        }
    };

    // Delete notification
    const deleteNotification = async (notificationId) => {
        try {
            await notificationApiService.deleteNotification(notificationId);

            // Update local state
            setNotifications(prev => prev.filter(n => n.id !== notificationId));

            toast.success('Notification deleted');
        } catch (error) {
            console.error('Failed to delete notification:', error);
            toast.error('Failed to delete notification');
        }
    };

    // WebSocket connection management
    useEffect(() => {
        if (user && token) {
            console.log('Initializing notifications for user:', user.id);

            // Connect to WebSocket
            websocketService.connect(user.id, token);

            // Fetch initial data
            fetchNotifications();
            fetchUnreadCount();

            // Listen for WebSocket events
            const handleConnection = () => setConnected(true);
            const handleError = () => setConnected(false);
            const handleReconnectFailed = () => {
                setConnected(false);
                toast.error('Failed to connect to notification service');
            };

            window.addEventListener('websocket-connected', handleConnection);
            window.addEventListener('websocket-error', handleError);
            window.addEventListener('websocket-reconnect-failed', handleReconnectFailed);

            // Listen for notification events
            window.addEventListener('notification', handleNewNotification);
            window.addEventListener('orderUpdate', handleNewNotification);
            window.addEventListener('paymentUpdate', handleNewNotification);
            window.addEventListener('deliveryUpdate', handleNewNotification);

            return () => {
                // Cleanup
                websocketService.disconnect();
                setConnected(false);

                window.removeEventListener('websocket-connected', handleConnection);
                window.removeEventListener('websocket-error', handleError);
                window.removeEventListener('websocket-reconnect-failed', handleReconnectFailed);
                window.removeEventListener('notification', handleNewNotification);
                window.removeEventListener('orderUpdate', handleNewNotification);
                window.removeEventListener('paymentUpdate', handleNewNotification);
                window.removeEventListener('deliveryUpdate', handleNewNotification);
            };
        }
    }, [user, token, fetchNotifications, fetchUnreadCount, handleNewNotification]);

    const value = {
        notifications,
        unreadCount,
        connected,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refreshNotifications: fetchNotifications,
        refreshUnreadCount: fetchUnreadCount
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
