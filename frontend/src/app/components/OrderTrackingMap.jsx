import { useState, useEffect, useCallback } from 'react';
import { DeliveryMap } from './map/DeliveryMap';
import { MapPin, Navigation, Clock } from 'lucide-react';
import { formatDistance, formatETA, calculateDistance, calculateETA } from '../utils/mapHelpers';
import locationService from '../services/locationService';
import deliveryService from '../services/deliveryService';

/**
 * Order Tracking Map Component
 * Shows real-time delivery tracking with agent location
 */
export function OrderTrackingMap({ orderId, deliveryInfo, restaurantLocation, customerLocation }) {
    const [agentLocation, setAgentLocation] = useState(null);
    const [distance, setDistance] = useState(null);
    const [eta, setEta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load initial delivery location
    useEffect(() => {
        loadDeliveryLocation();
    }, [orderId]);

    // Subscribe to location updates via WebSocket (if available)
    useEffect(() => {
        if (!deliveryInfo?.id) return;

        // TODO: Subscribe to WebSocket for real-time updates
        // For now, we'll poll every 15 seconds
        const interval = setInterval(() => {
            loadDeliveryLocation();
        }, 15000);

        return () => clearInterval(interval);
    }, [deliveryInfo?.id]);

    const loadDeliveryLocation = async () => {
        try {
            if (!deliveryInfo?.id) {
                setLoading(false);
                return;
            }

            const delivery = await locationService.getDeliveryLocation(deliveryInfo.id);

            if (delivery.agentLatitude && delivery.agentLongitude) {
                setAgentLocation({
                    lat: delivery.agentLatitude,
                    lng: delivery.agentLongitude
                });

                // Use backend-calculated distance and ETA if available
                if (delivery.estimatedDistanceKm) {
                    setDistance(delivery.estimatedDistanceKm);
                }
                if (delivery.estimatedTimeMinutes) {
                    setEta(delivery.estimatedTimeMinutes);
                }

                // If not available, calculate on frontend
                if (!delivery.estimatedDistanceKm && customerLocation) {
                    const dist = calculateDistance(
                        delivery.agentLatitude,
                        delivery.agentLongitude,
                        customerLocation.lat,
                        customerLocation.lng
                    );
                    setDistance(dist);
                    setEta(calculateETA(dist));
                }
            }

            setLoading(false);
            setError(null);
        } catch (err) {
            console.error('Error loading delivery location:', err);
            setError('Unable to load delivery location');
            setLoading(false);
        }
    };

    // If no delivery info or not out for delivery yet
    if (!deliveryInfo || !['PICKED_UP', 'IN_TRANSIT', 'DELIVERED'].includes(deliveryInfo.status)) {
        return null;
    }

    if (loading) {
        return (
            <div className="bg-card border border-border rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-card-foreground mb-4">Live Tracking</h3>
                <div className="bg-muted rounded-lg h-96 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading map...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-card border border-border rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-card-foreground mb-4">Live Tracking</h3>
                <div className="bg-destructive/10 rounded-lg h-96 flex items-center justify-center">
                    <div className="text-center text-destructive">
                        <p className="font-medium">{error}</p>
                        <button
                            onClick={loadDeliveryLocation}
                            className="mt-4 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border rounded-lg shadow-md overflow-hidden">
            <div className="p-6 pb-0">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-card-foreground">Live Tracking</h3>
                    <div className="flex items-center gap-2 text-sm text-[#10B981]">
                        <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
                        <span>Live</span>
                    </div>
                </div>
            </div>

            {/* Map */}
            <div className="px-6">
                <DeliveryMap
                    restaurantLocation={restaurantLocation ? {
                        lat: restaurantLocation.lat,
                        lng: restaurantLocation.lng,
                        address: restaurantLocation.address
                    } : null}
                    customerLocation={customerLocation ? {
                        lat: customerLocation.lat,
                        lng: customerLocation.lng,
                        address: customerLocation.address
                    } : null}
                    agentLocation={agentLocation}
                    showRoute={true}
                    height="400px"
                />
            </div>

            {/* Info Box */}
            {(distance !== null || eta !== null) && (
                <div className="p-6 pt-4">
                    <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-4 text-primary-foreground">
                        <div className="grid grid-cols-2 gap-4">
                            {distance !== null && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <Navigation size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-90">Distance</p>
                                        <p className="text-lg font-bold">{formatDistance(distance)}</p>
                                    </div>
                                </div>
                            )}

                            {eta !== null && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-90">ETA</p>
                                        <p className="text-lg font-bold">{formatETA(eta)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {deliveryInfo.status === 'PICKED_UP' && (
                        <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                            <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                            <p>Your delivery agent has picked up your order and is on the way!</p>
                        </div>
                    )}

                    {deliveryInfo.status === 'IN_TRANSIT' && (
                        <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                            <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                            <p>Your order is on the way. The agent will arrive soon!</p>
                        </div>
                    )}

                    {deliveryInfo.status === 'DELIVERED' && (
                        <div className="mt-4 flex items-start gap-2 text-sm text-[#10B981]">
                            <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                            <p className="font-medium">Your order has been delivered. Enjoy your meal!</p>
                        </div>
                    )}
                </div>
            )}

            {/* Auto-refresh indicator */}
            <div className="px-6 pb-4">
                <p className="text-xs text-muted-foreground text-center">
                    Location updates automatically every 15 seconds
                </p>
            </div>
        </div>
    );
}

export default OrderTrackingMap;
