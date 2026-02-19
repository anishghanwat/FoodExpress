import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ShoppingBag, IndianRupee, AlertCircle, Star, Store } from 'lucide-react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { OwnerNav } from '../../components/OwnerNav';
import { useAuth } from '../../context/AuthContext';
import restaurantService from '../../services/restaurantService';
import orderService from '../../services/orderService';
import { formatCurrency } from '../../utils/helpers';

export function OwnerDashboard() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load owner's restaurants
      console.log('Loading restaurants for owner:', user.id);
      const restaurantsData = await restaurantService.getOwnerRestaurants(user.id);
      console.log('Restaurants received:', restaurantsData);
      setRestaurants(restaurantsData);

      // Load orders for all owner's restaurants
      if (restaurantsData.length > 0) {
        try {
          // Fetch orders for each restaurant and combine them
          const allOrdersPromises = restaurantsData.map(restaurant =>
            orderService.getRestaurantOrders(restaurant.id)
          );
          const ordersArrays = await Promise.all(allOrdersPromises);
          // Flatten the arrays and sort by createdAt
          const allOrders = ordersArrays.flat().sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          console.log('Orders received:', allOrders);
          setOrders(allOrders);
        } catch (error) {
          console.error('Error loading orders:', error);
          setOrders([]);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    const variants = {
      PENDING: 'warning',
      CONFIRMED: 'info',
      PREPARING: 'warning',
      READY: 'success',
      OUT_FOR_DELIVERY: 'primary',
      DELIVERED: 'success',
      CANCELLED: 'error'
    };
    return variants[status] || 'default';
  };

  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'CONFIRMED');
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <OwnerNav />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Owner Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your restaurant overview</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* My Restaurants */}
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-1">My Restaurants</p>
                  <p className="text-3xl font-bold text-foreground">{restaurants.length}</p>
                  <Link to="/owner/restaurants" className="text-sm text-primary hover:underline mt-2 inline-block">
                    Manage →
                  </Link>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Store className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>

            {/* Today's Orders */}
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-1">Today's Orders</p>
                  <p className="text-3xl font-bold text-foreground">{todayOrders.length}</p>
                  <Link to="/owner/orders" className="text-sm text-primary hover:underline mt-2 inline-block">
                    View all →
                  </Link>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </Card>

            {/* Today's Revenue */}
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-1">Today's Revenue</p>
                  <p className="text-3xl font-bold text-foreground">{formatCurrency(todayRevenue)}</p>
                  <p className="text-sm text-muted-foreground mt-2">From {todayOrders.length} orders</p>
                </div>
                <div className="bg-emerald-500/10 p-3 rounded-lg">
                  <IndianRupee className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </Card>

            {/* Pending Orders */}
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-1">Pending Orders</p>
                  <p className={`text-3xl font-bold ${pendingOrders.length > 0 ? 'text-destructive' : 'text-foreground'}`}>
                    {pendingOrders.length}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {pendingOrders.length > 0 ? 'Requires attention' : 'All clear'}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${pendingOrders.length > 0 ? 'bg-destructive/10' : 'bg-muted/50'}`}>
                  <AlertCircle className={`w-6 h-6 ${pendingOrders.length > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
                </div>
              </div>
            </Card>
          </div>

          {/* My Restaurants */}
          <Card className="mb-8">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground">My Restaurants</h2>
              <Link to="/owner/restaurants">
                <Button variant="primary">Manage Restaurants</Button>
              </Link>
            </div>
            {restaurants.length === 0 ? (
              <div className="p-12 text-center">
                <Store size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">You don't have any restaurants yet</p>
                <Link to="/owner/restaurants">
                  <Button>Add Your First Restaurant</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {restaurants.map((restaurant) => (
                  <Card key={restaurant.id} hover className="p-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={restaurant.imageUrl || 'https://via.placeholder.com/80'}
                        alt={restaurant.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground mb-1">{restaurant.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{restaurant.cuisine}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24] mr-1" />
                            <span className="text-sm font-medium">{restaurant.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{restaurant.estimatedDeliveryTime} min</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Link to={`/owner/menu?restaurantId=${restaurant.id}`} className="flex-1">
                        <Button variant="outline" className="w-full text-sm">Manage Menu</Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Orders */}
          <Card>
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground">Recent Orders</h2>
              <Link to="/owner/orders">
                <Button variant="outline">View All Orders</Button>
              </Link>
            </div>
            {orders.length === 0 ? (
              <div className="p-12 text-center">
                <ShoppingBag size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No orders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-transparent divide-y divide-border">
                    {orders.slice(0, 10).map((order) => (
                      <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {order.items?.length || 0} items
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
