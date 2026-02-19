import { useState, useEffect } from 'react';
import { Package, MapPin, Clock, IndianRupee, Calendar } from 'lucide-react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { AgentNav } from '../../components/AgentNav';
import { useAuth } from '../../context/AuthContext';
import deliveryService from '../../services/deliveryService';
import orderService from '../../services/orderService';
import { formatCurrency } from '../../utils/helpers';

export function AgentHistory() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month
  const [stats, setStats] = useState({
    total: 0,
    totalEarnings: 0,
    avgEarnings: 0
  });

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterDeliveries();
  }, [dateFilter, deliveries]);

  const loadHistory = async () => {
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
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDeliveries = () => {
    const now = new Date();
    let filtered = deliveries;

    if (dateFilter === 'today') {
      filtered = deliveries.filter(d => {
        const deliveryDate = new Date(d.deliveryTime);
        return deliveryDate.toDateString() === now.toDateString();
      });
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = deliveries.filter(d => new Date(d.deliveryTime) >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = deliveries.filter(d => new Date(d.deliveryTime) >= monthAgo);
    }

    setFilteredDeliveries(filtered);
    calculateStats(filtered);
  };

  const calculateStats = (deliveryList) => {
    const total = deliveryList.length;
    const totalEarnings = deliveryList.reduce((sum, d) =>
      sum + (d.deliveryFee || d.order?.deliveryFee || 2.99), 0
    );
    const avgEarnings = total > 0 ? totalEarnings / total : 0;

    setStats({ total, totalEarnings, avgEarnings });
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
          <h1 className="text-3xl font-bold text-white mb-2">Delivery History</h1>
          <p className="text-white/60">View your completed deliveries</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-blue-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-400 font-medium">Total Deliveries</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
              </div>
              <Package className="w-10 h-10 text-blue-400" />
            </div>
          </Card>

          <Card className="p-4 bg-emerald-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-400 font-medium">Total Earnings</p>
                <p className="text-2xl font-bold text-white mt-1">{formatCurrency(stats.totalEarnings)}</p>
              </div>
              <IndianRupee className="w-10 h-10 text-emerald-400" />
            </div>
          </Card>

          <Card className="p-4 bg-amber-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-400 font-medium">Avg per Delivery</p>
                <p className="text-2xl font-bold text-white mt-1">{formatCurrency(stats.avgEarnings)}</p>
              </div>
              <IndianRupee className="w-10 h-10 text-amber-400" />
            </div>
          </Card>
        </div>

        {/* Date Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'today', 'week', 'month'].map((filter) => (
            <button
              key={filter}
              onClick={() => setDateFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${dateFilter === filter
                ? 'bg-emerald-600 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
            >
              {filter === 'all' ? 'All Time' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Deliveries List */}
        {filteredDeliveries.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Deliveries Found</h3>
            <p className="text-white/60">Complete deliveries to see them here</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredDeliveries.map((delivery) => (
              <Card key={delivery.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-white">
                        Order #{delivery.orderId}
                      </h3>
                      <Badge variant="success">Delivered</Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-white">Pickup</p>
                          <p className="text-white/60">{delivery.pickupAddress}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-white">Delivery</p>
                          <p className="text-white/60">{delivery.deliveryAddress}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-white/40" />
                        <span className="text-white/60">
                          {formatDate(delivery.deliveryTime)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-white/40" />
                        <span className="text-white/60">
                          Duration: {getTimeTaken(delivery.pickupTime, delivery.deliveryTime)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-white/60 mb-1">Earned</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      {formatCurrency(delivery.deliveryFee || delivery.order?.deliveryFee || 2.99)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
