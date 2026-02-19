# Component Inventory & Design System

## 1. Base UI Components (Radix UI - Already Implemented)

### Layout Components
- ✅ `Card` - Container component with header, content, footer
- ✅ `Separator` - Visual divider
- ✅ `Tabs` - Tabbed interface
- ✅ `Accordion` - Collapsible content
- ✅ `Collapsible` - Show/hide content
- ✅ `Sidebar` - Navigation sidebar
- ✅ `Sheet` - Slide-out panel
- ✅ `Drawer` - Bottom drawer

### Form Components
- ✅ `Input` - Text input field
- ✅ `Textarea` - Multi-line text input
- ✅ `Button` - Action button
- ✅ `Checkbox` - Checkbox input
- ✅ `Switch` - Toggle switch
- ✅ `Radio Group` - Radio button group
- ✅ `Select` - Dropdown select
- ✅ `Label` - Form label
- ✅ `Form` - Form wrapper with validation

### Feedback Components
- ✅ `Alert` - Alert messages
- ✅ `Alert Dialog` - Modal alert
- ✅ `Toast/Sonner` - Toast notifications
- ✅ `Progress` - Progress bar
- ✅ `Skeleton` - Loading placeholder
- ✅ `Badge` - Status badge

### Overlay Components
- ✅ `Dialog` - Modal dialog
- ✅ `Popover` - Popover content
- ✅ `Tooltip` - Hover tooltip
- ✅ `Dropdown Menu` - Dropdown menu
- ✅ `Context Menu` - Right-click menu
- ✅ `Hover Card` - Hover card

### Navigation Components
- ✅ `Navigation Menu` - Navigation menu
- ✅ `Menubar` - Menu bar
- ✅ `Breadcrumb` - Breadcrumb navigation
- ✅ `Pagination` - Page navigation

### Data Display
- ✅ `Table` - Data table
- ✅ `Avatar` - User avatar
- ✅ `Aspect Ratio` - Aspect ratio container
- ✅ `Scroll Area` - Scrollable area

### Utility Components
- ✅ `Command` - Command palette
- ✅ `Calendar` - Date picker
- ✅ `Slider` - Range slider
- ✅ `Toggle` - Toggle button
- ✅ `Toggle Group` - Toggle button group
- ✅ `Input OTP` - OTP input
- ✅ `Carousel` - Image carousel
- ✅ `Chart` - Chart components
- ✅ `Resizable` - Resizable panels

---

## 2. Custom Common Components (To Be Enhanced)

### Navigation
```
src/app/components/common/
├── Header.jsx                 # Main header with logo, search, cart
├── Footer.jsx                 # Footer with links
├── Navbar.jsx                 # Navigation bar
├── Sidebar.jsx                # Side navigation
├── MobileMenu.jsx             # Mobile hamburger menu
└── Breadcrumbs.jsx            # Page breadcrumbs
```

### Layout
```
src/app/components/layout/
├── MainLayout.jsx             # Main app layout
├── AuthLayout.jsx             # Auth pages layout
├── DashboardLayout.jsx        # Dashboard layout
├── PublicLayout.jsx           # Public pages layout
└── EmptyLayout.jsx            # Minimal layout
```

### Utility
```
src/app/components/common/
├── SearchBar.jsx              # Search input with suggestions
├── Loader.jsx                 # Loading spinner
├── ErrorBoundary.jsx          # Error boundary wrapper
├── NotFound.jsx               # 404 page
├── EmptyState.jsx             # Empty state placeholder
├── ConfirmDialog.jsx          # Confirmation dialog
└── ImageUpload.jsx            # Image upload component
```

---

## 3. Feature-Specific Components (To Be Created)

### Authentication Components
```
src/app/components/features/auth/
├── LoginForm.jsx              # Login form
├── RegisterForm.jsx           # Registration form
├── ForgotPasswordForm.jsx     # Forgot password form
├── ResetPasswordForm.jsx      # Reset password form
├── SocialLogin.jsx            # Social login buttons
└── AuthGuard.jsx              # Route protection
```

### Restaurant Components
```
src/app/components/features/restaurant/
├── RestaurantCard.jsx         # Restaurant card in list
├── RestaurantGrid.jsx         # Restaurant grid layout
├── RestaurantList.jsx         # Restaurant list layout
├── RestaurantHeader.jsx       # Restaurant detail header
├── RestaurantInfo.jsx         # Restaurant information
├── RestaurantReviews.jsx      # Reviews section
├── RestaurantFilters.jsx      # Filter sidebar
├── RestaurantSearch.jsx       # Search component
└── FeaturedRestaurants.jsx    # Featured section
```

### Menu Components
```
src/app/components/features/menu/
├── MenuCategory.jsx           # Menu category section
├── MenuItem.jsx               # Individual menu item
├── MenuItemCard.jsx           # Menu item card
├── MenuItemModal.jsx          # Item detail modal
├── MenuItemForm.jsx           # Add/edit menu item
├── CategoryForm.jsx           # Add/edit category
├── MenuGrid.jsx               # Menu grid layout
└── MenuList.jsx               # Menu list layout
```

### Cart Components
```
src/app/components/features/cart/
├── CartDrawer.jsx             # Slide-out cart
├── CartItem.jsx               # Cart item row
├── CartSummary.jsx            # Price summary
├── CartBadge.jsx              # Cart icon with count
├── EmptyCart.jsx              # Empty cart state
├── CartActions.jsx            # Cart action buttons
└── MiniCart.jsx               # Mini cart preview
```

### Order Components
```
src/app/components/features/order/
├── OrderCard.jsx              # Order card in list
├── OrderList.jsx              # Order list
├── OrderDetails.jsx           # Order details view
├── OrderStatus.jsx            # Order status badge
├── OrderTimeline.jsx          # Order status timeline
├── OrderTracking.jsx          # Live tracking map
├── OrderSummary.jsx           # Order summary
├── OrderActions.jsx           # Order action buttons
├── OrderFilters.jsx           # Order filters
└── OrderHistory.jsx           # Order history list
```

### Payment Components
```
src/app/components/features/payment/
├── PaymentMethodSelector.jsx # Payment method selection
├── CardPaymentForm.jsx        # Credit card form
├── WalletPayment.jsx          # Wallet payment
├── CashOnDelivery.jsx         # COD option
├── PaymentSummary.jsx         # Payment summary
├── PaymentSuccess.jsx         # Success screen
├── PaymentFailed.jsx          # Failed screen
└── SavedCards.jsx             # Saved payment methods
```

### Delivery Components
```
src/app/components/features/delivery/
├── DeliveryCard.jsx           # Delivery card
├── DeliveryList.jsx           # Delivery list
├── DeliveryMap.jsx            # Delivery map
├── DeliveryStatus.jsx         # Delivery status
├── DeliveryAgent.jsx          # Agent info card
├── DeliveryTracking.jsx       # Live tracking
├── DeliveryHistory.jsx        # Delivery history
└── DeliveryActions.jsx        # Delivery actions
```

### Address Components
```
src/app/components/features/address/
├── AddressCard.jsx            # Address card
├── AddressList.jsx            # Address list
├── AddressForm.jsx            # Add/edit address
├── AddressSelector.jsx        # Address selection
└── LocationPicker.jsx         # Map location picker
```

### Review Components
```
src/app/components/features/review/
├── ReviewCard.jsx             # Review card
├── ReviewList.jsx             # Review list
├── ReviewForm.jsx             # Add review form
├── RatingStars.jsx            # Star rating display
├── RatingInput.jsx            # Star rating input
└── ReviewSummary.jsx          # Review summary stats
```

### Notification Components
```
src/app/components/features/notification/
├── NotificationBell.jsx       # Notification icon
├── NotificationList.jsx       # Notification list
├── NotificationItem.jsx       # Notification item
├── NotificationDrawer.jsx     # Notification drawer
└── NotificationSettings.jsx   # Notification preferences
```

### Analytics Components
```
src/app/components/features/analytics/
├── StatCard.jsx               # Stat card
├── RevenueChart.jsx           # Revenue chart
├── OrdersChart.jsx            # Orders chart
├── PopularItems.jsx           # Popular items list
├── PerformanceMetrics.jsx     # Performance metrics
├── DateRangePicker.jsx        # Date range selector
└── ExportButton.jsx           # Export data button
```

### User Components
```
src/app/components/features/user/
├── UserProfile.jsx            # User profile view
├── UserAvatar.jsx             # User avatar
├── UserMenu.jsx               # User dropdown menu
├── ProfileForm.jsx            # Edit profile form
├── PasswordChange.jsx         # Change password form
└── AccountSettings.jsx        # Account settings
```

### Admin Components
```
src/app/components/features/admin/
├── UserTable.jsx              # User management table
├── RestaurantTable.jsx        # Restaurant table
├── OrderTable.jsx             # Order table
├── AgentTable.jsx             # Agent table
├── SystemStats.jsx            # System statistics
├── ActivityLog.jsx            # Activity log
└── SettingsPanel.jsx          # Settings panel
```

---

## 4. Component Design Patterns

### Pattern 1: Container/Presentational
```jsx
// Container (Logic)
const RestaurantListContainer = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchRestaurants();
  }, []);
  
  return <RestaurantList restaurants={restaurants} loading={loading} />;
};

// Presentational (UI)
const RestaurantList = ({ restaurants, loading }) => {
  if (loading) return <Loader />;
  return restaurants.map(r => <RestaurantCard key={r.id} {...r} />);
};
```

### Pattern 2: Compound Components
```jsx
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Content>Content</Card.Content>
  <Card.Footer>Footer</Card.Footer>
</Card>
```

### Pattern 3: Render Props
```jsx
<DataFetcher url="/api/restaurants">
  {({ data, loading, error }) => (
    loading ? <Loader /> : <RestaurantList data={data} />
  )}
</DataFetcher>
```

### Pattern 4: Custom Hooks
```jsx
const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchRestaurants().then(setRestaurants).finally(() => setLoading(false));
  }, []);
  
  return { restaurants, loading };
};
```

---

## 5. Component Props Standards

### Standard Props
```jsx
// All components should accept these
{
  className,      // Additional CSS classes
  style,          // Inline styles
  children,       // Child components
  ...rest         // Spread remaining props
}
```

### Loading States
```jsx
{
  loading: boolean,
  loadingText: string,
  skeleton: boolean
}
```

### Error States
```jsx
{
  error: Error | string,
  onRetry: () => void
}
```

### Action Props
```jsx
{
  onClick: () => void,
  onSubmit: (data) => void,
  onCancel: () => void,
  onDelete: (id) => void
}
```

---

## 6. Styling Conventions

### Tailwind Classes
```jsx
// Use consistent spacing
className="p-4 m-2 gap-4"

// Use semantic colors
className="bg-primary text-primary-foreground"

// Use responsive classes
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Use state variants
className="hover:bg-accent focus:ring-2 disabled:opacity-50"
```

### Component Variants
```jsx
// Use class-variance-authority for variants
const buttonVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "...",
      destructive: "...",
      outline: "..."
    },
    size: {
      sm: "...",
      md: "...",
      lg: "..."
    }
  }
});
```

---

## 7. Component Documentation Template

```jsx
/**
 * RestaurantCard Component
 * 
 * Displays restaurant information in a card format
 * 
 * @param {Object} props
 * @param {string} props.id - Restaurant ID
 * @param {string} props.name - Restaurant name
 * @param {string} props.image - Restaurant image URL
 * @param {number} props.rating - Restaurant rating (0-5)
 * @param {string} props.cuisine - Cuisine type
 * @param {number} props.deliveryTime - Estimated delivery time
 * @param {boolean} props.isOpen - Restaurant open status
 * @param {Function} props.onClick - Click handler
 * 
 * @example
 * <RestaurantCard
 *   id="123"
 *   name="Pizza Palace"
 *   image="/images/pizza.jpg"
 *   rating={4.5}
 *   cuisine="Italian"
 *   deliveryTime={30}
 *   isOpen={true}
 *   onClick={() => navigate(`/restaurant/123`)}
 * />
 */
```

---

## 8. Component Testing Strategy

### Unit Tests
```jsx
describe('RestaurantCard', () => {
  it('renders restaurant name', () => {
    render(<RestaurantCard name="Test Restaurant" />);
    expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<RestaurantCard onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

---

## 9. Component Checklist

Before marking a component as complete:

- [ ] Implements required functionality
- [ ] Accepts standard props (className, style, children)
- [ ] Has loading state
- [ ] Has error state
- [ ] Has empty state (if applicable)
- [ ] Is responsive (mobile, tablet, desktop)
- [ ] Is accessible (ARIA labels, keyboard navigation)
- [ ] Has proper TypeScript types (if using TS)
- [ ] Has unit tests
- [ ] Has documentation
- [ ] Follows design system
- [ ] Optimized for performance

---

## 10. Priority Components to Build First

### Phase 1 (Week 1-2)
1. AuthGuard
2. LoginForm
3. RegisterForm
4. Header with cart badge
5. SearchBar

### Phase 2 (Week 2-3)
1. RestaurantCard
2. RestaurantList
3. RestaurantFilters
4. MenuItemCard
5. CartDrawer

### Phase 3 (Week 3-4)
1. OrderCard
2. OrderTimeline
3. PaymentMethodSelector
4. AddressForm
5. OrderTracking

### Phase 4 (Week 4-5)
1. Dashboard stat cards
2. Analytics charts
3. Data tables
4. Admin forms
5. Notification system
