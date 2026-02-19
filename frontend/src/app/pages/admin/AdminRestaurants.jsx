import { useState, useEffect } from 'react';
import { Store, Search, CheckCircle, XCircle, Ban } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import { AdminNav } from '../../components/AdminNav';
import restaurantService from '../../services/restaurantService';
import { toast } from 'sonner';

export function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const allRestaurants = await restaurantService.getAll();
      setRestaurants(allRestaurants);
    } catch (error) {
      console.error('Error loading restaurants:', error);
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: restaurants.length,
    active: restaurants.filter(r => r.isActive).length,
    inactive: restaurants.filter(r => !r.isActive).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNav />
        <div className="flex items-center justify-center h-96">
          <div className="text-[#6B7280]">Loading restaurants...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Restaurant Management</h1>
          <p className="text-muted-foreground">Manage all platform restaurants</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Restaurants</p>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Active</p>
            <p className="text-2xl font-bold text-[#10B981]">{stats.active}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Inactive</p>
            <p className="text-2xl font-bold text-[#EF4444]">{stats.inactive}</p>
          </Card>
        </div>

        {/* Search */}
        <Card className="p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="text"
              placeholder="Search by name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.length === 0 ? (
            <Card className="col-span-full p-12 text-center">
              <Store className="w-12 h-12 mx-auto mb-2 text-muted-foreground/40" />
              <p className="text-muted-foreground">No restaurants found</p>
            </Card>
          ) : (
            filteredRestaurants.map((restaurant) => (
              <Card key={restaurant.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-1">{restaurant.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{restaurant.address}</p>
                    {restaurant.phone && (
                      <p className="text-xs text-muted-foreground">{restaurant.phone}</p>
                    )}
                  </div>
                  {restaurant.isActive ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="error">Inactive</Badge>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cuisine:</span>
                    <span className="text-white font-medium">{restaurant.cuisineType || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rating:</span>
                    <span className="text-white font-medium">
                      {restaurant.rating ? `${restaurant.rating} ⭐` : 'No ratings'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Owner ID:</span>
                    <span className="text-white font-medium">{restaurant.ownerId || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-[#10B981] hover:bg-green-500/10 hover:text-[#10B981]"
                  >
                    <CheckCircle size={16} className="mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-[#EF4444] hover:bg-red-500/10 hover:text-[#EF4444]"
                  >
                    <Ban size={16} className="mr-1" />
                    {restaurant.isActive ? 'Suspend' : 'Activate'}
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
