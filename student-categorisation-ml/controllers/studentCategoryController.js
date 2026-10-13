/**
 * Student Categorisation Controller
 * 
 * Exposes API endpoints for:
 * - Student category retrieval & status
 * - Initial categorization trigger
 * - Multi-component cycle re-evaluation
 * - Learning time & training event recording
 * - Comprehensive performance report generation
 */

const Child = require("../../server/models/Child");
const AnalysisResult = require("../../server/models/AnalysisResult");
const AssessmentResult = require("../../server/models/AssessmentResult");
const StudentCategory = require("../models/studentCategoryModel");

const {
    assignInitialCategory,
    reevaluateStudentCategory,
} = require("../services/categoryAssignmentService");
const {
    buildStudentReportData,
    generateHtmlReport,
} = require("../services/reportGenerationService");
const {
    validateLearningTimePayload,
    validateTrainingPayload,
    isValidObjectId,
} = require("../utils/dataValidation");
const categorisationConfig = require("../config/categorisationConfig");

/**
 * Get current category status & component metrics for a student.
 * GET /api/student-category/status/:childId
 */
exports.getStudentCategoryStatus = async (req, res) => {
    try {
        const { childId } = req.params;

        if (!isValidObjectId(childId)) {
            return res.status(400).json({ message: "Invalid student ID." });
        }

        const child = await Child.findById(childId);
        if (!child) {
            return res.status(404).json({ message: "Student not found." });
        }

        // Parent authorization: ensure parent owns child
        if (req.parent && String(child.parent) !== String(req.parent._id)) {
            return res.status(403).json({ message: "Unauthorized to view this student." });
        }

        const history = await StudentCategory.find({ child: child._id })
            .sort({ evaluatedAt: -1 })
            .limit(10);

        return res.status(200).json({
            success: true,
            childId: child._id,
            name: child.name,
            classNumber: child.classNumber,
            category: child.category || null,
            categoryLabel: child.categoryLabel || "Pending Analysis",
            categorisationType: child.categorisationType || null,
            categorisationScore: child.categorisationScore,
            componentScores: child.componentScores || {
                handwriting: null,
                learningTime: null,
                training: null,
                assessment: null,
            },
            categoryReason: child.categoryReason,
            lastCategorisationDate: child.lastCategorisationDate,
            learningCyclesCompleted: child.learningCyclesCompleted || 0,
            learningTimeStats: child.learningTimeStats || { activeSeconds: 0, totalSeconds: 0 },
            trainingStats: child.trainingStats || { totalAttempted: 0, totalCorrect: 0 },
            history,
            weights: categorisationConfig.COMPONENT_WEIGHTS,
            thresholds: categorisationConfig.REASSESSMENT_THRESHOLDS,
        });
    } catch (error) {
        console.error("Error getting category status:", error);
        return res.status(500).json({
            message: "Failed to retrieve student category status.",
            error: error.message,
        });
    }
};

/**
 * Assign initial category based exclusively on handwriting analysis.
 * POST /api/student-category/initial/:childId
 */
exports.triggerInitialCategorisation = async (req, res) => {
    try {
        const { childId } = req.params;

        if (!isValidObjectId(childId)) {
            return res.status(400).json({ message: "Invalid student ID." });
        }

        const child = await Child.findById(childId);
        if (!child) {
            return res.status(404).json({ message: "Student not found." });
        }

        if (req.parent && String(child.parent) !== String(req.parent._id)) {
            return res.status(403).json({ message: "Unauthorized to modify this student." });
        }

        const result = await assignInitialCategory(childId);
        return res.status(200).json({
            success: true,
            message: "Initial categorization processed successfully.",
            data: result,
        });
    } catch (error) {
        console.error("Error triggering initial categorisation:", error);
        return res.status(500).json({
            message: "Failed to process initial categorization.",
            error: error.message,
        });
    }
};

/**
 * Trigger multi-component re-evaluation after learning cycle.
 * POST /api/student-category/evaluate/:childId
 */
exports.triggerCycleReevaluation = async (req, res) => {
    try {
        const { childId } = req.params;
        const { assessmentId } = req.body;

        if (!isValidObjectId(childId)) {
            return res.status(400).json({ message: "Invalid student ID." });
        }

        const child = await Child.findById(childId);
        if (!child) {
            return res.status(404).json({ message: "Student not found." });
        }

        if (req.parent && String(child.parent) !== String(req.parent._id)) {
            return res.status(403).json({ message: "Unauthorized to evaluate this student." });
        }

        const result = await reevaluateStudentCategory(childId, { assessmentId });
        return res.status(200).json({
            success: true,
            message: result.isEvidenceComplete
                ? "Learning cycle re-evaluation completed successfully."
                : "Re-evaluation deferred due to incomplete cycle evidence.",
            data: result,
        });
    } catch (error) {
        console.error("Error triggering re-evaluation:", error);
        return res.status(500).json({
            message: "Failed to evaluate student learning cycle.",
            error: error.message,
        });
    }
};

/**
 * Record active learning time from frontend LearningModule.
 * POST /api/student-category/record-learning-time
 */
exports.recordLearningTime = async (req, res) => {
    try {
        const validation = validateLearningTimePayload(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ message: "Validation error", errors: validation.errors });
        }

        const { childId, activeSeconds, idleSeconds = 0, conceptTitle } = req.body;

        const child = await Child.findById(childId);
        if (!child) {
            return res.status(404).json({ message: "Student not found." });
        }

        if (req.parent && String(child.parent) !== String(req.parent._id)) {
            return res.status(403).json({ message: "Unauthorized to record time for this student." });
        }

        if (!child.learningTimeStats) {
            child.learningTimeStats = {
                totalSeconds: 0,
                activeSeconds: 0,
                idleSeconds: 0,
                sessionsCompleted: 0,
            };
        }

        child.learningTimeStats.totalSeconds = (child.learningTimeStats.totalSeconds || 0) + activeSeconds + idleSeconds;
        child.learningTimeStats.activeSeconds = (child.learningTimeStats.activeSeconds || 0) + activeSeconds;
        child.learningTimeStats.idleSeconds = (child.learningTimeStats.idleSeconds || 0) + idleSeconds;
        child.learningTimeStats.sessionsCompleted = (child.learningTimeStats.sessionsCompleted || 0) + 1;
        child.learningTimeStats.lastSessionDate = new Date();

        await child.save();

        return res.status(200).json({
            success: true,
            message: "Learning time recorded successfully.",
            learningTimeStats: child.learningTimeStats,
        });
    } catch (error) {
        console.error("Error recording learning time:", error);
        return res.status(500).json({
            message: "Failed to record learning time.",
            error: error.message,
        });
    }
};

/**
 * Record training session metrics from frontend TrainingModule.
 * POST /api/student-category/record-training
 */
exports.recordTrainingSession = async (req, res) => {
    try {
        const validation = validateTrainingPayload(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ message: "Validation error", errors: validation.errors });
        }

        const { childId, totalAttempted, totalCorrect, subject, mode } = req.body;

        const child = await Child.findById(childId);
        if (!child) {
            return res.status(404).json({ message: "Student not found." });
        }

        if (req.parent && String(child.parent) !== String(req.parent._id)) {
            return res.status(403).json({ message: "Unauthorized to record training for this student." });
        }

        if (!child.trainingStats) {
            child.trainingStats = {
                totalAttempted: 0,
                totalCorrect: 0,
                sessionsCompleted: 0,
            };
        }

        child.trainingStats.totalAttempted = (child.trainingStats.totalAttempted || 0) + totalAttempted;
        child.trainingStats.totalCorrect = (child.trainingStats.totalCorrect || 0) + totalCorrect;
        child.trainingStats.sessionsCompleted = (child.trainingStats.sessionsCompleted || 0) + 1;
        child.trainingStats.lastSessionDate = new Date();

        await child.save();

        return res.status(200).json({
            success: true,
            message: "Training metrics recorded successfully.",
            trainingStats: child.trainingStats,
        });
    } catch (error) {
        console.error("Error recording training session:", error);
        return res.status(500).json({
            message: "Failed to record training session.",
            error: error.message,
        });
    }
};

/**
 * Generate authenticated student performance report.
 * GET /api/student-category/report/:childId
 */
exports.getStudentPerformanceReport = async (req, res) => {
    try {
        const { childId } = req.params;
        const { format } = req.query; // 'json' | 'html'

        if (!isValidObjectId(childId)) {
            return res.status(400).json({ message: "Invalid student ID." });
        }

        if (!req.parent) {
            return res.status(401).json({ message: "Authentication required." });
        }

        const reportData = await buildStudentReportData(childId, req.parent._id);

        if (format === "html") {
            const html = generateHtmlReport(reportData);
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="DysLearn_Report_${reportData.studentName.replace(/[^a-zA-Z0-9]/g, "_")}.html"`
            );
            return res.send(html);
        }

        return res.status(200).json({
            success: true,
            report: reportData,
        });
    } catch (error) {
        console.error("Error generating student performance report:", error);
        const status = error.statusCode || 500;
        return res.status(status).json({
            message: "Failed to generate student performance report.",
            error: error.message,
        });
    }
};

/**
 * Get active categorisation configuration parameters.
 * GET /api/student-category/config
 */
exports.getCategorisationConfig = (req, res) => {
    return res.status(200).json({
        success: true,
        config: {
            categories: categorisationConfig.CATEGORIES,
            labels: categorisationConfig.CATEGORY_LABELS,
            descriptions: categorisationConfig.CATEGORY_DESCRIPTIONS,
            weights: categorisationConfig.COMPONENT_WEIGHTS,
            reassessmentThresholds: categorisationConfig.REASSESSMENT_THRESHOLDS,
            initialThresholds: categorisationConfig.INITIAL_HANDWRITING_THRESHOLDS,
            learningCards: categorisationConfig.PERSONALISED_LEARNING_CARDS,
            trainingConfig: categorisationConfig.PERSONALISED_TRAINING_CONFIG,
            difficultyMapping: categorisationConfig.PERSONALISED_ASSESSMENT_DIFFICULTY,
        },
    });
};
