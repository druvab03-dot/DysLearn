const test = require("node:test");
const assert = require("node:assert/strict");

const {
    calculateWeightedScore,
    calculateHandwritingScore,
    calculateLearningTimeScore,
    calculateTrainingScore,
    calculateAssessmentScore,
} = require("../utils/scoreCalculator");

const {
    assignInitialCategoryFromHandwriting,
    determineCategoryFromOverallScore,
} = require("../utils/categoryRules");

const categorisationConfig = require("../config/categorisationConfig");
const { sampleStudents } = require("../data/sampleTrainingData");

test("Initial categorisation — handwriting analysis only", async (t) => {
    await t.test("assigns Support Needed for low handwriting score (0-49)", () => {
        const result = assignInitialCategoryFromHandwriting(35);
        assert.equal(result.category, "support_needed");
        assert.equal(result.categoryLabel, "Support Needed");
    });

    await t.test("assigns Developing for medium handwriting score (50-74)", () => {
        const result = assignInitialCategoryFromHandwriting(58);
        assert.equal(result.category, "developing");
        assert.equal(result.categoryLabel, "Developing");
    });

    await t.test("assigns Progressing Well for high handwriting score (75-100)", () => {
        const result = assignInitialCategoryFromHandwriting(88);
        assert.equal(result.category, "progressing_well");
        assert.equal(result.categoryLabel, "Progressing Well");
    });

    await t.test("handles missing or invalid handwriting score gracefully", () => {
        const resNull = assignInitialCategoryFromHandwriting(null);
        assert.equal(resNull.category, null);
        assert.equal(resNull.categoryLabel, "Pending Analysis");

        const resUndef = assignInitialCategoryFromHandwriting(undefined);
        assert.equal(resUndef.category, null);

        const resNaN = assignInitialCategoryFromHandwriting(NaN);
        assert.equal(resNaN.category, null);
    });

    await t.test("validates boundary values for initial thresholds", () => {
        // Boundary 50: Developing
        assert.equal(assignInitialCategoryFromHandwriting(49.9).category, "support_needed");
        assert.equal(assignInitialCategoryFromHandwriting(50.0).category, "developing");

        // Boundary 75: Progressing Well
        assert.equal(assignInitialCategoryFromHandwriting(74.9).category, "developing");
        assert.equal(assignInitialCategoryFromHandwriting(75.0).category, "progressing_well");
    });
});

test("Re-categorisation weighted scoring model (30% + 10% + 30% + 30%)", async (t) => {
    const weights = categorisationConfig.COMPONENT_WEIGHTS;

    await t.test("weights strictly equal 0.30, 0.10, 0.30, 0.30 and sum to 1.00", () => {
        assert.equal(weights.handwriting, 0.30);
        assert.equal(weights.learningTime, 0.10);
        assert.equal(weights.training, 0.30);
        assert.equal(weights.assessment, 0.30);

        const sum = weights.handwriting + weights.learningTime + weights.training + weights.assessment;
        assert.equal(Math.round(sum * 100) / 100, 1.00);
    });

    await t.test("calculates exact overall score with all 4 components", () => {
        // 50*0.30 + 80*0.10 + 60*0.30 + 70*0.30 = 15 + 8 + 18 + 21 = 62.0
        const score = calculateWeightedScore({
            handwriting: 50,
            learningTime: 80,
            training: 60,
            assessment: 70,
        });
        assert.equal(score, 62.0);
    });

    await t.test("re-assessment threshold boundaries (0-39, 40-69, 70-100)", () => {
        // Support Needed: 0–39
        assert.equal(determineCategoryFromOverallScore(0).category, "support_needed");
        assert.equal(determineCategoryFromOverallScore(39.9).category, "support_needed");

        // Developing: 40–69 (Boundary exactly 40.0)
        assert.equal(determineCategoryFromOverallScore(40.0).category, "developing");
        assert.equal(determineCategoryFromOverallScore(55).category, "developing");
        assert.equal(determineCategoryFromOverallScore(69.9).category, "developing");

        // Progressing Well: 70–100 (Boundary exactly 70.0)
        assert.equal(determineCategoryFromOverallScore(70.0).category, "progressing_well");
        assert.equal(determineCategoryFromOverallScore(85).category, "progressing_well");
        assert.equal(determineCategoryFromOverallScore(100).category, "progressing_well");
    });

    await t.test("missing data does not produce misleading final score or category", () => {
        // Missing assessment
        const partial1 = calculateWeightedScore({
            handwriting: 60,
            learningTime: 70,
            training: 80,
            assessment: null,
        });
        assert.equal(partial1, null);

        // Missing training
        const partial2 = calculateWeightedScore({
            handwriting: 60,
            learningTime: 70,
            training: undefined,
            assessment: 80,
        });
        assert.equal(partial2, null);

        // Missing learning time
        const partial3 = calculateWeightedScore({
            handwriting: 60,
            learningTime: null,
            training: 80,
            assessment: 80,
        });
        assert.equal(partial3, null);
    });
});
