const express = require("express");
const router = express.Router();

const {
    startAssessmentSession,
    submitAssessment,
    getAssessmentById,
    getChildAssessments,
} = require("../controllers/assessmentController");

// Session management
router.post("/session/start", startAssessmentSession);
router.post("/session/submit", submitAssessment);

// Assessment history and retrieval
router.get("/child/:childId", getChildAssessments);
router.get("/:id", getAssessmentById);

module.exports = router;
