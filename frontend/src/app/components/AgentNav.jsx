import { Link, useLocation, useNavigate } from 'react-router';
import { LayoutDashboard, List, Package, History, DollarSign, LogOut, Power, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { useState } from 'react';

export function AgentNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    toast.success(`Status changed to ${!isAvailable ? 'Available' : 'Offline'}`);
  };

  const navLinks = [
    { to: '/agent/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/agent/queue', icon: List, label: 'Queue' },
    { to: '/agent/active', icon: Package, label: 'Active' },
    { to: '/agent/history', icon: History, label: 'History' },
    { to: '/agent/earnings', icon: DollarSign, label: 'Earnings' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-black/60 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/agent/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center">
              <UtensilsCrossed size={16} className="text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-white">FoodExpress</span>
              <span className="block text-xs text-white/40">Delivery Agent</span>
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
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-[#FF6B35] text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <Icon size={16} />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleAvailability}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isAvailable
                  ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                  : 'bg-white/5 text-white/50 border border-white/15'
                }`}
            >
              <Power size={14} />
              <span className="hidden sm:inline">{isAvailable ? 'Available' : 'Offline'}</span>
            </button>

            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-white/40">Delivery Agent</p>
            </div>
            <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-white/40 hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden border-t border-white/10">
        <div className="flex overflow-x-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex flex-col items-center gap-1 px-4 py-3 min-w-max text-xs transition-colors ${active ? 'text-[#FF6B35] border-b-2 border-[#FF6B35]' : 'text-white/50'
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