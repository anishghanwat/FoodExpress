import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter, Download } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import { AdminNav } from '../../components/AdminNav';
import orderService from '../../services/orderService';
import { formatCurrency } from '../../utils/helpers';
import { toast } from 'sonner';

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const allOrders = await orderService.getAll();
      setOrders(allOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    const variants = {
      PENDING: 'warning',
      CONFIRMED: 'info',
      PREPARING: 'info',
      READY_FOR_PICKUP: 'info',
      OUT_FOR_DELIVERY: 'info',
      DELIVERED: 'success',
      CANCELLED: 'error'
    };
    return variants[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDING: 'Pending',
      CONFIRMED: 'Confirmed',
      PREPARING: 'Preparing',
      READY_FOR_PICKUP: 'Ready for Pickup',
      OUT_FOR_DELIVERY: 'Out for Delivery',
      DELIVERED: 'Delivered',
      CANCELLED: 'Cancelled'
    };
    return labels[status] || status;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id?.toString().includes(searchQuery) ||
      order.deliveryAddress?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    active: orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status)).length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    cancelled: orders.filter(o => o.status === 'CANCELLED').length,
    revenue: orders
      .filter(o => o.status === 'DELIVERED')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  };

  const handleExport = () => {
    const csv = [
      ['Order ID', 'Restaurant', 'Status', 'Amount', 'Date', 'Items'].join(','),
      ...filteredOrders.map(order => [
        order.id,
        `Restaurant #${order.restaurantId}`,
        order.status,
        order.totalAmount?.toFixed(2) || '0.00',
        new Date(order.createdAt).toLocaleDateString(),
        order.items?.length || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Orders exported successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        <AdminNav />
        <div className="flex items-center justify-center h-96">
          <div className="text-[#6B7280]">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Order Management</h1>
            <p className="text-muted-foreground">Monitor all platform orders</p>
          </div>
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download size={18} />
            Export
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Active</p>
            <p className="text-2xl font-bold text-[#F59E0B]">{stats.active}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Delivered</p>
            <p className="text-2xl font-bold text-[#10B981]">{stats.delivered}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Cancelled</p>
            <p className="text-2xl font-bold text-[#EF4444]">{stats.cancelled}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Revenue</p>
            <p className="text-2xl font-bold text-[#10B981]">{formatCurrency(stats.revenue)}</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  type="text"
                  placeholder="Search by order ID or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-[#6B7280]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-input border border-border text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option className="bg-card" value="ALL">All Status</option>
                <option className="bg-card" value="PENDING">Pending</option>
                <option className="bg-card" value="CONFIRMED">Confirmed</option>
                <option className="bg-card" value="PREPARING">Preparing</option>
                <option className="bg-card" value="READY_FOR_PICKUP">Ready for Pickup</option>
                <option className="bg-card" value="OUT_FOR_DELIVERY">Out for Delivery</option>
                <option className="bg-card" value="DELIVERED">Delivered</option>
                <option className="bg-card" value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-muted-foreground" />
            </div>
          </div>
        </Card>

        {/* Orders Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Restaurant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Items
                  </th>
                </tr>
              </thead>
              <tbody className="bg-transparent divide-y divide-white/10">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-muted-foreground/40" />
                      <p>No orders found</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[#FF6B35]">#{order.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground">Restaurant #{order.restaurantId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">
                          {formatCurrency(order.totalAmount || 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                        <div className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {order.items?.length || 0} items
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
