import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Mail, UtensilsCrossed } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../components/Button';
import authService from '../services/authService';
import { forgotPasswordSchema } from '../utils/validationSchemas';
import toast from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';

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
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <UtensilsCrossed className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">FoodExpress</h1>
                </div>

                <div className="bg-card border border-border rounded-2xl p-8">
                    {!emailSent ? (
                        <>
                            <div className="text-center mb-6">
                                <div className="w-14 h-14 bg-primary/15 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-7 h-7 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground mb-2">Forgot Password?</h2>
                                <p className="text-muted-foreground text-sm">
                                    No worries! Enter your email and we'll send you reset instructions.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        {...register('email')}
                                        className="w-full px-4 py-2.5 bg-input border border-border text-foreground placeholder-muted-foreground rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/60 outline-none transition-all"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                                    )}
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link to="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                                    <ArrowLeft size={14} className="mr-1" />
                                    Back to Login
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="w-14 h-14 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-7 h-7 text-emerald-500" />
                            </div>
                            <h2 className="text-xl font-bold text-foreground mb-2">Check Your Email</h2>
                            <p className="text-muted-foreground text-sm mb-6">
                                We've sent password reset instructions to your email address.
                            </p>
                            <p className="text-sm text-muted-foreground mb-6">
                                Didn't receive the email? Check your spam folder or{' '}
                                <button onClick={() => setEmailSent(false)} className="text-primary hover:text-primary/80 transition-colors">
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
