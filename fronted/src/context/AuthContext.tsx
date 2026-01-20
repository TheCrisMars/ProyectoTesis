import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authService } from '../services/api';

interface User {
    id: number;
    email: string;
    full_name: string | null;
    profile_image_url: string | null;
    role: string; // 'admin' | 'user'
    is_active: boolean;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Function to load user profile
    const loadUser = async () => {
        try {
            if (authService.isAuthenticated()) {
                const response = await authService.getMe();
                setUser(response.data);
            } else {
                setUser(null); // Ensure user is null if not authenticated
            }
        } catch (error) {
            console.error("Failed to load user", error);
            authService.logout(); // If token is invalid, logout
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const login = async (token: string) => {
        localStorage.setItem('token', token);
        setIsLoading(true); // Set loading true while fetching user after login
        await loadUser();
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsLoading(false); // Not loading after logout
    };

    const refreshUser = async () => {
        try {
            if (authService.isAuthenticated()) {
                const response = await authService.getMe();
                setUser(response.data);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to refresh user", error);
            // Optionally, if refresh fails due to invalid token, force logout
            authService.logout();
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            logout,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
