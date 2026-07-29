const mongoose = require("mongoose");

const childSchema = new mongoose.Schema(
    {
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Parent",
            required: true,
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        class: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            enum: ["Below Average", "Average", "Above Average"],
            default: "Average",
        },

        handwritingSamples: [
            {
                type: String,
            },
        ],

        progress: {
            english: {
                type: Number,
                default: 0,
            },

            kannada: {
                type: Number,
                default: 0,
            },

            maths: {
                type: Number,
                default: 0,
            },

            gk: {
                type: Number,
                default: 0,
            },

            games: {
                type: Number,
                default: 0,
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Child", childSchema);