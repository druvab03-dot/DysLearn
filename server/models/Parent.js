const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const parentSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        profilePhoto: {
            type: String,
            default: "",
        },

        children: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Child",
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
// Hash password before saving
parentSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password during login
parentSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Parent", parentSchema);