import { Link, useNavigate } from 'react-router';
import { UtensilsCrossed, Search, User, LogOut, ChevronRight, Star, Clock, IndianRupee, MapPin, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import restaurantService from '../services/restaurantService';

const CUISINE_CATEGORIES = [
  { label: 'Biryani', emoji: '🍛', value: 'Biryani' },
  { label: 'Pizza', emoji: '🍕', value: 'Pizza' },
  { label: 'Burgers', emoji: '🍔', value: 'Burgers' },
  { label: 'Chinese', emoji: '🥡', value: 'Chinese' },
  { label: 'South Indian', emoji: '🥘', value: 'South Indian' },
  { label: 'Desserts', emoji: '🍰', value: 'Desserts' },
  { label: 'Rolls', emoji: '🌯', value: 'Rolls' },
  { label: 'Thali', emoji: '🍱', value: 'Thali' },
];

export function Welcome() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounced search for suggestions
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const results = await restaurantService.search(searchQuery.trim());
        const list = Array.isArray(results) ? results : (results?.content || []);
        setSuggestions(list.slice(0, 6));
        setShowDropdown(list.length > 0);
      } catch {
        setSuggestions([]);
        setShowDropdown(false);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/restaurants');
    }
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      const s = suggestions[activeIndex];
      navigate(`/restaurants/${s.id}`);
      setShowDropdown(false);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  const handleSuggestionClick = (restaurant) => {
    setShowDropdown(false);
    setSearchQuery(restaurant.name);
    navigate(`/restaurants/${restaurant.id}`);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center">
                <UtensilsCrossed size={18} className="text-white" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">FoodExpress</span>
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link to="/restaurants" className="text-white/70 hover:text-white text-sm transition-colors">
                    Order Now
                  </Link>
                  <div className="relative group">
                    <button className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="w-7 h-7 bg-[#FF6B35] rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user.name?.charAt(0).toUpperCase() || <User size={14} />}
                      </div>
                      <span className="hidden sm:inline">{user.name?.split(' ')[0]}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-44 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                        <User size={14} /> My Profile
                      </Link>
                      <Link to="/orders/history" className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                        My Orders
                      </Link>
                      <div className="border-t border-white/10 my-1" />
                      <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#EF4444]/80 hover:text-[#EF4444] hover:bg-white/5 transition-colors">
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white/80 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:bg-white/10"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-[#FF6B35] hover:bg-[#e55a25] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        className="relative min-h-screen flex items-center"
        style={{
          background: 'linear-gradient(135deg, #1a0a00 0%, #0f0f0f 40%, #001a2e 100%)',
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FF6B35, transparent)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #004E89, transparent)' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FF6B35]/15 border border-[#FF6B35]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-[#FF6B35] rounded-full animate-pulse" />
              <span className="text-[#FF6B35] text-sm font-medium">Delivering across your city</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4 tracking-tight">
              Hungry?
              <br />
              <span className="text-[#FF6B35]">We've got you.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-xl leading-relaxed">
              Order from your favourite restaurants and get fresh food delivered to your doorstep in minutes.
            </p>

            {/* Search Bar with Autocomplete */}
            <form onSubmit={handleSearch} className="flex gap-3 mb-4 max-w-xl">
              <div className="flex-1 relative" ref={searchRef}>
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 z-10" />
                <input
                  type="text"
                  placeholder="Search for restaurants or cuisines..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setActiveIndex(-1); }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl pl-11 pr-10 py-3.5 text-sm focus:outline-none focus:border-[#FF6B35]/60 focus:bg-white/15 transition-all"
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSuggestions([]); setShowDropdown(false); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                    {loadingSuggestions ? (
                      <div className="px-4 py-3 text-sm text-white/40 text-center">Searching...</div>
                    ) : (
                      suggestions.map((r, i) => (
                        <button
                          key={r.id}
                          type="button"
                          onMouseDown={() => handleSuggestionClick(r)}
                          onMouseEnter={() => setActiveIndex(i)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${i === activeIndex ? 'bg-white/10' : 'hover:bg-white/5'
                            } ${i < suggestions.length - 1 ? 'border-b border-white/5' : ''}`}
                        >
                          <div className="w-8 h-8 bg-[#FF6B35]/15 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Search size={14} className="text-[#FF6B35]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-medium truncate">{r.name}</p>
                            <p className="text-xs text-white/40 truncate">{r.cuisine} · {r.address}</p>
                          </div>
                          <ChevronRight size={14} className="text-white/20 flex-shrink-0" />
                        </button>
                      ))
                    )}
                    {/* View all results */}
                    <button
                      type="submit"
                      className="w-full px-4 py-2.5 text-sm text-[#FF6B35] hover:bg-white/5 transition-colors text-left border-t border-white/5"
                    >
                      Search all results for "{searchQuery}" →
                    </button>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="bg-[#FF6B35] hover:bg-[#e55a25] text-white font-semibold px-6 py-3.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2"
              >
                Find Food
                <ChevronRight size={16} />
              </button>
            </form>

            <Link
              to="/restaurants"
              className="inline-flex items-center gap-1.5 text-white/50 hover:text-white/80 text-sm transition-colors"
            >
              <MapPin size={14} />
              Browse all restaurants near you
            </Link>
          </div>
        </div>
      </div>

      {/* Cuisine Categories */}
      <div className="bg-[#111111] border-t border-white/5 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-white text-2xl font-bold">What are you craving?</h2>
            <Link
              to="/restaurants"
              className="text-[#FF6B35] hover:text-[#ff8a5c] text-sm font-medium flex items-center gap-1 transition-colors"
            >
              See all <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {CUISINE_CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                to={`/restaurants?cuisineType=${encodeURIComponent(cat.value)}`}
                className="group flex flex-col items-center gap-2 bg-white/5 hover:bg-[#FF6B35]/15 border border-white/10 hover:border-[#FF6B35]/40 rounded-2xl p-4 transition-all duration-200"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                  {cat.emoji}
                </span>
                <span className="text-white/70 group-hover:text-white text-xs font-medium text-center transition-colors">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Why FoodExpress */}
      <div className="bg-[#0f0f0f] py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-[#FF6B35]/15 rounded-xl flex items-center justify-center shrink-0">
                <Clock size={22} className="text-[#FF6B35]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Fast Delivery</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  Get your food delivered in 30 minutes or less, right to your door.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-[#FF6B35]/15 rounded-xl flex items-center justify-center shrink-0">
                <Star size={22} className="text-[#FF6B35]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Top Rated Restaurants</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  Only the best restaurants, curated and rated by real customers.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-[#FF6B35]/15 rounded-xl flex items-center justify-center shrink-0">
                <IndianRupee size={22} className="text-[#FF6B35]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Best Prices</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  Transparent pricing with no hidden charges. Pay what you see.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FF6B35] rounded-md flex items-center justify-center">
              <UtensilsCrossed size={13} className="text-white" />
            </div>
            <span className="text-white/60 text-sm font-medium">FoodExpress</span>
          </div>
          <p className="text-white/30 text-xs">© 2025 FoodExpress. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-white/40 hover:text-white/70 text-xs transition-colors">Login</Link>
            <Link to="/register" className="text-white/40 hover:text-white/70 text-xs transition-colors">Sign Up</Link>
            <Link to="/restaurants" className="text-white/40 hover:text-white/70 text-xs transition-colors">Browse</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
