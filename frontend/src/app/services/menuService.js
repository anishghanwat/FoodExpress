import { apiHelper } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { buildQueryString } from '../utils/helpers';

const menuService = {
    // Get menu items by restaurant ID
    getByRestaurantId: async (restaurantId) => {
        return await apiHelper.get(`${API_ENDPOINTS.MENUS.BASE}/restaurant/${restaurantId}`);
    },

    // Get menu item by ID
    getById: async (id) => {
        return await apiHelper.get(API_ENDPOINTS.MENUS.BY_ID(id));
    },

    // Search menu items
    search: async (query, filters = {}) => {
        const params = { query, ...filters };
        const queryString = buildQueryString(params);
        return await apiHelper.get(`${API_ENDPOINTS.MENUS.ITEMS}?${queryString}`);
    },

    // Get menu categories
    getCategories: async () => {
        return await apiHelper.get(API_ENDPOINTS.MENUS.CATEGORIES);
    },

    // Create menu item (owner)
    create: async (menuItemData) => {
        return await apiHelper.post(API_ENDPOINTS.MENUS.BASE, menuItemData);
    },

    // Update menu item (owner)
    update: async (id, menuItemData) => {
        return await apiHelper.put(API_ENDPOINTS.MENUS.BY_ID(id), menuItemData);
    },

    // Delete menu item (owner)
    delete: async (id) => {
        return await apiHelper.delete(API_ENDPOINTS.MENUS.BY_ID(id));
    },

    // Upload menu item image
    uploadImage: async (id, file, onProgress) => {
        return await apiHelper.upload(`${API_ENDPOINTS.MENUS.BY_ID(id)}/image`, file, onProgress);
    },

    // Toggle availability
    toggleAvailability: async (id) => {
        return await apiHelper.patch(`${API_ENDPOINTS.MENUS.BY_ID(id)}/availability`);
    },
};

export default menuService;
