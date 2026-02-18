import { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, Calendar, Package, Clock } from 'lucide-react';
import { Card } from '../../components/Card';
import { AgentNav } from '../../components/AgentNav';
import { useAuth } from '../../context/AuthContext';
import deliveryService from '../../services/deliveryService';
import orderService from '../../services/orderService';
import { formatCurrency } from '../../utils/helpers';

export function AgentEarnings() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    week: 0,
    month: 0,
    avgPerDelivery: 0,
    totalDeliveries: 0
  });

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      const allDeliveries = await deliveryService.getAgentDeliveries(user.id);

      // Only show completed deliveries
      const completed = allDeliveries.filter(d => d.status === 'DELIVERED');

      // Fetch order details for each delivery
      const deliveriesWithOrders = await Promise.all(
        completed.map(async (delivery) => {
          try {
            const order = await orderService.getById(delivery.orderId);
            return { ...delivery, order };
          } catch (error) {
            return delivery;
          }
        })
      );

      setDeliveries(deliveriesWithOrders);
      calculateStats(deliveriesWithOrders);
    } catch (error) {
      console.error('Error loading earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (deliveryList) => {
    const now = new Date();
    const today = now.toDateString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let total = 0;
    let todayEarnings = 0;
    let weekEarnings = 0;
    let monthEarnings = 0;

    deliveryList.forEach(d => {
      const fee = d.deliveryFee || d.order?.deliveryFee || 2.99;
      const deliveryDate = new Date(d.deliveryTime);

      total += fee;

      if (deliveryDate.toDateString() === today) {
        todayEarnings += fee;
      }
      if (deliveryDate >= weekAgo) {
        weekEarnings += fee;
      }
      if (deliveryDate >= monthAgo) {
        monthEarnings += fee;
      }
    });

    setStats({
      total,
      today: todayEarnings,
      week: weekEarnings,
      month: monthEarnings,
      avgPerDelivery: deliveryList.length > 0 ? total / deliveryList.length : 0,
      totalDeliveries: deliveryList.length
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <AgentNav />
        <div className="flex items-center justify-center h-96">
          <div className="text-white/60">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <AgentNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Earnings</h1>
          <p className="text-white/60">Track your delivery earnings</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-[#10B981] to-[#059669]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-white/80 font-medium">Total Earnings</p>
              <IndianRupee className="w-8 h-8 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(stats.total)}</p>
            <p className="text-xs text-white/70 mt-1">{stats.totalDeliveries} deliveries</p>
          </Card>

          <Card className="p-6 bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-white/60 font-medium">Today</p>
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(stats.today)}</p>
          </Card>

          <Card className="p-6 bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-white/60 font-medium">This Week</p>
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(stats.week)}</p>
          </Card>

          <Card className="p-6 bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-white/60 font-medium">This Month</p>
              <Package className="w-6 h-6 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(stats.month)}</p>
          </Card>
        </div>

        {/* Average Earnings */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Average per Delivery</h3>
              <p className="text-sm text-white/60">Your typical earnings</p>
            </div>
          </div>
          <p className="text-4xl font-bold text-blue-400">{formatCurrency(stats.avgPerDelivery)}</p>
        </Card>

        {/* Earnings Breakdown */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Earnings Breakdown</h2>
        </div>

        {deliveries.length === 0 ? (
          <Card className="p-12 text-center">
            <IndianRupee className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Earnings Yet</h3>
            <p className="text-white/60">Complete deliveries to start earning</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {deliveries.map((delivery) => {
              const fee = delivery.deliveryFee || delivery.order?.deliveryFee || 2.99;

              return (
                <Card key={delivery.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-bold text-white">Order #{delivery.orderId}</p>
                        <div className="flex items-center gap-2 text-sm text-white/60 mt-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(delivery.deliveryTime)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-400">+{formatCurrency(fee)}</p>
                      <p className="text-xs text-white/60">Delivery Fee</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
