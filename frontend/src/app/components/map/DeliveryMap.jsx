import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../../../styles/map.css';
import {
    restaurantIcon,
    customerIcon,
    agentIcon
} from '../../utils/mapIcons';
import {
    MAP_TILE_URL,
    MAP_ATTRIBUTION,
    DEFAULT_MAP_CENTER,
    DEFAULT_MAP_ZOOM,
    getCenterPoint,
    getBounds,
    getActiveTileConfig
} from '../../utils/mapHelpers';

/**
 * Component to auto-fit map bounds to markers
 */
function MapBounds({ coordinates }) {
    const map = useMap();

    useEffect(() => {
        if (coordinates && coordinates.length > 0) {
            const bounds = getBounds(coordinates);
            if (bounds) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [coordinates, map]);

    return null;
}

/**
 * Base Delivery Map Component
 * Shows restaurant, customer, and agent locations with route
 */
export function DeliveryMap({
    restaurantLocation,
    customerLocation,
    agentLocation,
    showRoute = true,
    height = '400px',
    className = ''
}) {
    const mapRef = useRef(null);

    // Get active tile configuration (with fallback support)
    const tileConfig = getActiveTileConfig();

    // Determine map center
    const coordinates = [
        restaurantLocation && [restaurantLocation.lat, restaurantLocation.lng],
        customerLocation && [customerLocation.lat, customerLocation.lng],
        agentLocation && [agentLocation.lat, agentLocation.lng]
    ].filter(Boolean);

    const center = coordinates.length > 0
        ? getCenterPoint(coordinates)
        : DEFAULT_MAP_CENTER;

    // Route coordinates
    const routeCoordinates = [];
    if (restaurantLocation) {
        routeCoordinates.push([restaurantLocation.lat, restaurantLocation.lng]);
    }
    if (agentLocation) {
        routeCoordinates.push([agentLocation.lat, agentLocation.lng]);
    }
    if (customerLocation) {
        routeCoordinates.push([customerLocation.lat, customerLocation.lng]);
    }

    return (
        <div className={`map-container ${className}`} style={{ height }}>
            <MapContainer
                center={center}
                zoom={DEFAULT_MAP_ZOOM}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
            >
                <TileLayer
                    url={tileConfig.url}
                    attribution={tileConfig.attribution}
                    maxZoom={19}
                    subdomains={['a', 'b', 'c']}
                />

                {/* Auto-fit bounds */}
                <MapBounds coordinates={coordinates} />

                {/* Restaurant Marker */}
                {restaurantLocation && (
                    <Marker
                        position={[restaurantLocation.lat, restaurantLocation.lng]}
                        icon={restaurantIcon}
                    >
                        <Popup>
                            <div className="map-popup-title">Restaurant</div>
                            <div className="map-popup-address">{restaurantLocation.address}</div>
                            <div className="map-popup-info">Pickup Location</div>
                        </Popup>
                    </Marker>
                )}

                {/* Customer Marker */}
                {customerLocation && (
                    <Marker
                        position={[customerLocation.lat, customerLocation.lng]}
                        icon={customerIcon}
                    >
                        <Popup>
                            <div className="map-popup-title">Delivery Location</div>
                            <div className="map-popup-address">{customerLocation.address}</div>
                            <div className="map-popup-info">Your Address</div>
                        </Popup>
                    </Marker>
                )}

                {/* Agent Marker */}
                {agentLocation && (
                    <Marker
                        position={[agentLocation.lat, agentLocation.lng]}
                        icon={agentIcon}
                    >
                        <Popup>
                            <div className="map-popup-title">Delivery Agent</div>
                            <div className="map-popup-info">On the way to you</div>
                        </Popup>
                    </Marker>
                )}

                {/* Route Line */}
                {showRoute && routeCoordinates.length >= 2 && (
                    <Polyline
                        positions={routeCoordinates}
                        pathOptions={{
                            color: '#3B82F6',
                            weight: 3,
                            opacity: 0.7,
                            dashArray: '10, 10'
                        }}
                    />
                )}
            </MapContainer>
        </div>
    );
}

export default DeliveryMap;
