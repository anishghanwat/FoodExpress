import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
    ArrowLeft, User, Mail, Phone, Shield, LogOut,
    ShoppingBag, Bell, ChevronRight, Edit3, Check, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { toast } from 'sonner';

export function Profile() {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();

    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
    });
    const [saving, setSaving] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            toast.error('Name cannot be empty');
            return;
        }
        setSaving(true);
        try {
            // Optimistically update local user state
            updateUser({ ...user, name: formData.name, phone: formData.phone });
            toast.success('Profile updated!');
            setEditing(false);
        } catch {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({ name: user?.name || '', phone: user?.phone || '' });
        setEditing(false);
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'ROLE_ADMIN': return 'Administrator';
            case 'ROLE_OWNER': return 'Restaurant Owner';
            case 'ROLE_AGENT': return 'Delivery Agent';
            default: return 'Customer';
        }
    };

    const getRoleDashboardLink = (role) => {
        switch (role) {
            case 'ROLE_ADMIN': return '/admin/dashboard';
            case 'ROLE_OWNER': return '/owner/dashboard';
            case 'ROLE_AGENT': return '/agent/dashboard';
            default: return null;
        }
    };

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    const dashboardLink = getRoleDashboardLink(user?.role);

    return (
        <div className="min-h-screen bg-[#0f0f0f]">
            {/* Header */}
            <div className="bg-black/60 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
                        >
                            <ArrowLeft size={18} />
                            Back
                        </button>
                        <Link to="/" className="text-lg font-bold text-white hover:text-[#FF6B35] transition-colors">
                            FoodExpress
                        </Link>
                        <div className="w-16" />
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">

                {/* Avatar + Name Card */}
                <Card>
                    <div className="p-6">
                        <div className="flex items-center gap-5">
                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#ff8a5c] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                                {initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl font-bold text-white truncate">{user?.name || 'User'}</h1>
                                <p className="text-white/50 text-sm truncate">{user?.email}</p>
                                <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-[#FF6B35]/15 border border-[#FF6B35]/30 text-[#FF6B35] text-xs rounded-full font-medium">
                                    {getRoleLabel(user?.role)}
                                </span>
                            </div>
                            {!editing && (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                                    title="Edit profile"
                                >
                                    <Edit3 size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Edit Form */}
                {editing && (
                    <Card>
                        <div className="p-6 space-y-4">
                            <h2 className="text-base font-semibold text-white mb-4">Edit Profile</h2>
                            <Input
                                label="Full Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Your full name"
                            />
                            <Input
                                label="Phone Number"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+91 XXXXX XXXXX"
                            />
                            <div className="flex gap-3 pt-2">
                                <Button onClick={handleSave} disabled={saving} className="flex-1 gap-2">
                                    <Check size={16} />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button variant="outline" onClick={handleCancel} className="flex-1 gap-2">
                                    <X size={16} />
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Account Info */}
                <Card>
                    <div className="p-5">
                        <h2 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Account</h2>
                        <div className="space-y-0 divide-y divide-white/5">
                            <div className="flex items-center gap-3 py-3">
                                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Mail size={15} className="text-white/50" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-white/40">Email</p>
                                    <p className="text-sm text-white truncate">{user?.email || '—'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 py-3">
                                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Phone size={15} className="text-white/50" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-white/40">Phone</p>
                                    <p className="text-sm text-white">{user?.phone || 'Not set'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 py-3">
                                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Shield size={15} className="text-white/50" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-white/40">Role</p>
                                    <p className="text-sm text-white">{getRoleLabel(user?.role)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Quick Links */}
                <Card>
                    <div className="p-5">
                        <h2 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Quick Links</h2>
                        <div className="space-y-0 divide-y divide-white/5">
                            <Link to="/orders/history" className="flex items-center gap-3 py-3 hover:bg-white/5 -mx-2 px-2 rounded-lg transition-colors">
                                <div className="w-8 h-8 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <ShoppingBag size={15} className="text-[#FF6B35]" />
                                </div>
                                <span className="flex-1 text-sm text-white">My Orders</span>
                                <ChevronRight size={16} className="text-white/30" />
                            </Link>
                            <Link to="/notifications" className="flex items-center gap-3 py-3 hover:bg-white/5 -mx-2 px-2 rounded-lg transition-colors">
                                <div className="w-8 h-8 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Bell size={15} className="text-[#FF6B35]" />
                                </div>
                                <span className="flex-1 text-sm text-white">Notifications</span>
                                <ChevronRight size={16} className="text-white/30" />
                            </Link>
                            {dashboardLink && (
                                <Link to={dashboardLink} className="flex items-center gap-3 py-3 hover:bg-white/5 -mx-2 px-2 rounded-lg transition-colors">
                                    <div className="w-8 h-8 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <User size={15} className="text-[#FF6B35]" />
                                    </div>
                                    <span className="flex-1 text-sm text-white">Dashboard</span>
                                    <ChevronRight size={16} className="text-white/30" />
                                </Link>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3.5 border border-[#EF4444]/30 text-[#EF4444] rounded-xl hover:bg-[#EF4444]/10 transition-colors text-sm font-medium"
                >
                    <LogOut size={16} />
                    Sign Out
                </button>

                <p className="text-center text-white/20 text-xs pb-4">FoodExpress · Member since {new Date().getFullYear()}</p>
            </div>
        </div>
    );
}
