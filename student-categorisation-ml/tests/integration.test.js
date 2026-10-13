const test = require("node:test");
const assert = require("node:assert/strict");

const {
    generateHtmlReport,
} = require("../services/reportGenerationService");

const {
    validateLearningTimePayload,
    validateTrainingPayload,
    isValidObjectId,
} = require("../utils/dataValidation");

test("Integration & Reporting — Comprehensive Performance Report (13 Requirements)", async (t) => {
    const mockReportData = {
        studentId: "64f1234567890abcdef12345",
        studentName: "Aarav Sharma",
        classNumber: 2,
        generatedAt: new Date().toISOString(),
        reportingPeriod: "Current Term",
        currentCategory: "developing",
        currentCategoryLabel: "Developing",
        categorisationType: "learning_cycle",
        categorisationMethod: "Comprehensive Multi-Component Learning Cycle Analysis",
        initialCategory: "support_needed",
        initialCategoryLabel: "Support Needed",
        initialHandwritingDate: "2026-10-01",
        isEvidenceComplete: true,
        overallScore: 58.5,
        componentScores: {
            handwriting: 60.0,
            learningTime: 75.0,
            training: 55.0,
            assessment: 55.0,
        },
        weights: {
            handwriting: 0.30,
            learningTime: 0.10,
            training: 0.30,
            assessment: 0.30,
        },
        learningCyclesCompleted: 2,
        learningTimeStats: {
            totalMinutes: 25,
            activeMinutes: 22,
            sessionsCompleted: 4,
            averageEngagementScore: 75.0,
        },
        trainingStats: {
            totalAttempted: 24,
            totalCorrect: 16,
            sessionsCompleted: 2,
            accuracyPercentage: 66.7,
        },
        latestAssessment: {
            totalScore: 55,
            difficulty: "medium",
            isExpired: false,
            roundsCompleted: 6,
            totalRounds: 6,
            gameScore: 33,
            theoryScore: 22,
        },
        conceptInsights: {
            strengths: ["Visual Letter Discrimination", "Phonetic Sound Matching"],
            conceptsToPractice: ["Consonant Digraphs", "Multi-digit Addition"],
        },
        categoryHistory: [
            {
                category: "support_needed",
                categoryLabel: "Support Needed",
                evaluatedAt: "2026-10-01",
                categorisationType: "initial",
                score: 38.0,
            },
            {
                category: "developing",
                categoryLabel: "Developing",
                evaluatedAt: "2026-10-13",
                categorisationType: "reassessment",
                score: 58.5,
            },
        ],
        recommendations: [
            "Continue balanced visual and typography exercises.",
            "Practice consonant digraphs with interactive games.",
        ],
        supportiveSummary:
            "Aarav demonstrates encouraging progress and strong learning enthusiasm across interactive sessions.",
    };

    await t.test("HTML report generator includes student details and all 13 points", () => {
        const html = generateHtmlReport(mockReportData);

        // Point 1: Student name and class
        assert.ok(html.includes("Aarav Sharma"));
        assert.ok(html.includes("Class 2"));

        // Point 2: Generation date
        assert.ok(html.includes("Report Date"));

        // Point 3 & 4: Categories
        assert.ok(html.includes("Developing"));
        assert.ok(html.includes("Support Needed"));

        // Point 5 & 6: Scores & weights
        assert.ok(html.includes("58.5"));
        assert.ok(html.includes("Composite Score / 100"));
        assert.ok(html.includes("30%"));
        assert.ok(html.includes("10%"));

        // Point 7: Learning cycles
        assert.ok(html.includes("Learning Cycles"));

        // Point 8 & 9: Activity summary & Gamified assessment
        assert.ok(html.includes("55"));

        // Point 10 & 11: Strengths, practice & history
        assert.ok(html.includes("Visual Letter Discrimination"));
        assert.ok(html.includes("Consonant Digraphs"));
        assert.ok(html.includes("Category Progression History"));

        // Point 12 & 13: Recommendations & supportive summary
        assert.ok(html.includes("Continue balanced visual"));
        assert.ok(html.includes("educational personalisation indicator"));
    });

    await t.test("Validates ObjectId, learning time payload, and training payload", () => {
        // Valid ObjectId
        assert.equal(isValidObjectId("64f1234567890abcdef12345"), true);
        assert.equal(isValidObjectId("invalid-id"), false);

        // Learning time validation
        const validTime = validateLearningTimePayload({
            childId: "64f1234567890abcdef12345",
            activeSeconds: 120,
            idleSeconds: 10,
        });
        assert.equal(validTime.isValid, true);

        const invalidTime = validateLearningTimePayload({
            childId: "bad-id",
            activeSeconds: -5,
        });
        assert.equal(invalidTime.isValid, false);

        // Training validation
        const validTrain = validateTrainingPayload({
            childId: "64f1234567890abcdef12345",
            totalAttempted: 10,
            totalCorrect: 8,
        });
        assert.equal(validTrain.isValid, true);

        const invalidTrain = validateTrainingPayload({
            childId: "64f1234567890abcdef12345",
            totalAttempted: 5,
            totalCorrect: 10, // More correct than attempted is invalid
        });
        assert.equal(invalidTrain.isValid, false);
    });
});
