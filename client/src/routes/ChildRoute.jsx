import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentParent } from "../services/authService";

function ChildRoute({ children }) {
    const [checking, setChecking] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const check = async () => {
            const token = localStorage.getItem("token");
            const activeChild = localStorage.getItem("activeChild");

            if (!token) {
                setAuthenticated(false);
                setChecking(false);
                return;
            }

            try {
                await getCurrentParent();

                if (!activeChild) {
                    setAuthenticated(false);
                    setChecking(false);
                    return;
                }

                JSON.parse(activeChild);

                setAuthenticated(true);
            } catch (err) {
                localStorage.removeItem("token");
                localStorage.removeItem("parent");
                localStorage.removeItem("activeChild");
                setAuthenticated(false);
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

    return children;
}

export default ChildRoute;