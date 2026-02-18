import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Mail, UtensilsCrossed } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../components/Button';
import authService from '../services/authService';
import { forgotPasswordSchema } from '../utils/validationSchemas';
import toast from 'react-hot-toast';

export function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: '' },
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await authService.forgotPassword(data.email);
            setEmailSent(true);
            toast.success('Password reset link sent to your email');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f0f0f]"
            style={{ background: 'linear-gradient(135deg, #1a0a00 0%, #0f0f0f 50%, #001a2e 100%)' }}>
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-[#FF6B35] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <UtensilsCrossed className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">FoodExpress</h1>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    {!emailSent ? (
                        <>
                            <div className="text-center mb-6">
                                <div className="w-14 h-14 bg-[#FF6B35]/15 border border-[#FF6B35]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-7 h-7 text-[#FF6B35]" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">Forgot Password?</h2>
                                <p className="text-white/50 text-sm">
                                    No worries! Enter your email and we'll send you reset instructions.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1.5">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        {...register('email')}
                                        className="w-full px-4 py-2.5 bg-white/7 border border-white/15 text-white placeholder-white/30 rounded-lg focus:ring-2 focus:ring-[#FF6B35]/50 focus:border-[#FF6B35]/60 outline-none transition-all"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-[#EF4444]">{errors.email.message}</p>
                                    )}
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link to="/login" className="inline-flex items-center text-sm text-white/50 hover:text-[#FF6B35] transition-colors">
                                    <ArrowLeft size={14} className="mr-1" />
                                    Back to Login
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="w-14 h-14 bg-[#10B981]/15 border border-[#10B981]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-7 h-7 text-[#10B981]" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Check Your Email</h2>
                            <p className="text-white/50 text-sm mb-6">
                                We've sent password reset instructions to your email address.
                            </p>
                            <p className="text-sm text-white/40 mb-6">
                                Didn't receive the email? Check your spam folder or{' '}
                                <button onClick={() => setEmailSent(false)} className="text-[#FF6B35] hover:text-[#ff8a5c] transition-colors">
                                    try again
                                </button>
                            </p>
                            <Link to="/login">
                                <Button className="w-full">Back to Login</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
