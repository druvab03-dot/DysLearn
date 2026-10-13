/**
 * Personalised Learning Service
 * 
 * Provides category-aware content selection across DysLearn:
 * 1. Learning Model: Exactly 4 cards per concept
 *    - Support Needed: 3 visual cards + 1 text card
 *    - Developing: 2 visual cards + 2 text cards
 *    - Progressing Well: 1 visual card + 3 text cards
 * 2. Training Module: Category-specific question count and visual/text mix
 *    - Support Needed: 20 questions (75% visual, 25% text)
 *    - Developing: 12 questions (50% visual, 50% text)
 *    - Progressing Well: 8 questions (25% visual, 75% text)
 * 3. Gamified Assessment: Difficulty level mapping
 *    - Support Needed: Easy
 *    - Developing: Medium
 *    - Progressing Well: Hard
 */

const {
    CATEGORIES,
    PERSONALISED_LEARNING_CARDS,
    PERSONALISED_TRAINING_CONFIG,
    PERSONALISED_ASSESSMENT_DIFFICULTY,
} = require("../config/categorisationConfig");

/**
 * Select exactly four personalised cards for a concept based on student category.
 * 
 * Grounded in the standard 8-card concept structure:
 *  - Cards 0..3 (indices 0-3): Visual cards
 *  - Cards 4..7 (indices 4-7): Dyslexia typography text cards
 * 
 * @param {Array<Object>|Object} conceptOrCards - Array of 8 cards or concept object with .cards
 * @param {string} category - Student category ('support_needed' | 'developing' | 'progressing_well')
 * @returns {Array<Object>} Exactly 4 personalised cards
 */
function selectPersonalisedCards(conceptOrCards, category = CATEGORIES.DEVELOPING) {
    const rawCards = Array.isArray(conceptOrCards)
        ? conceptOrCards
        : conceptOrCards?.cards || [];

    if (!Array.isArray(rawCards) || rawCards.length === 0) {
        return [];
    }

    // Default to 'developing' if category is unassigned or invalid
    const activeCategory = Object.values(CATEGORIES).includes(category)
        ? category
        : CATEGORIES.DEVELOPING;

    const config = PERSONALISED_LEARNING_CARDS[activeCategory] || PERSONALISED_LEARNING_CARDS[CATEGORIES.DEVELOPING];

    // Partition cards: in DysLearn, first 4 are visual, last 4 are text cards
    const visualPool = rawCards.slice(0, 4);
    const textPool = rawCards.slice(4, 8);

    let selectedVisual = [];
    let selectedText = [];

    if (activeCategory === CATEGORIES.SUPPORT_NEEDED) {
        // 3 visual + 1 text
        selectedVisual = visualPool.slice(0, config.visualCards); // 3
        selectedText = textPool.slice(0, config.textCards); // 1
    } else if (activeCategory === CATEGORIES.DEVELOPING) {
        // 2 visual + 2 text
        selectedVisual = visualPool.slice(0, config.visualCards); // 2
        selectedText = textPool.slice(0, config.textCards); // 2
    } else if (activeCategory === CATEGORIES.PROGRESSING_WELL) {
        // 1 visual + 3 text
        selectedVisual = visualPool.slice(0, config.visualCards); // 1
        selectedText = textPool.slice(0, config.textCards); // 3
    }

    const combined = [...selectedVisual, ...selectedText];

    // Safe fallback if source concept had fewer than 8 cards:
    // If combined is less than 4, fill remaining with any unique cards from rawCards
    if (combined.length < 4 && rawCards.length >= 4) {
        const selectedIds = new Set(combined.map((c, idx) => c.id || c.title || idx));
        for (const card of rawCards) {
            const cardId = card.id || card.title;
            if (!selectedIds.has(cardId)) {
                combined.push(card);
                selectedIds.add(cardId);
            }
            if (combined.length === 4) break;
        }
    }

    // Never return more than 4 cards under normal operation
    return combined.slice(0, 4);
}

/**
 * Filter and assemble training questions according to student category.
 * 
 * Question mix:
 *  - Support Needed: 20 questions (mostly visual, ~75% visual)
 *  - Developing: 12 questions (balanced, ~50% visual)
 *  - Progressing Well: 8 questions (mostly text, ~75% text)
 * 
 * @param {Array<Object>} visualQuestions - Pool of available visual questions
 * @param {Array<Object>} textQuestions - Pool of available text questions
 * @param {string} category - Student category
 * @returns {Array<Object>} Configured mix of training questions
 */
function selectPersonalisedTrainingQuestions(
    visualQuestions = [],
    textQuestions = [],
    category = CATEGORIES.DEVELOPING
) {
    const activeCategory = Object.values(CATEGORIES).includes(category)
        ? category
        : CATEGORIES.DEVELOPING;

    const config =
        PERSONALISED_TRAINING_CONFIG[activeCategory] ||
        PERSONALISED_TRAINING_CONFIG[CATEGORIES.DEVELOPING];

    const targetTotal = config.questionsPerSession;
    const targetVisualCount = Math.round(targetTotal * config.visualRatio);
    const targetTextCount = targetTotal - targetVisualCount;

    // Pick visual questions
    const pickedVisual = (visualQuestions || []).slice(0, targetVisualCount);
    // Pick text questions
    const pickedText = (textQuestions || []).slice(0, targetTextCount);

    let combined = [...pickedVisual, ...pickedText];

    // Fallbacks if one pool has fewer questions than requested:
    // Supplement from the other pool to reach session target if possible
    if (combined.length < targetTotal) {
        const remainingNeeded = targetTotal - combined.length;
        if (pickedVisual.length < targetVisualCount && textQuestions.length > pickedText.length) {
            const extraText = textQuestions.slice(pickedText.length, pickedText.length + remainingNeeded);
            combined.push(...extraText);
        } else if (pickedText.length < targetTextCount && visualQuestions.length > pickedVisual.length) {
            const extraVisual = visualQuestions.slice(pickedVisual.length, pickedVisual.length + remainingNeeded);
            combined.push(...extraVisual);
        }
    }

    return combined;
}

/**
 * Map student category to gamified assessment difficulty.
 * 
 * @param {string} category - Student category
 * @returns {string} 'easy' | 'medium' | 'hard'
 */
function getPersonalisedAssessmentDifficulty(category) {
    if (!category || !PERSONALISED_ASSESSMENT_DIFFICULTY[category]) {
        return "medium";
    }
    return PERSONALISED_ASSESSMENT_DIFFICULTY[category];
}

module.exports = {
    selectPersonalisedCards,
    selectPersonalisedTrainingQuestions,
    getPersonalisedAssessmentDifficulty,
};
