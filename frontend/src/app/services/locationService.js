import { apiHelper } from './api';
import { API_ENDPOINTS } from '../utils/constants';

const locationService = {
    /**
     * Update agent's current location
     * @param {number} deliveryId - Delivery ID
     * @param {number} latitude - Current latitude
     * @param {number} longitude - Current longitude
     * @returns {Promise} Updated delivery data
     */
    updateAgentLocation: async (deliveryId, latitude, longitude) => {
        return await apiHelper.post(
            `${API_ENDPOINTS.DELIVERY.BASE}/${deliveryId}/location`,
            { latitude, longitude }
        );
    },

    /**
     * Get delivery with location data
     * @param {number} deliveryId - Delivery ID
     * @returns {Promise} Delivery with location data
     */
    getDeliveryLocation: async (deliveryId) => {
        return await apiHelper.get(
            `${API_ENDPOINTS.DELIVERY.BASE}/${deliveryId}/location`
        );
    },

    /**
     * Start tracking agent's location using browser Geolocation API
     * @param {Function} onLocationUpdate - Callback when location updates
     * @param {Function} onError - Callback on error
     * @returns {number} Watch ID for stopping tracking
     */
    startLocationTracking: (onLocationUpdate, onError) => {
        if (!navigator.geolocation) {
            onError(new Error('Geolocation is not supported by your browser'));
            return null;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                onLocationUpdate({ latitude, longitude, accuracy });
            },
            (error) => {
                console.error('Geolocation error:', error);
                onError(error);
            },
            options
        );

        return watchId;
    },

    /**
     * Stop tracking agent's location
     * @param {number} watchId - Watch ID from startLocationTracking
     */
    stopLocationTracking: (watchId) => {
        if (watchId && navigator.geolocation) {
            navigator.geolocation.clearWatch(watchId);
        }
    },

    /**
     * Get current location once
     * @returns {Promise} Current location {latitude, longitude, accuracy}
     */
    getCurrentLocation: () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude, accuracy } = position.coords;
                    resolve({ latitude, longitude, accuracy });
                },
                (error) => {
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    },

    /**
     * Check if geolocation is available
     * @returns {boolean} True if geolocation is supported
     */
    isGeolocationAvailable: () => {
        return 'geolocation' in navigator;
    },

    /**
     * Request location permission
     * @returns {Promise} Permission status
     */
    requestLocationPermission: async () => {
        if (!navigator.permissions) {
            return 'unsupported';
        }

        try {
            const result = await navigator.permissions.query({ name: 'geolocation' });
            return result.state; // 'granted', 'denied', or 'prompt'
        } catch (error) {
            console.error('Error checking location permission:', error);
            return 'error';
        }
    }
};

export default locationService;
