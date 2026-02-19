import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

/**
 * RoleBasedRoute - Protects routes based on user role
 * Redirects to appropriate page if user doesn't have required role
 */
export function RoleBasedRoute({ children, allowedRoles }) {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user?.role)) {
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

export default RoleBasedRoute;
