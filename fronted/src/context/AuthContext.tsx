import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authService } from '../services/api';
import { jwtDecode } from "jwt-decode";

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
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded: any = jwtDecode(token);

                    // Check for expiration
                    const currentTime = Date.now() / 1000;
                    if (decoded.exp && decoded.exp < currentTime) {
                        console.warn("Token expired");
                        authService.logout();
                        setUser(null);
                        return;
                    }
                    setUser({
                        id: 0,
                        email: decoded.user || "",
                        full_name: decoded.user || "Usuario",
                        profile_image_url: null,
                        role: decoded.role || "user",
                        is_active: true
                    });
                } catch (e) {
                    console.error("Invalid token:", e);
                    authService.logout();
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to load user", error);
            authService.logout();
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
        setIsLoading(true);
        await loadUser();
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsLoading(false);
    };

    const refreshUser = async () => {
        await loadUser();
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
