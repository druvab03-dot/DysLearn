const mongoose = require("mongoose");

const assessmentResultSchema = new mongoose.Schema(
    {
        child: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Child",
            default: null,
            index: true,
        },

        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Parent",
            default: null,
            index: true,
        },

        sessionId: {
            type: String,
            required: true,
            index: true,
        },

        classNumber: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        subject: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            default: "medium",
        },

        totalScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },

        percentage: {
            type: Number,
            default: 0,
        },

        studentName: {
            type: String,
            default: "Student",
        },

        totalAttempted: {
            type: Number,
            default: 0,
        },

        totalCorrect: {
            type: Number,
            default: 0,
        },

        totalIncorrect: {
            type: Number,
            default: 0,
        },

        totalUnanswered: {
            type: Number,
            default: 0,
        },

        gameScore: {
            type: Number,
            required: true,
            min: 0,
            max: 60,
        },

        theoryScore: {
            type: Number,
            required: true,
            min: 0,
            max: 40,
        },

        durationSeconds: {
            type: Number,
            required: true,
            default: 0,
        },

        maxDurationSeconds: {
            type: Number,
            default: 1800, // 30 minutes maximum authoritative limit
        },

        startedAt: {
            type: Date,
            required: true,
        },

        submittedAt: {
            type: Date,
            default: Date.now,
        },

        isExpired: {
            type: Boolean,
            default: false,
        },

        roundsCompleted: {
            type: Number,
            default: 0,
        },

        totalRounds: {
            type: Number,
            default: 0,
        },

        gameBreakdown: [
            {
                roundIndex: { type: Number },
                gameType: { type: String },
                title: { type: String },
                skill: { type: String },
                score: { type: Number },
                maxScore: { type: Number },
                details: { type: mongoose.Schema.Types.Mixed },
            },
        ],

        conceptsMastered: [
            {
                type: String,
            },
        ],

        conceptsToPractice: [
            {
                type: String,
            },
        ],

        practiceRecommendations: [
            {
                type: String,
            },
        ],

        feedbackMessage: {
            type: String,
            default: "",
        },

        clientMetadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("AssessmentResult", assessmentResultSchema);
