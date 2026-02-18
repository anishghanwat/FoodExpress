import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import storage from '../utils/storage';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize auth state from storage
    useEffect(() => {
        const initAuth = () => {
            const token = storage.getToken();
            const storedUser = storage.getUser();

            if (token && storedUser) {
                setUser(storedUser);
                setIsAuthenticated(true);
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    // Login
    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            setUser(response.user);
            setIsAuthenticated(true);
            toast.success('Login successful!');
            return response;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            throw error;
        }
    };

    // Register
    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            setUser(response.user);
            setIsAuthenticated(true);
            toast.success('Registration successful!');
            return response;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            throw error;
        }
    };

    // Logout
    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            // Clear local state even if API call fails
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    // Update user
    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        storage.setUser(updatedUser);
    };

    // Check if user has role
    const hasRole = (role) => {
        return user?.role === role;
    };

    // Check if user has any of the roles
    const hasAnyRole = (roles) => {
        return roles.includes(user?.role);
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
        hasRole,
        hasAnyRole,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export default AuthContext;
