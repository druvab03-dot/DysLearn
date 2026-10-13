const test = require("node:test");
const assert = require("node:assert/strict");

const {
    selectPersonalisedCards,
    selectPersonalisedTrainingQuestions,
    getPersonalisedAssessmentDifficulty,
} = require("../services/personalisedLearningService");

const categorisationConfig = require("../config/categorisationConfig");

// Mock 8-card standard concept (cards 0..3 visual, cards 4..7 typography)
function createMockConceptCards() {
    return [
        { id: "v1", cardType: "visual", heading: "Visual Card 1", image: "/img1.jpg" },
        { id: "v2", cardType: "visual", heading: "Visual Card 2", image: "/img2.jpg" },
        { id: "v3", cardType: "visual", heading: "Visual Card 3", image: "/img3.jpg" },
        { id: "v4", cardType: "visual", heading: "Visual Card 4", image: "/img4.jpg" },
        { id: "t1", cardType: "typography", heading: "Text Card 1", text: "Text content 1" },
        { id: "t2", cardType: "typography", heading: "Text Card 2", text: "Text content 2" },
        { id: "t3", cardType: "typography", heading: "Text Card 3", text: "Text content 3" },
        { id: "t4", cardType: "typography", heading: "Text Card 4", text: "Text content 4" },
    ];
}

test("Personalised Learning — Exactly 4 cards per concept", async (t) => {
    const mockCards = createMockConceptCards();

    await t.test("Support Needed receives exactly 3 visual cards and 1 text card (total: 4)", () => {
        const cards = selectPersonalisedCards(mockCards, "support_needed");

        assert.equal(cards.length, 4, "Must receive exactly 4 cards");
        const visual = cards.filter((c) => c.cardType === "visual");
        const text = cards.filter((c) => c.cardType === "typography");

        assert.equal(visual.length, 3, "Must have 3 visual cards");
        assert.equal(text.length, 1, "Must have 1 text card");
    });

    await t.test("Developing receives exactly 2 visual cards and 2 text cards (total: 4)", () => {
        const cards = selectPersonalisedCards(mockCards, "developing");

        assert.equal(cards.length, 4, "Must receive exactly 4 cards");
        const visual = cards.filter((c) => c.cardType === "visual");
        const text = cards.filter((c) => c.cardType === "typography");

        assert.equal(visual.length, 2, "Must have 2 visual cards");
        assert.equal(text.length, 2, "Must have 2 text cards");
    });

    await t.test("Progressing Well receives exactly 1 visual card and 3 text cards (total: 4)", () => {
        const cards = selectPersonalisedCards(mockCards, "progressing_well");

        assert.equal(cards.length, 4, "Must receive exactly 4 cards");
        const visual = cards.filter((c) => c.cardType === "visual");
        const text = cards.filter((c) => c.cardType === "typography");

        assert.equal(visual.length, 1, "Must have 1 visual card");
        assert.equal(text.length, 3, "Must have 3 text cards");
    });

    await t.test("Card selection preserves educational content and contains no duplicates", () => {
        ["support_needed", "developing", "progressing_well"].forEach((category) => {
            const cards = selectPersonalisedCards(mockCards, category);
            const ids = cards.map((c) => c.id);
            const uniqueIds = new Set(ids);
            assert.equal(ids.length, uniqueIds.size, `Category ${category} must not contain duplicate cards`);
        });
    });

    await t.test("Safe fallback: handles limited cards gracefully without breaking", () => {
        const limitedCards = [
            { id: "v1", cardType: "visual", heading: "Card 1" },
            { id: "t1", cardType: "typography", heading: "Card 2" },
        ];
        const result = selectPersonalisedCards(limitedCards, "developing");
        assert.ok(result.length <= 4);
    });
});

test("Personalised Training Module — Category Question Counts and Content Mix", async (t) => {
    // Mock 20 questions (10 image, 10 text)
    const mockImageQuestions = Array.from({ length: 10 }, (_, i) => ({
        id: `img_${i + 1}`,
        type: "image",
        question: `Image Q ${i + 1}`,
    }));
    const mockTextQuestions = Array.from({ length: 10 }, (_, i) => ({
        id: `txt_${i + 1}`,
        type: "text",
        question: `Text Q ${i + 1}`,
    }));

    await t.test("Support Needed receives 20 questions with visual priority", () => {
        const questions = selectPersonalisedTrainingQuestions(
            mockImageQuestions,
            mockTextQuestions,
            "support_needed"
        );
        assert.equal(questions.length, 20, "Support Needed must receive 20 questions");
        const imageCount = questions.filter((q) => q.type === "image").length;
        assert.ok(imageCount >= 10, "Visual questions must be prioritized");
    });

    await t.test("Developing receives 12 questions with balanced mix", () => {
        const questions = selectPersonalisedTrainingQuestions(
            mockImageQuestions,
            mockTextQuestions,
            "developing"
        );
        assert.equal(questions.length, 12, "Developing must receive 12 questions");
        const imageCount = questions.filter((q) => q.type === "image").length;
        const textCount = questions.filter((q) => q.type === "text").length;
        assert.equal(imageCount, 6, "Must receive 6 image questions");
        assert.equal(textCount, 6, "Must receive 6 text questions");
    });

    await t.test("Progressing Well receives 8 questions with text priority", () => {
        const questions = selectPersonalisedTrainingQuestions(
            mockImageQuestions,
            mockTextQuestions,
            "progressing_well"
        );
        assert.equal(questions.length, 8, "Progressing Well must receive 8 questions");
        const textCount = questions.filter((q) => q.type === "text").length;
        assert.ok(textCount >= 6, "Text questions must be prioritized");
    });
});

test("Personalised Gamified Assessment — Difficulty Mapping", async (t) => {
    await t.test("Support Needed maps to easy difficulty", () => {
        assert.equal(getPersonalisedAssessmentDifficulty("support_needed"), "easy");
    });

    await t.test("Developing maps to medium difficulty", () => {
        assert.equal(getPersonalisedAssessmentDifficulty("developing"), "medium");
    });

    await t.test("Progressing Well maps to hard difficulty", () => {
        assert.equal(getPersonalisedAssessmentDifficulty("progressing_well"), "hard");
    });

    await t.test("Defaults to medium if category unassigned", () => {
        assert.equal(getPersonalisedAssessmentDifficulty(null), "medium");
        assert.equal(getPersonalisedAssessmentDifficulty(undefined), "medium");
        assert.equal(getPersonalisedAssessmentDifficulty("unknown"), "medium");
    });
});
