// Map utility functions for distance calculation and location helpers

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number} Radians
 */
function toRad(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Calculate ETA based on distance
 * @param {number} distanceKm - Distance in kilometers
 * @param {number} avgSpeedKmh - Average speed in km/h (default: 30)
 * @returns {number} Time in minutes
 */
export function calculateETA(distanceKm, avgSpeedKmh = 30) {
    const timeHours = distanceKm / avgSpeedKmh;
    const timeMinutes = Math.ceil(timeHours * 60);
    return timeMinutes;
}

/**
 * Format distance for display
 * @param {number} distanceKm - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export function formatDistance(distanceKm) {
    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)} m`;
    }
    return `${distanceKm.toFixed(1)} km`;
}

/**
 * Format ETA for display
 * @param {number} minutes - Time in minutes
 * @returns {string} Formatted ETA string
 */
export function formatETA(minutes) {
    if (minutes < 1) {
        return 'Less than 1 min';
    }
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

/**
 * Get center point between multiple coordinates
 * @param {Array} coordinates - Array of [lat, lng] pairs
 * @returns {Array} Center point [lat, lng]
 */
export function getCenterPoint(coordinates) {
    if (!coordinates || coordinates.length === 0) {
        return [0, 0];
    }

    if (coordinates.length === 1) {
        return coordinates[0];
    }

    let sumLat = 0;
    let sumLng = 0;

    coordinates.forEach(([lat, lng]) => {
        sumLat += lat;
        sumLng += lng;
    });

    return [sumLat / coordinates.length, sumLng / coordinates.length];
}

/**
 * Get bounds for multiple coordinates
 * @param {Array} coordinates - Array of [lat, lng] pairs
 * @returns {Array} Bounds [[minLat, minLng], [maxLat, maxLng]]
 */
export function getBounds(coordinates) {
    if (!coordinates || coordinates.length === 0) {
        return null;
    }

    let minLat = coordinates[0][0];
    let maxLat = coordinates[0][0];
    let minLng = coordinates[0][1];
    let maxLng = coordinates[0][1];

    coordinates.forEach(([lat, lng]) => {
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
    });

    return [[minLat, minLng], [maxLat, maxLng]];
}

/**
 * Default map center (New York City)
 */
export const DEFAULT_MAP_CENTER = [40.7128, -74.0060];

/**
 * Default map zoom level
 */
export const DEFAULT_MAP_ZOOM = 13;

/**
 * Map tile layer URLs (with fallback options)
 * If OpenStreetMap is blocked or slow, try alternative providers
 */

// Primary: OpenStreetMap (free, no API key)
export const MAP_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Alternative 1: CartoDB Positron (lighter, faster)
export const MAP_TILE_URL_CARTO = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
export const MAP_ATTRIBUTION_CARTO = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// Alternative 2: Stamen Terrain (good for delivery routes)
export const MAP_TILE_URL_STAMEN = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png';
export const MAP_ATTRIBUTION_STAMEN = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Alternative 3: Esri WorldStreetMap (reliable, fast)
export const MAP_TILE_URL_ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
export const MAP_ATTRIBUTION_ESRI = 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012';

/**
 * Get the active tile configuration
 * Change this to switch between providers
 */
export function getActiveTileConfig() {
    // Try CartoDB first (usually faster and more reliable)
    return {
        url: MAP_TILE_URL_CARTO,
        attribution: MAP_ATTRIBUTION_CARTO
    };

    // Uncomment to use OpenStreetMap
    // return {
    //     url: MAP_TILE_URL,
    //     attribution: MAP_ATTRIBUTION
    // };

    // Uncomment to use Esri
    // return {
    //     url: MAP_TILE_URL_ESRI,
    //     attribution: MAP_ATTRIBUTION_ESRI
    // };
}

/**
 * Geocode address using OpenStreetMap Nominatim API
 * @param {string} address - Address to geocode
 * @returns {Promise} Coordinates {lat, lng} or null
 */
export async function geocodeAddress(address) {
    if (!address) return null;
    try {
        // Add a delay to respect OSM usage policy (max 1 req/sec)
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`, {
            headers: {
                'User-Agent': 'FoodExpress-App'
            }
        });

        if (!response.ok) throw new Error('Geocoding failed');

        const data = await response.json();
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                address: data[0].display_name
            };
        }
    } catch (error) {
        console.error('Geocoding error:', error);
    }
    return null;
}
