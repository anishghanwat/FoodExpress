import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

/**
 * GuestRoute - For pages that should only be accessible to non-authenticated users
 * Redirects authenticated users to their appropriate dashboard
 */
export function GuestRoute({ children }) {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        // Redirect to appropriate dashboard based on user role
        if (user?.role === 'CUSTOMER') {
            return <Navigate to="/restaurants" replace />;
        } else if (user?.role === 'RESTAURANT_OWNER') {
            return <Navigate to="/owner/dashboard" replace />;
        } else if (user?.role === 'DELIVERY_AGENT') {
            return <Navigate to="/agent/dashboard" replace />;
        } else if (user?.role === 'ADMIN') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return children;
}

export default GuestRoute;
