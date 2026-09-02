import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser, registerUser, logoutUser } from "../../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("nexora_token") || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem("nexora_token");
            if (storedToken) {
                try {
                    const userData = await getCurrentUser();
                    setUser(userData);
                    setToken(storedToken);
                } catch (err) {
                    console.log("Auth session expired or invalid:", err);
                    localStorage.removeItem("nexora_token");
                    setUser(null);
                    setToken(null);
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (credentials) => {
        const data = await loginUser(credentials);
        localStorage.setItem("nexora_token", data.access_token);
        setToken(data.access_token);
        setUser(data.user);
        return data;
    };

    const register = async (userData) => {
        const data = await registerUser(userData);
        localStorage.setItem("nexora_token", data.access_token);
        setToken(data.access_token);
        setUser(data.user);
        return data;
    };

    const logout = async () => {
        await logoutUser();
        localStorage.removeItem("nexora_token");
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user && !!token
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export default AuthContext;
