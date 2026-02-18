import { createBrowserRouter, Navigate } from 'react-router';
import { Welcome } from './pages/Welcome';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { RestaurantList } from './pages/RestaurantList';
import { RestaurantDetail } from './pages/RestaurantDetail';
import { Checkout } from './pages/Checkout';
import { OrderTracking } from './pages/OrderTracking';
import { OrderHistory } from './pages/OrderHistory';
import Notifications from './pages/Notifications';
import { Profile } from './pages/Profile';
import { GuestRoute } from './routes/GuestRoute';
import { PrivateRoute } from './routes/PrivateRoute';

// Owner pages
import { OwnerDashboard } from './pages/owner/OwnerDashboard';
import { OwnerRestaurants } from './pages/owner/OwnerRestaurants';
import { OwnerMenu } from './pages/owner/OwnerMenu';
import { OwnerOrders } from './pages/owner/OwnerOrders';
import { OwnerAnalytics } from './pages/owner/OwnerAnalytics';

// Agent pages
import { AgentDashboard } from './pages/agent/AgentDashboard';
import { AgentQueue } from './pages/agent/AgentQueue';
import { AgentActive } from './pages/agent/AgentActive';
import { AgentHistory } from './pages/agent/AgentHistory';
import { AgentEarnings } from './pages/agent/AgentEarnings';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminRestaurants } from './pages/admin/AdminRestaurants';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCampaigns } from './pages/admin/AdminCampaigns';
import { AdminTemplates } from './pages/admin/AdminTemplates';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Welcome />
  },
  {
    path: '/login',
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    )
  },
  {
    path: '/register',
    element: (
      <GuestRoute>
        <Register />
      </GuestRoute>
    )
  },
  {
    path: '/restaurants',
    element: <RestaurantList />,
  },
  {
    path: '/restaurants/:id',
    element: <RestaurantDetail />,
  },
  {
    path: '/checkout',
    element: (
      <PrivateRoute>
        <Checkout />
      </PrivateRoute>
    )
  },
  {
    path: '/orders/:id/track',
    element: (
      <PrivateRoute>
        <OrderTracking />
      </PrivateRoute>
    )
  },
  {
    path: '/orders/history',
    element: (
      <PrivateRoute>
        <OrderHistory />
      </PrivateRoute>
    )
  },
  {
    path: '/notifications',
    element: (
      <PrivateRoute>
        <Notifications />
      </PrivateRoute>
    )
  },
  {
    path: '/profile',
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    )
  },
  {
    path: '/order-tracking/:id',
    element: (
      <PrivateRoute>
        <OrderTracking />
      </PrivateRoute>
    )
  },
  {
    path: '/owner/dashboard',
    element: (
      <PrivateRoute>
        <OwnerDashboard />
      </PrivateRoute>
    )
  },
  {
    path: '/owner/restaurants',
    element: (
      <PrivateRoute>
        <OwnerRestaurants />
      </PrivateRoute>
    )
  },
  {
    path: '/owner/menu',
    element: (
      <PrivateRoute>
        <OwnerMenu />
      </PrivateRoute>
    )
  },
  {
    path: '/owner/orders',
    element: (
      <PrivateRoute>
        <OwnerOrders />
      </PrivateRoute>
    )
  },
  {
    path: '/owner/analytics',
    element: (
      <PrivateRoute>
        <OwnerAnalytics />
      </PrivateRoute>
    )
  },
  {
    path: '/agent/dashboard',
    element: (
      <PrivateRoute>
        <AgentDashboard />
      </PrivateRoute>
    )
  },
  {
    path: '/agent/queue',
    element: (
      <PrivateRoute>
        <AgentQueue />
      </PrivateRoute>
    )
  },
  {
    path: '/agent/active',
    element: (
      <PrivateRoute>
        <AgentActive />
      </PrivateRoute>
    )
  },
  {
    path: '/agent/history',
    element: (
      <PrivateRoute>
        <AgentHistory />
      </PrivateRoute>
    )
  },
  {
    path: '/agent/earnings',
    element: (
      <PrivateRoute>
        <AgentEarnings />
      </PrivateRoute>
    )
  },
  {
    path: '/admin/dashboard',
    element: (
      <PrivateRoute>
        <AdminDashboard />
      </PrivateRoute>
    )
  },
  {
    path: '/admin/users',
    element: (
      <PrivateRoute>
        <AdminUsers />
      </PrivateRoute>
    )
  },
  {
    path: '/admin/restaurants',
    element: (
      <PrivateRoute>
        <AdminRestaurants />
      </PrivateRoute>
    )
  },
  {
    path: '/admin/orders',
    element: (
      <PrivateRoute>
        <AdminOrders />
      </PrivateRoute>
    )
  },
  {
    path: '/admin/campaigns',
    element: (
      <PrivateRoute>
        <AdminCampaigns />
      </PrivateRoute>
    )
  },
  {
    path: '/admin/templates',
    element: (
      <PrivateRoute>
        <AdminTemplates />
      </PrivateRoute>
    )
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-7xl font-bold text-[#FF6B35] mb-4">404</h1>
          <p className="text-white/40 mb-6">Page not found</p>
          <a href="/restaurants" className="text-[#FF6B35] hover:text-[#ff8a5c] transition-colors">
            Back to Home
          </a>
        </div>
      </div>
    )
  }
]);