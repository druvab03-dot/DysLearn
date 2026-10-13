/**
 * Data Validation Utilities for Student Categorisation
 * 
 * Ensures robust data integrity across database interactions,
 * component score validations, and API request handling.
 */

const { CATEGORIES } = require("../config/categorisationConfig");

/**
 * Validate MongoDB ObjectId string (24-character hexadecimal format).
 */
function isValidObjectId(id) {
    if (!id) return false;
    const str = String(id).trim();
    return /^[0-9a-fA-F]{24}$/.test(str);
}

/**
 * Validate a component score is a valid finite number in [0, 100].
 */
function isValidScore(score) {
    if (score === null || score === undefined) return false;
    const num = Number(score);
    return !isNaN(num) && isFinite(num) && num >= 0 && num <= 100;
}

/**
 * Validate student category string.
 */
function isValidCategory(category) {
    return Object.values(CATEGORIES).includes(category);
}

/**
 * Validate learning time tracking event payload.
 */
function validateLearningTimePayload(payload) {
    const errors = [];
    if (!payload) {
        return { isValid: false, errors: ["Payload is required"] };
    }

    if (!payload.childId || !isValidObjectId(payload.childId)) {
        errors.push("A valid childId is required");
    }

    if (
        typeof payload.activeSeconds !== "number" ||
        isNaN(payload.activeSeconds) ||
        payload.activeSeconds < 0
    ) {
        errors.push("activeSeconds must be a non-negative number");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Validate training session submission payload.
 */
function validateTrainingPayload(payload) {
    const errors = [];
    if (!payload) {
        return { isValid: false, errors: ["Payload is required"] };
    }

    if (!payload.childId || !isValidObjectId(payload.childId)) {
        errors.push("A valid childId is required");
    }

    if (
        typeof payload.totalAttempted !== "number" ||
        payload.totalAttempted <= 0
    ) {
        errors.push("totalAttempted must be a positive number");
    }

    if (
        typeof payload.totalCorrect !== "number" ||
        payload.totalCorrect < 0 ||
        payload.totalCorrect > (payload.totalAttempted || 0)
    ) {
        errors.push("totalCorrect must be between 0 and totalAttempted");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

module.exports = {
    isValidObjectId,
    isValidScore,
    isValidCategory,
    validateLearningTimePayload,
    validateTrainingPayload,
};
