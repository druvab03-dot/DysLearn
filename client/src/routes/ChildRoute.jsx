import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentParent } from "../services/authService";

function ChildRoute({ children }) {
    const [checking, setChecking] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [hasChild, setHasChild] = useState(false);

    useEffect(() => {
        const check = async () => {
            const token = localStorage.getItem("token");
            const activeChild = localStorage.getItem("activeChild");

            if (!token) {
                setAuthenticated(false);
                setHasChild(false);
                setChecking(false);
                return;
            }

            try {
                await getCurrentParent();
                setAuthenticated(true);

                if (!activeChild) {
                    setHasChild(false);
                    return;
                }

                JSON.parse(activeChild);
                setHasChild(true);
            } catch (error) {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("parent");
                    localStorage.removeItem("activeChild");
                    setAuthenticated(false);
                    setHasChild(false);
                } else if (localStorage.getItem("token")) {
                    // Retain session on network latency or non-auth error
                    setAuthenticated(true);
                    setHasChild(Boolean(activeChild));
                } else {
                    setAuthenticated(false);
                    setHasChild(false);
                }
            } finally {
                setChecking(false);
            }
        };

        check();
    }, []);

    if (checking) {
        return <div>Checking authentication...</div>;
    }

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!hasChild) {
        return <Navigate to="/parent-dashboard" replace />;
    }

    return children;
}

export default ChildRoute;