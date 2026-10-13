/**
 * DysLearn Curriculum Assessment Engine
 * Generates tailored, multimodal, dyslexia-friendly gamified assessment sessions
 * covering Classes 1-5 across English, Mathematics, EVS (GK), Hindi, and Kannada.
 *
 * Fully dynamic: every new attempt randomizes:
 *  - Target selection and distractor sampling
 *  - Matching card placements
 *  - Sequence builder clues and tile scrambling
 *  - Memory card positions
 *  - Odd-one-out puzzle selection and item positions
 *  - Theoretical question sampling (5 out of 10) and option shuffling
 *  - Randomized order of all game rounds
 */

import { getTrainingQuestions } from "../TrainingModule/trainingData.js";

// Utility: Pure Fisher-Yates array shuffle
export function shuffleArray(array) {
    if (!Array.isArray(array)) return [];
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Utility: Sample n unique elements
export function sampleUnique(array, n) {
    if (!Array.isArray(array)) return [];
    return shuffleArray(array).slice(0, Math.min(n, array.length));
}

// Subject categorization & odd-one-out curriculum banks with multiple scenarios per class
const categorizationCurriculum = {
    english: {
        1: {
            oddOneOutList: [
                {
                    question: "Which letter or word does NOT belong with the others?",
                    items: [
                        { id: "e1", text: "A", detail: "Vowel letter", isOdd: false },
                        { id: "e2", text: "E", detail: "Vowel letter", isOdd: false },
                        { id: "e3", text: "I", detail: "Vowel letter", isOdd: false },
                        { id: "e4", text: "B", detail: "Consonant letter", isOdd: true },
                    ],
                    reason: "'B' is a consonant, while A, E, and I are all vowels!",
                    categoryTitle: "Vowels vs Consonants",
                },
                {
                    question: "Which item is a non-living toy, while the others are living animals?",
                    items: [
                        { id: "e1", text: "Dog", detail: "Friendly pet animal", isOdd: false },
                        { id: "e2", text: "Cat", detail: "Purring animal", isOdd: false },
                        { id: "e3", text: "Cow", detail: "Gentle farm animal", isOdd: false },
                        { id: "e4", text: "Ball", detail: "Non-living toy to play with", isOdd: true },
                    ],
                    reason: "'Ball' is a toy for playing, while Dog, Cat, and Cow are living animals.",
                    categoryTitle: "Living Animals vs Toys",
                },
                {
                    question: "Which word is a fruit, while the others are colors?",
                    items: [
                        { id: "e1", text: "Red", detail: "Bright color", isOdd: false },
                        { id: "e2", text: "Blue", detail: "Sky color", isOdd: false },
                        { id: "e3", text: "Green", detail: "Leaf color", isOdd: false },
                        { id: "e4", text: "Apple", detail: "Sweet crunchy fruit", isOdd: true },
                    ],
                    reason: "'Apple' is a fruit, whereas Red, Blue, and Green are names of colors.",
                    categoryTitle: "Colors vs Fruits",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "CAT",
                    tiles: ["T", "C", "A"],
                    clue: "A friendly pet animal that purrs and says meow",
                    target: ["C", "A", "T"],
                },
                {
                    word: "BALL",
                    tiles: ["L", "B", "A", "L"],
                    clue: "A round toy used for bouncing, throwing, and kicking",
                    target: ["B", "A", "L", "L"],
                },
                {
                    word: "SUN",
                    tiles: ["N", "S", "U"],
                    clue: "Shines in the daytime sky giving light and warmth",
                    target: ["S", "U", "N"],
                },
            ],
        },
        2: {
            oddOneOutList: [
                {
                    question: "Which word is an action word (verb), while the others are naming words (nouns)?",
                    items: [
                        { id: "e1", text: "Apple", detail: "Fruit (Noun)", isOdd: false },
                        { id: "e2", text: "Chair", detail: "Object (Noun)", isOdd: false },
                        { id: "e3", text: "Book", detail: "Object (Noun)", isOdd: false },
                        { id: "e4", text: "Jump", detail: "Action word (Verb)", isOdd: true },
                    ],
                    reason: "'Jump' is an action word (verb), whereas Apple, Chair, and Book are naming objects (nouns).",
                    categoryTitle: "Nouns vs Action Verbs",
                },
                {
                    question: "Which animal is a wild predator, while the others are domestic farm animals?",
                    items: [
                        { id: "e1", text: "Cow", detail: "Domestic farm animal", isOdd: false },
                        { id: "e2", text: "Sheep", detail: "Domestic wool animal", isOdd: false },
                        { id: "e3", text: "Goat", detail: "Domestic farm animal", isOdd: false },
                        { id: "e4", text: "Tiger", detail: "Wild predator of the jungle", isOdd: true },
                    ],
                    reason: "'Tiger' is a wild forest predator, while Cow, Sheep, and Goat live peacefully on farms.",
                    categoryTitle: "Domestic Animals vs Wild Predators",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "TRAIN",
                    tiles: ["N", "T", "A", "R", "I"],
                    clue: "A long vehicle that runs on railway tracks",
                    target: ["T", "R", "A", "I", "N"],
                },
                {
                    word: "WATER",
                    tiles: ["R", "W", "A", "E", "T"],
                    clue: "A clear liquid essential for all life to drink",
                    target: ["W", "A", "T", "E", "R"],
                },
                {
                    word: "CLOCK",
                    tiles: ["K", "C", "L", "O", "C"],
                    clue: "An instrument with hands that shows the hours of the day",
                    target: ["C", "L", "O", "C", "K"],
                },
            ],
        },
        3: {
            oddOneOutList: [
                {
                    question: "Spot the singular word among plural words:",
                    items: [
                        { id: "e1", text: "Birds", detail: "Plural (many)", isOdd: false },
                        { id: "e2", text: "Flowers", detail: "Plural (many)", isOdd: false },
                        { id: "e3", text: "Trees", detail: "Plural (many)", isOdd: false },
                        { id: "e4", text: "Book", detail: "Singular (one)", isOdd: true },
                    ],
                    reason: "'Book' means just one book (singular), while the others are plural forms ending in 's'.",
                    categoryTitle: "Singular vs Plural",
                },
                {
                    question: "Which item is furniture, while the others are vehicles for travel?",
                    items: [
                        { id: "e1", text: "Car", detail: "Road vehicle", isOdd: false },
                        { id: "e2", text: "Bus", detail: "Public transport vehicle", isOdd: false },
                        { id: "e3", text: "Train", detail: "Railway vehicle", isOdd: false },
                        { id: "e4", text: "Chair", detail: "Household furniture to sit on", isOdd: true },
                    ],
                    reason: "'Chair' is furniture, while Car, Bus, and Train are vehicles for traveling.",
                    categoryTitle: "Vehicles vs Furniture",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "PENCIL",
                    tiles: ["L", "P", "C", "E", "I", "N"],
                    clue: "A tool used for writing and drawing on paper",
                    target: ["P", "E", "N", "C", "I", "L"],
                },
                {
                    word: "FLOWER",
                    tiles: ["R", "F", "L", "E", "O", "W"],
                    clue: "The colorful blooming part of a plant with sweet fragrance",
                    target: ["F", "L", "O", "W", "E", "R"],
                },
                {
                    word: "DOCTOR",
                    tiles: ["R", "D", "C", "O", "T", "O"],
                    clue: "A person who helps cure illnesses and protects our health",
                    target: ["D", "O", "C", "T", "O", "R"],
                },
            ],
        },
        4: {
            oddOneOutList: [
                {
                    question: "Which word is a naming word (noun), while the others are describing words (adjectives)?",
                    items: [
                        { id: "e1", text: "Bright", detail: "Describing word", isOdd: false },
                        { id: "e2", text: "Sweet", detail: "Describing word", isOdd: false },
                        { id: "e3", text: "Fast", detail: "Describing word", isOdd: false },
                        { id: "e4", text: "Table", detail: "Object (Noun)", isOdd: true },
                    ],
                    reason: "'Table' is a noun (an object), while Bright, Sweet, and Fast describe things (adjectives).",
                    categoryTitle: "Describing Words vs Nouns",
                },
                {
                    question: "Which word means unhappy, while the others all mean joyful (synonyms)?",
                    items: [
                        { id: "e1", text: "Happy", detail: "Feeling joyful", isOdd: false },
                        { id: "e2", text: "Cheerful", detail: "Full of smiles", isOdd: false },
                        { id: "e3", text: "Joyful", detail: "Very happy", isOdd: false },
                        { id: "e4", text: "Sad", detail: "Feeling unhappy (antonym)", isOdd: true },
                    ],
                    reason: "'Sad' is an antonym meaning unhappy, while Happy, Cheerful, and Joyful are synonyms.",
                    categoryTitle: "Synonyms vs Antonym",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "GARDEN",
                    tiles: ["N", "G", "D", "A", "E", "R"],
                    clue: "A beautiful place with flowers, grass, and plants",
                    target: ["G", "A", "R", "D", "E", "N"],
                },
                {
                    word: "FOREST",
                    tiles: ["T", "F", "R", "O", "S", "E"],
                    clue: "A large dense area filled with tall trees and wildlife",
                    target: ["F", "O", "R", "E", "S", "T"],
                },
                {
                    word: "SCHOOL",
                    tiles: ["L", "S", "C", "O", "H", "O"],
                    clue: "A place where students learn subjects and make friends",
                    target: ["S", "C", "H", "O", "O", "L"],
                },
            ],
        },
        5: {
            oddOneOutList: [
                {
                    question: "Which verb is in the present continuous tense (-ing), while the others are past tense?",
                    items: [
                        { id: "e1", text: "Walked", detail: "Past tense", isOdd: false },
                        { id: "e2", text: "Jumped", detail: "Past tense", isOdd: false },
                        { id: "e3", text: "Played", detail: "Past tense", isOdd: false },
                        { id: "e4", text: "Singing", detail: "Continuous tense", isOdd: true },
                    ],
                    reason: "'Singing' has the -ing form showing ongoing action, whereas Walked, Jumped, and Played are past actions.",
                    categoryTitle: "Verb Tenses",
                },
                {
                    question: "Which word is a noun, while the others are connecting words (conjunctions)?",
                    items: [
                        { id: "e1", text: "Because", detail: "Connects reason", isOdd: false },
                        { id: "e2", text: "Although", detail: "Connects contrast", isOdd: false },
                        { id: "e3", text: "Therefore", detail: "Connects conclusion", isOdd: false },
                        { id: "e4", text: "River", detail: "Natural waterbody (Noun)", isOdd: true },
                    ],
                    reason: "'River' is a naming noun, while Because, Although, and Therefore are conjunctions.",
                    categoryTitle: "Conjunctions vs Nouns",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "PLANET",
                    tiles: ["T", "P", "N", "L", "E", "A"],
                    clue: "A large celestial body orbiting the sun, like Earth",
                    target: ["P", "L", "A", "N", "E", "T"],
                },
                {
                    word: "NATURE",
                    tiles: ["E", "N", "T", "A", "R", "U"],
                    clue: "The physical world with plants, animals, mountains, and air",
                    target: ["N", "A", "T", "U", "R", "E"],
                },
                {
                    word: "ENERGY",
                    tiles: ["Y", "E", "N", "G", "E", "R"],
                    clue: "The power to do work, such as solar, heat, or wind power",
                    target: ["E", "N", "E", "R", "G", "Y"],
                },
            ],
        },
    },

    mathematics: {
        1: {
            oddOneOutList: [
                {
                    question: "Which shape is a 3D solid shape, while the others are flat 2D shapes?",
                    items: [
                        { id: "m1", text: "Circle", detail: "Flat 2D shape", isOdd: false },
                        { id: "m2", text: "Square", detail: "Flat 2D shape", isOdd: false },
                        { id: "m3", text: "Triangle", detail: "Flat 2D shape", isOdd: false },
                        { id: "m4", text: "Sphere", detail: "Solid 3D ball", isOdd: true },
                    ],
                    reason: "A Sphere is a 3-dimensional solid ball, while Circle, Square, and Triangle are flat 2D shapes.",
                    categoryTitle: "2D Flat Shapes vs 3D Solids",
                },
                {
                    question: "Which item is a number, while the others are geometric shapes?",
                    items: [
                        { id: "m1", text: "Circle", detail: "Round geometric shape", isOdd: false },
                        { id: "m2", text: "Square", detail: "Four-sided equal shape", isOdd: false },
                        { id: "m3", text: "Triangle", detail: "Three-sided shape", isOdd: false },
                        { id: "m4", text: "5", detail: "A counting numeral", isOdd: true },
                    ],
                    reason: "'5' is a numeral, while Circle, Square, and Triangle are geometric shapes.",
                    categoryTitle: "Geometric Shapes vs Numerals",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "2-4-6-8",
                    tiles: ["6", "2", "8", "4"],
                    clue: "Arrange these numbers in counting order from smallest to biggest",
                    target: ["2", "4", "6", "8"],
                },
                {
                    word: "1-3-5-7",
                    tiles: ["5", "1", "7", "3"],
                    clue: "Arrange odd counting numbers in ascending order",
                    target: ["1", "3", "5", "7"],
                },
                {
                    word: "1-2-3-4",
                    tiles: ["3", "1", "4", "2"],
                    clue: "Order the basic counting numbers from 1 to 4",
                    target: ["1", "2", "3", "4"],
                },
            ],
        },
        2: {
            oddOneOutList: [
                {
                    question: "Which number is an ODD number, while the others are EVEN numbers?",
                    items: [
                        { id: "m1", text: "4", detail: "Even number (2 × 2)", isOdd: false },
                        { id: "m2", text: "6", detail: "Even number (2 × 3)", isOdd: false },
                        { id: "m3", text: "8", detail: "Even number (2 × 4)", isOdd: false },
                        { id: "m4", text: "7", detail: "Odd number", isOdd: true },
                    ],
                    reason: "7 cannot be divided into pairs evenly, making it an odd number!",
                    categoryTitle: "Even vs Odd Numbers",
                },
                {
                    question: "Which item is a month, while the others are days of the week?",
                    items: [
                        { id: "m1", text: "Monday", detail: "Day of the week", isOdd: false },
                        { id: "m2", text: "Wednesday", detail: "Day of the week", isOdd: false },
                        { id: "m3", text: "Friday", detail: "Day of the week", isOdd: false },
                        { id: "m4", text: "January", detail: "Month of the year", isOdd: true },
                    ],
                    reason: "'January' is a month with 31 days, while Monday, Wednesday, and Friday are days of the week.",
                    categoryTitle: "Days of the Week vs Months",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "10-20-30-40",
                    tiles: ["30", "10", "40", "20"],
                    clue: "Arrange in counting steps of 10s (skip counting)",
                    target: ["10", "20", "30", "40"],
                },
                {
                    word: "5-10-15-20",
                    tiles: ["15", "5", "20", "10"],
                    clue: "Skip counting in steps of 5s up to 20",
                    target: ["5", "10", "15", "20"],
                },
            ],
        },
        3: {
            oddOneOutList: [
                {
                    question: "Which number is NOT a multiple of 5?",
                    items: [
                        { id: "m1", text: "15", detail: "5 × 3", isOdd: false },
                        { id: "m2", text: "25", detail: "5 × 5", isOdd: false },
                        { id: "m3", text: "40", detail: "5 × 8", isOdd: false },
                        { id: "m4", text: "23", detail: "Does not end in 0 or 5", isOdd: true },
                    ],
                    reason: "Multiples of 5 always end in 0 or 5. 23 ends in 3, so it is not a multiple of 5.",
                    categoryTitle: "Multiples of 5",
                },
                {
                    question: "Which item is a unit of length, while the others are Indian currency units?",
                    items: [
                        { id: "m1", text: "1 Rupee", detail: "Coin denomination", isOdd: false },
                        { id: "m2", text: "5 Rupees", detail: "Coin denomination", isOdd: false },
                        { id: "m3", text: "10 Rupees", detail: "Note/coin denomination", isOdd: false },
                        { id: "m4", text: "Kilometer", detail: "Measures distance/length", isOdd: true },
                    ],
                    reason: "'Kilometer' measures distance, while the others are denominations of money.",
                    categoryTitle: "Currency vs Distance Units",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "25-50-75-100",
                    tiles: ["75", "25", "100", "50"],
                    clue: "Order the quarter amounts in ascending order (counting by 25s)",
                    target: ["25", "50", "75", "100"],
                },
                {
                    word: "3-6-9-12",
                    tiles: ["9", "3", "12", "6"],
                    clue: "Multiples of 3 in counting order",
                    target: ["3", "6", "9", "12"],
                },
                {
                    word: "100-200-300-400",
                    tiles: ["300", "100", "400", "200"],
                    clue: "Count in hundreds from 100 to 400",
                    target: ["100", "200", "300", "400"],
                },
            ],
        },
        4: {
            oddOneOutList: [
                {
                    question: "Which number is a composite number, while the others are prime numbers?",
                    items: [
                        { id: "m1", text: "3", detail: "Prime (factors 1 and 3)", isOdd: false },
                        { id: "m2", text: "5", detail: "Prime (factors 1 and 5)", isOdd: false },
                        { id: "m3", text: "7", detail: "Prime (factors 1 and 7)", isOdd: false },
                        { id: "m4", text: "9", detail: "Composite (3 × 3 = 9)", isOdd: true },
                    ],
                    reason: "9 has factors 1, 3, and 9 (3 × 3), so it is composite, while 3, 5, and 7 are prime numbers.",
                    categoryTitle: "Prime vs Composite Numbers",
                },
                {
                    question: "Which item is a unit of weight, while the others are geometric line concepts?",
                    items: [
                        { id: "m1", text: "Line", detail: "Extends infinitely both ways", isOdd: false },
                        { id: "m2", text: "Ray", detail: "Has one endpoint", isOdd: false },
                        { id: "m3", text: "Line Segment", detail: "Has two endpoints", isOdd: false },
                        { id: "m4", text: "Kilogram", detail: "Measures mass/weight", isOdd: true },
                    ],
                    reason: "'Kilogram' measures weight, whereas Line, Ray, and Segment are geometry concepts.",
                    categoryTitle: "Geometry vs Units of Mass",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "12-24-36-48",
                    tiles: ["36", "12", "48", "24"],
                    clue: "Arrange the multiples of 12 in ascending order",
                    target: ["12", "24", "36", "48"],
                },
                {
                    word: "2-3-5-7",
                    tiles: ["5", "2", "7", "3"],
                    clue: "Arrange single-digit prime numbers in order",
                    target: ["2", "3", "5", "7"],
                },
            ],
        },
        5: {
            oddOneOutList: [
                {
                    question: "Which item is a unit of weight, while the others measure geometric angles?",
                    items: [
                        { id: "m1", text: "Acute Angle", detail: "Angle < 90°", isOdd: false },
                        { id: "m2", text: "Right Angle", detail: "Angle = 90°", isOdd: false },
                        { id: "m3", text: "Obtuse Angle", detail: "Angle > 90°", isOdd: false },
                        { id: "m4", text: "Kilogram", detail: "Unit of mass/weight", isOdd: true },
                    ],
                    reason: "Kilogram is a metric unit to measure mass, while the others are types of geometric angles.",
                    categoryTitle: "Angles vs Units of Measurement",
                },
                {
                    question: "Which shape has a curved boundary, while the others are straight-sided polygons?",
                    items: [
                        { id: "m1", text: "Triangle", detail: "3 straight sides", isOdd: false },
                        { id: "m2", text: "Rectangle", detail: "4 straight sides", isOdd: false },
                        { id: "m3", text: "Pentagon", detail: "5 straight sides", isOdd: false },
                        { id: "m4", text: "Circle", detail: "Curved round boundary", isOdd: true },
                    ],
                    reason: "A Circle has a continuous curved perimeter, while Triangle, Rectangle, and Pentagon have straight edges.",
                    categoryTitle: "Polygons vs Circles",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "100-250-500-1000",
                    tiles: ["500", "100", "1000", "250"],
                    clue: "Arrange these metric quantities from smallest to largest",
                    target: ["100", "250", "500", "1000"],
                },
                {
                    word: "30-60-90-180",
                    tiles: ["90", "30", "180", "60"],
                    clue: "Arrange geometric angles from acute to straight (in degrees)",
                    target: ["30", "60", "90", "180"],
                },
            ],
        },
    },

    evs: {
        1: {
            oddOneOutList: [
                {
                    question: "Which item is a NON-LIVING object, while the others are living beings?",
                    items: [
                        { id: "v1", text: "Dog", detail: "Living animal", isOdd: false },
                        { id: "v2", text: "Tree", detail: "Living plant", isOdd: false },
                        { id: "v3", text: "Cow", detail: "Living animal", isOdd: false },
                        { id: "v4", text: "Chair", detail: "Non-living wooden furniture", isOdd: true },
                    ],
                    reason: "A chair is non-living; it cannot breathe, eat, or grow, unlike animals and plants.",
                    categoryTitle: "Living Things vs Non-Living Objects",
                },
                {
                    question: "Which body part is a limb, while the others are sensory organs?",
                    items: [
                        { id: "v1", text: "Eyes", detail: "Sense of sight", isOdd: false },
                        { id: "v2", text: "Ears", detail: "Sense of hearing", isOdd: false },
                        { id: "v3", text: "Nose", detail: "Sense of smell", isOdd: false },
                        { id: "v4", text: "Hand", detail: "Limb for holding and working", isOdd: true },
                    ],
                    reason: "'Hand' is an upper limb, whereas Eyes, Ears, and Nose are primary sensory organs.",
                    categoryTitle: "Sense Organs vs Limbs",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "SEED-PLANT-FLOWER",
                    tiles: ["PLANT", "SEED", "FLOWER"],
                    clue: "Order the stages of plant growth from beginning to bloom",
                    target: ["SEED", "PLANT", "FLOWER"],
                },
                {
                    word: "MORNING-AFTERNOON-NIGHT",
                    tiles: ["AFTERNOON", "MORNING", "NIGHT"],
                    clue: "Arrange the chronological parts of a full day in natural order",
                    target: ["MORNING", "AFTERNOON", "NIGHT"],
                },
            ],
        },
        2: {
            oddOneOutList: [
                {
                    question: "Which body part is NOT one of our five sense organs?",
                    items: [
                        { id: "v1", text: "Eyes", detail: "Sense of sight", isOdd: false },
                        { id: "v2", text: "Ears", detail: "Sense of hearing", isOdd: false },
                        { id: "v3", text: "Nose", detail: "Sense of smell", isOdd: false },
                        { id: "v4", text: "Foot", detail: "Limb for walking", isOdd: true },
                    ],
                    reason: "The foot is a limb for locomotion, whereas Eyes, Ears, and Nose are primary sensory organs.",
                    categoryTitle: "Sense Organs",
                },
                {
                    question: "Which item is man-made furniture, while the others are natural sources of water?",
                    items: [
                        { id: "v1", text: "River", detail: "Natural flowing freshwater", isOdd: false },
                        { id: "v2", text: "Lake", detail: "Natural body of water", isOdd: false },
                        { id: "v3", text: "Rain", detail: "Natural precipitation", isOdd: false },
                        { id: "v4", text: "Table", detail: "Wooden household furniture", isOdd: true },
                    ],
                    reason: "'Table' is man-made furniture, while River, Lake, and Rain are natural water sources.",
                    categoryTitle: "Water Sources vs Furniture",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "EGG-CATERPILLAR-BUTTERFLY",
                    tiles: ["BUTTERFLY", "EGG", "CATERPILLAR"],
                    clue: "Arrange the life cycle of a butterfly in natural order",
                    target: ["EGG", "CATERPILLAR", "BUTTERFLY"],
                },
                {
                    word: "ROOT-STEM-LEAF",
                    tiles: ["LEAF", "ROOT", "STEM"],
                    clue: "Arrange the structure of a plant starting from the underground root upward",
                    target: ["ROOT", "STEM", "LEAF"],
                },
            ],
        },
        3: {
            oddOneOutList: [
                {
                    question: "Which animal is a CARNIVORE (meat-eater), while the others are plant-eating herbivores?",
                    items: [
                        { id: "v1", text: "Cow", detail: "Eats grass (Herbivore)", isOdd: false },
                        { id: "v2", text: "Deer", detail: "Eats leaves (Herbivore)", isOdd: false },
                        { id: "v3", text: "Goat", detail: "Eats shrubs (Herbivore)", isOdd: false },
                        { id: "v4", text: "Lion", detail: "Hunts prey (Carnivore)", isOdd: true },
                    ],
                    reason: "The Lion is a carnivore that hunts other animals, while cows, deer, and goats are plant-eaters.",
                    categoryTitle: "Herbivores vs Carnivores",
                },
                {
                    question: "Which creature cannot fly in the air, while the others are feathered birds?",
                    items: [
                        { id: "v1", text: "Crow", detail: "Flying bird", isOdd: false },
                        { id: "v2", text: "Pigeon", detail: "Flying bird", isOdd: false },
                        { id: "v3", text: "Sparrow", detail: "Flying bird", isOdd: false },
                        { id: "v4", text: "Cow", detail: "Four-legged domestic mammal", isOdd: true },
                    ],
                    reason: "'Cow' is a land mammal, while Crow, Pigeon, and Sparrow are winged birds.",
                    categoryTitle: "Birds vs Land Mammals",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "SUN-GRASS-DEER-LION",
                    tiles: ["DEER", "SUN", "LION", "GRASS"],
                    clue: "Arrange this natural food chain in energy flow sequence",
                    target: ["SUN", "GRASS", "DEER", "LION"],
                },
                {
                    word: "EVAPORATION-CONDENSATION-RAIN",
                    tiles: ["RAIN", "EVAPORATION", "CONDENSATION"],
                    clue: "Order the stages of rain formation from evaporation to precipitation",
                    target: ["EVAPORATION", "CONDENSATION", "RAIN"],
                },
            ],
        },
        4: {
            oddOneOutList: [
                {
                    question: "Which creature lives in freezing polar ice, while the others belong to hot desert ecosystems?",
                    items: [
                        { id: "v1", text: "Camel", detail: "Desert animal with hump", isOdd: false },
                        { id: "v2", text: "Cactus", detail: "Desert succulent plant", isOdd: false },
                        { id: "v3", text: "Fennec Fox", detail: "Desert fox with large ears", isOdd: false },
                        { id: "v4", text: "Penguin", detail: "Cold polar aquatic bird", isOdd: true },
                    ],
                    reason: "Penguins thrive in freezing polar Antarctic regions, while camels, cactus, and fennec foxes live in arid deserts.",
                    categoryTitle: "Desert vs Polar Habitats",
                },
                {
                    question: "Which energy source is a fossil fuel, while the others are clean renewable energies?",
                    items: [
                        { id: "v1", text: "Solar Energy", detail: "Renewable from sunlight", isOdd: false },
                        { id: "v2", text: "Wind Power", detail: "Renewable from airflow", isOdd: false },
                        { id: "v3", text: "Hydro Power", detail: "Renewable from flowing water", isOdd: false },
                        { id: "v4", text: "Coal", detail: "Non-renewable polluting fossil fuel", isOdd: true },
                    ],
                    reason: "'Coal' is a polluting non-renewable fossil fuel, while solar, wind, and hydro are green renewable energies.",
                    categoryTitle: "Renewable Energy vs Fossil Fuels",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "EVAPORATION-CONDENSATION-PRECIPITATION",
                    tiles: ["PRECIPITATION", "EVAPORATION", "CONDENSATION"],
                    clue: "Arrange the three primary stages of the natural water cycle",
                    target: ["EVAPORATION", "CONDENSATION", "PRECIPITATION"],
                },
            ],
        },
        5: {
            oddOneOutList: [
                {
                    question: "Which organ belongs to a plant, while the others are vital human internal organs?",
                    items: [
                        { id: "v1", text: "Heart", detail: "Pumps blood in humans", isOdd: false },
                        { id: "v2", text: "Lungs", detail: "Breathes oxygen in humans", isOdd: false },
                        { id: "v3", text: "Brain", detail: "Controls human nervous system", isOdd: false },
                        { id: "v4", text: "Leaf", detail: "Plant photosynthetic organ", isOdd: true },
                    ],
                    reason: "A leaf is an organ of a plant, whereas the heart, lungs, and brain are human vital organs.",
                    categoryTitle: "Human Organs vs Plant Structures",
                },
                {
                    question: "Which celestial body is a central burning star, while the others are orbiting planets?",
                    items: [
                        { id: "v1", text: "Earth", detail: "Planet with life", isOdd: false },
                        { id: "v2", text: "Mars", detail: "The red planet", isOdd: false },
                        { id: "v3", text: "Jupiter", detail: "Giant gas planet", isOdd: false },
                        { id: "v4", text: "Sun", detail: "Central luminous star of our solar system", isOdd: true },
                    ],
                    reason: "The Sun is a glowing star, while Earth, Mars, and Jupiter are orbiting planets.",
                    categoryTitle: "Planets vs The Sun",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "MOUTH-STOMACH-INTESTINE",
                    tiles: ["STOMACH", "MOUTH", "INTESTINE"],
                    clue: "Arrange the human digestive pathway in order of food movement",
                    target: ["MOUTH", "STOMACH", "INTESTINE"],
                },
            ],
        },
    },

    hindi: {
        1: {
            oddOneOutList: [
                {
                    question: "इनमें से कौन सा अक्षर 'व्यंजन' है, जबकि बाकी सभी 'स्वर' हैं?",
                    items: [
                        { id: "h1", text: "अ", detail: "स्वर वर्ण", isOdd: false },
                        { id: "h2", text: "आ", detail: "स्वर वर्ण", isOdd: false },
                        { id: "h3", text: "इ", detail: "स्वर वर्ण", isOdd: false },
                        { id: "h4", text: "क", detail: "व्यंजन वर्ण", isOdd: true },
                    ],
                    reason: "'क' एक व्यंजन वर्ण है, जबकि अ, आ, और इ स्वर वर्ण हैं।",
                    categoryTitle: "स्वर और व्यंजन",
                },
                {
                    question: "इनमें से कौन सा जंगली जानवर है, जबकि बाकी सभी मीठे फल हैं?",
                    items: [
                        { id: "h1", text: "आम", detail: "फलों का राजा", isOdd: false },
                        { id: "h2", text: "केला", detail: "स्वादिष्ट फल", isOdd: false },
                        { id: "h3", text: "सेब", detail: "स्वास्थ्यवर्धक फल", isOdd: false },
                        { id: "h4", text: "शेर", detail: "जंगल का शिकारी जानवर", isOdd: true },
                    ],
                    reason: "'शेर' एक जंगली जानवर है, जबकि आम, केला और सेब फल हैं।",
                    categoryTitle: "फल और जंगली जानवर",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "कमल",
                    tiles: ["ल", "क", "म"],
                    clue: "हमारा राष्ट्रीय फूल जो जल में खिलता है (क + म + ल)",
                    target: ["क", "म", "ल"],
                },
                {
                    word: "कलम",
                    tiles: ["म", "क", "ल"],
                    clue: "लिखने की सुंदर वस्तु (क + ल + म)",
                    target: ["क", "ल", "म"],
                },
                {
                    word: "घर",
                    tiles: ["र", "घ"],
                    clue: "जहाँ हम परिवार के साथ रहते हैं (घ + र)",
                    target: ["घ", "र"],
                },
            ],
        },
        2: {
            oddOneOutList: [
                {
                    question: "इनमें से कौन सा शब्द स्त्रीलिंग है, जबकि बाकी पुल्लिंग हैं?",
                    items: [
                        { id: "h1", text: "लड़का", detail: "पुल्लिंग शब्द", isOdd: false },
                        { id: "h2", text: "पिता", detail: "पुल्लिंग शब्द", isOdd: false },
                        { id: "h3", text: "भाई", detail: "पुल्लिंग शब्द", isOdd: false },
                        { id: "h4", text: "लड़की", detail: "स्त्रीलिंग शब्द", isOdd: true },
                    ],
                    reason: "'लड़की' स्त्रीलिंग शब्द है, जबकि लड़का, पिता और भाई पुल्लिंग शब्द हैं।",
                    categoryTitle: "लिंग भेद (स्त्रीलिंग व पुल्लिंग)",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "किताब",
                    tiles: ["ब", "कि", "ता"],
                    clue: "जिससे हम ज्ञान प्राप्त करते हैं और पढ़ते हैं",
                    target: ["कि", "ता", "ब"],
                },
                {
                    word: "सूरज",
                    tiles: ["ज", "सू", "र"],
                    clue: "जो हमें दिन में प्रकाश और ऊर्जा देता है",
                    target: ["सू", "र", "ज"],
                },
            ],
        },
        3: {
            oddOneOutList: [
                {
                    question: "इनमें से कौन सा शब्द एकवचन है, जबकि बाकी बहुवचन हैं?",
                    items: [
                        { id: "h1", text: "किताबें", detail: "बहुवचन (अनेक)", isOdd: false },
                        { id: "h2", text: "पेंसिलें", detail: "बहुवचन (अनेक)", isOdd: false },
                        { id: "h3", text: "गेंदें", detail: "बहुवचन (अनेक)", isOdd: false },
                        { id: "h4", text: "कलम", detail: "एकवचन (एक)", isOdd: true },
                    ],
                    reason: "'कलम' एकवचन रूप है, जबकि किताबें, पेंसिलें और गेंदें बहुवचन रूप हैं।",
                    categoryTitle: "एकवचन और बहुवचन",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "सड़क",
                    tiles: ["क", "स", "ड़"],
                    clue: "जिस पर गाड़ियाँ और वाहन सुरक्षित चलते हैं",
                    target: ["स", "ड़", "क"],
                },
            ],
        },
        4: {
            oddOneOutList: [
                {
                    question: "इनमें से कौन सा शब्द 'सूर्य' का पर्यायवाची नहीं है?",
                    items: [
                        { id: "h1", text: "रवि", detail: "सूर्य का पर्यायवाची", isOdd: false },
                        { id: "h2", text: "दिनकर", detail: "सूर्य का पर्यायवाची", isOdd: false },
                        { id: "h3", text: "भास्कर", detail: "सूर्य का पर्यायवाची", isOdd: false },
                        { id: "h4", text: "चाँद", detail: "चंद्रमा (अलग शब्द)", isOdd: true },
                    ],
                    reason: "'चाँद' चंद्रमा है, जबकि रवि, दिनकर और भास्कर सूर्य के पर्यायवाची नाम हैं।",
                    categoryTitle: "पर्यायवाची शब्द",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "भारत",
                    tiles: ["त", "भा", "र"],
                    clue: "हमारा प्यारा देश (भा + र + त)",
                    target: ["भा", "र", "त"],
                },
            ],
        },
        5: {
            oddOneOutList: [
                {
                    question: "इनमें से कौन सा शब्द संज्ञा है, जबकि बाकी सभी क्रिया शब्द (काम) हैं?",
                    items: [
                        { id: "h1", text: "पढ़ना", detail: "क्रिया (काम)", isOdd: false },
                        { id: "h2", text: "लिखना", detail: "क्रिया (काम)", isOdd: false },
                        { id: "h3", text: "दौड़ना", detail: "क्रिया (काम)", isOdd: false },
                        { id: "h4", text: "पेड़", detail: "संज्ञा (वस्तु/पौधा)", isOdd: true },
                    ],
                    reason: "'पेड़' एक संज्ञा है, जबकि पढ़ना, लिखना और दौड़ना क्रिया शब्द हैं।",
                    categoryTitle: "संज्ञा और क्रिया",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "हिमालय",
                    tiles: ["लय", "हि", "मा"],
                    clue: "भारत के उत्तर में स्थित महान पर्वतमाला",
                    target: ["हि", "मा", "लय"],
                },
            ],
        },
    },

    kannada: {
        1: {
            oddOneOutList: [
                {
                    question: "ಇವುಗಳಲ್ಲಿ ಯಾವುದು 'ವ್ಯಂಜನ' ಅಕ್ಷರವಾಗಿದೆ, ಉಳಿದವು 'ಸ್ವರ'ಗಳಾಗಿವೆ?",
                    items: [
                        { id: "k1", text: "ಅ", detail: "ಸ್ವರ ಅಕ್ಷರ", isOdd: false },
                        { id: "k2", text: "ಆ", detail: "ಸ್ವರ ಅಕ್ಷರ", isOdd: false },
                        { id: "k3", text: "ಇ", detail: "ಸ್ವರ ಅಕ್ಷರ", isOdd: false },
                        { id: "k4", text: "ಕ", detail: "ವ್ಯಂಜನ ಅಕ್ಷರ", isOdd: true },
                    ],
                    reason: "'ಕ' ವ್ಯಂಜನ ಅಕ್ಷರವಾಗಿದೆ, ಆದರೆ ಅ, ಆ, ಇ ಕನ್ನಡದ ಮೂಲ ಸ್ವರಗಳಾಗಿವೆ.",
                    categoryTitle: "ಸ್ವರಗಳು ಮತ್ತು ವ್ಯಂಜನಗಳು",
                },
                {
                    question: "ಇವುಗಳಲ್ಲಿ ಯಾವುದು ಕಾಡುಪ್ರಾಣಿಯಾಗಿದೆ, ಉಳಿದವು ಸಿಹಿಯಾದ ಹಣ್ಣುಗಳಾಗಿವೆ?",
                    items: [
                        { id: "k1", text: "ಸೇಬು", detail: "ಆರೋಗ್ಯಕರ ಹಣ್ಣು", isOdd: false },
                        { id: "k2", text: "ಬಾಳೆ", detail: "ರುಚಿಯಾದ ಹಣ್ಣು", isOdd: false },
                        { id: "k3", text: "ಮಾವು", detail: "ಹಣ್ಣುಗಳ ರಾಜ", isOdd: false },
                        { id: "k4", text: "ಸಿಂಹ", detail: "ಕಾಡಿನ ರಾಜ ಪ್ರಾಣಿ", isOdd: true },
                    ],
                    reason: "'ಸಿಂಹ' ಕಾಡುಪ್ರಾಣಿಯಾಗಿದೆ, ಆದರೆ ಸೇಬು, ಬಾಳೆ ಮತ್ತು ಮಾವು ಹಣ್ಣುಗಳು.",
                    categoryTitle: "ಹಣ್ಣುಗಳು ಮತ್ತು ಕಾಡುಪ್ರಾಣಿ",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "ಕಮಲ",
                    tiles: ["ಲ", "ಕ", "ಮ"],
                    clue: "ನಮ್ಮ ರಾಷ್ಟ್ರೀಯ ಹೂವು (ಕ + ಮ + ಲ)",
                    target: ["ಕ", "ಮ", "ಲ"],
                },
                {
                    word: "ಮನೆ",
                    tiles: ["ನೆ", "ಮ"],
                    clue: "ನಾವು ಕುಟುಂಬದೊಂದಿಗೆ ಪ್ರೀತಿಯಿಂದ ವಾಸಿಸುವ ಸ್ಥಳ",
                    target: ["ಮ", "ನೆ"],
                },
            ],
        },
        2: {
            oddOneOutList: [
                {
                    question: "ಇವುಗಳಲ್ಲಿ ಯಾವುದು 'ದೀರ್ಘಸ್ವರ'ವಾಗಿದೆ, ಉಳಿದವು 'ಹ್ರಸ್ವಸ್ವರ'ಗಳಾಗಿವೆ?",
                    items: [
                        { id: "k1", text: "ಅ", detail: "ಹ್ರಸ್ವಸ್ವರ (ಒಂದು ಮಾತ್ರೆ)", isOdd: false },
                        { id: "k2", text: "ಇ", detail: "ಹ್ರಸ್ವಸ್ವರ (ಒಂದು ಮಾತ್ರೆ)", isOdd: false },
                        { id: "k3", text: "ಉ", detail: "ಹ್ರಸ್ವಸ್ವರ (ಒಂದು ಮಾತ್ರೆ)", isOdd: false },
                        { id: "k4", text: "ಆ", detail: "ದೀರ್ಘಸ್ವರ (ಎರಡು ಮಾತ್ರೆ)", isOdd: true },
                    ],
                    reason: "'ಆ' ಎರಡು ಮಾತ್ರೆಗಳ ಕಾಲದಲ್ಲಿ ಉಚ್ಚರಿಸಲಾಗುವ ದೀರ್ಘಸ್ವರವಾಗಿದೆ, ಉಳಿದವು ಹ್ರಸ್ವಸ್ವರಗಳು.",
                    categoryTitle: "ಹ್ರಸ್ವಸ್ವರ ಮತ್ತು ದೀರ್ಘಸ್ವರ",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "ಹಣ್ಣು",
                    tiles: ["ಣ್ಣು", "ಹ"],
                    clue: "ಸಿಹಿಯಾದ ಮತ್ತು ಆರೋಗ್ಯಕರವಾದ ಆಹಾರ ಪದಾರ್ಥ",
                    target: ["ಹ", "ಣ್ಣು"],
                },
            ],
        },
        3: {
            oddOneOutList: [
                {
                    question: "ಇವುಗಳಲ್ಲಿ ಯಾವುದು 'ಸ್ತ್ರೀಲಿಂಗ' ಪದವಾಗಿದೆ, ಉಳಿದವು 'ಪುಲ್ಲಿಂಗ' ಪದಗಳಾಗಿವೆ?",
                    items: [
                        { id: "k1", text: "ಹುಡುಗ", detail: "ಪುಲ್ಲಿಂಗ ಪದ", isOdd: false },
                        { id: "k2", text: "ಅಪ್ಪ", detail: "ಪುಲ್ಲಿಂಗ ಪದ", isOdd: false },
                        { id: "k3", text: "ಅಣ್ಣ", detail: "ಪುಲ್ಲಿಂಗ ಪದ", isOdd: false },
                        { id: "k4", text: "ಹುಡುಗಿ", detail: "ಸ್ತ್ರೀಲಿಂಗ ಪದ", isOdd: true },
                    ],
                    reason: "'ಹುಡುಗಿ' ಸ್ತ್ರೀಲಿಂಗ ರೂಪವಾಗಿದೆ, ಉಳಿದವು ಪುಲ್ಲಿಂಗ ರೂಪಗಳಾಗಿವೆ.",
                    categoryTitle: "ಲಿಂಗಗಳು",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "ಶಾಲೆ",
                    tiles: ["ಲೆ", "ಶಾ"],
                    clue: "ನಾವು ಜ್ಞಾನ ಮತ್ತು ಪಾಠಗಳನ್ನು ಕಲಿಯುವ ಪವಿತ್ರ ಸ್ಥಳ",
                    target: ["ಶಾ", "ಲೆ"],
                },
            ],
        },
        4: {
            oddOneOutList: [
                {
                    question: "ಇವುಗಳಲ್ಲಿ ಯಾವುದು 'ಸೂರ್ಯ'ನ ಸಮಾನಾರ್ಥಕ ಪದವಲ್ಲ?",
                    items: [
                        { id: "k1", text: "ರವಿ", detail: "ಸೂರ್ಯನ ಸಮಾನಾರ್ಥಕ", isOdd: false },
                        { id: "k2", text: "ಭಾನು", detail: "ಸೂರ್ಯನ ಸಮಾನಾರ್ಥಕ", isOdd: false },
                        { id: "k3", text: "ದಿನಕರ", detail: "ಸೂರ್ಯನ ಸಮಾನಾರ್ಥಕ", isOdd: false },
                        { id: "k4", text: "ಚಂದ್ರ", detail: "ಚಂದ್ರಮ (ಬೇರೆ ಪದ)", isOdd: true },
                    ],
                    reason: "'ಚಂದ್ರ' ರಾತ್ರಿಯ ನಕ್ಷತ್ರಲೋಕದ ಚಂದ್ರಮ, ಆದರೆ ರವಿ, ಭಾನು ಮತ್ತು ದಿನಕರ ಸೂರ್ಯನ ಸಮಾನಾರ್ಥಕ ಪದಗಳು.",
                    categoryTitle: "ಸಮಾನಾರ್ಥಕ ಪದಗಳು",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "ಪುಸ್ತಕ",
                    tiles: ["ಕ", "ಪು", "ಸ್ತ"],
                    clue: "ಓದಲು ಮತ್ತು ಜ್ಞಾನ ಹೆಚ್ಚಿಸಲು ಬಳಸುವ ಗ್ರಂಥ",
                    target: ["ಪು", "ಸ್ತ", "ಕ"],
                },
            ],
        },
        5: {
            oddOneOutList: [
                {
                    question: "ಇವುಗಳಲ್ಲಿ ಯಾವುದು 'ನಾಮಪದ'ವಾಗಿದೆ, ಉಳಿದವು 'ಕ್ರಿಯಾಪದ'ಗಳಾಗಿವೆ?",
                    items: [
                        { id: "k1", text: "ಓದು", detail: "ಕ್ರಿಯಾಪದ (ಕೆಲಸ)", isOdd: false },
                        { id: "k2", text: "ಬರೆ", detail: "ಕ್ರಿಯಾಪದ (ಕೆಲಸ)", isOdd: false },
                        { id: "k3", text: "ಓಡು", detail: "ಕ್ರಿಯಾಪದ (ಕೆಲಸ)", isOdd: false },
                        { id: "k4", text: "ಮನೆ", detail: "ನಾಮಪದ (ವಸ್ತು/ಸ್ಥಳ)", isOdd: true },
                    ],
                    reason: "'ಮನೆ' ಒಂದು ನಾಮಪದ (ಸ್ಥಳ), ಆದರೆ ಓದು, ಬರೆ, ಮತ್ತು ಓಡು ಕ್ರಿಯೆಗಳನ್ನು ಸೂಚಿಸುವ ಕ್ರಿಯಾಪದಗಳು.",
                    categoryTitle: "ನಾಮಪದ ಮತ್ತು ಕ್ರಿಯಾಪದ",
                },
            ],
            sequenceBuilderList: [
                {
                    word: "ಕರ್ನಾಟಕ",
                    tiles: ["ಟಕ", "ಕರ್", "ನಾ"],
                    clue: "ನಮ್ಮ ಪ್ರೀತಿಯ ಸುಂದರ ರಾಜ್ಯ (ಕರ್ + ನಾ + ಟಕ)",
                    target: ["ಕರ್", "ನಾ", "ಟಕ"],
                },
            ],
        },
    },
};

/**
 * Generate a complete, unified 6-round multimodal assessment session with dynamic
 * question sampling, option shuffling, and randomized game round order.
 *
 * @param {number|string} classNumber (1 to 5)
 * @param {string} subject ('english', 'mathematics', 'evs', 'hindi', 'kannada')
 * @param {string} difficulty ('easy', 'medium', 'hard')
 */
export function generateAssessmentSession(classNumber, subject, difficulty = "medium") {
    const cNum = Number(classNumber) || 1;
    let sKey = String(subject).toLowerCase().trim();
    if (sKey === "gk" || sKey === "science") sKey = "evs";
    if (sKey === "maths" || sKey === "math") sKey = "mathematics";

    // Fetch verified image questions & text questions from the training module bank
    const imageQuestions = getTrainingQuestions(cNum, sKey, "image") || [];
    const textQuestions = getTrainingQuestions(cNum, sKey, "text") || [];

    // Fallbacks if fewer questions
    const safeImages = imageQuestions.length > 0 ? imageQuestions : getTrainingQuestions(1, "english", "image");
    const safeTexts = textQuestions.length > 0 ? textQuestions : getTrainingQuestions(1, "english", "text");

    // Difficulty params
    let detectiveCount = 4;
    let pairCount = 3;
    let memoryPairCount = 3;
    if (difficulty === "medium") {
        detectiveCount = 6;
        pairCount = 4;
        memoryPairCount = 4;
    } else if (difficulty === "hard") {
        detectiveCount = 8;
        pairCount = 4;
        memoryPairCount = 5;
    }

    // -------------------------------------------------------------
    // DYNAMIC ROUND 1: Picture Detective (Visual Discrimination & Search)
    // Random target selected from the image questions pool across attempts
    // -------------------------------------------------------------
    const shuffledImagePool = shuffleArray(safeImages);
    const targetQ = shuffledImagePool[0] || { concept: "Target", image: "/learning/real_photos/apple_1.jpg", question: "Find the concept" };
    const distractorCandidates = shuffledImagePool.slice(1);
    const chosenDistractors = sampleUnique(distractorCandidates, detectiveCount - 1).map((q, idx) => ({
        id: `dist_${idx}_${q.concept.toLowerCase().replace(/\s+/g, "_")}`,
        concept: q.concept,
        image: q.image,
        isTarget: false,
    }));

    const detectiveItems = shuffleArray([
        { id: `target_${targetQ.concept.toLowerCase().replace(/\s+/g, "_")}`, concept: targetQ.concept, image: targetQ.image, isTarget: true },
        ...chosenDistractors,
    ]);

    const roundDetective = {
        gameType: "picture-detective",
        gameLabel: "Picture Detective",
        skill: "Visual Discrimination & Object Recognition",
        points: 12,
        prompt: `Mission: Can you find the ${targetQ.concept.toUpperCase()} among the pictures?`,
        targetConcept: targetQ.concept,
        items: detectiveItems,
        hint: targetQ.explanation || `Look closely at each picture to spot the ${targetQ.concept}.`,
    };

    // -------------------------------------------------------------
    // DYNAMIC ROUND 2: Connect Match (Word & Picture Discovery)
    // Random subset of pairs sampled across attempts
    // -------------------------------------------------------------
    const matchSubset = sampleUnique(safeImages, pairCount);
    const leftItems = matchSubset.map((item, idx) => ({
        id: `left_${idx}`,
        matchKey: `pair_${item.concept.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
        text: item.concept,
        image: item.image,
    }));

    const rightItems = shuffleArray(
        matchSubset.map((item, idx) => ({
            id: `right_${idx}`,
            matchKey: `pair_${item.concept.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
            text: item.concept,
            subtext: item.explanation ? item.explanation.substring(0, 45) + "..." : item.concept,
        }))
    );

    const roundConnect = {
        gameType: "connect-match",
        gameLabel: "Match the Following",
        skill: "Word-to-Picture Association & Meaning",
        points: 12,
        prompt: "Tap a picture card on the left, then tap its matching word on the right!",
        leftItems,
        rightItems,
        totalPairs: pairCount,
    };

    // -------------------------------------------------------------
    // DYNAMIC ROUND 3: Sequence & Word Builder (Arrange & Build)
    // Random puzzle picked from subject sequence pool with shuffled tiles
    // -------------------------------------------------------------
    const subjectCurriculum = (categorizationCurriculum[sKey] && categorizationCurriculum[sKey][cNum])
        ? categorizationCurriculum[sKey][cNum]
        : categorizationCurriculum.english[1];

    const seqPool = subjectCurriculum.sequenceBuilderList || [subjectCurriculum.sequenceBuilder];
    const seqData = sampleUnique(seqPool, 1)[0] || seqPool[0];
    const scrambledTiles = shuffleArray(seqData.tiles);

    const roundSequence = {
        gameType: "sequence-builder",
        gameLabel: "Sequence & Word Builder",
        skill: "Phonological Sequencing & Structural Reasoning",
        points: 12,
        prompt: `Arrange the pieces in the correct order: "${seqData.clue}"`,
        targetSequence: seqData.target,
        availableTiles: scrambledTiles.map((t, idx) => ({ id: `tile_${idx}_${t}`, label: t })),
        targetWord: seqData.word,
        clue: seqData.clue,
    };

    // -------------------------------------------------------------
    // DYNAMIC ROUND 4: Memory & Recall Challenge (Working Memory)
    // Random pair pool sampled across attempts
    // -------------------------------------------------------------
    const memorySubset = sampleUnique(safeImages, memoryPairCount);
    const cardPool = [];
    memorySubset.forEach((item, idx) => {
        const memKey = `mem_${item.concept.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
        cardPool.push({
            id: `card_img_${idx}`,
            pairId: memKey,
            type: "image",
            content: item.image,
            label: item.concept,
        });
        cardPool.push({
            id: `card_txt_${idx}`,
            pairId: memKey,
            type: "text",
            content: item.concept,
            label: item.concept,
        });
    });

    const memoryCards = shuffleArray(cardPool);

    const roundMemory = {
        gameType: "memory-challenge",
        gameLabel: "Memory & Recall Challenge",
        skill: "Visual Working Memory & Conceptual Recall",
        points: 12,
        prompt: "Flip two cards to discover matching pairs! Take your time—there is no rush.",
        cards: memoryCards,
        totalPairs: memoryPairCount,
    };

    // -------------------------------------------------------------
    // DYNAMIC ROUND 5: Odd-One-Out & Categorization (Conceptual Reasoning)
    // Random puzzle picked from oddOneOut pool with shuffled choices
    // -------------------------------------------------------------
    const oddPool = subjectCurriculum.oddOneOutList || [subjectCurriculum.oddOneOut];
    const oddData = sampleUnique(oddPool, 1)[0] || oddPool[0];
    const shuffledOddItems = shuffleArray(oddData.items);

    const roundOdd = {
        gameType: "odd-one-out",
        gameLabel: "Categorization & Odd-One-Out",
        skill: "Categorization & Conceptual Discrimination",
        points: 12,
        prompt: oddData.question,
        items: shuffledOddItems,
        correctReason: oddData.reason,
        categoryTitle: oddData.categoryTitle,
    };

    // -------------------------------------------------------------
    // DYNAMIC ROUND 6: Theoretical Knowledge Challenge (Curriculum MCQ)
    // Samples 5 unique questions from all 10 available text questions
    // Shuffles answer options for each question while preserving correctAnswer
    // -------------------------------------------------------------
    const sampledTheoryQuestions = sampleUnique(safeTexts, 5);
    const selectedTheory = sampledTheoryQuestions.map((q, idx) => {
        const shuffledOptions = shuffleArray(q.options || []);
        return {
            index: idx + 1,
            id: q.id || `theory_${idx}`,
            question: q.question,
            options: shuffledOptions,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            concept: q.concept,
            topic: q.topic || "Core Curriculum",
        };
    });

    const roundTheory = {
        gameType: "theoretical-assessment",
        gameLabel: "Theoretical Knowledge Challenge",
        skill: "Curriculum Understanding & Theoretical Reasoning",
        points: 40, // 8 points per question x 5 = 40 points
        questions: selectedTheory,
        prompt: "Demonstrate your subject understanding by answering these 5 curriculum questions.",
    };

    // -------------------------------------------------------------
    // RANDOMIZE GAME ORDER WITHOUT A FIXED SEQUENCE
    // Shuffles all 6 eligible game rounds dynamically at the beginning
    // of every attempt. Theoretical test is randomized into the schedule
    // alongside all other eligible rounds without omissions or duplicates.
    // -------------------------------------------------------------
    const candidateRounds = [
        roundDetective,
        roundConnect,
        roundSequence,
        roundMemory,
        roundOdd,
        roundTheory,
    ];

    const randomizedRounds = shuffleArray(candidateRounds).map((round, idx) => ({
        ...round,
        id: `round_${idx + 1}_${round.gameType}`,
        roundIndex: idx + 1,
        title: `Round ${idx + 1}: ${round.gameLabel}`,
    }));

    return {
        classNumber: cNum,
        subject: sKey,
        difficulty,
        maxDurationSeconds: 1800, // 30 minutes
        totalRounds: 6,
        rounds: randomizedRounds,
        scoringDistribution: {
            gamePoints: 60, // 12 x 5 rounds
            theoryPoints: 40, // 8 x 5 questions
            totalPoints: 100,
        },
    };
}
