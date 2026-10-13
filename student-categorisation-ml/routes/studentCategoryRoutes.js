const express = require("express");
const router = express.Router();

const {
    getStudentCategoryStatus,
    triggerInitialCategorisation,
    triggerCycleReevaluation,
    recordLearningTime,
    recordTrainingSession,
    getStudentPerformanceReport,
    getCategorisationConfig,
} = require("../controllers/studentCategoryController");

const { protect } = require("../../server/middleware/authMiddleware");
const jwt = require("jsonwebtoken");
const Parent = require("../../server/models/Parent");

/**
 * Optional authentication middleware:
 * Populates req.parent if a valid Bearer token is provided.
 * Continues without error if no token is provided (e.g. child learning session).
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization || "";
        const token = authorization.startsWith("Bearer ") ? authorization.split(" ")[1] : null;
        if (token && process.env.JWT_SECRET) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const parent = await Parent.findById(decoded.id).select("-password");
            if (parent) {
                req.parent = parent;
            }
        }
    } catch (err) {
        // Continue unauthenticated
    }
    next();
};

// Configuration
router.get("/config", getCategorisationConfig);

// Category status & history
router.get("/status/:childId", optionalAuth, getStudentCategoryStatus);

// Initial categorisation trigger (handwriting only)
router.post("/initial/:childId", optionalAuth, triggerInitialCategorisation);

// Multi-component learning cycle re-evaluation trigger
router.post("/evaluate/:childId", optionalAuth, triggerCycleReevaluation);

// Learning metrics recording
router.post("/record-learning-time", optionalAuth, recordLearningTime);
router.post("/record-training", optionalAuth, recordTrainingSession);

// Downloadable performance report (authenticated parents only)
router.get("/report/:childId", protect, getStudentPerformanceReport);

module.exports = router;
