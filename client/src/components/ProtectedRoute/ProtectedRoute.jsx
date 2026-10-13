import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children }) {
    const { isAuthenticated, isCheckingSession } = useAuth();
    const location = useLocation();

    if (isCheckingSession) {
        return <div className="routeLoading">Checking your session…</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}

export default ProtectedRoute;
