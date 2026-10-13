const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        identifier: {
            type: String,
            required: true,
            trim: true,
        },

        otp: {
            type: String,
            required: true,
        },

        purpose: {
            type: String,
            required: true,
            enum: [
                "login",
                "forgot-password",
                "signup-email",
                "signup-phone",
            ],
        },

        verified: {
            type: Boolean,
            default: false,
        },

        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);


// Automatically remove expired OTP records
otpSchema.index(
    {
        expiresAt: 1,
    },
    {
        expireAfterSeconds: 0,
    }
);


module.exports = mongoose.model(
    "Otp",
    otpSchema
);