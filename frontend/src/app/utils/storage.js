import { STORAGE_KEYS } from './constants';

// Session Storage Wrapper (tab-isolated — each tab has its own auth session)
class Storage {
    // Set item
    set(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            sessionStorage.setItem(key, serializedValue);
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    // Get item
    get(key, defaultValue = null) {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    }

    // Remove item
    remove(key) {
        try {
            sessionStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }

    // Clear all
    clear() {
        try {
            sessionStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }

    // Check if key exists
    has(key) {
        return sessionStorage.getItem(key) !== null;
    }

    // Get all keys
    keys() {
        return Object.keys(sessionStorage);
    }

    // Auth specific methods
    setToken(token) {
        return this.set(STORAGE_KEYS.TOKEN, token);
    }

    getToken() {
        return this.get(STORAGE_KEYS.TOKEN);
    }

    removeToken() {
        return this.remove(STORAGE_KEYS.TOKEN);
    }

    setRefreshToken(token) {
        return this.set(STORAGE_KEYS.REFRESH_TOKEN, token);
    }

    getRefreshToken() {
        return this.get(STORAGE_KEYS.REFRESH_TOKEN);
    }

    removeRefreshToken() {
        return this.remove(STORAGE_KEYS.REFRESH_TOKEN);
    }

    setUser(user) {
        return this.set(STORAGE_KEYS.USER, user);
    }

    getUser() {
        return this.get(STORAGE_KEYS.USER);
    }

    removeUser() {
        return this.remove(STORAGE_KEYS.USER);
    }

    // Cart specific methods
    setCart(cart) {
        return this.set(STORAGE_KEYS.CART, cart);
    }

    getCart() {
        return this.get(STORAGE_KEYS.CART, []);
    }

    removeCart() {
        return this.remove(STORAGE_KEYS.CART);
    }

    // Theme specific methods
    setTheme(theme) {
        return this.set(STORAGE_KEYS.THEME, theme);
    }

    getTheme() {
        return this.get(STORAGE_KEYS.THEME, 'light');
    }

    // Clear auth data
    clearAuth() {
        this.removeToken();
        this.removeRefreshToken();
        this.removeUser();
    }
}

export default new Storage();
