"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Load session on mount
        const storedToken = localStorage.getItem("token");
        const storedProfile = localStorage.getItem("userProfile");

        if (storedToken && storedProfile) {
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedProfile));
            } catch (e) {
                console.error("Failed to parse user profile", e);
            }
        }
        setLoading(false);
    }, []);

    const login = (newToken, userData) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("userProfile", JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        router.push("/dashboard");
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userProfile");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("weeklyPlan");
        setToken(null);
        setUser(null);
        router.push("/");
    };

    const value = {
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
