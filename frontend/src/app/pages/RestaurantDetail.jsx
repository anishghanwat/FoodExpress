import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, Star, Clock, IndianRupee, Plus, Minus, ShoppingCart, Leaf } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import restaurantService from '../services/restaurantService';
import menuService from '../services/menuService';
import { formatCurrency } from '../utils/helpers';
import { toast } from 'sonner';
import { ThemeToggle } from '../components/ThemeToggle';

export function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, addItem, updateQuantity, getItemQuantity } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    loadRestaurantData();
  }, [id]);

  const loadRestaurantData = async () => {
    setLoading(true);
    try {
      const [restaurantData, menuData] = await Promise.all([
        restaurantService.getById(id),
        menuService.getByRestaurantId(id)
      ]);
      setRestaurant(restaurantData);
      setMenuItems(menuData);
    } catch (error) {
      console.error('Error loading restaurant:', error);
      toast.error('Failed to load restaurant data');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = (item) => {
    if (restaurant.status === 'CLOSED') {
      toast.error('Restaurant is currently closed');
      return;
    }

    if (!item.isAvailable) {
      toast.error('This item is currently unavailable');
      return;
    }

    addItem(
      {
        id: item.id,
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: 1
      },
      {
        id: parseInt(id),
        name: restaurant.name
      }
    );
  };

  const handleUpdateQuantity = (menuItemId, change) => {
    const currentQuantity = getItemQuantity(menuItemId);
    const newQuantity = currentQuantity + change;
    updateQuantity(menuItemId, newQuantity);

    if (newQuantity === 0) {
      toast.success('Removed from cart');
    }
  };

  const totalItems = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalCartPrice = cart?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSkeleton type="text" />
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Restaurant not found</p>
          <Button onClick={() => navigate('/restaurants')} variant="outline">Back to Restaurants</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/restaurants')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <Link to="/" className="text-lg font-bold text-foreground hover:text-primary transition-colors">FoodExpress</Link>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link to="/checkout">
                <Button variant="outline" className="flex items-center gap-2 text-sm">
                  <ShoppingCart size={16} />
                  Cart ({totalItems})
                </Button>
              </Link>
              {!user && (
                <Link to="/login">
                  <Button variant="primary" className="text-sm">Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Restaurant Hero */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 text-white p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold">{restaurant.name}</h1>
              <Badge variant={restaurant.status === 'OPEN' ? 'success' : 'error'}>
                {restaurant.status}
              </Badge>
            </div>
            <p className="text-lg opacity-90 mb-4">{restaurant.description}</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Star size={20} className="text-[#F59E0B] fill-current" />
                <span className="font-medium">{restaurant.rating}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={20} />
                <span>{restaurant.deliveryTime} min</span>
              </div>
              <div className="flex items-center gap-2">
                <IndianRupee size={20} />
                <span>{formatCurrency(restaurant.deliveryFee)} delivery</span>
              </div>
              <div className="text-sm opacity-75">
                {restaurant.cuisineType} Cuisine
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm transition-all ${selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 border border-border text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        {menuItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No menu items available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map(item => {
              const quantity = getItemQuantity(item.id);

              return (
                <Card key={item.id} className="overflow-hidden">
                  <div className="flex gap-4 p-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-card-foreground mb-1">{item.name}</h3>
                          {item.isVeg && (
                            <div className="inline-flex items-center gap-1 text-[#10B981] text-xs">
                              <Leaf size={12} />
                              <span>Veg</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      <p className="text-base font-bold text-primary mb-3">
                        {formatCurrency(item.price)}
                      </p>

                      {quantity === 0 ? (
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.isAvailable || restaurant.status === 'CLOSED'}
                          className="w-full"
                        >
                          {item.isAvailable ? 'Add to Cart' : 'Unavailable'}
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleUpdateQuantity(item.id, -1)} className="px-2">
                            <Minus size={14} />
                          </Button>
                          <span className="font-medium min-w-[2rem] text-center text-card-foreground">{quantity}</span>
                          <Button size="sm" onClick={() => handleUpdateQuantity(item.id, 1)} className="px-2">
                            <Plus size={14} />
                          </Button>
                        </div>
                      )}
                    </div>

                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky Cart Bar — Swiggy-style */}
      {
        totalItems > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none">
            <Link to="/checkout" className="pointer-events-auto block">
              <div
                className="max-w-2xl mx-auto bg-primary text-primary-foreground rounded-2xl shadow-2xl shadow-primary/30 flex items-center justify-between px-5 py-4 transition-all duration-300"
                style={{ animation: 'slideUp 0.3s ease-out' }}
              >
                {/* Left: item count badge + restaurant */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-foreground/20 rounded-xl flex items-center justify-center font-bold text-primary-foreground text-sm">
                    {totalItems}
                  </div>
                  <div>
                    <div className="text-primary-foreground font-semibold text-sm leading-tight">
                      {totalItems} item{totalItems > 1 ? 's' : ''} in cart
                    </div>
                    <div className="text-primary-foreground/70 text-xs">
                      {restaurant?.name}
                    </div>
                  </div>
                </div>

                {/* Right: total + arrow */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-primary-foreground font-bold text-base">{formatCurrency(totalCartPrice)}</div>
                    <div className="text-primary-foreground/70 text-xs">+ taxes</div>
                  </div>
                  <div className="flex items-center gap-1 text-primary-foreground font-semibold text-sm">
                    View Cart
                    <ShoppingCart size={16} className="ml-1" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )
      }

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div >
  );
}
