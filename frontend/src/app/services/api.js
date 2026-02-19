import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import storage from '../utils/storage';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add auth token to headers
        const token = storage.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add user ID to headers for backend services that need it
        let userId = null;

        // Try to get user from storage
        const user = storage.getUser();
        if (user && user.id) {
            userId = user.id;
        } else {
            // Fallback: try to get from sessionStorage directly
            try {
                const userData = sessionStorage.getItem('user_data');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    if (parsedUser && parsedUser.id) {
                        userId = parsedUser.id;
                    }
                }
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }

        if (userId) {
            config.headers['X-User-Id'] = userId;
        } else {
            console.warn('⚠️ No user ID found for request:', config.url);
            console.log('Storage user:', storage.getUser());
            console.log('sessionStorage user_data:', sessionStorage.getItem('user_data'));
        }

        // Log request in development
        if (import.meta.env.DEV) {
            console.log('🚀 Request:', config.method.toUpperCase(), config.url);
            console.log('Headers:', {
                Authorization: config.headers.Authorization ? 'Bearer ***' : 'none',
                'X-User-Id': config.headers['X-User-Id'] || 'MISSING'
            });
        }

        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // Log response in development
        if (import.meta.env.DEV) {
            console.log('✅ Response:', response.config.url, response.data);
        }

        // Handle backend response format: {success, data, message, timestamp}
        if (response.data && typeof response.data === 'object') {
            // If backend returns {success, data, message}, extract the data
            if ('success' in response.data && 'data' in response.data) {
                // Extract the data for all endpoints (including auth)
                response.data._originalResponse = { ...response.data };
                return { ...response, data: response.data.data, _meta: response.data };
            }
        }

        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Log error in development
        if (import.meta.env.DEV) {
            console.error('❌ Error:', error.response?.status, error.config.url);
        }

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token
                const refreshToken = storage.getRefreshToken();
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
                        refreshToken,
                    });

                    const { token } = response.data;
                    storage.setToken(token);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, logout user
                storage.clearAuth();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';

        // Don't show toast for certain errors
        const silentErrors = [401, 404];
        if (!silentErrors.includes(error.response?.status)) {
            toast.error(errorMessage);
        }

        return Promise.reject(error);
    }
);

// API helper methods
export const apiHelper = {
    // GET request
    get: async (url, config = {}) => {
        try {
            const response = await api.get(url, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // POST request
    post: async (url, data = {}, config = {}) => {
        try {
            const response = await api.post(url, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // PUT request
    put: async (url, data = {}, config = {}) => {
        try {
            const response = await api.put(url, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // PATCH request
    patch: async (url, data = {}, config = {}) => {
        try {
            const response = await api.patch(url, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // DELETE request
    delete: async (url, config = {}) => {
        try {
            const response = await api.delete(url, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Upload file
    upload: async (url, file, onProgress) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        onProgress(percentCompleted);
                    }
                },
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default api;
