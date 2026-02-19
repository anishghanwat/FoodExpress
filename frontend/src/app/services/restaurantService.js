import { apiHelper } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { buildQueryString } from '../utils/helpers';

const restaurantService = {
    // Get all restaurants
    getAll: async (params = {}) => {
        const queryString = buildQueryString(params);
        const url = queryString ? `${API_ENDPOINTS.RESTAURANTS.BASE}?${queryString}` : API_ENDPOINTS.RESTAURANTS.BASE;
        return await apiHelper.get(url);
    },

    // Search restaurants
    search: async (query, filters = {}) => {
        const params = { query, ...filters };
        const queryString = buildQueryString(params);
        return await apiHelper.get(`${API_ENDPOINTS.RESTAURANTS.SEARCH}?${queryString}`);
    },

    // Get featured restaurants
    getFeatured: async () => {
        return await apiHelper.get(API_ENDPOINTS.RESTAURANTS.FEATURED);
    },

    // Get restaurant by ID
    getById: async (id) => {
        return await apiHelper.get(API_ENDPOINTS.RESTAURANTS.BY_ID(id));
    },

    // Get owner's restaurants
    getOwnerRestaurants: async (ownerId) => {
        return await apiHelper.get(`/api/restaurants/owner/${ownerId}`);
    },

    // Get restaurant menu
    getMenu: async (id) => {
        return await apiHelper.get(API_ENDPOINTS.RESTAURANTS.MENU(id));
    },

    // Get restaurant reviews
    getReviews: async (id, params = {}) => {
        const queryString = buildQueryString(params);
        const url = queryString
            ? `${API_ENDPOINTS.RESTAURANTS.REVIEWS(id)}?${queryString}`
            : API_ENDPOINTS.RESTAURANTS.REVIEWS(id);
        return await apiHelper.get(url);
    },

    // Add review
    addReview: async (restaurantId, review) => {
        return await apiHelper.post(API_ENDPOINTS.RESTAURANTS.REVIEWS(restaurantId), review);
    },

    // Create restaurant (owner)
    create: async (restaurantData) => {
        return await apiHelper.post(API_ENDPOINTS.RESTAURANTS.BASE, restaurantData);
    },

    // Update restaurant (owner)
    update: async (id, restaurantData) => {
        return await apiHelper.put(API_ENDPOINTS.RESTAURANTS.BY_ID(id), restaurantData);
    },

    // Delete restaurant (owner/admin)
    delete: async (id) => {
        return await apiHelper.delete(API_ENDPOINTS.RESTAURANTS.BY_ID(id));
    },

    // Upload restaurant image
    uploadImage: async (id, file, onProgress) => {
        return await apiHelper.upload(`${API_ENDPOINTS.RESTAURANTS.BY_ID(id)}/image`, file, onProgress);
    },
};

export default restaurantService;
