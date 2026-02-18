import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * Create a custom marker icon
 * @param {string} color - Marker color
 * @param {string} icon - Icon HTML (emoji or SVG)
 * @returns {L.DivIcon} Leaflet DivIcon
 */
function createCustomIcon(color, icon) {
    return L.divIcon({
        className: 'custom-marker',
        html: `
      <div style="
        background-color: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          font-size: 20px;
        ">${icon}</div>
      </div>
    `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
}

/**
 * Restaurant marker icon (orange)
 */
export const restaurantIcon = createCustomIcon('#FF6B35', '🏪');

/**
 * Customer marker icon (green)
 */
export const customerIcon = createCustomIcon('#10B981', '🏠');

/**
 * Agent marker icon (blue with pulse animation)
 */
export const agentIcon = L.divIcon({
    className: 'agent-marker',
    html: `
    <div class="agent-marker-container">
      <div class="agent-marker-pulse"></div>
      <div style="
        background-color: #3B82F6;
        width: 40px;
        height: 40px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 10;
      ">
        <div style="
          transform: rotate(45deg);
          font-size: 20px;
        ">📍</div>
      </div>
    </div>
  `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

/**
 * Pickup marker icon (orange)
 */
export const pickupIcon = createCustomIcon('#FF6B35', '📦');

/**
 * Delivery marker icon (green)
 */
export const deliveryIcon = createCustomIcon('#10B981', '🎯');
