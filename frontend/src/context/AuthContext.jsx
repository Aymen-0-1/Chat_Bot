import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const data = await authService.getCurrentUser();
                    setUser(data.user || data);
                } catch (err) {
                    console.error('Failed to get current user:', err.response?.data || err.message);
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    const login = async (credentials) => {
        setError(null);
        try {
            const data = await authService.login(credentials);
            setUser(data.user || data);
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        }
    };

    const register = async (credentials) => {
        setError(null);
        try {
            const data = await authService.register(credentials);
            return { success: true, message: data.message };
        } catch (err) {
            console.log("Backend Error Details:", err.response?.data);
            const errorMessage = err.response?.data?.message || 'Registration failed';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        }
    };

    const logout = async () => {
        setError(null);
        try {
            await authService.logout();
        } catch (err) {
            console.error(err);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);