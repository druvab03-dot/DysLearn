/**
 * Category Assignment Service
 * 
 * Manages the lifecycle of student categorization:
 * 1. Initial categorization (handwriting analysis only)
 * 2. Re-categorization after learning cycles (30% Handwriting + 10% Learning Time + 30% Training + 30% Assessment)
 * 3. Auditable MongoDB history logging and idempotent evaluation guards
 */

const Child = require("../../server/models/Child");
const AnalysisResult = require("../../server/models/AnalysisResult");
const AssessmentResult = require("../../server/models/AssessmentResult");
const StudentCategory = require("../models/studentCategoryModel");

const {
    getInitialCategoryFromHandwriting,
    getCategoryFromOverallScore,
} = require("../utils/categoryRules");
const { analyzeStudentPerformance } = require("./performanceAnalysisService");
const { extractHandwritingFeatures } = require("./handwritingFeatureService");
const { CATEGORY_LABELS } = require("../config/categorisationConfig");

/**
 * Assign initial category using handwriting analysis results only.
 * 
 * Called when handwriting analysis is completed for a student.
 * Does not incorporate learning duration, training performance, or test scores.
 * 
 * @param {string|Object} childId - Student MongoDB ID
 * @param {Object} [analysisOverride] - Optional direct AnalysisResult document
 * @returns {Promise<Object>} Categorisation result
 */
async function assignInitialCategory(childId, analysisOverride = null) {
    const child = await Child.findById(childId);
    if (!child) {
        throw new Error("Student not found");
    }

    let analysis = analysisOverride;
    if (!analysis) {
        if (child.latestAnalysis) {
            analysis = await AnalysisResult.findById(child.latestAnalysis);
        } else if (child.analysisResults && child.analysisResults.length > 0) {
            analysis = await AnalysisResult.findById(
                child.analysisResults[child.analysisResults.length - 1]
            );
        }
    }

    const handwritingFeatures = extractHandwritingFeatures(analysis);
    const initialResult = getInitialCategoryFromHandwriting(handwritingFeatures.score);

    if (initialResult.isPending) {
        return {
            childId: child._id,
            category: null,
            categoryLabel: "Pending Analysis",
            categorisationType: "initial",
            isPending: true,
            reason: initialResult.reason,
            lastCategorisationDate: null,
        };
    }

    const prevCategory = child.category || null;

    // Update student document in MongoDB
    child.category = initialResult.category;
    child.categoryLabel = initialResult.categoryLabel;
    child.categorisationType = "initial";
    child.categorisationScore = handwritingFeatures.score;
    child.componentScores = {
        handwriting: handwritingFeatures.score,
        learningTime: null,
        training: null,
        assessment: null,
    };
    child.categoryReason = initialResult.reason;
    child.lastCategorisationDate = new Date();

    if (!Array.isArray(child.categoryHistory)) {
        child.categoryHistory = [];
    }

    child.categoryHistory.push({
        category: initialResult.category,
        categoryLabel: initialResult.categoryLabel,
        categorisationType: "initial",
        categorisationScore: handwritingFeatures.score,
        componentScores: {
            handwriting: handwritingFeatures.score,
            learningTime: null,
            training: null,
            assessment: null,
        },
        reason: initialResult.reason,
        date: new Date(),
        learningCycleIndex: 0,
    });

    await child.save();

    // Create persistent auditable record
    const categoryRecord = await StudentCategory.create({
        child: child._id,
        parent: child.parent,
        category: initialResult.category,
        categoryLabel: initialResult.categoryLabel,
        categorisationType: "initial",
        categorisationScore: handwritingFeatures.score,
        weights: {
            handwriting: 1.0,
            learningTime: 0.0,
            training: 0.0,
            assessment: 0.0,
        },
        componentScores: {
            handwriting: handwritingFeatures.score,
            learningTime: null,
            training: null,
            assessment: null,
        },
        rawMetrics: {
            handwritingScore: handwritingFeatures.score,
            totalLetters: handwritingFeatures.totalLetters,
            counts: {
                Normal: handwritingFeatures.normalCount,
                Corrected: handwritingFeatures.correctedCount,
                Reversal: handwritingFeatures.reversalCount,
            },
        },
        reason: initialResult.reason,
        previousCategory: prevCategory,
        learningCycleIndex: 0,
        isEvidenceComplete: true,
        evaluatedAt: new Date(),
    });

    return {
        childId: child._id,
        category: initialResult.category,
        categoryLabel: initialResult.categoryLabel,
        categorisationType: "initial",
        categorisationScore: handwritingFeatures.score,
        componentScores: child.componentScores,
        reason: initialResult.reason,
        lastCategorisationDate: child.lastCategorisationDate,
        recordId: categoryRecord._id,
    };
}

/**
 * Re-evaluate student category after a completed learning cycle.
 * 
 * Strict 4-component weighted model:
 *  overallScore = handwriting*0.30 + learningTime*0.10 + training*0.30 + test*0.30
 * 
 * Idempotency:
 * If an assessment was already evaluated for this cycle and evidence has not changed,
 * returns the existing record rather than duplicating records.
 * 
 * If required evidence is incomplete, retains current category with explanatory reason.
 * 
 * @param {string|Object} childId - Student MongoDB ID
 * @param {Object} [options] - Optional context (e.g. cycle index, assessmentId)
 * @returns {Promise<Object>} Evaluation result
 */
async function reevaluateStudentCategory(childId, options = {}) {
    const child = await Child.findById(childId);
    if (!child) {
        throw new Error("Student not found");
    }

    // Fetch latest analysis
    let analysisResult = null;
    if (child.latestAnalysis) {
        analysisResult = await AnalysisResult.findById(child.latestAnalysis);
    }

    // Fetch latest assessment
    let assessmentResult = null;
    if (options.assessmentId) {
        assessmentResult = await AssessmentResult.findById(options.assessmentId);
    } else if (child.latestAssessment) {
        assessmentResult = await AssessmentResult.findById(child.latestAssessment);
    }

    // Perform multi-component analysis
    const performance = analyzeStudentPerformance({
        child,
        analysisResult,
        assessmentResult,
        learningTimeStats: child.learningTimeStats || {},
        trainingStats: child.trainingStats || {},
    });

    // Guard: Insufficient evidence
    if (!performance.hasSufficientEvidence) {
        return {
            childId: child._id,
            category: child.category || "pending_analysis",
            categoryLabel: child.categoryLabel || "Pending Evidence",
            categorisationType: child.categorisationType || "initial",
            categorisationScore: child.categorisationScore,
            componentScores: performance.componentScores,
            missingComponents: performance.missingComponents,
            isEvidenceComplete: false,
            reason: `Re-categorisation deferred: required learning components missing (${performance.missingComponents.join(
                ", "
            )}). Current category retained.`,
            lastCategorisationDate: child.lastCategorisationDate,
        };
    }

    // Idempotency check:
    // If a StudentCategory record was generated for this exact assessment sessionId, avoid duplicates
    if (assessmentResult && assessmentResult.sessionId) {
        const existingRecord = await StudentCategory.findOne({
            child: child._id,
            categorisationType: "reassessment",
            "rawMetrics.assessmentSessionId": assessmentResult.sessionId,
        });

        if (existingRecord) {
            return {
                childId: child._id,
                category: existingRecord.category,
                categoryLabel: existingRecord.categoryLabel,
                categorisationType: "reassessment",
                categorisationScore: existingRecord.categorisationScore,
                componentScores: existingRecord.componentScores,
                reason: existingRecord.reason,
                lastCategorisationDate: existingRecord.evaluatedAt,
                isDuplicate: true,
                recordId: existingRecord._id,
            };
        }
    }

    // Evaluate category from 0-100 overall weighted score
    const categoryDecision = getCategoryFromOverallScore(performance.overallScore);
    const prevCategory = child.category || null;
    const currentCycles = (child.learningCyclesCompleted || 0) + 1;

    // Update Child record
    child.category = categoryDecision.category;
    child.categoryLabel = categoryDecision.categoryLabel;
    child.categorisationType = "reassessment";
    child.categorisationScore = performance.overallScore;
    child.componentScores = performance.componentScores;
    child.categoryReason = categoryDecision.reason;
    child.lastCategorisationDate = new Date();
    child.learningCyclesCompleted = currentCycles;

    if (!Array.isArray(child.categoryHistory)) {
        child.categoryHistory = [];
    }

    child.categoryHistory.push({
        category: categoryDecision.category,
        categoryLabel: categoryDecision.categoryLabel,
        categorisationType: "reassessment",
        categorisationScore: performance.overallScore,
        componentScores: performance.componentScores,
        reason: categoryDecision.reason,
        date: new Date(),
        learningCycleIndex: currentCycles,
    });

    await child.save();

    // Create auditable record
    const categoryRecord = await StudentCategory.create({
        child: child._id,
        parent: child.parent,
        category: categoryDecision.category,
        categoryLabel: categoryDecision.categoryLabel,
        categorisationType: "reassessment",
        categorisationScore: performance.overallScore,
        weights: {
            handwriting: 0.30,
            learningTime: 0.10,
            training: 0.30,
            assessment: 0.30,
        },
        componentScores: performance.componentScores,
        rawMetrics: {
            ...performance.rawMetrics,
            assessmentSessionId: assessmentResult?.sessionId || null,
        },
        reason: categoryDecision.reason,
        previousCategory: prevCategory,
        learningCycleIndex: currentCycles,
        isEvidenceComplete: true,
        evaluatedAt: new Date(),
    });

    return {
        childId: child._id,
        category: categoryDecision.category,
        categoryLabel: categoryDecision.categoryLabel,
        categorisationType: "reassessment",
        categorisationScore: performance.overallScore,
        componentScores: performance.componentScores,
        reason: categoryDecision.reason,
        previousCategory: prevCategory,
        learningCyclesCompleted: currentCycles,
        strengths: performance.strengths,
        practiceAreas: performance.practiceAreas,
        lastCategorisationDate: child.lastCategorisationDate,
        recordId: categoryRecord._id,
    };
}

module.exports = {
    assignInitialCategory,
    reevaluateStudentCategory,
};
