import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Search, SlidersHorizontal, Star, Clock, IndianRupee, X, ShoppingCart, LogOut, User } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import NotificationBell from '../components/NotificationBell';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import restaurantService from '../services/restaurantService';
import { formatCurrency } from '../utils/helpers';

export function RestaurantList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(() => {
    const cuisineFromUrl = searchParams.get('cuisineType');
    return {
      cuisineType: cuisineFromUrl ? [cuisineFromUrl] : [],
      minRating: 0,
      maxDeliveryTime: 60,
      onlyOpen: false,
      sortBy: 'rating'
    };
  });

  const cuisineTypes = ['Italian', 'American', 'Japanese', 'Mexican', 'Thai', 'Biryani', 'Pizza', 'Burgers', 'Chinese', 'South Indian', 'Desserts', 'Rolls', 'Thali'];

  useEffect(() => {
    loadRestaurants();
  }, [filters]);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const data = await restaurantService.getAll(filters);
      setRestaurants(data);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCuisineToggle = (cuisine) => {
    const newCuisines = filters.cuisineType.includes(cuisine)
      ? filters.cuisineType.filter(c => c !== cuisine)
      : [...filters.cuisineType, cuisine];
    setFilters({ ...filters, cuisineType: newCuisines });
  };

  const clearFilters = () => {
    setFilters({
      cuisineType: [],
      minRating: 0,
      maxDeliveryTime: 60,
      onlyOpen: false,
      sortBy: 'rating'
    });
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisineType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredRestaurants = restaurants.filter(r => r.rating >= 4.5 && r.status === 'OPEN').slice(0, 5);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const totalItems = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Top Navigation */}
      <nav className="bg-black/60 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#FF6B35] rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">F</span>
              </div>
              <Link to="/" className="text-xl font-bold text-white hover:text-[#FF6B35] transition-colors">FoodExpress</Link>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link to="/orders/history" className="text-white/60 hover:text-white text-sm transition-colors">
                    My Orders
                  </Link>
                  <NotificationBell />
                  <Link to="/checkout" className="relative">
                    <Button variant="outline" className="flex items-center gap-2 text-sm">
                      <ShoppingCart size={16} />
                      Cart
                      {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-[#FF6B35] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {totalItems}
                        </span>
                      )}
                    </Button>
                  </Link>
                  <div className="relative group">
                    <Button variant="ghost" className="flex items-center gap-2 text-sm">
                      <User size={16} />
                      {user?.name}
                    </Button>
                    <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <Link
                        to="/profile"
                        className="w-full text-left px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
                      >
                        <User size={14} />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
                      >
                        <LogOut size={14} />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/checkout" className="relative">
                    <Button variant="outline" className="flex items-center gap-2 text-sm">
                      <ShoppingCart size={16} />
                      Cart
                      {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-[#FF6B35] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {totalItems}
                        </span>
                      )}
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="primary" className="text-sm">Login</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/30" size={18} />
              <input
                type="text"
                placeholder="Search restaurants or cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/7 border border-white/15 text-white placeholder-white/30 rounded-xl focus:ring-2 focus:ring-[#FF6B35]/50 focus:border-[#FF6B35]/60 outline-none transition-all"
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={16} />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-64 flex-shrink-0`}>
            <Card className="sticky top-24">
              <div className="p-5 space-y-5">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-white">Filters</h3>
                  <button onClick={clearFilters} className="text-sm text-[#FF6B35] hover:text-[#ff8a5c] transition-colors">
                    Clear All
                  </button>
                </div>

                {/* Cuisine Type */}
                <div>
                  <h4 className="text-sm font-medium text-white/60 mb-3">Cuisine Type</h4>
                  <div className="space-y-2">
                    {cuisineTypes.map(cuisine => (
                      <label key={cuisine} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.cuisineType.includes(cuisine)}
                          onChange={() => handleCuisineToggle(cuisine)}
                          className="w-4 h-4 accent-[#FF6B35] rounded"
                        />
                        <span className="ml-2 text-sm text-white/70">{cuisine}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="text-sm font-medium text-white/60 mb-3">Minimum Rating</h4>
                  <input
                    type="range" min="0" max="5" step="0.5"
                    value={filters.minRating}
                    onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                    className="w-full accent-[#FF6B35]"
                  />
                  <div className="flex justify-between text-xs text-white/40 mt-1">
                    <span>0</span>
                    <span className="text-[#FF6B35]">{filters.minRating}+</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Delivery Time */}
                <div>
                  <h4 className="text-sm font-medium text-white/60 mb-3">Max Delivery Time</h4>
                  <input
                    type="range" min="15" max="60" step="5"
                    value={filters.maxDeliveryTime}
                    onChange={(e) => setFilters({ ...filters, maxDeliveryTime: parseInt(e.target.value) })}
                    className="w-full accent-[#FF6B35]"
                  />
                  <div className="flex justify-between text-xs text-white/40 mt-1">
                    <span>15 min</span>
                    <span className="text-[#FF6B35]">{filters.maxDeliveryTime} min</span>
                    <span>60 min</span>
                  </div>
                </div>

                {/* Only Open */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.onlyOpen}
                    onChange={(e) => setFilters({ ...filters, onlyOpen: e.target.checked })}
                    className="w-4 h-4 accent-[#FF6B35] rounded"
                  />
                  <span className="ml-2 text-sm text-white/70">Only Open Restaurants</span>
                </label>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Featured Restaurants */}
            {featuredRestaurants.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-white mb-4">Featured Restaurants</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                  {featuredRestaurants.map(restaurant => (
                    <Link
                      key={restaurant.id}
                      to={`/restaurants/${restaurant.id}`}
                      className="flex-shrink-0 w-64"
                    >
                      <Card hover className="h-full">
                        <img
                          src={restaurant.imageUrl}
                          alt={restaurant.name}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-bold text-white mb-1">{restaurant.name}</h3>
                          <p className="text-sm text-white/50 mb-2">{restaurant.cuisineType}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star size={14} className="text-[#F59E0B] fill-current" />
                              <span className="text-sm font-medium text-white">{restaurant.rating}</span>
                            </div>
                            <span className="text-white/20">•</span>
                            <div className="flex items-center gap-1">
                              <Clock size={14} className="text-white/40" />
                              <span className="text-sm text-white/60">{restaurant.deliveryTime} min</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Restaurants */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">
                {filteredRestaurants.length} restaurants found
              </h2>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="px-3 py-2 bg-white/7 border border-white/15 text-white rounded-lg focus:ring-2 focus:ring-[#FF6B35]/50 outline-none text-sm"
              >
                <option value="rating" className="bg-[#1a1a1a]">Sort by Rating</option>
                <option value="deliveryTime" className="bg-[#1a1a1a]">Sort by Delivery Time</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <LoadingSkeleton key={i} type="card" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRestaurants.map(restaurant => (
                  <Link key={restaurant.id} to={`/restaurants/${restaurant.id}`}>
                    <Card hover className="h-full">
                      <div className="relative">
                        <img
                          src={restaurant.imageUrl}
                          alt={restaurant.name}
                          className="w-full h-48 object-cover"
                        />
                        {restaurant.status === 'CLOSED' && (
                          <div className="absolute top-2 right-2">
                            <Badge variant="error">CLOSED</Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-white mb-1">{restaurant.name}</h3>
                        <p className="text-sm text-white/50 mb-3">{restaurant.cuisineType}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star size={14} className="text-[#F59E0B] fill-current" />
                            <span className="text-sm font-medium text-white">{restaurant.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-white/50">
                            <Clock size={14} />
                            <span className="text-sm">{restaurant.deliveryTime} min</span>
                          </div>
                          <div className="flex items-center gap-1 text-white/50">
                            <IndianRupee size={14} />
                            <span className="text-sm">{formatCurrency(restaurant.deliveryFee)}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {!loading && filteredRestaurants.length === 0 && (
              <div className="text-center py-16">
                <p className="text-white/40 mb-4">No restaurants found matching your criteria</p>
                <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
