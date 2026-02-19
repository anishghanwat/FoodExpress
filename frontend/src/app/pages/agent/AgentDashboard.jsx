import { useState, useEffect } from 'react';
import { Package, IndianRupee, TrendingUp, Clock, CheckCircle, Truck } from 'lucide-react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { AgentNav } from '../../components/AgentNav';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import deliveryService from '../../services/deliveryService';
import { formatCurrency } from '../../utils/helpers';

export function AgentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayDeliveries: 0,
    todayEarnings: 0,
    activeDeliveries: 0,
    totalDeliveries: 0,
    totalEarnings: 0,
    avgDeliveryTime: 0,
    completionRate: 100
  });
  const [recentDeliveries, setRecentDeliveries] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fetch all agent deliveries
      const allDeliveries = await deliveryService.getAgentDeliveries(user.id);

      // Calculate stats
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Today's deliveries
      const todayDelivered = allDeliveries.filter(d =>
        d.status === 'DELIVERED' && new Date(d.deliveryTime) >= todayStart
      );

      // Active deliveries
      const active = allDeliveries.filter(d =>
        ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'].includes(d.status)
      );

      // All completed deliveries
      const completed = allDeliveries.filter(d => d.status === 'DELIVERED');

      // Calculate earnings
      const todayEarnings = todayDelivered.reduce((sum, d) => sum + (d.deliveryFee || 2.99), 0);
      const totalEarnings = completed.reduce((sum, d) => sum + (d.deliveryFee || 2.99), 0);

      // Calculate average delivery time
      const deliveriesWithTime = completed.filter(d => d.pickupTime && d.deliveryTime);
      const avgTime = deliveriesWithTime.length > 0
        ? deliveriesWithTime.reduce((sum, d) => {
          const duration = new Date(d.deliveryTime) - new Date(d.pickupTime);
          return sum + duration;
        }, 0) / deliveriesWithTime.length / 60000 // Convert to minutes
        : 0;

      // Completion rate (assuming all delivered orders were completed successfully)
      const totalAssigned = allDeliveries.filter(d =>
        ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'].includes(d.status)
      ).length;
      const completionRate = totalAssigned > 0 ? (completed.length / totalAssigned) * 100 : 100;

      setStats({
        todayDeliveries: todayDelivered.length,
        todayEarnings,
        activeDeliveries: active.length,
        totalDeliveries: completed.length,
        totalEarnings,
        avgDeliveryTime: Math.round(avgTime),
        completionRate: Math.round(completionRate)
      });

      // Get recent deliveries (last 5)
      const recent = completed
        .sort((a, b) => new Date(b.deliveryTime) - new Date(a.deliveryTime))
        .slice(0, 5);
      setRecentDeliveries(recent);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeTaken = (pickup, delivery) => {
    if (!pickup || !delivery) return 'N/A';
    const diff = new Date(delivery) - new Date(pickup);
    const minutes = Math.floor(diff / 60000);
    return `${minutes} min`;
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
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.name || 'Agent'}!
          </h1>
          <p className="text-muted-foreground">Here's your delivery overview</p>
        </div>

        {/* Today's Stats */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Today's Performance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-6 bg-gradient-to-br from-[#10B981] to-[#059669]">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-sm opacity-90 mb-1">Deliveries</p>
                  <p className="text-3xl font-bold">{stats.todayDeliveries}</p>
                </div>
                <Package className="w-12 h-12 opacity-80" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-[#3B82F6] to-[#2563EB]">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-sm opacity-90 mb-1">Earnings</p>
                  <p className="text-3xl font-bold">{formatCurrency(stats.todayEarnings)}</p>
                </div>
                <IndianRupee className="w-12 h-12 opacity-80" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-[#F59E0B] to-[#D97706]">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-sm opacity-90 mb-1">Active</p>
                  <p className="text-3xl font-bold">{stats.activeDeliveries}</p>
                </div>
                <Truck className="w-12 h-12 opacity-80" />
              </div>
            </Card>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Overall Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Deliveries</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalDeliveries}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalEarnings)}</p>
                </div>
                <IndianRupee className="w-10 h-10 text-emerald-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Time</p>
                  <p className="text-2xl font-bold text-foreground">{stats.avgDeliveryTime} min</p>
                </div>
                <Clock className="w-10 h-10 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                  <p className="text-2xl font-bold text-foreground">{stats.completionRate}%</p>
                </div>
                <TrendingUp className="w-10 h-10 text-emerald-500" />
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/agent/queue')}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Package className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">View Queue</p>
                  <p className="text-sm text-muted-foreground">Accept new deliveries</p>
                </div>
              </div>
            </Card>

            <Card
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/agent/active')}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-lg">
                  <Truck className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Active Deliveries</p>
                  <p className="text-sm text-muted-foreground">{stats.activeDeliveries} in progress</p>
                </div>
              </div>
            </Card>

            <Card
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/agent/history')}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">View History</p>
                  <p className="text-sm text-muted-foreground">{stats.totalDeliveries} completed</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Deliveries */}
        {recentDeliveries.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Deliveries</h2>
              <button
                onClick={() => navigate('/agent/history')}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {recentDeliveries.map((delivery) => (
                <Card key={delivery.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Order #{delivery.orderId}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(delivery.deliveryTime)} • {getTimeTaken(delivery.pickupTime, delivery.deliveryTime)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400">
                        +{formatCurrency(delivery.deliveryFee || 2.99)}
                      </p>
                      <Badge variant="success" className="text-xs">Delivered</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
