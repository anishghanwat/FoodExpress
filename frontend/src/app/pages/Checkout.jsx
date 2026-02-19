import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft, MapPin, CreditCard, Wallet, IndianRupee, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import orderService from '../services/orderService';
import paymentService from '../services/paymentService';
import { formatCurrency } from '../utils/helpers';
import { toast } from 'sonner';
import { ThemeToggle } from '../components/ThemeToggle';

export function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, updateQuantity, removeFromCart, clearCart, restaurant } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    address: '123 Customer St',
    apartment: 'Apt 4B',
    city: 'City',
    state: 'State',
    zipCode: '12345',
    phone: '+1234567890',
    paymentMethod: 'CARD'
  });

  useEffect(() => {
    if (!cart || cart.length === 0) {
      if (!orderPlaced) {
        navigate('/restaurants');
      }
    }
  }, [cart, navigate, orderPlaced]);

  const handleUpdateQuantity = (menuItemId, change) => {
    const item = cart.find(i => i.id === menuItemId);
    if (!item) return;
    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) return;
    updateQuantity(menuItemId, newQuantity);
  };

  const handleRemoveItem = (menuItemId) => {
    removeFromCart(menuItemId);
    toast.success('Item removed from cart');
  };

  const subtotal = cart?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const deliveryFee = 2.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const handleProceedToPayment = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login', { state: { redirectTo: '/checkout' } });
      return;
    }

    if (!formData.address || !formData.city || !formData.state || !formData.zipCode || !formData.phone) {
      toast.error('Please fill in all delivery address fields');
      return;
    }

    setLoading(true);

    try {
      if (formData.paymentMethod === 'CASH') {
        await handlePlaceOrder();
        return;
      }

      // 1. Create payment entry and get Razorpay Order ID
      const paymentResponse = await paymentService.createPayment({
        orderId: Date.now(), // Temporary ID for Razorpay order
        customerId: user.id,
        amount: total,
        currency: 'INR'
      });

      const options = {
        key: paymentResponse.razorpayKeyId,
        amount: Math.round(total * 100),
        currency: 'INR',
        name: 'FoodExpress',
        description: `Order for ${restaurant?.name || 'Food'}`,
        order_id: paymentResponse.razorpayOrderId,
        handler: async (response) => {
          try {
            setLoading(true);
            // 2. Verify payment on server
            await paymentService.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            toast.success('Payment successful! Creating your order...');
            // 3. Place order
            await handlePlaceOrder();
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed');
            setLoading(false);
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: formData.phone || ''
        },
        theme: {
          color: '#FF6B35'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.info('Payment cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error initializing payment:', error);
      toast.error(error.response?.data?.message || 'Failed to initialize payment');
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        restaurantId: restaurant?.id,
        restaurantName: restaurant?.name,
        customerEmail: user?.email,
        customerName: user?.name,
        items: cart.map(item => ({
          menuItemId: item.menuItemId || item.id,
          itemName: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        deliveryAddress: `${formData.address}, ${formData.apartment}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        deliveryInstructions: '',
        paymentMethod: formData.paymentMethod
      };

      const response = await orderService.create(orderData);
      setOrderPlaced(true);
      clearCart();
      toast.success('Order placed successfully!');

      if (response && response.id) {
        setTimeout(() => {
          navigate(`/orders/${response.id}/track`, { replace: true });
        }, 500);
      } else {
        setTimeout(() => {
          navigate('/orders/history', { replace: true });
        }, 500);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-sm">
          {/* Animated cart icon */}
          <div className="w-24 h-24 bg-muted/20 border border-border rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={40} className="text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground text-sm mb-8">
            Looks like you haven't added anything yet. Browse restaurants and find something delicious!
          </p>
          <Link to="/restaurants">
            <Button className="px-8">Browse Restaurants</Button>
          </Link>
          <div className="mt-4">
            <button onClick={() => navigate(-1)} className="text-muted-foreground text-sm hover:text-foreground transition-colors">
              ← Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <h1 className="text-lg font-bold text-foreground">Checkout</h1>
            <div className="w-20 flex justify-end"><ThemeToggle /></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Delivery Address</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Street Address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                  <Input label="Apartment/Suite" value={formData.apartment} onChange={(e) => setFormData({ ...formData, apartment: e.target.value })} />
                  <Input label="Phone Number" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                  <Input label="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
                  <Input label="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} required />
                  <Input label="ZIP Code" value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} required />
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center">
                    <CreditCard size={18} className="text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Payment Method</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'CARD' })}
                    className={`p-4 border rounded-xl transition-all text-left ${formData.paymentMethod === 'CARD'
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-muted/20 hover:border-muted-foreground/30'
                      }`}
                  >
                    <CreditCard className="mb-2 text-muted-foreground" size={22} />
                    <div className="font-medium text-foreground">Online Payment</div>
                    <div className="text-xs text-muted-foreground mt-1">Debit/Credit Card, UPI, NetBanking</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'CASH' })}
                    className={`p-4 border rounded-xl transition-all text-left ${formData.paymentMethod === 'CASH'
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-muted/20 hover:border-muted-foreground/30'
                      }`}
                  >
                    <IndianRupee className="mb-2 text-muted-foreground" size={22} />
                    <div className="font-medium text-foreground">Cash on Delivery</div>
                    <div className="text-xs text-muted-foreground mt-1">Pay when you receive</div>
                  </button>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <div className="p-6">
                <h2 className="text-lg font-bold text-foreground mb-5">Order Summary</h2>
                <div className="space-y-3 mb-5 max-h-80 overflow-y-auto">
                  {cart?.map(item => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b border-border">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground text-sm mb-1">{item.name}</h4>
                        <p className="text-sm text-primary font-medium mb-2">{formatCurrency(item.price)}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary text-muted-foreground transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-medium min-w-[1.5rem] text-center text-foreground">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary text-muted-foreground transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                          <button onClick={() => handleRemoveItem(item.id)} className="ml-auto text-muted-foreground/70 hover:text-destructive transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground text-sm">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-5 pb-5 border-b border-border">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Delivery Fee</span><span>{formatCurrency(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax (8%)</span><span>{formatCurrency(tax)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-5">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">{formatCurrency(total)}</span>
                </div>

                <Button onClick={handleProceedToPayment} disabled={loading} className="w-full">
                  {loading ? 'Processing...' : formData.paymentMethod === 'CARD' ? 'Proceed to Payment' : 'Place Order'}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  By placing this order, you agree to our Terms &amp; Conditions
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}