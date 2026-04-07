"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
    _id: string;
    username: string;
    email: string;
    accessToken: string;
    personalDetails?: {
        fullname?: string;
        age?: number;
        gender?: string;
        religion?: string;
        location?: string;
        bio?: string;
        profilePic?: string;
    };
    education?: {
        degree?: string;
        field?: string;
    };
    professional?: {
        jobTitle?: string;
        income?: number;
    };
    preferences?: {
        preferredAgeMin?: number;
        preferredAgeMax?: number;
        preferredReligion?: string;
        preferredEducation?: string;
        preferredGender?: string;
    };
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => {},
    logout: () => {},
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        router.push("/login"); // Fixed router logic
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
