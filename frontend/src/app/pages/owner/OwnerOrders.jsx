import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { OwnerNav } from '../../components/OwnerNav';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import restaurantService from '../../services/restaurantService';
import { formatCurrency } from '../../utils/helpers';
import { toast } from 'sonner';

export function OwnerOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const statusTabs = ['All', 'Pending', 'Confirmed', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Delivered'];

  const fetchOrders = async () => {
    try {
      if (!selectedRestaurant) return;

      const data = await orderService.getRestaurantOrders(selectedRestaurant.id);
      console.log('Fetched orders:', data);
      setOrders(data);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const loadRestaurants = async () => {
    try {
      const data = await restaurantService.getOwnerRestaurants(user.id);
      setRestaurants(data);
      if (data.length > 0) {
        setSelectedRestaurant(data[0]);
      }
    } catch (error) {
      console.error('Error loading restaurants:', error);
      toast.error('Failed to load restaurants');
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurant) {
      fetchOrders();
      // Auto-refresh every 30 seconds
      const interval = setInterval(() => {
        fetchOrders();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [selectedRestaurant]);

  const filteredOrders = selectedStatus === 'All'
    ? orders
    : orders.filter(order => {
      const statusMap = {
        'Ready for Pickup': 'READY_FOR_PICKUP',
        'Out for Delivery': 'OUT_FOR_DELIVERY'
      };
      const mappedStatus = statusMap[selectedStatus] || selectedStatus.toUpperCase();
      return order.status === mappedStatus;
    });

  const getStatusBadgeVariant = (status) => {
    const variants = {
      PENDING: 'warning',
      CONFIRMED: 'info',
      PREPARING: 'warning',
      READY_FOR_PICKUP: 'success',
      OUT_FOR_DELIVERY: 'info',
      DELIVERED: 'default',
      CANCELLED: 'default'
    };
    return variants[status] || 'default';
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success('Order status updated');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      PENDING: 'CONFIRMED',
      CONFIRMED: 'PREPARING',
      PREPARING: 'READY',
      READY: 'COMPLETED',
      COMPLETED: 'COMPLETED'
    };
    return statusFlow[currentStatus];
  };

  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    return allStatuses;
  };

  const formatStatusDisplay = (status) => {
    const displayMap = {
      'READY_FOR_PICKUP': 'Ready for Pickup',
      'OUT_FOR_DELIVERY': 'Out for Delivery'
    };
    return displayMap[status] || status.charAt(0) + status.slice(1).toLowerCase();
  };

  const getTimeSince = (date) => {
    const minutes = Math.floor((new Date() - date) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-[#6B7280]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <OwnerNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Restaurant Selector */}
        {restaurants.length > 1 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">Select Restaurant</label>
            <select
              value={selectedRestaurant?.id || ''}
              onChange={(e) => {
                const restaurant = restaurants.find(r => r.id === parseInt(e.target.value));
                setSelectedRestaurant(restaurant);
              }}
              className="px-4 py-2 bg-input border border-border text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {restaurants.map((restaurant) => (
                <option className="bg-card" key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Auto-refresh indicator */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="w-4 h-4" />
            <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
            <span className="text-[#10B981]">(Auto-refresh every 30s)</span>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 text-[#FF6B35] hover:bg-[#FF6B35]/10 rounded-lg transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Now
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {statusTabs.map((status) => {
            const count = status === 'All'
              ? orders.length
              : orders.filter(o => o.status === status.toUpperCase()).length;

            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition ${selectedStatus === status
                  ? 'bg-[#FF6B35] text-white shadow-lg'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
              >
                {status}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${selectedStatus === status
                  ? 'bg-white/20'
                  : 'bg-muted/50'
                  }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Orders Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-transparent divide-y divide-white/10">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-foreground">#{order.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-foreground">Customer #{order.userId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{order.items?.length || 0} items</p>
                        <p className="text-xs text-muted-foreground max-w-xs truncate">
                          {order.items?.map(item => `${item.itemName} x${item.quantity}`).join(', ')}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-foreground">{formatCurrency(order.totalAmount)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {formatStatusDisplay(order.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {getTimeSince(new Date(order.createdAt))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="px-3 py-1.5 text-sm bg-input border border-border text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {getStatusOptions(order.status).map((status) => (
                          <option className="bg-card" key={status} value={status}>
                            {formatStatusDisplay(status)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <p className="text-muted-foreground">No orders found for this status</p>
              </div>
            </div>
          )}
        </Card>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-amber-500 font-medium">Pending</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              {orders.filter(o => o.status === 'PENDING').length}
            </p>
          </Card>
          <Card className="p-4 bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-500 font-medium">In Progress</p>
            <p className="text-2xl font-bold text-red-400 mt-1">
              {orders.filter(o => ['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'].includes(o.status)).length}
            </p>
          </Card>
          <Card className="p-4 bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-sm text-emerald-500 font-medium">Delivered Today</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              {orders.filter(o => o.status === 'DELIVERED').length}
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}