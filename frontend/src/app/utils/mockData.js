// Mock data for the food delivery platform

export const mockRestaurants = [
  {
    id: 1,
    name: "Bella Italia",
    description: "Authentic Italian cuisine with fresh pasta and wood-fired pizzas",
    address: "123 Main St, Downtown",
    phone: "+1234567890",
    ownerId: 1,
    active: true,
    cuisineType: "Italian",
    rating: 4.5,
    deliveryTime: 30,
    deliveryFee: 2.99,
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Tokyo Sushi Bar",
    description: "Fresh sushi and Japanese specialties",
    address: "456 Oak Ave, Midtown",
    phone: "+1234567891",
    ownerId: 2,
    active: true,
    cuisineType: "Japanese",
    rating: 4.8,
    deliveryTime: 25,
    deliveryFee: 3.99,
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "El Taco Loco",
    description: "Authentic Mexican street food and tacos",
    address: "789 Elm St, Westside",
    phone: "+1234567892",
    ownerId: 3,
    active: false,
    cuisineType: "Mexican",
    rating: 4.2,
    deliveryTime: 35,
    deliveryFee: 2.49,
    status: "CLOSED",
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "Burger Haven",
    description: "Gourmet burgers and classic American comfort food",
    address: "321 Pine St, Eastside",
    phone: "+1234567893",
    ownerId: 4,
    active: true,
    cuisineType: "American",
    rating: 4.6,
    deliveryTime: 20,
    deliveryFee: 1.99,
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    name: "Thai Orchid",
    description: "Traditional Thai dishes with authentic flavors",
    address: "555 Maple Dr, Northside",
    phone: "+1234567894",
    ownerId: 5,
    active: true,
    cuisineType: "Thai",
    rating: 4.7,
    deliveryTime: 28,
    deliveryFee: 3.49,
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&q=80",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 6,
    name: "Pizza Paradise",
    description: "New York style pizzas and Italian appetizers",
    address: "888 Broadway, Central",
    phone: "+1234567895",
    ownerId: 6,
    active: true,
    cuisineType: "Italian",
    rating: 4.4,
    deliveryTime: 30,
    deliveryFee: 2.99,
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

export const mockMenuItems = {
  1: [ // Bella Italia
    {
      id: 101,
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce, mozzarella, and fresh basil",
      price: 12.99,
      category: "Pizza",
      available: true,
      imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
      restaurantId: 1,
      isVeg: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: 102,
      name: "Spaghetti Carbonara",
      description: "Creamy pasta with bacon, eggs, and parmesan cheese",
      price: 14.99,
      category: "Pasta",
      available: true,
      imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80",
      restaurantId: 1,
      isVeg: false,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: 103,
      name: "Caesar Salad",
      description: "Crisp romaine lettuce with parmesan and croutons",
      price: 8.99,
      category: "Salads",
      available: true,
      imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80",
      restaurantId: 1,
      isVeg: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: 104,
      name: "Tiramisu",
      description: "Classic Italian dessert with coffee and mascarpone",
      price: 6.99,
      category: "Desserts",
      available: true,
      imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80",
      restaurantId: 1,
      isVeg: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    }
  ],
  2: [ // Tokyo Sushi Bar
    {
      id: 201,
      name: "California Roll",
      description: "Crab, avocado, and cucumber wrapped in seaweed and rice",
      price: 10.99,
      category: "Rolls",
      available: true,
      imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&q=80",
      restaurantId: 2,
      isVeg: false,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: 202,
      name: "Salmon Nigiri",
      description: "Fresh salmon over pressed sushi rice",
      price: 12.99,
      category: "Nigiri",
      available: true,
      imageUrl: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&q=80",
      restaurantId: 2,
      isVeg: false,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: 203,
      name: "Miso Soup",
      description: "Traditional Japanese soup with tofu and seaweed",
      price: 4.99,
      category: "Appetizers",
      available: true,
      imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80",
      restaurantId: 2,
      isVeg: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    }
  ],
  4: [ // Burger Haven
    {
      id: 401,
      name: "Classic Cheeseburger",
      description: "Beef patty with cheddar cheese, lettuce, and tomato",
      price: 11.99,
      category: "Burgers",
      available: true,
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
      restaurantId: 4,
      isVeg: false,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: 402,
      name: "Crispy Fries",
      description: "Golden crispy french fries",
      price: 4.99,
      category: "Sides",
      available: true,
      imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
      restaurantId: 4,
      isVeg: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: 403,
      name: "Chocolate Milkshake",
      description: "Creamy chocolate milkshake with whipped cream",
      price: 5.99,
      category: "Drinks",
      available: true,
      imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
      restaurantId: 4,
      isVeg: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    }
  ]
};

export const mockUsers = {
  customer: {
    id: 1,
    name: "John Doe",
    email: "customer@test.com",
    role: "CUSTOMER",
    createdAt: "2024-01-01T00:00:00Z"
  },
  owner: {
    id: 2,
    name: "Jane Smith",
    email: "owner@test.com",
    role: "OWNER",
    createdAt: "2024-01-01T00:00:00Z"
  },
  agent: {
    id: 3,
    name: "Mike Johnson",
    email: "agent@test.com",
    role: "AGENT",
    createdAt: "2024-01-01T00:00:00Z"
  },
  admin: {
    id: 4,
    name: "Sarah Admin",
    email: "admin@test.com",
    role: "ADMIN",
    createdAt: "2024-01-01T00:00:00Z"
  }
};

export const mockOrders = [
  {
    id: 1001,
    customerId: 1,
    restaurantId: 1,
    restaurantName: "Bella Italia",
    status: "DELIVERED",
    items: [
      { menuItemId: 101, name: "Margherita Pizza", quantity: 2, price: 12.99 },
      { menuItemId: 103, name: "Caesar Salad", quantity: 1, price: 8.99 }
    ],
    deliveryAddress: "123 Customer St, Apt 4B, City, State 12345",
    paymentMethod: "CARD",
    totalAmount: 34.97,
    agentId: 3,
    agentName: "Mike Johnson",
    agentPhone: "+1234567890",
    createdAt: "2026-02-10T12:30:00Z",
    updatedAt: "2026-02-10T13:15:00Z"
  },
  {
    id: 1002,
    customerId: 1,
    restaurantId: 2,
    restaurantName: "Tokyo Sushi Bar",
    status: "PREPARING",
    items: [
      { menuItemId: 201, name: "California Roll", quantity: 1, price: 10.99 },
      { menuItemId: 202, name: "Salmon Nigiri", quantity: 2, price: 12.99 }
    ],
    deliveryAddress: "123 Customer St, Apt 4B, City, State 12345",
    paymentMethod: "CARD",
    totalAmount: 40.96,
    agentId: null,
    agentName: null,
    agentPhone: null,
    createdAt: "2026-02-13T11:00:00Z",
    updatedAt: "2026-02-13T11:15:00Z"
  }
];

// Admin mock data
export const mockAllUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "customer@test.com",
    role: "CUSTOMER",
    status: "ACTIVE",
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "owner@test.com",
    role: "OWNER",
    status: "ACTIVE",
    createdAt: "2024-01-15T00:00:00Z"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "agent@test.com",
    role: "AGENT",
    status: "ACTIVE",
    createdAt: "2024-02-01T00:00:00Z"
  },
  {
    id: 4,
    name: "Sarah Admin",
    email: "admin@test.com",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    name: "David Lee",
    email: "david@test.com",
    role: "CUSTOMER",
    status: "ACTIVE",
    createdAt: "2024-03-10T00:00:00Z"
  },
  {
    id: 6,
    name: "Emma Wilson",
    email: "emma@test.com",
    role: "OWNER",
    status: "ACTIVE",
    createdAt: "2024-03-15T00:00:00Z"
  },
  {
    id: 7,
    name: "Tom Brown",
    email: "tom@test.com",
    role: "AGENT",
    status: "INACTIVE",
    createdAt: "2024-02-20T00:00:00Z"
  }
];

export const mockCampaigns = [
  {
    id: 1,
    name: "Weekend Special Offers",
    type: "PROMOTIONAL",
    segment: "ALL_CUSTOMERS",
    status: "SENT",
    sentCount: 1250,
    openRate: 45.2,
    createdAt: "2026-02-01T00:00:00Z",
    sentAt: "2026-02-05T10:00:00Z"
  },
  {
    id: 2,
    name: "New Restaurant Launch",
    type: "ANNOUNCEMENT",
    segment: "ACTIVE_CUSTOMERS",
    status: "SCHEDULED",
    sentCount: 0,
    openRate: 0,
    createdAt: "2026-02-10T00:00:00Z",
    scheduledAt: "2026-02-15T12:00:00Z"
  },
  {
    id: 3,
    name: "Loyalty Rewards",
    type: "LOYALTY",
    segment: "PREMIUM_CUSTOMERS",
    status: "DRAFT",
    sentCount: 0,
    openRate: 0,
    createdAt: "2026-02-12T00:00:00Z"
  }
];

export const mockTemplates = [
  {
    id: 1,
    name: "Welcome Email",
    type: "EMAIL",
    subject: "Welcome to FoodExpress!",
    content: "Thank you for joining FoodExpress. Start exploring amazing restaurants near you.",
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Order Confirmation",
    type: "EMAIL",
    subject: "Your order has been confirmed",
    content: "Your order #{{orderId}} has been confirmed and is being prepared.",
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "Delivery Update",
    type: "SMS",
    content: "Your order is out for delivery. Track it here: {{trackingLink}}",
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "Promotional Offer",
    type: "PUSH",
    content: "🎉 Get 20% off your next order! Use code: {{promoCode}}",
    createdAt: "2024-01-05T00:00:00Z"
  }
];

export const mockSystemStats = {
  totalUsers: 1250,
  totalRestaurants: 85,
  activeOrders: 23,
  totalRevenue: 125480.50,
  usersByRole: {
    CUSTOMER: 1050,
    OWNER: 85,
    AGENT: 112,
    ADMIN: 3
  }
};

export const mockServiceHealth = [
  {
    name: "API Gateway",
    status: "HEALTHY",
    responseTime: 45,
    lastCheck: "2026-02-13T14:30:00Z"
  },
  {
    name: "Database",
    status: "HEALTHY",
    responseTime: 12,
    lastCheck: "2026-02-13T14:30:00Z"
  },
  {
    name: "Payment Service",
    status: "HEALTHY",
    responseTime: 230,
    lastCheck: "2026-02-13T14:29:00Z"
  },
  {
    name: "Notification Service",
    status: "WARNING",
    responseTime: 580,
    lastCheck: "2026-02-13T14:28:00Z"
  },
  {
    name: "SMS Gateway",
    status: "HEALTHY",
    responseTime: 95,
    lastCheck: "2026-02-13T14:30:00Z"
  }
];

export const mockRecentActivity = [
  {
    id: 1,
    type: "ORDER",
    message: "New order #1025 placed by John Doe",
    timestamp: "2026-02-13T14:25:00Z"
  },
  {
    id: 2,
    type: "USER",
    message: "New user registration: Emma Wilson (OWNER)",
    timestamp: "2026-02-13T14:20:00Z"
  },
  {
    id: 3,
    type: "RESTAURANT",
    message: "Restaurant 'Spice Garden' activated",
    timestamp: "2026-02-13T14:15:00Z"
  },
  {
    id: 4,
    type: "PAYMENT",
    message: "Payment processed: $45.99 for order #1024",
    timestamp: "2026-02-13T14:10:00Z"
  },
  {
    id: 5,
    type: "AGENT",
    message: "Agent Mike Johnson completed delivery #1023",
    timestamp: "2026-02-13T14:05:00Z"
  }
];