import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, UtensilsCrossed, Check, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../components/Button';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { registerSchema } from '../utils/validationSchemas';
import { USER_ROLES } from '../utils/constants';

export function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '', email: '', phone: '', password: '', confirmPassword: '',
      role: USER_ROLES.CUSTOMER,
    },
  });

  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');

  const passwordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;
    return strength;
  };

  const strength = passwordStrength(password);
  const passwordsMatch = password && password === confirmPassword;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      if (data.role === USER_ROLES.CUSTOMER) navigate('/restaurants', { replace: true });
      else if (data.role === USER_ROLES.RESTAURANT_OWNER) navigate('/owner/dashboard', { replace: true });
      else if (data.role === USER_ROLES.DELIVERY_AGENT) navigate('/agent/dashboard', { replace: true });
      else navigate('/', { replace: true });
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-input border border-border text-foreground placeholder-muted-foreground rounded-lg focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-all";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <div className="min-h-screen bg-background flex">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #001a2e 0%, #0f0f0f 50%, #1a0a00 100%)' }}>
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FF6B35, transparent)' }} />
        <div className="relative text-center text-white p-12 z-10">
          <div className="w-20 h-20 bg-[#FF6B35] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <UtensilsCrossed className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Join FoodExpress</h1>
          <p className="text-xl text-muted-foreground">Start your food delivery journey today</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 overflow-y-auto bg-background">
        <div className="w-full max-w-md py-6">
          <div className="text-center mb-6 lg:hidden">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
              <UtensilsCrossed className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">FoodExpress</h1>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-1">Create Account</h2>
            <p className="text-muted-foreground mb-6 text-sm">Join the FoodExpress community</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register('name')}
                  className="w-full px-4 py-2.5 bg-input border border-input text-foreground placeholder-muted-foreground rounded-lg focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-all"
                />
                {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  {...register('email')}
                  className="w-full px-4 py-2.5 bg-input border border-input text-foreground placeholder-muted-foreground rounded-lg focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-all"
                />
                {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  {...register('phone')}
                  className="w-full px-4 py-2.5 bg-input border border-input text-foreground placeholder-muted-foreground rounded-lg focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-all"
                />
                {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">I want to register as</label>
                <select
                  {...register('role')}
                  className="w-full px-4 py-2.5 bg-input border border-input text-foreground rounded-lg focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-all"
                >
                  <option value={USER_ROLES.CUSTOMER}>Customer</option>
                  <option value={USER_ROLES.RESTAURANT_OWNER}>Restaurant Owner</option>
                  <option value={USER_ROLES.DELIVERY_AGENT}>Delivery Agent</option>
                </select>
                {errors.role && <p className="mt-1 text-sm text-destructive">{errors.role.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    {...register('password')}
                    className="w-full px-4 py-2.5 bg-input border border-input text-foreground placeholder-muted-foreground rounded-lg focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>}
              </div>

              {password && (
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < strength
                        ? strength === 1 ? 'bg-destructive'
                          : strength === 2 ? 'bg-yellow-500'
                            : 'bg-green-500'
                        : 'bg-muted'
                        }`} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Strength: {strength === 1 ? 'Weak' : strength === 2 ? 'Fair' : strength === 3 ? 'Good' : strength === 4 ? 'Strong' : 'Too short'}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    {...register('confirmPassword')}
                    className="w-full px-4 py-2.5 bg-input border border-input text-foreground placeholder-muted-foreground rounded-lg focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-all"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {confirmPassword && (
                    <div className="absolute right-10 top-2.5">
                      {passwordsMatch ? <Check size={18} className="text-green-500" /> : <X size={18} className="text-destructive" />}
                    </div>
                  )}
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-destructive">{errors.confirmPassword.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
