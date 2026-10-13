/**
 * DysLearn Content Registry
 * Central registry mapping (classNumber, subject) to verified textbook educational content.
 * Exactly 8 cards per individual concept across all populated classes and subjects.
 */

import { class1EnglishContent } from "./class1EnglishContent.js";
import {
    class2EnglishContent,
    class3EnglishContent,
    class4EnglishContent,
    class5EnglishContent
} from "./englishContent.js";

import {
    class1MathsContent,
    class2MathsContent,
    class3MathsContent,
    class4MathsContent,
    class5MathsContent
} from "./mathsContent.js";

import {
    class1ScienceContent,
    class2ScienceContent,
    class3ScienceContent,
    class4ScienceContent,
    class5ScienceContent
} from "./scienceContent.js";

import {
    class1KannadaContent,
    class2KannadaContent,
    class3KannadaContent,
    class4KannadaContent,
    class5KannadaContent
} from "./kannadaContent.js";

import {
    class1HindiContent,
    class2HindiContent,
    class3HindiContent,
    class4HindiContent,
    class5HindiContent
} from "./hindiContent.js";

const contentMap = {
    // English
    "1-english": class1EnglishContent,
    "2-english": class2EnglishContent,
    "3-english": class3EnglishContent,
    "4-english": class4EnglishContent,
    "5-english": class5EnglishContent,

    // Mathematics
    "1-mathematics": class1MathsContent,
    "1-maths": class1MathsContent,
    "2-mathematics": class2MathsContent,
    "2-maths": class2MathsContent,
    "3-mathematics": class3MathsContent,
    "3-maths": class3MathsContent,
    "4-mathematics": class4MathsContent,
    "4-maths": class4MathsContent,
    "5-mathematics": class5MathsContent,
    "5-maths": class5MathsContent,

    // EVS / Science / General Knowledge (GK content integrated under EVS)
    "1-evs": class1ScienceContent,
    "1-science": class1ScienceContent,
    "1-gk": class1ScienceContent,
    "2-evs": class2ScienceContent,
    "2-science": class2ScienceContent,
    "2-gk": class2ScienceContent,
    "3-evs": class3ScienceContent,
    "3-science": class3ScienceContent,
    "3-gk": class3ScienceContent,
    "4-evs": class4ScienceContent,
    "4-science": class4ScienceContent,
    "4-gk": class4ScienceContent,
    "5-evs": class5ScienceContent,
    "5-science": class5ScienceContent,
    "5-gk": class5ScienceContent,

    // Hindi (NCERT Sarangi & Veena)
    "1-hindi": class1HindiContent,
    "2-hindi": class2HindiContent,
    "3-hindi": class3HindiContent,
    "4-hindi": class4HindiContent,
    "5-hindi": class5HindiContent,

    // Kannada
    "1-kannada": class1KannadaContent,
    "2-kannada": class2KannadaContent,
    "3-kannada": class3KannadaContent,
    "4-kannada": class4KannadaContent,
    "5-kannada": class5KannadaContent
};

/**
 * Get learning content for a specific class and subject
 * @param {string|number} classNumber 
 * @param {string} subject 
 * @returns {Array} Array of topic objects
 */
export function getLearningContent(classNumber = 1, subject = "english") {
    const normClass = String(classNumber || 1).replace(/[^0-9]/g, "") || "1";
    const normSubject = String(subject || "english").toLowerCase().trim();
    const key = `${normClass}-${normSubject}`;

    if (contentMap[key]) {
        return contentMap[key];
    }

    // Fallbacks
    if (contentMap[`1-${normSubject}`]) {
        return contentMap[`1-${normSubject}`];
    }

    return class1EnglishContent;
}

/**
 * Check if a subject has available textbook source content
 * @param {string|number} classNumber
 * @param {string} subject
 * @returns {boolean}
 */
export function hasSubjectContent(classNumber = 1, subject = "english") {
    const normClass = String(classNumber || 1).replace(/[^0-9]/g, "") || "1";
    const normSubject = String(subject || "english").toLowerCase().trim();
    const key = `${normClass}-${normSubject}`;
    return Boolean(contentMap[key]);
}
