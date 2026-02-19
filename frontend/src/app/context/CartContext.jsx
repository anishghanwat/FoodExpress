import React, { createContext, useContext, useState, useEffect } from 'react';
import storage from '../utils/storage';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [restaurant, setRestaurant] = useState(null);

    // Load cart from storage on mount
    useEffect(() => {
        const savedCart = storage.getCart();
        if (savedCart && savedCart.items) {
            setCart(savedCart.items);
            setRestaurant(savedCart.restaurant);
        }
    }, []);

    // Save cart to storage whenever it changes
    useEffect(() => {
        if (cart.length > 0) {
            storage.setCart({ items: cart, restaurant });
        } else {
            storage.removeCart();
        }
    }, [cart, restaurant]);

    // Add item to cart
    const addItem = (item, restaurantInfo) => {
        // Check if cart has items from different restaurant
        if (restaurant && restaurant.id !== restaurantInfo.id) {
            const confirm = window.confirm(
                'Your cart contains items from another restaurant. Do you want to clear it and add items from this restaurant?'
            );
            if (!confirm) return;
            clearCart();
        }

        setRestaurant(restaurantInfo);

        const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id);

        if (existingItemIndex > -1) {
            // Item exists, update quantity
            const updatedCart = [...cart];
            updatedCart[existingItemIndex].quantity += item.quantity || 1;
            setCart(updatedCart);
            toast.success('Item quantity updated');
        } else {
            // New item, add to cart
            setCart([...cart, { ...item, quantity: item.quantity || 1 }]);
            toast.success('Item added to cart');
        }
    };

    // Remove item from cart
    const removeItem = (itemId) => {
        const updatedCart = cart.filter((item) => item.id !== itemId);
        setCart(updatedCart);

        if (updatedCart.length === 0) {
            setRestaurant(null);
        }

        toast.success('Item removed from cart');
    };

    // Alias for removeItem to match usage in Checkout
    const removeFromCart = removeItem;

    // Update item quantity
    const updateQuantity = (itemId, quantity) => {
        if (quantity <= 0) {
            removeItem(itemId);
            return;
        }

        const updatedCart = cart.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
        );
        setCart(updatedCart);
    };

    // Clear cart
    const clearCart = () => {
        setCart([]);
        setRestaurant(null);
        storage.removeCart();
    };

    // Get cart total
    const getTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // Get cart item count
    const getItemCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    // Check if item is in cart
    const isInCart = (itemId) => {
        return cart.some((item) => item.id === itemId);
    };

    // Get item quantity
    const getItemQuantity = (itemId) => {
        const item = cart.find((item) => item.id === itemId);
        return item ? item.quantity : 0;
    };

    const value = {
        cart,
        restaurant,
        addItem,
        removeItem,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
        isInCart,
        getItemQuantity,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export default CartContext;
