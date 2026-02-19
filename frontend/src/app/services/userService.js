import { apiHelper } from './api';
import { API_ENDPOINTS } from '../utils/constants';

const userService = {
    // Get user profile
    getProfile: async () => {
        return await apiHelper.get(API_ENDPOINTS.USERS.PROFILE);
    },

    // Get user by ID (public/admin)
    getById: async (id) => {
        return await apiHelper.get(`${API_ENDPOINTS.USERS.BASE}/${id}`);
    },

    // Update user profile
    updateProfile: async (userData) => {
        return await apiHelper.put(API_ENDPOINTS.USERS.UPDATE, userData);
    },

    // Get user addresses
    getAddresses: async () => {
        return await apiHelper.get(API_ENDPOINTS.USERS.ADDRESSES);
    },

    // Add address
    addAddress: async (address) => {
        return await apiHelper.post(API_ENDPOINTS.USERS.ADDRESSES, address);
    },

    // Update address
    updateAddress: async (addressId, address) => {
        return await apiHelper.put(`${API_ENDPOINTS.USERS.ADDRESSES}/${addressId}`, address);
    },

    // Delete address
    deleteAddress: async (addressId) => {
        return await apiHelper.delete(`${API_ENDPOINTS.USERS.ADDRESSES}/${addressId}`);
    },

    // Upload profile picture
    uploadProfilePicture: async (file, onProgress) => {
        return await apiHelper.upload(`${API_ENDPOINTS.USERS.PROFILE}/picture`, file, onProgress);
    },
};

export default userService;
