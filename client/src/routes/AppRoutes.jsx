import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Landing from "../pages/Landing/Landing";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import ClassDashboard from "../pages/ClassDashboard/ClassDashboard";
import ParentDashboard from "../pages/ParentDashboard/ParentDashboard";

import LearningModule from "../components/LearningModule/LearningModule";

import ProtectedRoute from "./ProtectedRoute";
import ChildRoute from "./ChildRoute";

function PublicOnlyRoute({ children }) {
    const token = localStorage.getItem("token");
    if (token) {
        const activeChild = localStorage.getItem("activeChild");
        return (
            <Navigate
                to={activeChild ? "/dashboard" : "/parent-dashboard"}
                replace
            />
        );
    }
    return children;
}


function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>


                {/* ================= PUBLIC ================= */}

                <Route
                    path="/"
                    element={
                        <Landing />
                    }
                />

                <Route
                    path="/login"
                    element={
                        <PublicOnlyRoute>
                            <Login />
                        </PublicOnlyRoute>
                    }
                />

                <Route
                    path="/signup"
                    element={
                        <PublicOnlyRoute>
                            <Login />
                        </PublicOnlyRoute>
                    }
                />


                {/* ================= PARENT DASHBOARD ================= */}

                <Route
                    path="/parent-dashboard"
                    element={
                        <ProtectedRoute>
                            <ParentDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* ================= MAIN DASHBOARD ================= */}

                <Route
                    path="/dashboard"
                    element={
                        <ChildRoute>
                            <Dashboard />
                        </ChildRoute>
                    }
                />


                {/* ================= CLASS DASHBOARD ================= */}

                <Route
                    path="/class/:classNumber"
                    element={
                        <ChildRoute>
                            <ClassDashboard />
                        </ChildRoute>
                    }
                />


                {/* ================= LEARNING MODULE ================= */}

                <Route
                    path="/class/:classNumber/:subject"
                    element={
                        <ChildRoute>
                            <LearningModule />
                        </ChildRoute>
                    }
                />

                <Route
                    path="/class/:classNumber/learning"
                    element={
                        <ChildRoute>
                            <LearningModule />
                        </ChildRoute>
                    }
                />


                {/* ================= FALLBACK ================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}


export default AppRoutes;