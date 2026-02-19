import { mockRestaurants, mockMenuItems, mockUsers, mockOrders } from './mockData';
import { apiHelper } from '../services/api';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get all orders (mock + created)
const getAllOrders = () => {
  const createdOrders = localStorage.getItem('createdOrders');
  const parsedOrders = createdOrders ? JSON.parse(createdOrders) : [];
  return [...mockOrders, ...parsedOrders];
};

// Helper to save a created order
const saveCreatedOrder = (order) => {
  const createdOrders = localStorage.getItem('createdOrders');
  const parsedOrders = createdOrders ? JSON.parse(createdOrders) : [];
  parsedOrders.push(order);
  localStorage.setItem('createdOrders', JSON.stringify(parsedOrders));
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    await delay();

    // Mock authentication
    const userMap = {
      'customer@test.com': mockUsers.customer,
      'owner@test.com': mockUsers.owner,
      'agent@test.com': mockUsers.agent,
      'admin@test.com': mockUsers.admin
    };

    const user = userMap[email];

    if (user && password === 'password') {
      return {
        token: 'mock-jwt-token-' + user.role,
        ...user
      };
    }

    throw new Error('Invalid credentials');
  },

  register: async (name, email, password, role) => {
    await delay();

    // Mock registration
    return {
      id: Math.floor(Math.random() * 10000),
      name,
      email,
      role,
      createdAt: new Date().toISOString()
    };
  }
};

// Restaurant API
export const restaurantAPI = {
  getAll: async (filters = {}) => {
    await delay();

    let restaurants = [...mockRestaurants];

    // Apply filters
    if (filters.cuisineType && filters.cuisineType.length > 0) {
      restaurants = restaurants.filter(r => filters.cuisineType.includes(r.cuisineType));
    }

    if (filters.minRating) {
      restaurants = restaurants.filter(r => r.rating >= filters.minRating);
    }

    if (filters.maxDeliveryTime) {
      restaurants = restaurants.filter(r => r.deliveryTime <= filters.maxDeliveryTime);
    }

    if (filters.onlyOpen) {
      restaurants = restaurants.filter(r => r.status === 'OPEN');
    }

    // Apply sorting
    if (filters.sortBy === 'rating') {
      restaurants.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'deliveryTime') {
      restaurants.sort((a, b) => a.deliveryTime - b.deliveryTime);
    }

    return restaurants;
  },

  getByOwner: async () => {
    await delay();
    // Return restaurants owned by the current owner (mock implementation)
    return mockRestaurants.filter((_, index) => index < 2); // Returns first 2 restaurants
  },

  getById: async (id) => {
    await delay();
    const restaurant = mockRestaurants.find(r => r.id === parseInt(id));
    if (!restaurant) throw new Error('Restaurant not found');
    return restaurant;
  },

  getMenu: async (restaurantId) => {
    await delay();
    return mockMenuItems[restaurantId] || [];
  }
};

// Order API
export const orderAPI = {
  create: async (orderData) => {
    await delay();

    const newOrder = {
      id: Math.floor(Math.random() * 10000),
      ...orderData,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveCreatedOrder(newOrder);
    return newOrder;
  },

  getById: async (orderId) => {
    await delay();
    const order = getAllOrders().find(o => o.id === parseInt(orderId));
    if (!order) throw new Error('Order not found');
    return order;
  },

  getByCustomer: async (customerId) => {
    await delay();
    return getAllOrders().filter(o => o.customerId === parseInt(customerId));
  },

  getByOwner: async () => {
    await delay();
    // Return all orders for restaurants owned by the current owner (mock implementation)
    // In a real app, this would filter by restaurantId based on owner's restaurants
    return getAllOrders();
  },

  updateStatus: async (orderId, status) => {
    await delay();
    return {
      id: orderId,
      status,
      updatedAt: new Date().toISOString()
    };
  }
};

// Tracking API
export const trackingAPI = {
  getOrderTracking: async (orderId) => {
    await delay();

    const order = getAllOrders().find(o => o.id === parseInt(orderId));
    if (!order) throw new Error('Order not found');

    const statusTimeline = {
      'PENDING': ['Order Placed'],
      'CONFIRMED': ['Order Placed', 'Restaurant Confirmed'],
      'PREPARING': ['Order Placed', 'Restaurant Confirmed', 'Preparing Food'],
      'OUT_FOR_DELIVERY': ['Order Placed', 'Restaurant Confirmed', 'Preparing Food', 'Out for Delivery'],
      'DELIVERED': ['Order Placed', 'Restaurant Confirmed', 'Preparing Food', 'Out for Delivery', 'Delivered']
    };

    return {
      orderId: order.id,
      status: order.status,
      estimatedDeliveryTime: '30 mins',
      agentName: order.agentName || 'Not assigned yet',
      agentPhone: order.agentPhone || '',
      currentLocation: {
        lat: 40.7128,
        lng: -74.0060
      },
      timeline: statusTimeline[order.status] || []
    };
  }
};

// Cart management (using localStorage)
export const cartAPI = {
  getCart: () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : { items: [], restaurantId: null };
  },

  addToCart: (restaurantId, item) => {
    const cart = cartAPI.getCart();

    // Clear cart if different restaurant
    if (cart.restaurantId && cart.restaurantId !== restaurantId) {
      cart.items = [];
    }

    cart.restaurantId = restaurantId;

    // Check if item exists
    const existingItem = cart.items.find(i => i.menuItemId === item.menuItemId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ ...item, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },

  updateQuantity: (menuItemId, quantity) => {
    const cart = cartAPI.getCart();
    const item = cart.items.find(i => i.menuItemId === menuItemId);

    if (item) {
      if (quantity <= 0) {
        cart.items = cart.items.filter(i => i.menuItemId !== menuItemId);
      } else {
        item.quantity = quantity;
      }
    }

    if (cart.items.length === 0) {
      cart.restaurantId = null;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },

  clearCart: () => {
    localStorage.removeItem('cart');
    return { items: [], restaurantId: null };
  }
};

// User session management
export const sessionAPI = {
  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  clearSession: () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
  }
};

// Admin API
export const adminAPI = {
  // System stats
  getStats: async () => {
    await delay();
    const { mockSystemStats } = await import('./mockData');
    return mockSystemStats;
  },

  // Service health
  getHealth: async () => {
    await delay();
    const { mockServiceHealth } = await import('./mockData');
    return { services: mockServiceHealth };
  },

  // Recent activity
  getRecentActivity: async () => {
    await delay();
    const { mockRecentActivity } = await import('./mockData');
    return mockRecentActivity;
  },

  // User management
  getUsers: async (page = 0, size = 20, role = null) => {
    await delay();
    const { mockAllUsers } = await import('./mockData');
    let users = [...mockAllUsers];

    if (role && role !== 'ALL') {
      users = users.filter(u => u.role === role);
    }

    const start = page * size;
    const end = start + size;
    const paginatedUsers = users.slice(start, end);

    return {
      users: paginatedUsers,
      totalPages: Math.ceil(users.length / size),
      totalElements: users.length,
      currentPage: page
    };
  },

  searchUsers: async (query, role = null) => {
    await delay();
    const { mockAllUsers } = await import('./mockData');
    let users = [...mockAllUsers];

    if (query) {
      const lowerQuery = query.toLowerCase();
      users = users.filter(u =>
        u.name.toLowerCase().includes(lowerQuery) ||
        u.email.toLowerCase().includes(lowerQuery)
      );
    }

    if (role && role !== 'ALL') {
      users = users.filter(u => u.role === role);
    }

    return users;
  },

  updateUserRole: async (userId, newRole) => {
    await delay();
    return {
      id: userId,
      role: newRole,
      updatedAt: new Date().toISOString()
    };
  },

  deleteUser: async (userId) => {
    await delay();
    return { success: true, id: userId };
  },

  // Campaign management
  getCampaigns: async () => {
    return await apiHelper.get('/api/notifications/campaigns');
  },

  createCampaign: async (campaignData) => {
    return await apiHelper.post('/api/notifications/campaigns', campaignData);
  },

  sendCampaign: async (campaignId) => {
    return await apiHelper.post(`/api/notifications/campaigns/${campaignId}/send`);
  },

  getCampaignAnalytics: async (campaignId) => {
    return await apiHelper.get(`/api/notifications/campaigns/${campaignId}/analytics`);
  },

  deleteCampaign: async (campaignId) => {
    return await apiHelper.delete(`/api/notifications/campaigns/${campaignId}`);
  },

  // Template management
  getTemplates: async () => {
    return await apiHelper.get('/api/notifications/templates');
  },

  createTemplate: async (templateData) => {
    return await apiHelper.post('/api/notifications/templates', templateData);
  },

  updateTemplate: async (templateId, templateData) => {
    return await apiHelper.put(`/api/notifications/templates/${templateId}`, templateData);
  },

  deleteTemplate: async (templateId) => {
    return await apiHelper.delete(`/api/notifications/templates/${templateId}`);
  }
};