import { useState, useEffect } from 'react';
import { IndianRupee, ShoppingBag, TrendingUp, Star, Users, Clock } from 'lucide-react';
import { Card } from '../../components/Card';
import { OwnerNav } from '../../components/OwnerNav';
import { orderAPI, restaurantAPI } from '../../utils/api';
import { formatCurrency } from '../../utils/helpers';

export function OwnerAnalytics() {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState('all');
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [restaurantsData, ordersData] = await Promise.all([
        restaurantAPI.getByOwner(),
        orderAPI.getByOwner()
      ]);
      setRestaurants(restaurantsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (selectedRestaurant === 'all') return true;
    return order.restaurantId === parseInt(selectedRestaurant);
  });

  const getTotalRevenue = () => {
    return filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  };

  const getCompletedOrders = () => {
    return filteredOrders.filter(o => o.status === 'DELIVERED').length;
  };

  const getAverageOrderValue = () => {
    const completed = filteredOrders.filter(o => o.status === 'DELIVERED');
    if (completed.length === 0) return 0;
    return getTotalRevenue() / completed.length;
  };

  const getAverageRating = () => {
    if (selectedRestaurant === 'all') {
      const total = restaurants.reduce((sum, r) => sum + r.rating, 0);
      return restaurants.length > 0 ? (total / restaurants.length).toFixed(1) : 0;
    }
    const restaurant = restaurants.find(r => r.id === parseInt(selectedRestaurant));
    return restaurant ? restaurant.rating.toFixed(1) : 0;
  };

  const getTopItems = () => {
    const itemCounts = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (itemCounts[item.name]) {
          itemCounts[item.name].count += item.quantity;
          itemCounts[item.name].revenue += item.price * item.quantity;
        } else {
          itemCounts[item.name] = {
            name: item.name,
            count: item.quantity,
            revenue: item.price * item.quantity
          };
        }
      });
    });

    return Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getOrdersByStatus = () => {
    const statusCounts = {
      PENDING: 0,
      CONFIRMED: 0,
      PREPARING: 0,
      READY: 0,
      OUT_FOR_DELIVERY: 0,
      DELIVERED: 0,
      CANCELLED: 0
    };

    filteredOrders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    return statusCounts;
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(getTotalRevenue()),
      icon: IndianRupee,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+12.5%'
    },
    {
      title: 'Orders Completed',
      value: getCompletedOrders(),
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+8.2%'
    },
    {
      title: 'Avg Order Value',
      value: formatCurrency(getAverageOrderValue()),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+5.1%'
    },
    {
      title: 'Average Rating',
      value: getAverageRating(),
      icon: Star,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      change: '+0.3'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <OwnerNav />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <OwnerNav />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
              <p className="text-muted-foreground">Track your business performance</p>
            </div>
            <div className="flex gap-3">
              <select
                value={selectedRestaurant}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
                className="px-4 py-2 bg-input border border-border text-foreground rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              >
                <option className="bg-card" value="all">All Restaurants</option>
                {restaurants.map(restaurant => (
                  <option className="bg-card" key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-input border border-border text-foreground rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              >
                <option className="bg-card" value="today">Today</option>
                <option className="bg-card" value="week">This Week</option>
                <option className="bg-card" value="month">This Month</option>
                <option className="bg-card" value="year">This Year</option>
              </select>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.bgColor.replace('bg-', 'bg-').replace('-50', '-500/10')} ${stat.color.replace('text-', 'text-').replace('-600', '-400')} p-3 rounded-lg`}>
                        <Icon size={24} />
                      </div>
                      <span className="text-sm text-green-400">{stat.change}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Selling Items */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">Top Selling Items</h2>
                <div className="space-y-4">
                  {getTopItems().map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FF6B35] rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.count} orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">{formatCurrency(item.revenue)}</p>
                      </div>
                    </div>
                  ))}
                  {getTopItems().length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No sales data available</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Orders by Status */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">Orders by Status</h2>
                <div className="space-y-3">
                  {Object.entries(getOrdersByStatus()).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-foreground">{status.replace(/_/g, ' ')}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-white/10 rounded-full h-2">
                          <div
                            className="bg-[#FF6B35] h-2 rounded-full"
                            style={{
                              width: `${filteredOrders.length > 0 ? (count / filteredOrders.length) * 100 : 0}%`
                            }}
                          />
                        </div>
                        <span className="font-medium text-foreground w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Restaurant Performance */}
            {selectedRestaurant === 'all' && (
              <Card className="lg:col-span-2">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6">Restaurant Performance</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {restaurants.map(restaurant => {
                      const restaurantOrders = orders.filter(o => o.restaurantId === restaurant.id);
                      const revenue = restaurantOrders.reduce((sum, o) => sum + o.totalAmount, 0);
                      const completed = restaurantOrders.filter(o => o.status === 'DELIVERED').length;

                      return (
                        <div key={restaurant.id} className="p-4 border border-border rounded-lg hover:border-[#FF6B35] transition-colors">
                          <div className="flex items-center gap-3 mb-4">
                            <img
                              src={restaurant.imageUrl}
                              alt={restaurant.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{restaurant.name}</p>
                              <div className="flex items-center gap-1">
                                <Star className="text-amber-400 fill-amber-400" size={14} />
                                <span className="text-sm text-muted-foreground">{restaurant.rating}</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Revenue</span>
                              <span className="font-medium text-foreground">{formatCurrency(revenue)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Orders</span>
                              <span className="font-medium text-foreground">{completed}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
