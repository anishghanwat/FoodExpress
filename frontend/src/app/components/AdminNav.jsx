import { Link, useLocation, useNavigate } from 'react-router';
import { LayoutDashboard, Users, Store, ShoppingBag, Megaphone, FileText, LogOut, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export function AdminNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/restaurants', icon: Store, label: 'Restaurants' },
    { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { to: '/admin/campaigns', icon: Megaphone, label: 'Campaigns' },
    { to: '/admin/templates', icon: FileText, label: 'Templates' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <UtensilsCrossed size={16} className="text-primary-foreground" />
            </div>
            <div>
              <span className="text-base font-bold text-foreground">FoodExpress</span>
              <span className="block text-xs text-muted-foreground">Admin Panel</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                >
                  <Icon size={16} />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden border-t border-border">
        <div className="flex overflow-x-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex flex-col items-center gap-1 px-4 py-3 min-w-max text-xs transition-colors ${active ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
                  }`}
              >
                <Icon size={18} />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
