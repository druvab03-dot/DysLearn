const test = require("node:test");
const assert = require("node:assert/strict");

const {
    calculateHandwritingScore,
    calculateLearningTimeScore,
    calculateTrainingScore,
    calculateAssessmentScore,
    calculateWeightedScore,
} = require("../utils/scoreCalculator");

const {
    analyzeStudentPerformance,
} = require("../services/performanceAnalysisService");

const { sampleStudents } = require("../data/sampleTrainingData");

test("Performance Analysis Service — Component Calculations", async (t) => {
    await t.test("Handwriting score normalisation", () => {
        // Direct score
        assert.equal(calculateHandwritingScore({ score: 82 }), 82);

        // Letter counts formula: Normal*1.0, Corrected*0.5, Reversal*0.0
        const counts = { Normal: 15, Corrected: 4, Reversal: 1 };
        const scoreFromCounts = calculateHandwritingScore({ counts, totalLetters: 20 });
        // (15*1.0 + 4*0.5) / 20 = 17 / 20 = 85.0
        assert.equal(scoreFromCounts, 85.0);

        // Clamping to [0, 100]
        assert.equal(calculateHandwritingScore({ score: 150 }), 100);
        assert.equal(calculateHandwritingScore({ score: -10 }), 0);
    });

    await t.test("Learning time score — active vs idle and non-penalizing curve", () => {
        // Fast learner with focused 600 active seconds (10 min) and 0 idle seconds
        const score10Min = calculateLearningTimeScore({
            activeSeconds: 600,
            idleSeconds: 0,
            sessionsCompleted: 2,
        });
        assert.ok(score10Min >= 70, "10 minutes of active learning achieves healthy engagement score");

        // Adequate learner: 1200 active seconds (20 min)
        const score20Min = calculateLearningTimeScore({
            activeSeconds: 1200,
            idleSeconds: 120,
            sessionsCompleted: 4,
        });
        assert.ok(score20Min >= 85, "20 minutes of active learning achieves high engagement score");

        // Missing active time returns null
        assert.equal(calculateLearningTimeScore(null), null);
    });

    await t.test("Training score calculation — accuracy and attempts", () => {
        // 8 correct out of 10 attempted
        const score8of10 = calculateTrainingScore({ totalAttempted: 10, totalCorrect: 8 });
        assert.equal(score8of10, 80.0);

        // 12 correct out of 12 attempted
        const scorePerfect = calculateTrainingScore({ totalAttempted: 12, totalCorrect: 12 });
        assert.equal(scorePerfect, 100.0);

        // 0 attempted returns null
        assert.equal(calculateTrainingScore({ totalAttempted: 0, totalCorrect: 0 }), null);
    });

    await t.test("Gamified assessment score normalization", () => {
        // Valid completed assessment with score 78
        const validScore = calculateAssessmentScore({ totalScore: 78 });
        assert.equal(validScore, 78);

        // Score clamping
        assert.equal(calculateAssessmentScore({ totalScore: 110 }), 100);
        assert.equal(calculateAssessmentScore({ totalScore: -5 }), 0);

        // Missing assessment returns null
        assert.equal(calculateAssessmentScore(null), null);
    });
});

test("Performance Analysis Service — Sample Trajectories & Evidence Completeness", async (t) => {
    await t.test("evaluates Support Needed reference student", () => {
        const student = sampleStudents.supportNeededProfile;
        const analysis = analyzeStudentPerformance(student);

        assert.equal(analysis.hasSufficientEvidence, true);
        assert.ok(analysis.overallScore < 40, `Expected score < 40, got ${analysis.overallScore}`);
        assert.equal(analysis.suggestedCategory, "support_needed");
        assert.equal(analysis.suggestedCategoryLabel, "Support Needed");
    });

    await t.test("evaluates Developing reference student", () => {
        const student = sampleStudents.developingProfile;
        const analysis = analyzeStudentPerformance(student);

        assert.equal(analysis.hasSufficientEvidence, true);
        assert.ok(analysis.overallScore >= 40 && analysis.overallScore < 70, `Expected 40 <= score < 70, got ${analysis.overallScore}`);
        assert.equal(analysis.suggestedCategory, "developing");
        assert.equal(analysis.suggestedCategoryLabel, "Developing");
    });

    await t.test("evaluates Progressing Well reference student", () => {
        const student = sampleStudents.progressingWellProfile;
        const analysis = analyzeStudentPerformance(student);

        assert.equal(analysis.hasSufficientEvidence, true);
        assert.ok(analysis.overallScore >= 70, `Expected score >= 70, got ${analysis.overallScore}`);
        assert.equal(analysis.suggestedCategory, "progressing_well");
        assert.equal(analysis.suggestedCategoryLabel, "Progressing Well");
    });

    await t.test("identifies incomplete evidence without giving misleading classification", () => {
        const student = sampleStudents.incompleteEvidenceProfile;
        const analysis = analyzeStudentPerformance(student);

        assert.equal(analysis.hasSufficientEvidence, false);
        assert.equal(analysis.overallScore, null);
        assert.ok(analysis.missingComponents.includes("assessment"));
        assert.ok(analysis.missingComponents.includes("training"));
    });
});
