import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Eye, EyeOff, UtensilsCrossed } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../utils/validationSchemas';
import { USER_ROLES } from '../utils/constants';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await login(data);
      const user = response.user;

      const redirectTo = location.state?.redirectTo;
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
        return;
      }

      if (user.role === USER_ROLES.CUSTOMER) navigate('/restaurants', { replace: true });
      else if (user.role === USER_ROLES.RESTAURANT_OWNER) navigate('/owner/dashboard', { replace: true });
      else if (user.role === USER_ROLES.DELIVERY_AGENT) navigate('/agent/dashboard', { replace: true });
      else if (user.role === USER_ROLES.ADMIN) navigate('/admin/dashboard', { replace: true });
      else navigate('/', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1a0a00 0%, #0f0f0f 50%, #001a2e 100%)' }}>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FF6B35, transparent)' }} />
        <div className="relative text-center text-white p-12 z-10">
          <div className="w-20 h-20 bg-[#FF6B35] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <UtensilsCrossed className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4">FoodExpress</h1>
          <p className="text-xl text-white/60">Delicious food, delivered fast.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="w-12 h-12 bg-[#FF6B35] rounded-xl flex items-center justify-center mx-auto mb-3">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">FoodExpress</h1>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-white/50 mb-6 text-sm">Sign in to continue to FoodExpress</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  {...register('email')}
                  className="w-full px-4 py-2.5 bg-white/7 border border-white/15 text-white placeholder-white/30 rounded-lg focus:ring-2 focus:ring-[#FF6B35]/50 focus:border-[#FF6B35]/60 outline-none transition-all"
                />
                {errors.email && <p className="mt-1 text-sm text-[#EF4444]">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password')}
                    className="w-full px-4 py-2.5 bg-white/7 border border-white/15 text-white placeholder-white/30 rounded-lg focus:ring-2 focus:ring-[#FF6B35]/50 focus:border-[#FF6B35]/60 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-[#EF4444]">{errors.password.message}</p>}
              </div>

              <div className="flex items-center justify-end">
                <Link to="/forgot-password" className="text-sm text-[#FF6B35] hover:text-[#ff8a5c] transition-colors">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-white/50">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#FF6B35] hover:text-[#ff8a5c] font-medium transition-colors">
                  Register now
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-xs text-white/30 text-center mb-3">Demo Credentials</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { role: 'Customer', email: 'customer@test.com' },
                  { role: 'Owner', email: 'owner@test.com' },
                  { role: 'Agent', email: 'agent@test.com' },
                  { role: 'Admin', email: 'admin@test.com' },
                ].map(({ role, email }) => (
                  <div key={role} className="p-2 bg-white/5 border border-white/10 rounded-lg">
                    <div className="font-medium text-white/70">{role}</div>
                    <div className="text-white/40">{email}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-white/30 mt-2">Password: Password@123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
