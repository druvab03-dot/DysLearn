/**
 * DysLearn Student Categorisation Engine Configuration
 * 
 * Defines categories, component weights, scoring thresholds,
 * personalisation parameters, and educational learning rules.
 * 
 * IMPORTANT:
 * Categories are educational personalisation indicators designed to adapt
 * the learning model, question count, and difficulty. They are NOT a medical
 * or clinical diagnosis of dyslexia.
 */

const CATEGORIES = {
    SUPPORT_NEEDED: "support_needed",
    DEVELOPING: "developing",
    PROGRESSING_WELL: "progressing_well",
};

const CATEGORY_LABELS = {
    [CATEGORIES.SUPPORT_NEEDED]: "Support Needed",
    [CATEGORIES.DEVELOPING]: "Developing",
    [CATEGORIES.PROGRESSING_WELL]: "Progressing Well",
};

const CATEGORY_DESCRIPTIONS = {
    [CATEGORIES.SUPPORT_NEEDED]:
        "Benefits from high visual support, multi-sensory concrete anchors, guided exercises, and gentle pacing to reinforce foundational phonological and perceptual recognition.",
    [CATEGORIES.DEVELOPING]:
        "Demonstrates solid progress with balanced combinations of visual and text-based challenges. Strengthening fluency, sequencing, and conceptual connections.",
    [CATEGORIES.PROGRESSING_WELL]:
        "Shows high confidence and emerging mastery across literacy and numeracy concepts. Ready for richer text-based challenges, higher abstract reasoning, and advanced practice.",
};

// Exact weights mandated by curriculum assessment specification (Total: 100%)
const COMPONENT_WEIGHTS = {
    HANDWRITING: 0.30,      // 30%
    LEARNING_TIME: 0.10,    // 10%
    TRAINING: 0.30,         // 30%
    ASSESSMENT: 0.30,       // 30%
    handwriting: 0.30,
    learningTime: 0.10,
    training: 0.30,
    assessment: 0.30,
};

// Re-categorisation weighted score thresholds (0-100 scale)
// Validated boundaries:
// 0 <= score < 40  -> Support Needed
// 40 <= score < 70 -> Developing (boundary 40 belongs to Developing)
// 70 <= score <= 100 -> Progressing Well (boundary 70 belongs to Progressing Well)
const REASSESSMENT_THRESHOLDS = {
    [CATEGORIES.SUPPORT_NEEDED]: { min: 0, max: 39.999 },
    [CATEGORIES.DEVELOPING]: { min: 40, max: 69.999 },
    [CATEGORIES.PROGRESSING_WELL]: { min: 70, max: 100 },
};

// Initial handwriting-only categorization thresholds (0-100 scale)
// Based on handwriting model character classification: Normal (1.0), Corrected (0.5), Reversal (0.0)
const INITIAL_HANDWRITING_THRESHOLDS = {
    [CATEGORIES.SUPPORT_NEEDED]: { min: 0, max: 49.999 },
    [CATEGORIES.DEVELOPING]: { min: 50, max: 74.999 },
    [CATEGORIES.PROGRESSING_WELL]: { min: 75, max: 100 },
};

// Active learning time normalization rules (10% component)
// Designed to measure focused engagement without penalizing fast or efficient readers
const LEARNING_TIME_RULES = {
    MIN_ENGAGED_SECONDS: 30,       // Under 30s considered rushed/incomplete
    OPTIMAL_ENGAGED_SECONDS: 240,   // ~4 mins for a concept (4 cards) represents solid engagement
    MAX_COUNTED_SECONDS: 600,       // 10 mins ceiling (prevents idle time inflating scores)
    IDLE_TIMEOUT_SECONDS: 60,       // No interaction for 60s pauses active timer
};

// Personalised Learning Model: exactly 4 cards per concept
const PERSONALISED_LEARNING_CARDS = {
    [CATEGORIES.SUPPORT_NEEDED]: {
        visualCards: 3,     // Cards 1, 2, 3
        textCards: 1,       // Card 5
        totalCards: 4,
        description: "3 visual cards + 1 text card",
    },
    [CATEGORIES.DEVELOPING]: {
        visualCards: 2,     // Cards 1, 2
        textCards: 2,       // Cards 5, 6
        totalCards: 4,
        description: "2 visual cards + 2 text cards",
    },
    [CATEGORIES.PROGRESSING_WELL]: {
        visualCards: 1,     // Card 1
        textCards: 3,       // Cards 5, 6, 7
        totalCards: 4,
        description: "1 visual card + 3 text cards",
    },
};

// Personalised Training Module settings
const PERSONALISED_TRAINING_CONFIG = {
    [CATEGORIES.SUPPORT_NEEDED]: {
        questionsPerSession: 20,
        visualRatio: 0.75,   // Mostly visual questions
        textRatio: 0.25,
        description: "20 questions, mostly visual-based",
    },
    [CATEGORIES.DEVELOPING]: {
        questionsPerSession: 12,
        visualRatio: 0.50,   // Balanced mix
        textRatio: 0.50,
        description: "12 questions, balanced visual and text mix",
    },
    [CATEGORIES.PROGRESSING_WELL]: {
        questionsPerSession: 8,
        visualRatio: 0.25,   // Mostly text-based with few visual
        textRatio: 0.75,
        description: "8 questions, mostly text-based",
    },
};

// Personalised Gamified Assessment difficulty mapping
const PERSONALISED_ASSESSMENT_DIFFICULTY = {
    [CATEGORIES.SUPPORT_NEEDED]: "easy",
    [CATEGORIES.DEVELOPING]: "medium",
    [CATEGORIES.PROGRESSING_WELL]: "hard",
};

module.exports = {
    CATEGORIES,
    CATEGORY_LABELS,
    CATEGORY_DESCRIPTIONS,
    COMPONENT_WEIGHTS,
    REASSESSMENT_THRESHOLDS,
    INITIAL_HANDWRITING_THRESHOLDS,
    LEARNING_TIME_RULES,
    PERSONALISED_LEARNING_CARDS,
    PERSONALISED_TRAINING_CONFIG,
    PERSONALISED_ASSESSMENT_DIFFICULTY,
};
