import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.connected = false;
        this.subscriptions = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
    }

    connect(userId, token) {
        if (this.connected) {
            console.log('WebSocket already connected');
            return;
        }

        console.log('Connecting to WebSocket for user:', userId);

        try {
            const socket = new SockJS('http://localhost:8086/ws/notifications');
            this.stompClient = Stomp.over(socket);

            // Disable debug logging in production
            this.stompClient.debug = (str) => {
                if (process.env.NODE_ENV === 'development') {
                    console.log('STOMP:', str);
                }
            };

            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            this.stompClient.connect(
                headers,
                () => this.onConnected(userId),
                (error) => this.onError(error, userId, token)
            );
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            this.scheduleReconnect(userId, token);
        }
    }

    onConnected(userId) {
        this.connected = true;
        this.reconnectAttempts = 0;
        console.log('✓ WebSocket connected for user:', userId);

        // Subscribe to user-specific channels
        this.subscribe(`/user/${userId}/queue/notifications`, this.handleNotification);
        this.subscribe(`/user/${userId}/queue/orders`, this.handleOrderUpdate);
        this.subscribe(`/user/${userId}/queue/payments`, this.handlePaymentUpdate);
        this.subscribe(`/user/${userId}/queue/deliveries`, this.handleDeliveryUpdate);

        // Dispatch connection event
        window.dispatchEvent(new CustomEvent('websocket-connected', { detail: { userId } }));
    }

    onError(error, userId, token) {
        console.error('WebSocket connection error:', error);
        this.connected = false;

        // Dispatch error event
        window.dispatchEvent(new CustomEvent('websocket-error', { detail: { error } }));

        // Attempt to reconnect
        this.scheduleReconnect(userId, token);
    }

    scheduleReconnect(userId, token) {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Reconnecting in ${this.reconnectDelay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

            setTimeout(() => {
                this.connect(userId, token);
            }, this.reconnectDelay);
        } else {
            console.error('Max reconnection attempts reached');
            window.dispatchEvent(new CustomEvent('websocket-reconnect-failed'));
        }
    }

    subscribe(destination, callback) {
        if (this.stompClient && this.connected) {
            try {
                const subscription = this.stompClient.subscribe(destination, callback);
                this.subscriptions.set(destination, subscription);
                console.log('✓ Subscribed to:', destination);
            } catch (error) {
                console.error('Failed to subscribe to', destination, error);
            }
        }
    }

    disconnect() {
        if (this.stompClient) {
            console.log('Disconnecting WebSocket...');

            // Unsubscribe from all channels
            this.subscriptions.forEach((subscription, destination) => {
                try {
                    subscription.unsubscribe();
                    console.log('Unsubscribed from:', destination);
                } catch (error) {
                    console.error('Error unsubscribing from', destination, error);
                }
            });
            this.subscriptions.clear();

            // Disconnect
            try {
                this.stompClient.disconnect(() => {
                    console.log('✓ WebSocket disconnected');
                });
            } catch (error) {
                console.error('Error disconnecting:', error);
            }

            this.connected = false;
            this.stompClient = null;
        }
    }

    handleNotification(message) {
        try {
            const notification = JSON.parse(message.body);
            console.log('📬 Received notification:', notification);
            window.dispatchEvent(new CustomEvent('notification', { detail: notification }));
        } catch (error) {
            console.error('Error parsing notification:', error);
        }
    }

    handleOrderUpdate(message) {
        try {
            const notification = JSON.parse(message.body);
            console.log('📦 Order update:', notification);
            window.dispatchEvent(new CustomEvent('orderUpdate', { detail: notification }));
        } catch (error) {
            console.error('Error parsing order update:', error);
        }
    }

    handlePaymentUpdate(message) {
        try {
            const notification = JSON.parse(message.body);
            console.log('💳 Payment update:', notification);
            window.dispatchEvent(new CustomEvent('paymentUpdate', { detail: notification }));
        } catch (error) {
            console.error('Error parsing payment update:', error);
        }
    }

    handleDeliveryUpdate(message) {
        try {
            const notification = JSON.parse(message.body);
            console.log('🚚 Delivery update:', notification);
            window.dispatchEvent(new CustomEvent('deliveryUpdate', { detail: notification }));
        } catch (error) {
            console.error('Error parsing delivery update:', error);
        }
    }

    isConnected() {
        return this.connected;
    }
}

export default new WebSocketService();
