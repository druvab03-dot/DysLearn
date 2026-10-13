/**
 * Score Calculator Utility for Student Categorisation
 * 
 * Normalises all 4 component scores to a standard 0-100 scale:
 *  1. Handwriting analysis (30%)
 *  2. Active learning time (10%)
 *  3. Training performance (30%)
 *  4. Gamified assessment test (30%)
 * 
 * Calculates the exact weighted score:
 * overallScore = handwriting * 0.30 + learningTime * 0.10 + training * 0.30 + test * 0.30
 */

const {
    COMPONENT_WEIGHTS,
    LEARNING_TIME_RULES,
} = require("../config/categorisationConfig");

/**
 * Normalise handwriting analysis result to 0-100 score.
 * 
 * Higher score indicates fewer character reversals and stronger stroke stability.
 * Lower score indicates higher reversal frequency (e.g., b/d, p/q) or instability.
 * 
 * @param {Object|number} analysis - AnalysisResult document or raw score
 * @returns {number|null} Normalised score between 0 and 100, or null if invalid
 */
function normalizeHandwritingScore(analysis) {
    if (analysis === null || analysis === undefined) return null;

    // Direct numeric score provided
    if (typeof analysis === "number" && !isNaN(analysis)) {
        return Math.min(100, Math.max(0, parseFloat(analysis.toFixed(2))));
    }

    // AnalysisResult object
    if (typeof analysis === "object") {
        if (typeof analysis.score === "number" && !isNaN(analysis.score)) {
            return Math.min(100, Math.max(0, parseFloat(analysis.score.toFixed(2))));
        }

        // Calculate from counts if raw counts are present: Normal(1.0), Corrected(0.5), Reversal(0.0)
        if (analysis.counts && typeof analysis.counts === "object") {
            const normal = Number(analysis.counts.Normal || 0);
            const corrected = Number(analysis.counts.Corrected || 0);
            const reversal = Number(analysis.counts.Reversal || 0);
            const total = normal + corrected + reversal;

            if (total > 0) {
                const weightedSum = normal * 1.0 + corrected * 0.5 + reversal * 0.0;
                const calculated = (weightedSum / total) * 100;
                return Math.min(100, Math.max(0, parseFloat(calculated.toFixed(2))));
            }
        }
    }

    return null;
}

/**
 * Normalise active learning time to a 0-100 score.
 * 
 * Engagement scoring principle:
 * Measures focused card interaction and time-on-task without unfairly penalising
 * fast or efficient readers, and without letting idle sitting inflate the score.
 * 
 * Target band: ~2 to 5 minutes of active listening/reading for a learning concept
 * yields 85-100 points. Zero or trivial clicks (< 15s) yield lower engagement scores.
 * 
 * @param {number} activeSeconds - Total active seconds spent on learning cards
 * @param {number} idleSeconds - Detected idle seconds (excluded)
 * @returns {number} Normalised score between 0 and 100
 */
function normalizeLearningTimeScore(activeSeconds = 0, idleSeconds = 0) {
    if (typeof activeSeconds !== "number" || isNaN(activeSeconds) || activeSeconds <= 0) {
        return 0;
    }

    const safeActive = Math.max(0, activeSeconds - Math.max(0, idleSeconds || 0));

    if (safeActive < 15) {
        // Trivial/rushed through without reading (< 15s)
        return Math.min(30, Math.round((safeActive / 15) * 30));
    }

    if (safeActive < LEARNING_TIME_RULES.MIN_ENGAGED_SECONDS) {
        // Brief exposure (15-30s): 30 to 55 points
        const fraction = (safeActive - 15) / (LEARNING_TIME_RULES.MIN_ENGAGED_SECONDS - 15);
        return Math.round(30 + fraction * 25);
    }

    if (safeActive < 120) {
        // Moderate focused engagement (30-120s): 55 to 85 points
        const fraction = (safeActive - 30) / (120 - 30);
        return Math.round(55 + fraction * 30);
    }

    if (safeActive <= LEARNING_TIME_RULES.OPTIMAL_ENGAGED_SECONDS) {
        // Ideal learning time (120-240s): 85 to 100 points
        const fraction = (safeActive - 120) / (LEARNING_TIME_RULES.OPTIMAL_ENGAGED_SECONDS - 120);
        return Math.round(85 + fraction * 15);
    }

    // Beyond optimal (240s-600s): sustained attention capped at 100 (idle capped)
    return 100;
}

/**
 * Normalise training module performance to 0-100 score.
 * 
 * @param {number} correctAnswers - Number of correct answers in training
 * @param {number} totalAttempted - Number of attempted questions
 * @returns {number|null} Normalised score between 0 and 100, or null if no attempts
 */
function normalizeTrainingScore(correctAnswers, totalAttempted) {
    if (
        typeof totalAttempted !== "number" ||
        isNaN(totalAttempted) ||
        totalAttempted <= 0
    ) {
        return null;
    }

    const safeCorrect = Math.max(0, Number(correctAnswers) || 0);
    const score = (safeCorrect / totalAttempted) * 100;
    return Math.min(100, Math.max(0, parseFloat(score.toFixed(2))));
}

/**
 * Normalise gamified assessment score to 0-100 score.
 * 
 * @param {number} totalScore - Final recorded assessment score
 * @param {number} maxScore - Maximum possible points (default 100)
 * @returns {number|null} Normalised score between 0 and 100, or null if invalid
 */
function normalizeAssessmentScore(totalScore, maxScore = 100) {
    if (typeof totalScore !== "number" || isNaN(totalScore)) {
        return null;
    }

    const safeMax = Math.max(1, Number(maxScore) || 100);
    const clamped = Math.min(safeMax, Math.max(0, totalScore));
    const score = (clamped / safeMax) * 100;
    return Math.min(100, Math.max(0, parseFloat(score.toFixed(2))));
}

/**
 * Calculate the overall weighted score across all 4 components:
 * 
 * overallScore = handwriting * 0.30 + learningTime * 0.10 + training * 0.30 + test * 0.30
 * 
 * Strict completeness rule:
 * Returns null if ANY of the required component scores is missing or invalid.
 * Missing components are NEVER silently treated as zero or redistributed.
 * 
 * @param {Object} scores
 * @returns {Object} { overallScore, isComplete, componentScores, missingComponents }
 */
function calculateWeightedOverallScore(params = {}) {
    const handwritingScore = params.handwritingScore ?? params.handwriting;
    const learningTimeScore = params.learningTimeScore ?? params.learningTime;
    const trainingScore = params.trainingScore ?? params.training;
    const testScore = params.testScore ?? params.assessment ?? params.test;

    const missingComponents = [];

    if (handwritingScore === null || handwritingScore === undefined || isNaN(handwritingScore)) {
        missingComponents.push("handwriting");
    }
    if (learningTimeScore === null || learningTimeScore === undefined || isNaN(learningTimeScore)) {
        missingComponents.push("learningTime");
    }
    if (trainingScore === null || trainingScore === undefined || isNaN(trainingScore)) {
        missingComponents.push("training");
    }
    if (testScore === null || testScore === undefined || isNaN(testScore)) {
        missingComponents.push("assessment");
    }

    if (missingComponents.length > 0) {
        return {
            overallScore: null,
            isComplete: false,
            missingComponents,
            componentScores: {
                handwriting: handwritingScore ?? null,
                learningTime: learningTimeScore ?? null,
                training: trainingScore ?? null,
                assessment: testScore ?? null,
            },
        };
    }

    const hScore = Math.min(100, Math.max(0, Number(handwritingScore)));
    const lScore = Math.min(100, Math.max(0, Number(learningTimeScore)));
    const tScore = Math.min(100, Math.max(0, Number(trainingScore)));
    const aScore = Math.min(100, Math.max(0, Number(testScore)));

    const weightedScore =
        hScore * COMPONENT_WEIGHTS.HANDWRITING +
        lScore * COMPONENT_WEIGHTS.LEARNING_TIME +
        tScore * COMPONENT_WEIGHTS.TRAINING +
        aScore * COMPONENT_WEIGHTS.ASSESSMENT;

    const roundedScore = parseFloat(weightedScore.toFixed(2));

    return {
        overallScore: Math.min(100, Math.max(0, roundedScore)),
        isComplete: true,
        missingComponents: [],
        componentScores: {
            handwriting: parseFloat(hScore.toFixed(2)),
            learningTime: parseFloat(lScore.toFixed(2)),
            training: parseFloat(tScore.toFixed(2)),
            assessment: parseFloat(aScore.toFixed(2)),
        },
    };
}

function calculateLearningTimeScore(activeSecondsOrObj, idleSeconds = 0) {
    if (activeSecondsOrObj === null || activeSecondsOrObj === undefined) return null;
    if (typeof activeSecondsOrObj === "object") {
        const active = activeSecondsOrObj.activeSeconds ?? 0;
        const idle = activeSecondsOrObj.idleSeconds ?? 0;
        return normalizeLearningTimeScore(active, idle);
    }
    return normalizeLearningTimeScore(activeSecondsOrObj, idleSeconds);
}

function calculateTrainingScore(correctOrObj, totalAttempted) {
    if (correctOrObj === null || correctOrObj === undefined) return null;
    if (typeof correctOrObj === "object") {
        const correct = correctOrObj.totalCorrect ?? correctOrObj.correctAnswers ?? 0;
        const attempted = correctOrObj.totalAttempted ?? correctOrObj.totalQuestions ?? 0;
        return normalizeTrainingScore(correct, attempted);
    }
    return normalizeTrainingScore(correctOrObj, totalAttempted);
}

function calculateAssessmentScore(scoreOrObj, maxScore = 100) {
    if (scoreOrObj === null || scoreOrObj === undefined) return null;
    if (typeof scoreOrObj === "object") {
        const score = scoreOrObj.totalScore ?? scoreOrObj.score;
        return normalizeAssessmentScore(score, maxScore);
    }
    return normalizeAssessmentScore(scoreOrObj, maxScore);
}

function calculateWeightedScore(scores) {
    const res = calculateWeightedOverallScore(scores);
    return res.isComplete ? res.overallScore : null;
}

module.exports = {
    normalizeHandwritingScore,
    calculateHandwritingScore: normalizeHandwritingScore,
    normalizeLearningTimeScore,
    calculateLearningTimeScore,
    normalizeTrainingScore,
    calculateTrainingScore,
    normalizeAssessmentScore,
    calculateAssessmentScore,
    calculateWeightedOverallScore,
    calculateWeightedScore,
};
