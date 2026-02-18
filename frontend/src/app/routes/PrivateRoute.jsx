import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

/**
 * PrivateRoute - Protects routes that require authentication
 * Redirects to login if user is not authenticated
 */
export function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

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

    return children;
}

export default PrivateRoute;
