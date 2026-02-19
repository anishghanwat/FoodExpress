import { useState, useEffect, useCallback } from 'react';
import { DeliveryMap } from './map/DeliveryMap';
import { MapPin, Navigation, Clock, Radio, AlertCircle } from 'lucide-react';
import { formatDistance, formatETA, calculateDistance, calculateETA } from '../utils/mapHelpers';
import locationService from '../services/locationService';
import { toast } from 'sonner';

/**
 * Agent Delivery Map Component
 * Shows delivery route and allows agent to share location
 */
export function AgentDeliveryMap({ delivery }) {
    const [isTracking, setIsTracking] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [watchId, setWatchId] = useState(null);
    const [distance, setDistance] = useState(null);
    const [eta, setEta] = useState(null);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);

    // Check if geolocation is available
    const isGeolocationAvailable = locationService.isGeolocationAvailable();

    // Calculate distance and ETA when location changes
    useEffect(() => {
        if (currentLocation && delivery.deliveryLatitude && delivery.deliveryLongitude) {
            const dist = calculateDistance(
                currentLocation.latitude,
                currentLocation.longitude,
                delivery.deliveryLatitude,
                delivery.deliveryLongitude
            );
            setDistance(dist);
            setEta(calculateETA(dist));
        }
    }, [currentLocation, delivery]);

    // Start location tracking
    const startTracking = useCallback(() => {
        if (!isGeolocationAvailable) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        const id = locationService.startLocationTracking(
            async (location) => {
                setCurrentLocation(location);
                setLastUpdate(new Date());
                setError(null);

                // Update backend every time location changes
                try {
                    await locationService.updateAgentLocation(
                        delivery.id,
                        location.latitude,
                        location.longitude
                    );
                    console.log('Location updated:', location);
                } catch (err) {
                    console.error('Failed to update location:', err);
                    // Don't show error toast for every failed update
                }
            },
            (err) => {
                console.error('Location tracking error:', err);
                setError(err.message);
                toast.error('Failed to get your location. Please check permissions.');
                setIsTracking(false);
            }
        );

        if (id) {
            setWatchId(id);
            setIsTracking(true);
            toast.success('Location sharing started');
        }
    }, [delivery.id, isGeolocationAvailable]);

    // Stop location tracking
    const stopTracking = useCallback(() => {
        if (watchId) {
            locationService.stopLocationTracking(watchId);
            setWatchId(null);
            setIsTracking(false);
            toast.info('Location sharing stopped');
        }
    }, [watchId]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (watchId) {
                locationService.stopLocationTracking(watchId);
            }
        };
    }, [watchId]);

    // Get current location once (for initial display)
    useEffect(() => {
        if (delivery.agentLatitude && delivery.agentLongitude) {
            setCurrentLocation({
                latitude: delivery.agentLatitude,
                longitude: delivery.agentLongitude
            });
        }
    }, [delivery]);

    const pickupLocation = delivery.pickupLatitude && delivery.pickupLongitude ? {
        lat: delivery.pickupLatitude,
        lng: delivery.pickupLongitude,
        address: delivery.pickupAddress
    } : null;

    const deliveryLocation = delivery.deliveryLatitude && delivery.deliveryLongitude ? {
        lat: delivery.deliveryLatitude,
        lng: delivery.deliveryLongitude,
        address: delivery.deliveryAddress
    } : null;

    const agentLocation = currentLocation ? {
        lat: currentLocation.latitude,
        lng: currentLocation.longitude
    } : null;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-[#1F2937]">Delivery Route</h3>

                    {/* Location Sharing Toggle */}
                    <button
                        onClick={isTracking ? stopTracking : startTracking}
                        disabled={!isGeolocationAvailable}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isTracking
                                ? 'bg-[#10B981] text-white hover:bg-[#059669]'
                                : 'bg-[#3B82F6] text-white hover:bg-[#2563EB]'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <Radio size={18} className={isTracking ? 'animate-pulse' : ''} />
                        <span>{isTracking ? 'Sharing Location' : 'Share Location'}</span>
                    </button>
                </div>

                {!isGeolocationAvailable && (
                    <div className="mt-2 flex items-start gap-2 text-sm text-[#EF4444]">
                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                        <p>Geolocation is not supported by your browser</p>
                    </div>
                )}

                {error && (
                    <div className="mt-2 flex items-start gap-2 text-sm text-[#EF4444]">
                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                        <p>{error}</p>
                    </div>
                )}
            </div>

            {/* Map */}
            <div className="relative">
                <DeliveryMap
                    restaurantLocation={pickupLocation}
                    customerLocation={deliveryLocation}
                    agentLocation={agentLocation}
                    showRoute={true}
                    height="350px"
                />

                {/* Tracking Indicator Overlay */}
                {isTracking && (
                    <div className="absolute top-4 left-4 bg-[#10B981] text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span>Live Tracking</span>
                    </div>
                )}
            </div>

            {/* Info Box */}
            <div className="p-4 bg-[#F9FAFB]">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Distance */}
                    {distance !== null && (
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="flex items-center gap-2 mb-1">
                                <Navigation size={16} className="text-[#3B82F6]" />
                                <span className="text-xs text-[#6B7280] font-medium">Distance</span>
                            </div>
                            <p className="text-lg font-bold text-[#1F2937]">{formatDistance(distance)}</p>
                        </div>
                    )}

                    {/* ETA */}
                    {eta !== null && (
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock size={16} className="text-[#10B981]" />
                                <span className="text-xs text-[#6B7280] font-medium">ETA</span>
                            </div>
                            <p className="text-lg font-bold text-[#1F2937]">{formatETA(eta)}</p>
                        </div>
                    )}
                </div>

                {/* Delivery Info */}
                <div className="space-y-2">
                    {/* Pickup Address */}
                    {delivery.status === 'ASSIGNED' && pickupLocation && (
                        <div className="flex items-start gap-2 text-sm">
                            <MapPin size={16} className="text-[#FF6B35] flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-[#1F2937]">Pickup from:</p>
                                <p className="text-[#6B7280]">{delivery.pickupAddress}</p>
                            </div>
                        </div>
                    )}

                    {/* Delivery Address */}
                    {deliveryLocation && (
                        <div className="flex items-start gap-2 text-sm">
                            <MapPin size={16} className="text-[#10B981] flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-[#1F2937]">Deliver to:</p>
                                <p className="text-[#6B7280]">{delivery.deliveryAddress}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Last Update */}
                {lastUpdate && isTracking && (
                    <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-[#6B7280] text-center">
                            Last updated: {lastUpdate.toLocaleTimeString()}
                        </p>
                    </div>
                )}

                {/* Instructions */}
                {!isTracking && isGeolocationAvailable && (
                    <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-[#6B7280] text-center">
                            Enable location sharing to update customers in real-time
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AgentDeliveryMap;
