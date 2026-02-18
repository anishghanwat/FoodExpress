# FoodExpress - Quick Start Guide

## 🎯 Overview

FoodExpress is a fully functional food delivery platform demo with a complete customer experience flow. This guide will help you navigate the application.

## 🚀 Getting Started

1. **Visit the Welcome Page**
   - The landing page (`/`) provides an overview of all features
   - View demo credentials for different user roles
   - Click "Get Started" to register or "Sign In" to login

2. **Login with Demo Account**
   - Email: `customer@test.com`
   - Password: `password`
   - This gives you access to the customer experience

## 📱 Customer Journey

### Step 1: Browse Restaurants
After logging in, you'll see the restaurant listing page with:
- **Search bar**: Search for restaurants or cuisines
- **Filters**: Filter by cuisine type, rating, delivery time
- **Sort options**: Sort by rating or delivery time
- **Featured section**: Top-rated restaurants at the top

### Step 2: Explore Restaurant & Menu
Click on any restaurant to:
- View restaurant details (rating, delivery time, fees)
- Browse menu items organized by categories
- See vegetarian indicators
- Check item prices and descriptions
- Add items to your cart

### Step 3: Manage Your Cart
- Click "Add to Cart" on any menu item
- Adjust quantities with +/- buttons
- View cart summary in the floating cart button
- Cart is saved automatically (persists on page refresh)

### Step 4: Checkout
Click "View Cart" or navigate to checkout to:
- Review your order items
- Enter delivery address details
- Choose payment method:
  - Credit/Debit Card
  - Cash on Delivery
  - Digital Wallet
- See price breakdown (subtotal, delivery fee, tax)
- Place your order

### Step 5: Track Your Order
After placing an order:
- Automatically redirected to order tracking page
- View 5-stage status timeline:
  1. Order Placed
  2. Restaurant Confirmed
  3. Preparing Food
  4. Out for Delivery
  5. Delivered
- See estimated delivery time
- View delivery agent information (when assigned)
- Contact support if needed

### Step 6: Order History
Access your order history to:
- View all past orders
- See order details and status
- Reorder from previous orders
- Track active orders
- Rate completed orders

## 🎨 Key Features to Try

### Restaurant Filters
- **Cuisine Type**: Filter by Italian, Japanese, Mexican, Thai, American
- **Rating**: Set minimum rating (0-5 stars)
- **Delivery Time**: Set maximum delivery time (15-60 minutes)
- **Open Only**: Toggle to show only open restaurants

### Search Functionality
Type in the search bar to find:
- Specific restaurant names
- Cuisine types
- Food items

### Cart Management
- Items persist across page navigation
- If you switch restaurants, cart clears automatically
- Adjust quantities at any time
- Remove items easily

### Order Status
Orders go through realistic status changes:
- **Pending**: Just placed
- **Confirmed**: Restaurant accepted
- **Preparing**: Food being made
- **Out for Delivery**: On the way
- **Delivered**: Completed

## 🔧 Technical Features

### Data Persistence
- User session stored in localStorage
- Cart saved automatically
- Survives page refreshes

### Mock Data
The app includes:
- 6 different restaurants
- 15+ menu items
- Sample order history
- Realistic prices and ratings

### Responsive Design
Works perfectly on:
- Desktop computers
- Tablets
- Mobile phones

## 🎭 Other User Roles

### Restaurant Owner
- Login: `owner@test.com` / `password`
- Shows placeholder dashboard
- Lists planned features for restaurant management

### Delivery Agent
- Login: `agent@test.com` / `password`
- Shows placeholder dashboard
- Lists planned features for delivery management

### Admin
- Login: `admin@test.com` / `password`
- Shows placeholder dashboard
- Lists planned features for platform administration

## 💡 Tips & Tricks

1. **Try Multiple Restaurants**: Each restaurant has unique menu items
2. **Use Filters**: Narrow down options quickly with filters
3. **Check Order History**: See your past orders and their status
4. **Persistent Cart**: Your cart saves automatically - come back anytime
5. **Responsive**: Try on different screen sizes
6. **Toast Notifications**: Watch for success/error messages at the top

## 🐛 Known Limitations

This is a frontend demo with mock data:
- No real payment processing
- No actual restaurant connections
- Order tracking updates are simulated
- Map tracking is a placeholder
- No real-time notifications

## 🔮 Planned Features

Future enhancements will include:
- Restaurant owner dashboard
- Delivery agent interface
- Admin control panel
- Real-time WebSocket notifications
- Live map tracking
- Payment gateway integration
- Rating and review system
- Advanced analytics

## 📞 Need Help?

- All forms have validation
- Error messages show inline
- Success/error toasts appear at the top
- Use demo credentials to test different roles
- Cart and session clear on logout

## 🎉 Enjoy!

Explore the app, place some orders, and experience the full customer journey. This demo showcases modern web development practices with React, Tailwind CSS, and a clean, intuitive design inspired by leading food delivery platforms.
