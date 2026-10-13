/**
 * Category Rules & Boundary Logic
 * 
 * Maps normalized scores to the 3 standard educational categories:
 *  1. Support Needed (support_needed)
 *  2. Developing (developing)
 *  3. Progressing Well (progressing_well)
 * 
 * Strict boundary handling:
 * Re-categorisation:
 *  - 0 <= score < 40: Support Needed
 *  - 40 <= score < 70: Developing (40.0 is Developing)
 *  - 70 <= score <= 100: Progressing Well (70.0 is Progressing Well)
 * 
 * Initial Handwriting-only:
 *  - 0 <= score < 50: Support Needed
 *  - 50 <= score < 75: Developing
 *  - 75 <= score <= 100: Progressing Well
 */

const {
    CATEGORIES,
    CATEGORY_LABELS,
    CATEGORY_DESCRIPTIONS,
    REASSESSMENT_THRESHOLDS,
    INITIAL_HANDWRITING_THRESHOLDS,
} = require("../config/categorisationConfig");

/**
 * Assign initial category based exclusively on handwriting analysis.
 * 
 * Used upon student onboarding before any learning cycle data exists.
 * Does NOT incorporate learning time, training, or assessment.
 * 
 * @param {number|null} handwritingScore - Normalized score 0-100
 * @returns {Object} { category, categoryLabel, reason, isPending }
 */
function getInitialCategoryFromHandwriting(handwritingScore) {
    if (
        handwritingScore === null ||
        handwritingScore === undefined ||
        isNaN(handwritingScore)
    ) {
        return {
            category: null,
            categoryLabel: "Pending Analysis",
            reason: "Handwriting sample has not been analyzed or character confidence was insufficient.",
            isPending: true,
        };
    }

    const score = Math.min(100, Math.max(0, Number(handwritingScore)));

    if (score < INITIAL_HANDWRITING_THRESHOLDS[CATEGORIES.DEVELOPING].min) {
        return {
            category: CATEGORIES.SUPPORT_NEEDED,
            categoryLabel: CATEGORY_LABELS[CATEGORIES.SUPPORT_NEEDED],
            reason: `Initial handwriting assessment score is ${score.toFixed(1)}/100. Frequent letter reversals and orientation variations detected. Recommended high visual reinforcement and multi-sensory concrete anchors.`,
            isPending: false,
        };
    }

    if (score < INITIAL_HANDWRITING_THRESHOLDS[CATEGORIES.PROGRESSING_WELL].min) {
        return {
            category: CATEGORIES.DEVELOPING,
            categoryLabel: CATEGORY_LABELS[CATEGORIES.DEVELOPING],
            reason: `Initial handwriting assessment score is ${score.toFixed(1)}/100. Moderate stroke consistency with occasional character corrections. Recommended balanced visual and text practice.`,
            isPending: false,
        };
    }

    return {
        category: CATEGORIES.PROGRESSING_WELL,
        categoryLabel: CATEGORY_LABELS[CATEGORIES.PROGRESSING_WELL],
        reason: `Initial handwriting assessment score is ${score.toFixed(1)}/100. Strong letter consistency and minimal reversal indicators. Ready for standard progression and text challenges.`,
        isPending: false,
    };
}

/**
 * Assign updated category based on the 4-component weighted overall score.
 * 
 * Re-assessment thresholds:
 *  - 0 to 39: Support Needed
 *  - 40 to 69: Developing (Score 40 = Developing)
 *  - 70 to 100: Progressing Well (Score 70 = Progressing Well)
 * 
 * @param {number|null} overallScore - 4-component weighted score (0-100)
 * @returns {Object} { category, categoryLabel, reason, isValid }
 */
function getCategoryFromOverallScore(overallScore) {
    if (
        overallScore === null ||
        overallScore === undefined ||
        isNaN(overallScore)
    ) {
        return {
            category: null,
            categoryLabel: "Insufficient Data",
            reason: "All 4 learning cycle components (Handwriting 30%, Learning Time 10%, Training 30%, Assessment 30%) are required for re-categorisation.",
            isValid: false,
        };
    }

    const score = Math.min(100, Math.max(0, Number(overallScore)));

    if (score < REASSESSMENT_THRESHOLDS[CATEGORIES.DEVELOPING].min) {
        // 0 to 39.999
        return {
            category: CATEGORIES.SUPPORT_NEEDED,
            categoryLabel: CATEGORY_LABELS[CATEGORIES.SUPPORT_NEEDED],
            reason: `Composite learning score is ${score.toFixed(1)}/100 (Threshold: 0–39). Learner thrives with maximum visual scaffolding (3 visual + 1 text card) and focused foundational practice.`,
            isValid: true,
        };
    }

    if (score < REASSESSMENT_THRESHOLDS[CATEGORIES.PROGRESSING_WELL].min) {
        // 40.0 to 69.999
        return {
            category: CATEGORIES.DEVELOPING,
            categoryLabel: CATEGORY_LABELS[CATEGORIES.DEVELOPING],
            reason: `Composite learning score is ${score.toFixed(1)}/100 (Threshold: 40–69). Learner demonstrates solid steady progression. Thrives with balanced multi-modal learning (2 visual + 2 text cards).`,
            isValid: true,
        };
    }

    // 70.0 to 100
    return {
        category: CATEGORIES.PROGRESSING_WELL,
        categoryLabel: CATEGORY_LABELS[CATEGORIES.PROGRESSING_WELL],
        reason: `Composite learning score is ${score.toFixed(1)}/100 (Threshold: 70–100). Learner shows strong concept mastery and reading fluency. Ready for advanced text-rich challenges (1 visual + 3 text cards).`,
        isValid: true,
    };
}

module.exports = {
    getInitialCategoryFromHandwriting,
    assignInitialCategoryFromHandwriting: getInitialCategoryFromHandwriting,
    getCategoryFromOverallScore,
    determineCategoryFromOverallScore: getCategoryFromOverallScore,
};
