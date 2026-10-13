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
import TrainingModule from "../components/TrainingModule/TrainingModule";
import AssessmentSession from "../components/AssessmentModule/AssessmentSession";
import AssessmentLobby from "../components/AssessmentModule/AssessmentLobby";

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


                {/* ================= SUBJECT LEARNING ================= */}

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

                <Route
                    path="/class/:classNumber/:subject"
                    element={
                        <ChildRoute>
                            <LearningModule />
                        </ChildRoute>
                    }
                />


                {/* ================= TRAINING MODULE ================= */}

                <Route
                    path="/class/:classNumber/:subject/training"
                    element={
                        <ChildRoute>
                            <TrainingModule />
                        </ChildRoute>
                    }
                />

                <Route
                    path="/training/:classNumber/:subject"
                    element={
                        <ChildRoute>
                            <TrainingModule />
                        </ChildRoute>
                    }
                />

                <Route
                    path="/training/:classNumber"
                    element={
                        <ChildRoute>
                            <TrainingModule />
                        </ChildRoute>
                    }
                />

                <Route
                    path="/training"
                    element={
                        <ChildRoute>
                            <TrainingModule />
                        </ChildRoute>
                    }
                />


                {/* ================= GAMIFIED ASSESSMENT SYSTEM ================= */}

                <Route
                    path="/class/:classNumber/:subject/assessment"
                    element={
                        <ChildRoute>
                            <AssessmentSession />
                        </ChildRoute>
                    }
                />

                <Route
                    path="/assessment/:classNumber/:subject"
                    element={
                        <ChildRoute>
                            <AssessmentSession />
                        </ChildRoute>
                    }
                />

                <Route
                    path="/assessment"
                    element={
                        <ChildRoute>
                            <AssessmentLobby />
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