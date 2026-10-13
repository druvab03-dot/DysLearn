/**
 * Student Categorisation Client Service
 * 
 * Provides utilities and API clients for:
 * 1. Personalised card selection (exactly 4 cards per concept: 3v+1t, 2v+2t, 1v+3t)
 * 2. Personalised training configuration (20, 12, 8 questions; visual/text mix)
 * 3. Personalised assessment difficulty (Easy, Medium, Hard)
 * 4. Active learning time & training recording
 * 5. Category status & downloadable performance report retrieval
 */

import api from "./api";

export const CATEGORIES = {
    SUPPORT_NEEDED: "support_needed",
    DEVELOPING: "developing",
    PROGRESSING_WELL: "progressing_well",
};

export const CATEGORY_LABELS = {
    [CATEGORIES.SUPPORT_NEEDED]: "Support Needed",
    [CATEGORIES.DEVELOPING]: "Developing",
    [CATEGORIES.PROGRESSING_WELL]: "Progressing Well",
};

export const PERSONALISED_CARD_CONFIG = {
    [CATEGORIES.SUPPORT_NEEDED]: { visualCards: 3, textCards: 1, total: 4 },
    [CATEGORIES.DEVELOPING]: { visualCards: 2, textCards: 2, total: 4 },
    [CATEGORIES.PROGRESSING_WELL]: { visualCards: 1, textCards: 3, total: 4 },
};

export const PERSONALISED_TRAINING_CONFIG = {
    [CATEGORIES.SUPPORT_NEEDED]: {
        questionCount: 20,
        visualRatio: 0.75,
        textRatio: 0.25,
        description: "20 questions, mostly visual-based presentation",
    },
    [CATEGORIES.DEVELOPING]: {
        questionCount: 12,
        visualRatio: 0.50,
        textRatio: 0.50,
        description: "12 questions, balanced visual and text mix",
    },
    [CATEGORIES.PROGRESSING_WELL]: {
        questionCount: 8,
        visualRatio: 0.25,
        textRatio: 0.75,
        description: "8 questions, mostly text-based with visual anchors",
    },
};

export const PERSONALISED_DIFFICULTY_MAP = {
    [CATEGORIES.SUPPORT_NEEDED]: "easy",
    [CATEGORIES.DEVELOPING]: "medium",
    [CATEGORIES.PROGRESSING_WELL]: "hard",
};

/**
 * Select exactly four personalised cards for a concept based on student category.
 * 
 * Concept structure in DysLearn:
 *  - Cards 0..3 (indices 0-3): Visual learning cards
 *  - Cards 4..7 (indices 4-7): Dyslexia typography text cards
 * 
 * @param {Array<Object>|Object} conceptOrCards - Array of 8 cards or concept object with .cards
 * @param {string} category - Current student category
 * @returns {Array<Object>} Exactly 4 personalised cards
 */
export function selectPersonalisedCards(conceptOrCards, category = CATEGORIES.DEVELOPING) {
    const rawCards = Array.isArray(conceptOrCards)
        ? conceptOrCards
        : conceptOrCards?.cards || [];

    if (!Array.isArray(rawCards) || rawCards.length === 0) {
        return [];
    }

    const activeCategory = Object.values(CATEGORIES).includes(category)
        ? category
        : CATEGORIES.DEVELOPING;

    const config = PERSONALISED_CARD_CONFIG[activeCategory] || PERSONALISED_CARD_CONFIG[CATEGORIES.DEVELOPING];

    const visualPool = rawCards.slice(0, 4);
    const textPool = rawCards.slice(4, 8);

    let selectedVisual = [];
    let selectedText = [];

    if (activeCategory === CATEGORIES.SUPPORT_NEEDED) {
        selectedVisual = visualPool.slice(0, config.visualCards); // 3
        selectedText = textPool.slice(0, config.textCards); // 1
    } else if (activeCategory === CATEGORIES.DEVELOPING) {
        selectedVisual = visualPool.slice(0, config.visualCards); // 2
        selectedText = textPool.slice(0, config.textCards); // 2
    } else if (activeCategory === CATEGORIES.PROGRESSING_WELL) {
        selectedVisual = visualPool.slice(0, config.visualCards); // 1
        selectedText = textPool.slice(0, config.textCards); // 3
    }

    const combined = [...selectedVisual, ...selectedText];

    // Safe fallback if source concept had fewer than 8 cards
    if (combined.length < 4 && rawCards.length >= 4) {
        const selectedIds = new Set(combined.map((c, idx) => c.id || c.heading || idx));
        for (const card of rawCards) {
            const cardId = card.id || card.heading;
            if (!selectedIds.has(cardId)) {
                combined.push(card);
                selectedIds.add(cardId);
            }
            if (combined.length === 4) break;
        }
    }

    return combined.slice(0, 4);
}

/**
 * Get category-appropriate training configuration.
 */
export function getPersonalisedTrainingConfig(category = CATEGORIES.DEVELOPING) {
    const activeCategory = Object.values(CATEGORIES).includes(category)
        ? category
        : CATEGORIES.DEVELOPING;
    return PERSONALISED_TRAINING_CONFIG[activeCategory] || PERSONALISED_TRAINING_CONFIG[CATEGORIES.DEVELOPING];
}

/**
 * Get category-appropriate assessment difficulty.
 */
export function getPersonalisedAssessmentDifficulty(category = CATEGORIES.DEVELOPING) {
    const activeCategory = Object.values(CATEGORIES).includes(category)
        ? category
        : CATEGORIES.DEVELOPING;
    return PERSONALISED_DIFFICULTY_MAP[activeCategory] || "medium";
}

/**
 * Fetch category status & component metrics for a child.
 */
export async function getStudentCategoryStatus(childId) {
    const response = await api.get(`/student-category/status/${childId}`);
    return response.data;
}

/**
 * Trigger initial categorization based on handwriting analysis only.
 */
export async function triggerInitialCategorisation(childId) {
    const response = await api.post(`/student-category/initial/${childId}`);
    return response.data;
}

/**
 * Record active learning time from LearningModule.
 */
export async function recordLearningTime({ childId, activeSeconds, idleSeconds = 0, conceptTitle = "" }) {
    if (!childId || activeSeconds <= 0) return null;
    try {
        const response = await api.post("/student-category/record-learning-time", {
            childId,
            activeSeconds: Math.round(activeSeconds),
            idleSeconds: Math.round(idleSeconds),
            conceptTitle,
        });
        return response.data;
    } catch (err) {
        console.warn("Could not record learning time:", err.message);
        return null;
    }
}

/**
 * Record training metrics from TrainingModule.
 */
export async function recordTrainingMetrics({ childId, totalAttempted, totalCorrect, subject, mode }) {
    if (!childId || totalAttempted <= 0) return null;
    try {
        const response = await api.post("/student-category/record-training", {
            childId,
            totalAttempted: Number(totalAttempted),
            totalCorrect: Number(totalCorrect),
            subject,
            mode,
        });
        return response.data;
    } catch (err) {
        console.warn("Could not record training metrics:", err.message);
        return null;
    }
}

/**
 * Download authenticated student performance report.
 */
export async function downloadPerformanceReport(childId, studentName = "Student") {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5001/api/student-category/report/${childId}?format=html`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to download performance report");
    }

    const htmlBlob = await response.blob();
    const url = window.URL.createObjectURL(htmlBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `DysLearn_Performance_Report_${studentName.replace(/[^a-zA-Z0-9]/g, "_")}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
