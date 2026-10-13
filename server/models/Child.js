const mongoose = require("mongoose");


const childSchema = new mongoose.Schema(
    {
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Parent",
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        classNumber: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        handwritingImage: {
            type: String,
            default: null,
        },

        analysisReportPdf: {
            type: String,
            default: null,
        },

        learningLevel: {
            type: String,
            enum: [
                "below-average",
                "average",
                "above-average",
            ],
            default: null,
        },

        handwritingAnalyzed: {
            type: Boolean,
            default: false,
        },

        latestAnalysis: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AnalysisResult",
            default: null,
        },

        analysisResults: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "AnalysisResult",
            },
        ],

        latestAssessment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AssessmentResult",
            default: null,
        },

        assessmentResults: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "AssessmentResult",
            },
        ],

        // Student Categorisation Model fields
        category: {
            type: String,
            enum: ["support_needed", "developing", "progressing_well", null],
            default: null,
        },

        categoryLabel: {
            type: String,
            default: null,
        },

        categorisationType: {
            type: String,
            enum: ["initial_handwriting", "learning_cycle", null],
            default: null,
        },

        categorisationScore: {
            type: Number,
            default: null,
        },

        componentScores: {
            handwriting: { type: Number, default: null },
            learningTime: { type: Number, default: null },
            training: { type: Number, default: null },
            assessment: { type: Number, default: null },
        },

        categoryReason: {
            type: String,
            default: null,
        },

        lastCategorisationDate: {
            type: Date,
            default: null,
        },

        learningCyclesCompleted: {
            type: Number,
            default: 0,
        },

        learningTimeStats: {
            totalSeconds: { type: Number, default: 0 },
            activeSeconds: { type: Number, default: 0 },
            idleSeconds: { type: Number, default: 0 },
            sessionsCompleted: { type: Number, default: 0 },
            lastSessionDate: { type: Date, default: null },
        },

        trainingStats: {
            totalAttempted: { type: Number, default: 0 },
            totalCorrect: { type: Number, default: 0 },
            sessionsCompleted: { type: Number, default: 0 },
            lastSessionDate: { type: Date, default: null },
        },

        categoryHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "StudentCategory",
            },
        ],
    },
    {
        timestamps: true,
    }
);


module.exports =
    mongoose.model("Child", childSchema);