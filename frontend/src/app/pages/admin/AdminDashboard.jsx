import { useState, useEffect } from 'react';
import { Users, Store, ShoppingBag, IndianRupee, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Card } from '../../components/Card';
import { AdminNav } from '../../components/AdminNav';
import adminService from '../../services/adminService';
import restaurantService from '../../services/restaurantService';
import orderService from '../../services/orderService';
import { formatCurrency } from '../../utils/helpers';
import { toast } from 'sonner';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    activeOrders: 0,
    totalRevenue: 0,
    usersByRole: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load user stats
      const userStats = await adminService.users.getAll({ page: 0, size: 1 });

      // Load restaurants
      const restaurants = await restaurantService.getAll();

      // Load orders
      const orders = await orderService.getAll();

      // Calculate stats
      const activeOrders = orders.filter(o =>
        !['DELIVERED', 'CANCELLED'].includes(o.status)
      ).length;

      const totalRevenue = orders
        .filter(o => o.status === 'DELIVERED')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      setStats({
        totalUsers: userStats.totalItems || 0,
        totalRestaurants: restaurants.length || 0,
        activeOrders,
        totalRevenue,
        usersByRole: {
          CUSTOMER: 0,
          RESTAURANT_OWNER: 0,
          DELIVERY_AGENT: 0,
          ADMIN: 0
        }
      });

      // Try to load detailed user stats
      try {
        const detailedStats = await adminService.users.getAll({ page: 0, size: 100 });
        // Count users by role from the actual data
        const roleCounts = {
          CUSTOMER: 0,
          RESTAURANT_OWNER: 0,
          DELIVERY_AGENT: 0,
          ADMIN: 0
        };

        if (detailedStats.users) {
          detailedStats.users.forEach(user => {
            if (roleCounts.hasOwnProperty(user.role)) {
              roleCounts[user.role]++;
            }
          });
        }

        setStats(prev => ({
          ...prev,
          usersByRole: roleCounts
        }));
      } catch (error) {
        console.log('Could not load user role breakdown');
      }

    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">System overview and monitoring</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link to="/admin/users">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 p-3 rounded-lg">
                      <Users size={24} />
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalUsers}</p>
                </div>
              </Card>
            </Link>

            <Link to="/admin/restaurants">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-purple-500/10 text-purple-600 dark:text-purple-400 p-3 rounded-lg">
                      <Store size={24} />
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-1">Total Restaurants</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalRestaurants}</p>
                </div>
              </Card>
            </Link>

            <Link to="/admin/orders">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 p-3 rounded-lg">
                      <ShoppingBag size={24} />
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-1">Active Orders</p>
                  <p className="text-3xl font-bold text-foreground">{stats.activeOrders}</p>
                </div>
              </Card>
            </Link>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-500/10 text-green-600 dark:text-green-400 p-3 rounded-lg">
                    <IndianRupee size={24} />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link to="/admin/users">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Manage Users</h3>
                    <p className="text-sm text-muted-foreground">View and manage all users</p>
                  </div>
                  <ArrowRight className="text-primary" size={24} />
                </div>
              </Card>
            </Link>

            <Link to="/admin/restaurants">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Manage Restaurants</h3>
                    <p className="text-sm text-muted-foreground">Approve and monitor restaurants</p>
                  </div>
                  <ArrowRight className="text-primary" size={24} />
                </div>
              </Card>
            </Link>

            <Link to="/admin/orders">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Monitor Orders</h3>
                    <p className="text-sm text-muted-foreground">Track all platform orders</p>
                  </div>
                  <ArrowRight className="text-primary" size={24} />
                </div>
              </Card>
            </Link>
          </div>

          {/* User Statistics */}
          {Object.keys(stats.usersByRole).length > 0 && (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">Users by Role</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-blue-500 mb-2">
                      {stats.usersByRole.CUSTOMER || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Customers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-amber-500 mb-2">
                      {stats.usersByRole.RESTAURANT_OWNER || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Restaurant Owners</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-emerald-500 mb-2">
                      {stats.usersByRole.DELIVERY_AGENT || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Delivery Agents</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-destructive mb-2">
                      {stats.usersByRole.ADMIN || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Administrators</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Platform Health */}
          <div className="mt-6">
            <Card className="p-6 bg-gradient-to-r from-[#D1FAE5] to-[#A7F3D0]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#10B981]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#064E3B] mb-1">Platform Status: Operational</h3>
                  <p className="text-sm text-[#065F46]">
                    All systems are running smoothly. {stats.activeOrders} orders currently being processed.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
