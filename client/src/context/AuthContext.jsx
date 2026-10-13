/* eslint-disable react-refresh/only-export-components */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { getCurrentParent } from "../services/authService";

const AuthContext = createContext();

function getStoredSession() {
    const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
    const token = storage.getItem("token");
    const parent = storage.getItem("parent");

    if (!token || !parent) return null;

    try {
        return { token, parent: JSON.parse(parent), storage };
    } catch {
        storage.removeItem("token");
        storage.removeItem("parent");
        return null;
    }
}

export function AuthProvider({ children }) {
    const [parent, setParent] = useState(() => getStoredSession()?.parent || null);
    const [isCheckingSession, setIsCheckingSession] = useState(true);

    const clearSession = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("parent");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("parent");
        setParent(null);
    }, []);

    const saveSession = useCallback((data, rememberMe = true) => {
        const storage = rememberMe ? localStorage : sessionStorage;
        const otherStorage = rememberMe ? sessionStorage : localStorage;

        otherStorage.removeItem("token");
        otherStorage.removeItem("parent");
        storage.setItem("token", data.token);
        storage.setItem("parent", JSON.stringify(data.parent));
        setParent(data.parent);
    }, []);

    useEffect(() => {
        const verifySession = async () => {
            const session = getStoredSession();

            if (!session) {
                setIsCheckingSession(false);
                return;
            }

            try {
                const data = await getCurrentParent();
                const refreshedParent = data.parent;
                session.storage.setItem("parent", JSON.stringify(refreshedParent));
                setParent(refreshedParent);
            } catch (error) {
                if (error.response?.status === 401) clearSession();
            } finally {
                setIsCheckingSession(false);
            }
        };

        verifySession();
    }, [clearSession]);

    const value = useMemo(() => ({
        parent,
        isAuthenticated: Boolean(parent),
        isCheckingSession,
        saveSession,
        logout: clearSession,
    }), [parent, isCheckingSession, saveSession, clearSession]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
