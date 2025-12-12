import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../mocks/mockUsers';
import { authenticateUser } from '../mocks/mockUsers';

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    isTeacher: boolean;
    isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'skill_passport_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // Load user from localStorage on mount
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Failed to load user from storage:', error);
        }
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        const authenticatedUser = authenticateUser(username, password);

        if (authenticatedUser) {
            setUser(authenticatedUser);
            try {
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));
            } catch (error) {
                console.error('Failed to save user to storage:', error);
            }
            return true;
        }

        return false;
    };

    const logout = () => {
        setUser(null);
        try {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        } catch (error) {
            console.error('Failed to remove user from storage:', error);
        }
    };

    const value: AuthContextType = {
        user,
        login,
        logout,
        isAuthenticated: user !== null,
        isTeacher: user?.role === 'teacher',
        isStudent: user?.role === 'student',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
