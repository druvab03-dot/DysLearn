/**
 * Performance Analysis Service
 * 
 * Aggregates learning cycle components, checks for complete evidence,
 * computes normalized component scores, and evaluates overall performance.
 */

const {
    normalizeHandwritingScore,
    normalizeLearningTimeScore,
    normalizeTrainingScore,
    normalizeAssessmentScore,
    calculateWeightedOverallScore,
} = require("../utils/scoreCalculator");
const { extractHandwritingFeatures } = require("./handwritingFeatureService");
const { getCategoryFromOverallScore } = require("../utils/categoryRules");

/**
 * Perform multi-component performance analysis for a student.
 * 
 * @param {Object} params
 * @param {Object} params.child - Child document
 * @param {Object} params.analysisResult - Latest AnalysisResult document
 * @param {Object} params.assessmentResult - Latest AssessmentResult document
 * @param {Object} params.learningTimeStats - Learning time tracking data
 * @param {Object} params.trainingStats - Training module stats
 * @returns {Object} Comprehensive performance analysis breakdown
 */
function analyzeStudentPerformance(params = {}) {
    const child = params.child || params;
    const analysisResult = params.analysisResult || params.handwritingAnalysis || child.latestAnalysis;
    const assessmentResult = params.assessmentResult || params.assessment || child.latestAssessment;
    const learningTimeStats = params.learningTimeStats || params.learningTime || child.learningTimeStats;
    const trainingStats = params.trainingStats || params.training || child.trainingStats;
    // 1. Handwriting Feature Analysis (30%)
    const handwritingFeatures = extractHandwritingFeatures(analysisResult);
    const handwritingScore = handwritingFeatures.hasValidAnalysis
        ? handwritingFeatures.score
        : null;

    // 2. Active Learning Time Analysis (10%)
    let learningTimeScore = null;
    const activeSeconds =
        learningTimeStats?.activeSeconds ??
        child?.learningTimeStats?.activeSeconds ??
        null;

    if (activeSeconds !== null && typeof activeSeconds === "number" && activeSeconds > 0) {
        const idleSeconds =
            learningTimeStats?.idleSeconds ??
            child?.learningTimeStats?.idleSeconds ??
            0;
        learningTimeScore = normalizeLearningTimeScore(activeSeconds, idleSeconds);
    }

    // 3. Training Module Performance (30%)
    let trainingScore = null;
    const trainAttempted =
        trainingStats?.totalAttempted ??
        child?.trainingStats?.totalAttempted ??
        null;
    const trainCorrect =
        trainingStats?.totalCorrect ??
        child?.trainingStats?.totalCorrect ??
        null;

    if (
        trainAttempted !== null &&
        typeof trainAttempted === "number" &&
        trainAttempted > 0
    ) {
        trainingScore = normalizeTrainingScore(trainCorrect, trainAttempted);
    }

    // 4. Gamified Assessment Performance (30%)
    let testScore = null;
    if (assessmentResult && typeof assessmentResult.totalScore === "number") {
        testScore = normalizeAssessmentScore(
            assessmentResult.totalScore,
            assessmentResult.maxDurationSeconds ? 100 : 100
        );
    }

    // 5. Evidence Completeness Check
    const weightedResult = calculateWeightedOverallScore({
        handwritingScore,
        learningTimeScore,
        trainingScore,
        testScore,
    });

    // 6. Strengths and Recommended Focus Concepts
    const strengths = [];
    const practiceAreas = [];

    if (assessmentResult?.conceptsMastered && Array.isArray(assessmentResult.conceptsMastered)) {
        strengths.push(...assessmentResult.conceptsMastered);
    }
    if (assessmentResult?.conceptsToPractice && Array.isArray(assessmentResult.conceptsToPractice)) {
        practiceAreas.push(...assessmentResult.conceptsToPractice);
    }

    if (handwritingFeatures.normalRate >= 0.75) {
        strengths.push("High letter formation consistency and stroke clarity");
    } else if (handwritingFeatures.reversalRate >= 0.25) {
        practiceAreas.push("Letter orientation differentiation (b/d, p/q recognition)");
    }

    if (trainingScore !== null && trainingScore >= 75) {
        strengths.push("Strong question recall and active concept discrimination");
    } else if (trainingScore !== null && trainingScore < 50) {
        practiceAreas.push("Repetitive flashcard reinforcement and word building");
    }

    const categoryEval = weightedResult.isComplete
        ? getCategoryFromOverallScore(weightedResult.overallScore)
        : { category: null, categoryLabel: null, reason: "Incomplete learning cycle evidence" };

    return {
        hasSufficientEvidence: weightedResult.isComplete,
        missingComponents: weightedResult.missingComponents,
        overallScore: weightedResult.overallScore,
        componentScores: weightedResult.componentScores,
        suggestedCategory: categoryEval.category,
        suggestedCategoryLabel: categoryEval.categoryLabel,
        reason: categoryEval.reason,
        strengths,
        practiceAreas,
        rawMetrics: {
            handwriting: {
                rawScore: handwritingScore,
                totalLetters: handwritingFeatures.totalLetters,
                reversalRate: handwritingFeatures.reversalRate,
                normalRate: handwritingFeatures.normalRate,
            },
            learningTime: {
                activeSeconds: activeSeconds || 0,
                score: learningTimeScore,
            },
            training: {
                attempted: trainAttempted || 0,
                correct: trainCorrect || 0,
                score: trainingScore,
            },
            assessment: {
                totalScore: assessmentResult?.totalScore ?? null,
                difficulty: assessmentResult?.difficulty ?? null,
                roundsCompleted: assessmentResult?.roundsCompleted ?? 0,
            },
        },
        strengths: [...new Set(strengths)],
        practiceAreas: [...new Set(practiceAreas)],
    };
}

module.exports = {
    analyzeStudentPerformance,
};
