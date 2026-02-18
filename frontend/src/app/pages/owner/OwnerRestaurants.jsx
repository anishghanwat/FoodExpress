import { useState, useEffect } from 'react';
import { Plus, Edit, TrendingUp, MapPin, Phone, Clock, X, Star } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { OwnerNav } from '../../components/OwnerNav';
import { useAuth } from '../../context/AuthContext';
import restaurantService from '../../services/restaurantService';
import { toast } from 'sonner';

export function OwnerRestaurants() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    cuisine: 'Italian',
    imageUrl: ''
  });

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const data = await restaurantService.getOwnerRestaurants(user.id);
      console.log('Loaded restaurants:', data);
      setRestaurants(data);
    } catch (error) {
      console.error('Error loading restaurants:', error);
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const toggleRestaurantStatus = async (id) => {
    try {
      const restaurant = restaurants.find(r => r.id === id);
      if (!restaurant) return;

      // Update the restaurant status in the backend
      await restaurantService.update(id, {
        ...restaurant,
        isActive: !restaurant.isActive
      });

      // Update local state
      setRestaurants(restaurants.map(r => {
        if (r.id === id) {
          return {
            ...r,
            isActive: !r.isActive
          };
        }
        return r;
      }));

      toast.success(`Restaurant ${!restaurant.isActive ? 'opened' : 'closed'} successfully`);
    } catch (error) {
      console.error('Error toggling restaurant status:', error);
      toast.error('Failed to update restaurant status');
    }
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    try {
      const newRestaurant = {
        ...formData,
        ownerId: user.id,
        openingTime: '09:00',
        closingTime: '22:00',
        deliveryFee: 2.99,
        estimatedDeliveryTime: 30,
        description: 'A great place to eat',
        email: user.email,
        isActive: true
      };
      await restaurantService.create(newRestaurant);
      setShowAddModal(false);
      setFormData({
        name: '',
        address: '',
        phone: '',
        cuisine: 'Italian',
        imageUrl: ''
      });
      toast.success('Restaurant added successfully!');
      loadRestaurants();
    } catch (error) {
      console.error('Error adding restaurant:', error);
      toast.error('Failed to add restaurant');
    }
  };

  const handleEditRestaurant = async (e) => {
    e.preventDefault();
    try {
      await restaurantService.update(editingRestaurant.id, {
        ...formData,
        ownerId: user.id
      });
      setShowEditModal(false);
      setEditingRestaurant(null);
      setFormData({
        name: '',
        address: '',
        phone: '',
        cuisine: 'Italian',
        imageUrl: ''
      });
      toast.success('Restaurant updated successfully!');
      loadRestaurants();
    } catch (error) {
      console.error('Error updating restaurant:', error);
      toast.error('Failed to update restaurant');
    }
  };

  const openEditModal = (restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      address: restaurant.address,
      phone: restaurant.phone,
      cuisine: restaurant.cuisine,
      imageUrl: restaurant.imageUrl || ''
    });
    setShowEditModal(true);
  };

  const viewStats = (restaurant) => {
    // For now, just show a toast. Later can navigate to analytics page
    toast.info(`Viewing stats for ${restaurant.name} - Coming soon!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-[#6B7280]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <OwnerNav />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">My Restaurants</h1>
            <p className="text-white/60">Manage your restaurant locations</p>
          </div>

          {/* Add New Restaurant Button */}
          <div className="flex justify-end mb-6">
            <Button className="bg-[#FF6B35] hover:bg-[#FF5722] text-white" onClick={() => setShowAddModal(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add New Restaurant
            </Button>
          </div>

          {/* Restaurants Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {restaurants.map((restaurant) => (
              <Card key={restaurant.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  {/* Restaurant Image */}
                  <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0">
                    <img
                      src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Restaurant Details */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{restaurant.name}</h3>
                        <Badge variant={restaurant.isActive ? 'success' : 'default'}>
                          {restaurant.isActive ? 'OPEN' : 'CLOSED'}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={restaurant.isActive}
                            onChange={() => toggleRestaurantStatus(restaurant.id)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#DBEAFE]/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10B981]"></div>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start text-sm text-white/60">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{restaurant.address}</span>
                      </div>
                      <div className="flex items-center text-sm text-white/60">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{restaurant.phone}</span>
                      </div>
                      <div className="flex items-center text-sm text-white/60">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{restaurant.cuisine} Cuisine</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-xs text-white/60 mb-1">Rating</p>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24] mr-1" />
                          <p className="text-lg font-bold text-white">{restaurant.rating || 'N/A'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-white/60 mb-1">Reviews</p>
                        <p className="text-lg font-bold text-white">{restaurant.totalReviews || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/60 mb-1">Delivery</p>
                        <p className="text-lg font-bold text-white">{restaurant.estimatedDeliveryTime || 'N/A'} min</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => openEditModal(restaurant)}
                        variant="outline"
                        className="flex-1 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => viewStats(restaurant)}
                        variant="outline"
                        className="flex-1 border-[#004E89] text-[#004E89] hover:bg-[#004E89] hover:text-white"
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        View Stats
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {restaurants.length === 0 && (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-white/40" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Restaurants Yet</h3>
                <p className="text-white/60 mb-6">
                  Get started by adding your first restaurant location
                </p>
                <Button className="bg-[#FF6B35] hover:bg-[#FF5722] text-white" onClick={() => setShowAddModal(true)}>
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Restaurant
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Add Restaurant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Add New Restaurant</h2>
              <button className="text-white/60 hover:text-white" onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddRestaurant}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-white/60">Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md shadow-sm text-white focus:outline-none focus:ring-[#FF6B35] focus:border-[#FF6B35] sm:text-sm placeholder-white/20"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-white/60">Address</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md shadow-sm text-white focus:outline-none focus:ring-[#FF6B35] focus:border-[#FF6B35] sm:text-sm placeholder-white/20"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-white/60">Phone</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md shadow-sm text-white focus:outline-none focus:ring-[#FF6B35] focus:border-[#FF6B35] sm:text-sm placeholder-white/20"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-white/60">Cuisine Type</label>
                <select
                  className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md shadow-sm text-white focus:outline-none focus:ring-[#FF6B35] focus:border-[#FF6B35] sm:text-sm"
                  value={formData.cuisine}
                  onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                >
                  <option className="bg-[#1a1a1a]" value="Italian">Italian</option>
                  <option className="bg-[#1a1a1a]" value="American">American</option>
                  <option className="bg-[#1a1a1a]" value="Mexican">Mexican</option>
                  <option className="bg-[#1a1a1a]" value="Chinese">Chinese</option>
                  <option className="bg-[#1a1a1a]" value="Indian">Indian</option>
                  <option className="bg-[#1a1a1a]" value="Japanese">Japanese</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-white/60">Image URL</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md shadow-sm text-white focus:outline-none focus:ring-[#FF6B35] focus:border-[#FF6B35] sm:text-sm placeholder-white/20"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div className="flex justify-end">
                <Button className="bg-[#FF6B35] hover:bg-[#FF5722] text-white" type="submit">
                  Add Restaurant
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Restaurant Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Edit Restaurant</h2>
              <button className="text-white/60 hover:text-white" onClick={() => setShowEditModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditRestaurant}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-white/60">Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md shadow-sm text-white focus:outline-none focus:ring-[#FF6B35] focus:border-[#FF6B35] sm:text-sm placeholder-white/20"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-white/60">Address</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md shadow-sm text-white focus:outline-none focus:ring-[#FF6B35] focus:border-[#FF6B35] sm:text-sm placeholder-white/20"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-white/60">Phone</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md shadow-sm text-white focus:outline-none focus:ring-[#FF6B35] focus:border-[#FF6B35] sm:text-sm placeholder-white/20"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-white/60">Cuisine Type</label>
                <select
                  className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md shadow-sm text-white focus:outline-none focus:ring-[#FF6B35] focus:border-[#FF6B35] sm:text-sm"
                  value={formData.cuisine}
                  onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                >
                  <option className="bg-[#1a1a1a]" value="Italian">Italian</option>
                  <option className="bg-[#1a1a1a]" value="American">American</option>
                  <option className="bg-[#1a1a1a]" value="Mexican">Mexican</option>
                  <option className="bg-[#1a1a1a]" value="Chinese">Chinese</option>
                  <option className="bg-[#1a1a1a]" value="Indian">Indian</option>
                  <option className="bg-[#1a1a1a]" value="Japanese">Japanese</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-white/60">Image URL</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md shadow-sm text-white focus:outline-none focus:ring-[#FF6B35] focus:border-[#FF6B35] sm:text-sm placeholder-white/20"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div className="flex justify-end">
                <Button className="bg-[#FF6B35] hover:bg-[#FF5722] text-white" type="submit">
                  Update Restaurant
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
