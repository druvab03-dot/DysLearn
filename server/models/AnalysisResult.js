const mongoose = require("mongoose");

const analysisResultSchema = new mongoose.Schema(
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

        uploadId: {
            type: String,
            required: true,
        },

        classNumber: {
            type: Number,
            required: true,
        },

        handwritingImage: {
            type: String,
            default: null,
        },

        pdfUrl: {
            type: String,
            default: null,
        },

        category: {
            type: String,
            default: null,
        },

        score: {
            type: Number,
            default: null,
        },

        totalLetters: {
            type: Number,
            default: 0,
        },

        counts: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },

        details: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },

        status: {
            type: String,
            enum: ["completed", "failed"],
            default: "completed",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("AnalysisResult", analysisResultSchema);
