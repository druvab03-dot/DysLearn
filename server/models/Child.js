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

        class: {
            type: String,
            trim: true,
            default: "",
        },

        handwritingImage: {
            type: String,
            required: true,
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
    },
    {
        timestamps: true,
    }
);


module.exports =
    mongoose.model("Child", childSchema);