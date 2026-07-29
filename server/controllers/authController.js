const Parent = require("../models/Parent");
const generateJWT = require("../utils/generateJWT");

// Register Parent
const registerParent = async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;

        if (!fullName || !email || !phone || !password) {
            return res.status(400).json({
                message: "Please fill all required fields",
            });
        }

        const emailExists = await Parent.findOne({ email });

        if (emailExists) {
            return res.status(400).json({
                message: "Email already registered",
            });
        }

        const phoneExists = await Parent.findOne({ phone });

        if (phoneExists) {
            return res.status(400).json({
                message: "Phone number already registered",
            });
        }

        const parent = await Parent.create({
            fullName,
            email,
            phone,
            password,
        });

        res.status(201).json({
            success: true,
            message: "Registration successful",
            token: generateJWT(parent._id),
            parent: {
                id: parent._id,
                fullName: parent.fullName,
                email: parent.email,
                phone: parent.phone,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Login Parent
const loginParent = async (req, res) => {
    try {
        const { email, password } = req.body;

        const parent = await Parent.findOne({ email });

        if (!parent) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const isMatch = await parent.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            token: generateJWT(parent._id),
            parent: {
                id: parent._id,
                fullName: parent.fullName,
                email: parent.email,
                phone: parent.phone,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    registerParent,
    loginParent,
};