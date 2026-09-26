import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getCurrentUser, loginUser, registerUser, logoutUser, getMyPermissions, WORKSPACE_ID } from "../../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("nexora_token") || null);
    const [permissions, setPermissions] = useState({});
    const [userRole, setUserRole] = useState("Member");
    const [isOwner, setIsOwner] = useState(false);
    const [loading, setLoading] = useState(true);

    const refreshPermissions = useCallback(async (workspaceId = WORKSPACE_ID) => {
        const storedToken = localStorage.getItem("nexora_token");
        if (!storedToken) return;
        try {
            const data = await getMyPermissions(workspaceId);
            if (data) {
                setPermissions(data.permissions || {});
                setUserRole(data.role || "Member");
                setIsOwner(!!data.is_owner);
            }
        } catch (err) {
            console.log("Failed to refresh user permissions:", err);
        }
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem("nexora_token");
            if (storedToken) {
                try {
                    const userData = await getCurrentUser();
                    setUser(userData);
                    setToken(storedToken);
                    await refreshPermissions();
                } catch (err) {
                    console.log("Auth session expired or invalid:", err);
                    localStorage.removeItem("nexora_token");
                    setUser(null);
                    setToken(null);
                    setPermissions({});
                    setUserRole("Member");
                    setIsOwner(false);
                }
            }
            setLoading(false);
        };
        initAuth();
    }, [refreshPermissions]);

    const login = async (credentials) => {
        const data = await loginUser(credentials);
        localStorage.setItem("nexora_token", data.access_token);
        setToken(data.access_token);
        try {
            const freshUser = await getCurrentUser();
            setUser(freshUser);
        } catch {
            setUser(data.user);
        }
        await refreshPermissions();
        return data;
    };

    const register = async (userData) => {
        const data = await registerUser(userData);
        localStorage.setItem("nexora_token", data.access_token);
        setToken(data.access_token);
        try {
            const freshUser = await getCurrentUser();
            setUser(freshUser);
        } catch {
            setUser(data.user);
        }
        await refreshPermissions();
        return data;
    };

    const logout = async () => {
        await logoutUser();
        localStorage.removeItem("nexora_token");
        setUser(null);
        setToken(null);
        setPermissions({});
        setUserRole("Member");
        setIsOwner(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                permissions,
                userRole,
                isOwner,
                refreshPermissions,
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
