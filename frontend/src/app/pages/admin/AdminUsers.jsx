import { useState, useEffect } from 'react';
import { Users, Search, Edit, Ban, CheckCircle, Trash2, Filter } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import { AdminNav } from '../../components/AdminNav';
import adminService from '../../services/adminService';
import { toast } from 'sonner';

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalItems: 0
  });

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const loadUsers = async (page = 0) => {
    try {
      setLoading(true);
      const params = { page, size: 20 };
      if (roleFilter !== 'ALL') {
        params.role = roleFilter;
      }

      const response = await adminService.users.getAll(params);
      setUsers(response.users || []);
      setPagination({
        currentPage: response.currentPage || 0,
        totalPages: response.totalPages || 0,
        totalItems: response.totalItems || 0
      });
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (userId) => {
    if (!confirm('Are you sure you want to suspend this user?')) return;

    try {
      await adminService.users.suspend(userId, 'Suspended by admin');
      toast.success('User suspended successfully');
      loadUsers(pagination.currentPage);
    } catch (error) {
      console.error('Error suspending user:', error);
      toast.error('Failed to suspend user');
    }
  };

  const handleActivate = async (userId) => {
    try {
      await adminService.users.activate(userId);
      toast.success('User activated successfully');
      loadUsers(pagination.currentPage);
    } catch (error) {
      console.error('Error activating user:', error);
      toast.error('Failed to activate user');
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      await adminService.users.delete(userId);
      toast.success('User deleted successfully');
      loadUsers(pagination.currentPage);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const getRoleBadgeVariant = (role) => {
    const variants = {
      ADMIN: 'error',
      RESTAURANT_OWNER: 'warning',
      DELIVERY_AGENT: 'info',
      CUSTOMER: 'default'
    };
    return variants[role] || 'default';
  };

  const getRoleLabel = (role) => {
    const labels = {
      ADMIN: 'Admin',
      RESTAURANT_OWNER: 'Restaurant Owner',
      DELIVERY_AGENT: 'Delivery Agent',
      CUSTOMER: 'Customer'
    };
    return labels[role] || role;
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <AdminNav />
        <div className="flex items-center justify-center h-96">
          <div className="text-[#6B7280]">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-white/60">Manage all platform users</p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-white/40" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              >
                <option className="bg-[#1a1a1a]" value="ALL">All Roles</option>
                <option className="bg-[#1a1a1a]" value="CUSTOMER">Customers</option>
                <option className="bg-[#1a1a1a]" value="RESTAURANT_OWNER">Restaurant Owners</option>
                <option className="bg-[#1a1a1a]" value="DELIVERY_AGENT">Delivery Agents</option>
                <option className="bg-[#1a1a1a]" value="ADMIN">Admins</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-6 text-sm text-white/60">
            <span>Total: {pagination.totalItems}</span>
            <span>Page: {pagination.currentPage + 1} of {pagination.totalPages}</span>
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-transparent divide-y divide-white/10">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-white/60">
                      <Users className="w-12 h-12 mx-auto mb-2 text-white/20" />
                      <p>No users found</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-sm text-white/60">{user.email}</div>
                          {user.phone && (
                            <div className="text-xs text-white/40">{user.phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.active ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="error">Suspended</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {user.active ? (
                            <Button
                              onClick={() => handleSuspend(user.id)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Ban size={16} className="mr-1" />
                              Suspend
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleActivate(user.id)}
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:bg-green-50"
                            >
                              <CheckCircle size={16} className="mr-1" />
                              Activate
                            </Button>
                          )}
                          <Button
                            onClick={() => handleDelete(user.id)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
              <Button
                onClick={() => loadUsers(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 0}
                variant="outline"
              >
                Previous
              </Button>
              <span className="text-sm text-white/60">
                Page {pagination.currentPage + 1} of {pagination.totalPages}
              </span>
              <Button
                onClick={() => loadUsers(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages - 1}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
