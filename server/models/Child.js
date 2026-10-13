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
    },
    {
        timestamps: true,
    }
);


module.exports =
    mongoose.model("Child", childSchema);