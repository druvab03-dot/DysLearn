import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentParent } from "../services/authService";

function ChildRoute({ children }) {
    const [checking, setChecking] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [redirectTo, setRedirectTo] = useState("/login");

    useEffect(() => {
        const check = async () => {
            const token = localStorage.getItem("token");
            const activeChild = localStorage.getItem("activeChild");

            if (!token) {
                setAuthenticated(false);
                setRedirectTo("/login");
                setChecking(false);
                return;
            }

            try {
                await getCurrentParent();

                if (!activeChild) {
                    setAuthenticated(false);
                    setRedirectTo("/parent-dashboard");
                    setChecking(false);
                    return;
                }

                const parsedChild = JSON.parse(activeChild);
                if (!parsedChild?.handwritingAnalyzed || !parsedChild?.analysisReportPdf) {
                    setAuthenticated(false);
                    setRedirectTo("/parent-dashboard");
                    setChecking(false);
                    return;
                }

                setAuthenticated(true);
            } catch (err) {
                localStorage.removeItem("token");
                localStorage.removeItem("parent");
                localStorage.removeItem("activeChild");
                setAuthenticated(false);
                setRedirectTo("/login");
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
        return <Navigate to={redirectTo} replace />;
    }

    return children;
}

export default ChildRoute;