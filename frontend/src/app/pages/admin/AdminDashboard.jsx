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
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
          <p className="text-[#6B7280]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <AdminNav />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-white/60">System overview and monitoring</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link to="/admin/users">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                      <Users size={24} />
                    </div>
                  </div>
                  <p className="text-white/60 text-sm mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                </div>
              </Card>
            </Link>

            <Link to="/admin/restaurants">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
                      <Store size={24} />
                    </div>
                  </div>
                  <p className="text-white/60 text-sm mb-1">Total Restaurants</p>
                  <p className="text-3xl font-bold text-white">{stats.totalRestaurants}</p>
                </div>
              </Card>
            </Link>

            <Link to="/admin/orders">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-amber-50 text-amber-600 p-3 rounded-lg">
                      <ShoppingBag size={24} />
                    </div>
                  </div>
                  <p className="text-white/60 text-sm mb-1">Active Orders</p>
                  <p className="text-3xl font-bold text-white">{stats.activeOrders}</p>
                </div>
              </Card>
            </Link>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-50 text-green-600 p-3 rounded-lg">
                    <IndianRupee size={24} />
                  </div>
                </div>
                <p className="text-white/60 text-sm mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link to="/admin/users">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#FF6B35]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white mb-1">Manage Users</h3>
                    <p className="text-sm text-white/60">View and manage all users</p>
                  </div>
                  <ArrowRight className="text-[#FF6B35]" size={24} />
                </div>
              </Card>
            </Link>

            <Link to="/admin/restaurants">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#FF6B35]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white mb-1">Manage Restaurants</h3>
                    <p className="text-sm text-white/60">Approve and monitor restaurants</p>
                  </div>
                  <ArrowRight className="text-[#FF6B35]" size={24} />
                </div>
              </Card>
            </Link>

            <Link to="/admin/orders">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#FF6B35]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white mb-1">Monitor Orders</h3>
                    <p className="text-sm text-white/60">Track all platform orders</p>
                  </div>
                  <ArrowRight className="text-[#FF6B35]" size={24} />
                </div>
              </Card>
            </Link>
          </div>

          {/* User Statistics */}
          {Object.keys(stats.usersByRole).length > 0 && (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Users by Role</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-[#3B82F6] mb-2">
                      {stats.usersByRole.CUSTOMER || 0}
                    </p>
                    <p className="text-sm text-white/60">Customers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-[#F59E0B] mb-2">
                      {stats.usersByRole.RESTAURANT_OWNER || 0}
                    </p>
                    <p className="text-sm text-white/60">Restaurant Owners</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-[#10B981] mb-2">
                      {stats.usersByRole.DELIVERY_AGENT || 0}
                    </p>
                    <p className="text-sm text-white/60">Delivery Agents</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-[#EF4444] mb-2">
                      {stats.usersByRole.ADMIN || 0}
                    </p>
                    <p className="text-sm text-white/60">Administrators</p>
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
