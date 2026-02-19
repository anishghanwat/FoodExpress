import { useState, useEffect } from 'react';
import { Package, MapPin, Clock, CheckCircle, Truck, ArrowRight, Map } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { AgentNav } from '../../components/AgentNav';
import { AgentDeliveryMap } from '../../components/AgentDeliveryMap';
import { useAuth } from '../../context/AuthContext';
import deliveryService from '../../services/deliveryService';
import { formatCurrency } from '../../utils/helpers';
import { toast } from 'sonner';

export function AgentActive() {
  const { user } = useAuth();
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedMapId, setExpandedMapId] = useState(null);

  useEffect(() => {
    loadActiveDeliveries();
    const interval = setInterval(loadActiveDeliveries, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadActiveDeliveries = async () => {
    try {
      const deliveries = await deliveryService.getActive();
      setActiveDeliveries(deliveries || []);
    } catch (error) {
      console.error('Error loading active deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (deliveryId, newStatus) => {
    setUpdatingId(deliveryId);
    try {
      await deliveryService.updateStatus(deliveryId, newStatus);
      toast.success(`Delivery status updated to ${getStatusLabel(newStatus)}`);
      await loadActiveDeliveries();
    } catch (error) {
      console.error('Error updating delivery status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update delivery status';
      toast.error(errorMessage);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      ASSIGNED: 'Assigned',
      PICKED_UP: 'Picked Up',
      IN_TRANSIT: 'In Transit',
      DELIVERED: 'Delivered'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      ASSIGNED: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      PICKED_UP: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      IN_TRANSIT: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
      DELIVERED: 'bg-green-500/10 text-green-400 border border-green-500/20'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getNextAction = (status) => {
    switch (status) {
      case 'ASSIGNED':
        return { label: 'Mark as Picked Up', nextStatus: 'PICKED_UP', icon: Package };
      case 'PICKED_UP':
        return { label: 'Start Delivery', nextStatus: 'IN_TRANSIT', icon: Truck };
      case 'IN_TRANSIT':
        return { label: 'Mark as Delivered', nextStatus: 'DELIVERED', icon: CheckCircle };
      default:
        return null;
    }
  };

  const getTimeSince = (date) => {
    const minutes = Math.floor((new Date() - new Date(date)) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AgentNav />
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AgentNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Active Deliveries</h1>
          <p className="text-muted-foreground">Manage your ongoing deliveries</p>
        </div>

        {activeDeliveries.length === 0 ? (
          <Card className="p-12 text-center">
            <Truck className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No Active Deliveries</h3>
            <p className="text-muted-foreground">Accept orders from the queue to start delivering</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeDeliveries.map((delivery) => {
              const nextAction = getNextAction(delivery.status);
              const ActionIcon = nextAction?.icon;

              return (
                <Card key={delivery.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1">
                        Order #{delivery.orderId}
                      </h3>
                      <Badge className={getStatusColor(delivery.status)}>
                        {getStatusLabel(delivery.status)}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#FF6B35]">
                        {formatCurrency(delivery.orderAmount || 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Earn: {formatCurrency(delivery.deliveryFee || 2.99)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Pickup</p>
                        <p className="text-sm text-muted-foreground">{delivery.pickupAddress}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Delivery</p>
                        <p className="text-sm text-muted-foreground">{delivery.deliveryAddress}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {delivery.status === 'ASSIGNED' && `Accepted ${getTimeSince(delivery.createdAt)}`}
                        {delivery.status === 'PICKED_UP' && `Picked up ${getTimeSince(delivery.pickupTime)}`}
                        {delivery.status === 'IN_TRANSIT' && `In transit ${getTimeSince(delivery.pickupTime)}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Delivery #{delivery.id}</p>
                    </div>
                  </div>

                  {/* Map Toggle Button */}
                  <button
                    onClick={() => setExpandedMapId(expandedMapId === delivery.id ? null : delivery.id)}
                    className="w-full mb-3 py-2 px-4 border-2 border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/10 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Map className="w-5 h-5" />
                    <span>{expandedMapId === delivery.id ? 'Hide Map' : 'Show Map'}</span>
                  </button>

                  {/* Delivery Map */}
                  {expandedMapId === delivery.id && (
                    <div className="mb-4">
                      <AgentDeliveryMap delivery={delivery} />
                    </div>
                  )}

                  {nextAction && (
                    <Button
                      onClick={() => handleUpdateStatus(delivery.id, nextAction.nextStatus)}
                      disabled={updatingId === delivery.id}
                      className="w-full bg-[#10B981] hover:bg-[#059669] text-white"
                    >
                      {ActionIcon && <ActionIcon className="w-5 h-5 mr-2" />}
                      {updatingId === delivery.id ? 'Updating...' : nextAction.label}
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
