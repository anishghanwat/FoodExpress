import { apiHelper } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import storage from '../utils/storage';

const authService = {
    // Login
    login: async (credentials) => {
        const response = await apiHelper.post(API_ENDPOINTS.AUTH.LOGIN, credentials);

        console.log('Auth response:', response);

        // apiHelper already extracts data, so response is the AuthResponse directly
        // Response structure after api.js processing: {token, refreshToken, user}
        if (response.token) {
            storage.setToken(response.token);
        }
        if (response.refreshToken) {
            storage.setRefreshToken(response.refreshToken);
        }
        if (response.user) {
            storage.setUser(response.user);
            console.log('User stored:', response.user);
        } else {
            console.error('No user in response!', response);
        }

        return response;
    },

    // Register
    register: async (userData) => {
        const response = await apiHelper.post(API_ENDPOINTS.AUTH.REGISTER, userData);

        console.log('Register response:', response);

        // apiHelper already extracts data, so response is the AuthResponse directly
        // Response structure after api.js processing: {token, refreshToken, user}
        if (response.token) {
            storage.setToken(response.token);
        }
        if (response.refreshToken) {
            storage.setRefreshToken(response.refreshToken);
        }
        if (response.user) {
            storage.setUser(response.user);
            console.log('User stored:', response.user);
        } else {
            console.error('No user in response!', response);
        }

        return response;
    },

    // Logout
    logout: async () => {
        try {
            await apiHelper.post(API_ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            storage.clearAuth();
            storage.removeCart();
        }
    },

    // Refresh token
    refreshToken: async () => {
        const refreshToken = storage.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await apiHelper.post(API_ENDPOINTS.AUTH.REFRESH, {
            refreshToken,
        });

        if (response.token) {
            storage.setToken(response.token);
        }

        return response;
    },

    // Forgot password
    forgotPassword: async (email) => {
        return await apiHelper.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    },

    // Reset password
    resetPassword: async (token, newPassword) => {
        return await apiHelper.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
            token,
            newPassword,
        });
    },

    // Verify email
    verifyEmail: async (token) => {
        return await apiHelper.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
    },

    // Get current user
    getCurrentUser: () => {
        return storage.getUser();
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!storage.getToken();
    },

    // Get user role
    getUserRole: () => {
        const user = storage.getUser();
        return user?.role || null;
    },
};

export default authService;
