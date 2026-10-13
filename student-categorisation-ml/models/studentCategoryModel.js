let mongoose;
try {
    mongoose = require("mongoose");
} catch (err) {
    mongoose = require("../../server/node_modules/mongoose");
}
const { CATEGORIES } = require("../config/categorisationConfig");

const studentCategorySchema = new mongoose.Schema(
    {
        child: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Child",
            required: true,
            index: true,
        },

        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Parent",
            required: true,
            index: true,
        },

        category: {
            type: String,
            enum: Object.values(CATEGORIES),
            required: true,
        },

        categoryLabel: {
            type: String,
            required: true,
        },

        categorisationType: {
            type: String,
            enum: ["initial", "reassessment"],
            required: true,
        },

        categorisationScore: {
            type: Number,
            min: 0,
            max: 100,
            default: null,
        },

        weights: {
            handwriting: { type: Number, default: 0.30 },
            learningTime: { type: Number, default: 0.10 },
            training: { type: Number, default: 0.30 },
            assessment: { type: Number, default: 0.30 },
        },

        componentScores: {
            handwriting: { type: Number, default: null },
            learningTime: { type: Number, default: null },
            training: { type: Number, default: null },
            assessment: { type: Number, default: null },
        },

        rawMetrics: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },

        reason: {
            type: String,
            required: true,
        },

        previousCategory: {
            type: String,
            default: null,
        },

        learningCycleIndex: {
            type: Number,
            default: 1,
        },

        isEvidenceComplete: {
            type: Boolean,
            default: true,
        },

        evaluatedAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for fast student timeline retrieval
studentCategorySchema.index({ child: 1, evaluatedAt: -1 });

module.exports = mongoose.model("StudentCategory", studentCategorySchema);
