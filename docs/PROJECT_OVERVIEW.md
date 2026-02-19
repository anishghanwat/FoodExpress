# FoodExpress - Food Delivery Platform

A modern, responsive food delivery platform built with React, Vite, and Tailwind CSS, inspired by Swiggy/Zomato/Uber Eats.

## 🚀 Features

### Implemented (Customer Flow)
- ✅ **Authentication System**
  - Login and Registration pages
  - Role-based authentication (Customer, Owner, Agent, Admin)
  - Protected routes
  - Session management with localStorage

- ✅ **Restaurant Discovery**
  - Restaurant listing with grid layout
  - Featured restaurants carousel
  - Advanced filtering (cuisine, rating, delivery time)
  - Search functionality
  - Sort by rating or delivery time
  - Restaurant status badges (OPEN/CLOSED)

- ✅ **Restaurant Detail & Menu**
  - Restaurant information display
  - Menu items organized by categories
  - Category filtering
  - Add to cart functionality
  - Quantity management
  - Vegetarian indicators
  - Item availability status

- ✅ **Shopping Cart & Checkout**
  - Persistent cart using localStorage
  - Add/remove/update items
  - Delivery address form
  - Multiple payment methods (Card, Cash, Wallet)
  - Order summary with price breakdown
  - Tax and delivery fee calculation

- ✅ **Order Tracking**
  - Real-time order status timeline
  - 5-stage tracking (Placed → Confirmed → Preparing → Out for Delivery → Delivered)
  - Delivery agent information
  - Estimated delivery time
  - Visual status indicators
  - Live map placeholder

- ✅ **Order History**
  - List of past orders
  - Order details and status
  - Reorder functionality
  - Date formatting (Today, Yesterday, X days ago)
  - Track order button

### Planned (Coming Soon)
- 🔄 Restaurant Owner Dashboard
- 🔄 Delivery Agent Interface
- 🔄 Admin Panel
- 🔄 Real-time notifications
- 🔄 Rating & review system
- 🔄 Live map integration
- 🔄 Payment gateway integration

## 🎨 Design System

### Color Palette
- **Primary:** #FF6B35 (Orange) - CTAs, active states
- **Secondary:** #004E89 (Dark Blue) - Headers, important text
- **Success:** #10B981 (Green) - Success states, available status
- **Warning:** #F59E0B (Amber) - Warnings, pending states
- **Error:** #EF4444 (Red) - Errors, closed/cancelled states
- **Background:** #F9FAFB (Light Gray)
- **Surface:** #FFFFFF (White cards)
- **Text Primary:** #1F2937
- **Text Secondary:** #6B7280

### Typography
- **Font Family:** Inter (Google Fonts)
- **Headings:** Inter Bold (24px, 20px, 18px)
- **Body:** Inter Regular (16px, 14px)
- **Small Text:** Inter Regular (12px)

### Components
- ✅ Navigation bars
- ✅ Cards with hover effects
- ✅ Forms (login, register, checkout)
- ✅ Buttons (primary, secondary, outline, ghost, success, danger)
- ✅ Status badges
- ✅ Search bars with filters
- ✅ Toast notifications (Sonner)
- ✅ Loading skeletons
- ✅ Input fields with labels and error states

## 🛠️ Technical Stack

- **React:** 18.3.1 (with JSX)
- **Vite:** 6.3.5
- **React Router:** 7.13.0 (Data mode)
- **Tailwind CSS:** 4.1.12
- **Lucide React:** Icons library
- **Sonner:** Toast notifications
- **Motion:** Animations (installed but can be used as needed)

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   └── LoadingSkeleton.jsx
│   ├── pages/
│   │   ├── Welcome.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── RestaurantList.jsx
│   │   ├── RestaurantDetail.jsx
│   │   ├── Checkout.jsx
│   │   ├── OrderTracking.jsx
│   │   ├── OrderHistory.jsx
│   │   └── NotImplemented.jsx
│   ├── utils/
│   │   ├── mockData.js
│   │   └── api.js
│   ├── routes.jsx
│   └── App.tsx
└── styles/
    ├── theme.css
    └── fonts.css
```

## 🔐 Demo Credentials

All demo accounts use password: `password`

- **Customer:** customer@test.com
- **Restaurant Owner:** owner@test.com
- **Delivery Agent:** agent@test.com
- **Admin:** admin@test.com

## 🗺️ Routes

### Public Routes
- `/` - Welcome page
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Customer)
- `/restaurants` - Restaurant listing
- `/restaurants/:id` - Restaurant detail & menu
- `/checkout` - Checkout page
- `/orders/:id/track` - Order tracking
- `/orders/history` - Order history

### Protected Routes (Other Roles - Coming Soon)
- `/owner/dashboard` - Restaurant owner dashboard
- `/agent/dashboard` - Delivery agent dashboard
- `/admin/dashboard` - Admin panel

## 💾 Data Storage

The application uses mock APIs with localStorage for data persistence:

- **User Session:** Stored in localStorage as `currentUser`
- **Shopping Cart:** Stored in localStorage as `cart`
- **Mock Data:** Includes 6 restaurants, multiple menu items, and sample orders

## 🎯 User Flows

### Customer Flow (Fully Implemented)
1. Welcome page → Login/Register
2. Restaurant listing with filters
3. Select restaurant → View menu
4. Add items to cart
5. Proceed to checkout → Enter delivery details
6. Place order
7. Track order in real-time
8. View order history

### Restaurant Owner Flow (Placeholder)
- Dashboard overview
- Manage menu items
- Process incoming orders
- View analytics

### Delivery Agent Flow (Placeholder)
- View available deliveries
- Accept assignments
- Navigate to locations
- Update delivery status

### Admin Flow (Placeholder)
- User management
- Platform analytics
- Handle disputes
- Restaurant approvals

## 🚀 Getting Started

The application is built with Vite and React. To run locally:

1. Install dependencies: `pnpm install`
2. Start development server: `pnpm dev`
3. Build for production: `pnpm build`

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## ✨ Key Features

- **Smooth Animations:** Hover effects, transitions, and loading states
- **Real-time Updates:** Simulated order tracking updates
- **User-Friendly:** Intuitive navigation and clear visual feedback
- **Performance:** Fast loading with optimized images
- **Accessibility:** Semantic HTML and proper ARIA labels
- **Modern UI:** Clean, professional design inspired by leading food delivery apps

## 🔮 Future Enhancements

1. Backend integration (REST API or GraphQL)
2. Real-time WebSocket connections for live tracking
3. Map integration (Google Maps/Mapbox)
4. Payment gateway (Stripe/PayPal)
5. Push notifications
6. Image uploads for menu items
7. Advanced search with Elasticsearch
8. Progressive Web App (PWA) support
9. Multi-language support
10. Dark mode theme

## 📄 License

This is a demonstration project created for educational purposes.
