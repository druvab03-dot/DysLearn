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
                        <Login />
                    }
                />

                <Route
                    path="/signup"
                    element={
                        <Login />
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


                {/* ================= ENGLISH LEARNING ================= */}

                <Route
                    path="/class/:classNumber/english"
                    element={
                        <ChildRoute>
                            <LearningModule
                                subject="English"
                            />
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