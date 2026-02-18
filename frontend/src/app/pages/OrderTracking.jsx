import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, CheckCircle2, Clock, Package, Truck, Home, Phone, User, RefreshCw } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { OrderTrackingMap } from '../components/OrderTrackingMap';
import orderService from '../services/orderService';
import deliveryService from '../services/deliveryService';
import restaurantService from '../services/restaurantService';
import locationService from '../services/locationService';
import userService from '../services/userService';
import { formatCurrency } from '../utils/helpers';
import { geocodeAddress } from '../utils/mapHelpers';
import { toast } from 'sonner';

export function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tracking, setTracking] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadTracking();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadTracking(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [id]);

  const loadTracking = async (isAutoRefresh = false) => {
    if (isAutoRefresh) {
      setRefreshing(true);
    }

    try {
      const data = await orderService.getById(id);

      // Get delivery info if order is out for delivery or delivered
      let deliveryData = null;
      if (['OUT_FOR_DELIVERY', 'DELIVERED', 'READY_FOR_PICKUP'].includes(data.status)) {
        try {
          const deliveryResponse = await deliveryService.getByOrderId(id);
          if (deliveryResponse) {
            deliveryData = deliveryResponse;
          }
        } catch (err) {
          console.log('Could not fetch delivery info:', err);
        }
      }

      setDeliveryInfo(deliveryData);

      // Fetch agent name if assigned
      let agentName = 'Not assigned yet';
      if (deliveryData?.agentId) {
        try {
          const agentUser = await userService.getById(deliveryData.agentId);
          if (agentUser && agentUser.name) {
            agentName = agentUser.name;
          } else {
            agentName = `Agent #${deliveryData.agentId}`;
          }
        } catch (err) {
          console.error('Error fetching agent details:', err);
          agentName = `Agent #${deliveryData.agentId}`;
        }
      }

      // Fetch restaurant details for address
      let restaurantLocation = null;
      try {
        const restaurantRx = await restaurantService.getById(data.restaurantId);
        if (restaurantRx && restaurantRx.address) {
          const coords = await geocodeAddress(restaurantRx.address);
          if (coords) {
            restaurantLocation = {
              ...coords,
              address: restaurantRx.address
            };
          }
        }
      } catch (err) {
        console.error('Error fetching restaurant details:', err);
      }

      // Geo-location logic: Try live system location first, fallback to address geocoding
      let customerLocation = null;
      try {
        // 1. Try to get live location
        if (locationService.isGeolocationAvailable()) {
          try {
            const position = await locationService.getCurrentLocation();
            if (position) {
              customerLocation = {
                lat: position.latitude,
                lng: position.longitude,
                address: 'Current Location (Live)'
              };
              console.log('Using live system location:', customerLocation);
            }
          } catch (geoErr) {
            console.warn('Live location access denied or failed:', geoErr);
          }
        }

        // 2. Fallback to delivery address if live location failed
        if (!customerLocation && data.deliveryAddress) {
          const coords = await geocodeAddress(data.deliveryAddress);
          if (coords) {
            customerLocation = {
              ...coords,
              address: data.deliveryAddress
            };
          }
        }
      } catch (err) {
        console.error('Error determining customer location:', err);
      }

      // Transform the order data to match the tracking format
      const trackingData = {
        orderId: data.id,
        status: data.status,
        restaurantName: data.restaurantName || `Restaurant #${data.restaurantId}`,
        restaurantId: data.restaurantId,
        items: data.items,
        totalAmount: data.totalAmount,
        deliveryAddress: data.deliveryAddress,
        estimatedDeliveryTime: getEstimatedTime(data.status, data.createdAt),
        timeline: getTimelineFromStatus(data.status),
        agentName: agentName,
        agentPhone: deliveryData?.agentPhone || null,
        deliveryStatus: deliveryData?.status || null,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        restaurantLocation,
        customerLocation
      };

      setTracking(trackingData);
      setLastUpdated(new Date()); // Ensure UI updates
      if (!isAutoRefresh) setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error loading tracking:', error);
      setTracking(null);
      setLoading(false);
      setRefreshing(false);
      // Only show toast on first load, not on interval refreshes
      if (!isAutoRefresh) {
        toast.error('Failed to load tracking information');
      }
    }
  };

  const handleManualRefresh = () => {
    loadTracking(true);
    toast.success('Refreshing order status...');
  };

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this order? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      await orderService.cancel(id, 'Customer requested cancellation');
      toast.success('Order cancelled successfully');
      // Reload tracking to show updated status
      loadTracking();
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const getEstimatedTime = (status, createdAt) => {
    if (status === 'DELIVERED') {
      return 'Delivered';
    }

    // Calculate time since order was placed
    const orderTime = new Date(createdAt);
    const now = new Date();
    const minutesPassed = Math.floor((now - orderTime) / 60000);

    // Estimate based on status
    let estimatedMinutes = 45;
    if (status === 'CONFIRMED') estimatedMinutes = 40;
    if (status === 'PREPARING') estimatedMinutes = 30;
    if (status === 'READY_FOR_PICKUP') estimatedMinutes = 20;
    if (status === 'OUT_FOR_DELIVERY') estimatedMinutes = 15;

    const remainingMinutes = Math.max(5, estimatedMinutes - minutesPassed);
    return `${remainingMinutes}-${remainingMinutes + 10} minutes`;
  };

  const getTimelineFromStatus = (status) => {
    const timeline = ['Order Placed'];

    if (['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(status)) {
      timeline.push('Restaurant Confirmed');
    }
    if (['PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(status)) {
      timeline.push('Preparing Food');
    }
    if (['READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(status)) {
      timeline.push('Ready for Pickup');
    }
    if (['OUT_FOR_DELIVERY', 'DELIVERED'].includes(status)) {
      timeline.push('Out for Delivery');
    }
    if (status === 'DELIVERED') {
      timeline.push('Delivered');
    }

    return timeline;
  };

  const statusSteps = [
    {
      key: 'Order Placed',
      icon: CheckCircle2,
      label: 'Order Placed',
      description: 'We have received your order'
    },
    {
      key: 'Restaurant Confirmed',
      icon: Clock,
      label: 'Restaurant Confirmed',
      description: 'Restaurant is preparing your food'
    },
    {
      key: 'Preparing Food',
      icon: Package,
      label: 'Preparing Food',
      description: 'Your delicious meal is being prepared'
    },
    {
      key: 'Ready for Pickup',
      icon: CheckCircle2,
      label: 'Ready for Pickup',
      description: 'Food is ready, waiting for delivery agent'
    },
    {
      key: 'Out for Delivery',
      icon: Truck,
      label: 'Out for Delivery',
      description: 'Your order is on the way'
    },
    {
      key: 'Delivered',
      icon: Home,
      label: 'Delivered',
      description: 'Enjoy your meal!'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
          <p className="text-white/40">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (!tracking) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 mb-4">Order not found</p>
          <Button onClick={() => navigate('/orders/history')} variant="outline">View Order History</Button>
        </div>
      </div>
    );
  }

  // Calculate current step index based on the timeline progress
  const currentStepIndex = Math.max(0, tracking.timeline.length - 1);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <div className="bg-black/60 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/orders/history')}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft size={18} />
              Back to Orders
            </button>
            <h1 className="text-lg font-bold text-white">Order #{id}</h1>
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors disabled:opacity-50 text-sm"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        <div className="mb-8 bg-gradient-to-r from-[#FF6B35] to-[#ff8a5c] rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">
            {statusSteps[currentStepIndex]?.label || 'Processing'}
          </h2>
          <p className="text-base opacity-90 mb-3">
            {statusSteps[currentStepIndex]?.description || 'Your order is being processed'}
          </p>
          {tracking.status !== 'DELIVERED' && (
            <p className="text-sm opacity-75">
              Estimated delivery: {tracking.estimatedDeliveryTime}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-base font-bold text-white">Order Status</h3>
                  {lastUpdated && (
                    <p className="text-xs text-white/40">
                      Updated {new Date(lastUpdated).toLocaleTimeString()}
                    </p>
                  )}
                </div>

                <div className="space-y-5">
                  {statusSteps.map((step, index) => {
                    const isCompleted = tracking.timeline.includes(step.key);
                    const isCurrent = index === currentStepIndex;
                    const Icon = step.icon;

                    return (
                      <div key={step.key} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isCompleted ? 'bg-[#10B981] text-white'
                            : isCurrent ? 'bg-[#FF6B35] text-white animate-pulse'
                              : 'bg-white/10 text-white/30'
                            }`}>
                            <Icon size={20} />
                          </div>
                          {index < statusSteps.length - 1 && (
                            <div className={`w-0.5 h-10 mt-2 transition-all ${isCompleted ? 'bg-[#10B981]' : 'bg-white/10'}`} />
                          )}
                        </div>

                        <div className="flex-1 pb-6">
                          <h4 className={`font-medium mb-1 text-sm ${isCompleted || isCurrent ? 'text-white' : 'text-white/30'
                            }`}>
                            {step.label}
                          </h4>
                          <p className={`text-xs ${isCompleted || isCurrent ? 'text-white/50' : 'text-white/20'
                            }`}>
                            {step.description}
                          </p>
                          {isCompleted && (
                            <Badge variant="success" className="mt-2">Completed</Badge>
                          )}
                          {isCurrent && !isCompleted && (
                            <Badge variant="warning" className="mt-2">In Progress</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Live Tracking Map - Hide when delivered */}
            {(tracking.status === 'OUT_FOR_DELIVERY' || tracking.status === 'READY_FOR_PICKUP') && deliveryInfo && (
              <div className="mt-6">
                <OrderTrackingMap
                  orderId={id}
                  deliveryInfo={deliveryInfo}
                  restaurantLocation={
                    deliveryInfo.pickupLatitude && deliveryInfo.pickupLongitude
                      ? {
                        lat: deliveryInfo.pickupLatitude,
                        lng: deliveryInfo.pickupLongitude,
                        address: deliveryInfo.pickupAddress || tracking.restaurantName
                      }
                      : null
                  }
                  customerLocation={
                    deliveryInfo.deliveryLatitude && deliveryInfo.deliveryLongitude
                      ? {
                        lat: deliveryInfo.deliveryLatitude,
                        lng: deliveryInfo.deliveryLongitude,
                        address: deliveryInfo.deliveryAddress || tracking.deliveryAddress
                      }
                      : null
                  }
                />
              </div>
            )}
          </div>

          {/* Delivery Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Details */}
            <Card>
              <div className="p-5">
                <h3 className="font-bold text-white mb-4 text-sm">Order Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-white/40">Restaurant</p>
                    <p className="font-medium text-white text-sm">{tracking.restaurantName}</p>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-xs text-white/40 mb-2">Items</p>
                    {tracking.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm mb-1">
                        <span className="text-white/70">{item.quantity}x {item.itemName}</span>
                        <span className="text-white/40">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex justify-between font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-[#FF6B35]">{formatCurrency(tracking.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Delivery Address */}
            <Card>
              <div className="p-5">
                <h3 className="font-bold text-white mb-3 text-sm">Delivery Address</h3>
                <p className="text-white/50 text-sm">{tracking.deliveryAddress}</p>
              </div>
            </Card>

            {/* Delivery Agent - Hide when delivered */}
            {tracking.agentName && tracking.agentName !== 'Not assigned yet' && tracking.status !== 'DELIVERED' && (
              <Card>
                <div className="p-5">
                  <h3 className="font-bold text-white mb-4 text-sm">Delivery Agent</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {tracking.agentName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{tracking.agentName}</p>
                      <div className="flex items-center gap-1 text-xs text-white/40">
                        <User size={12} />
                        <span>Delivery Partner</span>
                      </div>
                    </div>
                  </div>
                  {tracking.agentPhone && (
                    <a
                      href={`tel:${tracking.agentPhone}`}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-sm"
                    >
                      <Phone size={16} />
                      <span>Call Agent</span>
                    </a>
                  )}
                </div>
              </Card>
            )}

            {/* Help & Support */}
            <Card>
              <div className="p-5">
                <h3 className="font-bold text-white mb-4 text-sm">Need Help?</h3>
                <div className="space-y-2">
                  {(tracking.status === 'PENDING' || tracking.status === 'CONFIRMED') && (
                    <Button
                      variant="outline"
                      className="w-full justify-center text-[#EF4444] border-[#EF4444]/50 hover:bg-[#EF4444]/10 text-sm"
                      onClick={handleCancelOrder}
                    >
                      Cancel Order
                    </Button>
                  )}
                  <Button variant="outline" className="w-full justify-center text-sm">Contact Support</Button>
                  <Button variant="outline" className="w-full justify-center text-sm">Report Issue</Button>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            {tracking.status === 'DELIVERED' && (
              <Card>
                <div className="p-5">
                  <h3 className="font-bold text-white mb-4 text-sm">Order Complete</h3>
                  <div className="space-y-2">
                    <Link to="/restaurants">
                      <Button className="w-full justify-center text-sm">Order Again</Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-center text-sm">Rate Order</Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}