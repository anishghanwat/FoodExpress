import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Clock, MapPin, ShoppingBag, Eye, RotateCcw } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import { formatCurrency } from '../utils/helpers';
import { toast } from 'sonner';

export function OrderHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const data = await orderService.getCustomerOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this order? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      await orderService.cancel(orderId, 'Customer requested cancellation');
      toast.success('Order cancelled successfully');
      // Reload orders to show updated status
      loadOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { variant: 'warning', label: 'Pending' },
      'CONFIRMED': { variant: 'primary', label: 'Confirmed' },
      'PREPARING': { variant: 'primary', label: 'Preparing' },
      'OUT_FOR_DELIVERY': { variant: 'primary', label: 'Out for Delivery' },
      'DELIVERED': { variant: 'success', label: 'Delivered' },
      'CANCELLED': { variant: 'error', label: 'Cancelled' }
    };

    const config = statusConfig[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <div className="bg-black/60 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/restaurants')}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <h1 className="text-lg font-bold text-white">My Orders</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <LoadingSkeleton key={i} type="card" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <div className="p-12 text-center">
              <ShoppingBag size={56} className="mx-auto mb-4 text-white/20" />
              <h2 className="text-xl font-bold text-white mb-2">No orders yet</h2>
              <p className="text-white/40 mb-6">Start exploring restaurants and place your first order!</p>
              <Link to="/restaurants">
                <Button>Browse Restaurants</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Card key={order.id} hover>
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-bold text-white">
                          {order.restaurantName || `Restaurant #${order.restaurantId}`}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="space-y-1 text-sm text-white/40">
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span className="line-clamp-1">{order.deliveryAddress}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-white/30 mb-1">Order #{order.id}</p>
                      <p className="text-xl font-bold text-[#FF6B35]">{formatCurrency(order.totalAmount)}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4 pb-4 border-b border-white/10">
                    <p className="text-xs text-white/40 mb-2">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {order.items.map((item, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white/60">
                          {item.quantity}x {item.itemName}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    {['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'].includes(order.status) && (
                      <Link to={`/orders/${order.id}/track`} className="flex-1">
                        <Button variant="primary" className="w-full justify-center gap-2 text-sm">
                          <Eye size={16} />
                          Track Order
                        </Button>
                      </Link>
                    )}

                    {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                      <Button
                        variant="outline"
                        className="flex-1 justify-center gap-2 text-[#EF4444] border-[#EF4444]/50 hover:bg-[#EF4444]/10 text-sm"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Cancel Order
                      </Button>
                    )}

                    {order.status === 'DELIVERED' && (
                      <Button variant="outline" className="flex-1 justify-center gap-2 text-sm" onClick={() => navigate('/restaurants')}>
                        <RotateCcw size={16} />
                        Reorder
                      </Button>
                    )}

                    {order.status === 'DELIVERED' && (
                      <Button variant="outline" className="flex-1 justify-center text-sm">Rate Order</Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
