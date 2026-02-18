// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Food Delivery System';

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        LOGOUT: '/api/auth/logout',
        REFRESH: '/api/auth/refresh',
        FORGOT_PASSWORD: '/api/auth/forgot-password',
        RESET_PASSWORD: '/api/auth/reset-password',
        VERIFY_EMAIL: '/api/auth/verify-email',
    },
    USERS: {
        BASE: '/api/users',
        PROFILE: '/api/users/profile',
        UPDATE: '/api/users/profile',
        ADDRESSES: '/api/users/addresses',
    },
    RESTAURANTS: {
        BASE: '/api/restaurants',
        SEARCH: '/api/restaurants/search',
        FEATURED: '/api/restaurants/featured',
        BY_ID: (id) => `/api/restaurants/${id}`,
        MENU: (id) => `/api/restaurants/${id}/menu`,
        REVIEWS: (id) => `/api/restaurants/${id}/reviews`,
    },
    MENUS: {
        BASE: '/api/menu',
        BY_ID: (id) => `/api/menu/${id}`,
        CATEGORIES: '/api/menu/categories',
        ITEMS: '/api/menu/items',
    },
    ORDERS: {
        BASE: '/api/orders',
        BY_ID: (id) => `/api/orders/${id}`,
        CUSTOMER: '/api/orders/customer',
        RESTAURANT: '/api/orders/restaurant',
        AGENT: '/api/orders/agent',
        TRACK: (id) => `/api/orders/${id}/track`,
        CANCEL: (id) => `/api/orders/${id}/cancel`,
    },
    PAYMENTS: {
        BASE: '/api/payments',
        PROCESS: '/api/payments/process',
        METHODS: '/api/payments/methods',
        HISTORY: '/api/payments/history',
    },
    DELIVERY: {
        BASE: '/api/deliveries',
        AVAILABLE: '/api/deliveries/available',
        ACTIVE: '/api/deliveries/active',
        HISTORY: '/api/deliveries/history',
        ACCEPT: (id) => `/api/deliveries/${id}/accept`,
        COMPLETE: (id) => `/api/deliveries/${id}/complete`,
        LOCATION: (id) => `/api/deliveries/${id}/location`,
        UPDATE_LOCATION: (id) => `/api/deliveries/${id}/location`,
    },
    NOTIFICATIONS: {
        BASE: '/api/notifications',
        UNREAD: '/api/notifications/unread',
        MARK_READ: (id) => `/api/notifications/${id}/read`,
    },
    ADMIN: {
        USERS: '/api/admin/users',
        RESTAURANTS: '/api/admin/restaurants',
        ORDERS: '/api/admin/orders',
        ANALYTICS: '/api/admin/analytics',
    },
};

export const USER_ROLES = {
    CUSTOMER: 'CUSTOMER',
    RESTAURANT_OWNER: 'RESTAURANT_OWNER',
    DELIVERY_AGENT: 'DELIVERY_AGENT',
    ADMIN: 'ADMIN',
};

export const ORDER_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    PREPARING: 'PREPARING',
    READY: 'READY',
    PICKED_UP: 'PICKED_UP',
    ON_THE_WAY: 'ON_THE_WAY',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
};

export const ORDER_STATUS_LABELS = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    PREPARING: 'Preparing',
    READY: 'Ready for Pickup',
    PICKED_UP: 'Picked Up',
    ON_THE_WAY: 'On the Way',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
};

export const ORDER_STATUS_COLORS = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PREPARING: 'bg-purple-100 text-purple-800',
    READY: 'bg-indigo-100 text-indigo-800',
    PICKED_UP: 'bg-cyan-100 text-cyan-800',
    ON_THE_WAY: 'bg-orange-100 text-orange-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
};

export const PAYMENT_METHODS = {
    CARD: 'CARD',
    WALLET: 'WALLET',
    CASH: 'CASH',
    UPI: 'UPI',
};

export const PAYMENT_STATUS = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
};

export const DELIVERY_STATUS = {
    ASSIGNED: 'ASSIGNED',
    ACCEPTED: 'ACCEPTED',
    PICKED_UP: 'PICKED_UP',
    ON_THE_WAY: 'ON_THE_WAY',
    DELIVERED: 'DELIVERED',
};

export const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user_data',
    CART: 'shopping_cart',
    THEME: 'theme_preference',
};

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

export const VALIDATION = {
    PASSWORD_MIN_LENGTH: 8,
    PHONE_REGEX: /^[0-9]{10}$/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PIN_CODE_REGEX: /^[0-9]{6}$/,
};

export const TOAST_DURATION = {
    SUCCESS: 3000,
    ERROR: 5000,
    INFO: 3000,
    WARNING: 4000,
};

export const IMAGE_UPLOAD = {
    MAX_SIZE: 5 * 1024 * 1024,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
};

export const DEBOUNCE_DELAY = 500;

export const MAP_CONFIG = {
    DEFAULT_CENTER: { lat: 28.6139, lng: 77.2090 },
    DEFAULT_ZOOM: 12,
};
