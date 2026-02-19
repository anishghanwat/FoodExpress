import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { OwnerNav } from '../../components/OwnerNav';
import { useAuth } from '../../context/AuthContext';
import restaurantService from '../../services/restaurantService';
import menuService from '../../services/menuService';
import { formatCurrency } from '../../utils/helpers';
import { toast } from 'sonner';

export function OwnerMenu() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main',
    imageUrl: '',
    isVegetarian: false
  });

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurant) {
      loadMenuItems();
    }
  }, [selectedRestaurant]);

  const loadRestaurants = async () => {
    try {
      const data = await restaurantService.getOwnerRestaurants(user.id);
      setRestaurants(data);
      if (data.length > 0) {
        setSelectedRestaurant(data[0].id);
      }
    } catch (error) {
      console.error('Error loading restaurants:', error);
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const loadMenuItems = async () => {
    try {
      const items = await menuService.getByRestaurantId(selectedRestaurant);
      console.log('Loaded menu items:', items);
      setMenuItems(items);
    } catch (error) {
      console.error('Error loading menu items:', error);
      toast.error('Failed to load menu items');
      setMenuItems([]);
    }
  };

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleAvailability = async (id) => {
    try {
      const item = menuItems.find(i => i.id === id);
      const updated = { ...item, isAvailable: !item.isAvailable };
      await menuService.update(id, updated);
      setMenuItems(menuItems.map(i => i.id === id ? updated : i));
      toast.success('Availability updated');
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const deleteMenuItem = async (id) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      await menuService.delete(id);
      setMenuItems(menuItems.filter(item => item.id !== id));
      toast.success('Menu item deleted');
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const itemData = {
        restaurantId: selectedRestaurant,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
        isAvailable: true,
        isVegetarian: formData.isVegetarian
      };

      if (editingItem) {
        await menuService.update(editingItem.id, itemData);
        toast.success('Menu item updated');
      } else {
        await menuService.create(itemData);
        toast.success('Menu item added');
      }

      closeModal();
      loadMenuItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error('Failed to save menu item');
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Main',
      imageUrl: '',
      isVegetarian: false
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      imageUrl: item.imageUrl || '',
      isVegetarian: item.isVegetarian || false
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Main',
      imageUrl: '',
      isVegetarian: false
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-[#6B7280]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <OwnerNav />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Menu Management</h1>
            <p className="text-muted-foreground">Add, edit, and manage your menu items</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Select Restaurant
              </label>
              <select
                value={selectedRestaurant || ''}
                onChange={(e) => setSelectedRestaurant(Number(e.target.value))}
                className="w-full sm:w-64 px-4 py-2 bg-input border border-border text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {restaurants.map((restaurant) => (
                  <option className="bg-card" key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>
            <Button className="bg-[#FF6B35] hover:bg-[#FF5722] text-white w-full sm:w-auto" onClick={openAddModal}>
              <Plus className="w-5 h-5 mr-2" />
              Add Menu Item
            </Button>
          </div>

          <Card className="p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 px-4 py-2 bg-input border border-border text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none placeholder-muted-foreground"
                  />
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${selectedCategory === category
                      ? 'bg-[#FF6B35] text-white'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Available
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-transparent divide-y divide-white/10">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                          />
                          <div>
                            <p className="font-medium text-foreground">{item.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="default">{item.category}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.isAvailable}
                            onChange={() => toggleAvailability(item.id)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#DBEAFE]/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10B981]"></div>
                        </label>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="text-[#FF6B35] hover:text-[#FF5722] p-2 hover:bg-[#FF6B35]/10 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteMenuItem(item.id)}
                            className="text-[#EF4444] hover:text-[#DC2626] p-2 hover:bg-[#EF4444]/10 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredItems.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">No menu items found</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-card border border-border p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-input border border-border text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none placeholder-muted-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 bg-input border border-border text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-input border border-border text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Vegetarian</label>
                  <div className="flex items-center h-10">
                    <input
                      type="checkbox"
                      checked={formData.isVegetarian}
                      onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                      className="w-4 h-4 text-[#FF6B35] bg-muted/50 border-border rounded focus:ring-[#FF6B35]"
                    />
                    <label className="ml-2 text-sm text-muted-foreground">This item is vegetarian</label>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-input border border-border text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none placeholder-muted-foreground"
                    rows="3"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Image URL</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 bg-input border border-border text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none placeholder-muted-foreground"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#FF6B35] hover:bg-[#FF5722] text-white">
                  {editingItem ? 'Update' : 'Add'} Item
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
