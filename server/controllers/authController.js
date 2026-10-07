const { Parent, Otp } = require("../models/dbAdapter");

const generateJWT = require("../utils/generateJWT");
const { sendOTP } = require("../services/otpService");


// ==========================================
// HELPER - Find Parent by Email or Phone
// ==========================================

const findParent = async (identifier) => {

    return await Parent.findOne({
        $or: [
            { email: identifier },
            { phone: identifier }
        ]
    });

};


// ==========================================
// HELPER - Generate OTP
// ==========================================

const generateOTP = () => {

    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();

};

// ==========================================
// HELPER - Validate Password
// ==========================================

const validatePassword = (password) => {

    const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;

    return regex.test(password);

};


// ==========================================
// REGISTER PARENT
// ==========================================

const registerParent = async (req, res) => {

    try {

        const {
            fullName,
            email,
            phone,
            password
        } = req.body;


        if (!fullName || !email || !phone || !password) {

            return res.status(400).json({
                message: "Please fill all required fields"
            });

        }

        if (!validatePassword(password)) {

             return res.status(400).json({
                 message:  "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."

              });

        }


        const emailExists = await Parent.findOne({
            email
        });


        if (emailExists) {

            return res.status(400).json({
                message: "Email already registered"
            });

        }


        const phoneExists = await Parent.findOne({
            phone
        });


        if (phoneExists) {

            return res.status(400).json({
                message: "Phone number already registered"
            });

        }


        // Check Email Verification
        const emailVerification = await Otp.findOne({

            identifier: email,

            purpose: "signup-email",

            verified: true

        });


        if (!emailVerification) {

            return res.status(400).json({
                message: "Please verify your email first"
            });

        }


        // Check Phone Verification
        const phoneVerification = await Otp.findOne({

            identifier: phone,

            purpose: "signup-phone",

            verified: true

        });


        if (!phoneVerification) {

            return res.status(400).json({
                message: "Please verify your phone number first"
            });

        }


        const parent = await Parent.create({

            fullName,
            email,
            phone,
            password

        });


        // Remove verification records after successful signup
        await Otp.deleteMany({

            $or: [

                {
                    identifier: email,
                    purpose: "signup-email"
                },

                {
                    identifier: phone,
                    purpose: "signup-phone"
                }

            ]

        });


        res.status(201).json({

            success: true,

            message: "Registration successful",

            token: generateJWT(parent._id),

            parent: {

                id: parent._id,

                fullName: parent.fullName,

                email: parent.email,

                phone: parent.phone

            }

        });


    } catch (error) {

        console.error(
            "Register Error:",
            error
        );


        res.status(500).json({
            message: error.message
        });

    }

};


// ==========================================
// SEND SIGNUP OTP
// ==========================================

const sendSignupOTP = async (req, res) => {

    try {

        const {
            identifier,
            type
        } = req.body;


        if (!identifier || !type) {

            return res.status(400).json({
                message: "Identifier and verification type are required"
            });

        }


        if (
            type !== "email" &&
            type !== "phone"
        ) {

            return res.status(400).json({
                message: "Invalid verification type"
            });

        }


        if (
            type === "email" &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
        ) {

            return res.status(400).json({
                message: "Enter a valid email address"
            });

        }


        if (
            type === "phone" &&
            !/^[0-9]{10}$/.test(identifier)
        ) {

            return res.status(400).json({
                message: "Enter a valid 10-digit phone number"
            });

        }


        if (type === "email") {

            const existingParent = await Parent.findOne({
                email: identifier
            });


            if (existingParent) {

                return res.status(400).json({
                    message: "Email already registered"
                });

            }

        }


        if (type === "phone") {

            const existingParent = await Parent.findOne({
                phone: identifier
            });


            if (existingParent) {

                return res.status(400).json({
                    message: "Phone number already registered"
                });

            }

        }


        const purpose =
            type === "email"
                ? "signup-email"
                : "signup-phone";


        const otp = generateOTP();


        await Otp.deleteMany({

            identifier,

            purpose

        });


        await Otp.create({

            identifier,

            otp,

            purpose,

            verified: false,

            expiresAt:
                new Date(
                    Date.now() +
                    5 * 60 * 1000
                )

        });


        try {

            await sendOTP(

                identifier,

                otp,

                purpose

            );

        } catch (sendError) {

            await Otp.deleteMany({

                identifier,

                purpose

            });


            throw sendError;

        }


        res.json({

            success: true,

            message:
                type === "email"
                    ? "Verification OTP sent to your email"
                    : "Verification OTP sent to your phone"

        });


    } catch (error) {

        console.error(
            "Signup OTP Error:",
            error
        );


        res.status(500).json({

            message:
                error.message ||
                "Unable to send verification OTP"

        });

    }

};


// ==========================================
// VERIFY SIGNUP OTP
// ==========================================

const verifySignupOTP = async (req, res) => {

    try {

        const {
            identifier,
            otp,
            type
        } = req.body;


        if (!identifier || !otp || !type) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }


        const purpose =
            type === "email"
                ? "signup-email"
                : type === "phone"
                ? "signup-phone"
                : null;


        if (!purpose) {

            return res.status(400).json({
                message: "Invalid verification type"
            });

        }


        const storedOTP = await Otp.findOne({

            identifier,

            purpose

        });


        if (!storedOTP) {

            return res.status(400).json({
                message: "OTP expired or not found"
            });

        }


        if (
            storedOTP.expiresAt <
            new Date()
        ) {

            await Otp.deleteOne({
                _id: storedOTP._id
            });


            return res.status(400).json({
                message: "OTP expired"
            });

        }


        if (
            storedOTP.otp !==
            otp.toString()
        ) {

            return res.status(400).json({
                message: "Invalid OTP"
            });

        }


        storedOTP.verified = true;

        await storedOTP.save();


        res.json({

            success: true,

            message:
                type === "email"
                    ? "Email verified successfully"
                    : "Phone number verified successfully"

        });


    } catch (error) {

        console.error(
            "Verify Signup OTP Error:",
            error
        );


        res.status(500).json({
            message: error.message
        });

    }

};


// ==========================================
// PASSWORD LOGIN
// ==========================================

const loginParent = async (req, res) => {

    try {

        const {
            identifier,
            password
        } = req.body;


        if (!identifier || !password) {

            return res.status(400).json({
                message: "Please enter email/phone and password"
            });

        }


        const parent =
            await findParent(identifier);


        if (!parent) {

            return res.status(401).json({
                message: "Invalid credentials"
            });

        }


        const isMatch =
            await parent.matchPassword(
                password
            );


        if (!isMatch) {

            return res.status(401).json({
                message: "Invalid credentials"
            });

        }


        res.json({

            success: true,

            message: "Login successful",

            token:
                generateJWT(parent._id),

            parent: {

                id: parent._id,

                fullName:
                    parent.fullName,

                email:
                    parent.email,

                phone:
                    parent.phone

            }

        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// ==========================================
// SEND LOGIN OTP
// ==========================================

const sendLoginOTP = async (req, res) => {

    try {

        const {
            identifier
        } = req.body;


        if (!identifier) {

            return res.status(400).json({
                message: "Enter email or phone number"
            });

        }


        const parent =
            await findParent(identifier);


        if (!parent) {

            return res.status(404).json({
                message: "Account not found"
            });

        }


        const otp =
            generateOTP();


        await Otp.deleteMany({

            identifier,

            purpose: "login"

        });


        await Otp.create({

            identifier,

            otp,

            purpose: "login",

            verified: false,

            expiresAt:
                new Date(
                    Date.now() +
                    5 * 60 * 1000
                )

        });


        try {

            await sendOTP(

                identifier,

                otp,

                "login"

            );

        } catch (sendError) {

            await Otp.deleteMany({

                identifier,

                purpose: "login"

            });


            throw sendError;

        }


        res.json({

            success: true,

            message: "OTP sent successfully"

        });


    } catch (error) {

        console.error(
            "Send Login OTP Error:",
            error
        );


        res.status(500).json({

            message:
                error.message ||
                "Unable to send OTP"

        });

    }

};


// ==========================================
// VERIFY LOGIN OTP
// ==========================================

const verifyLoginOTP = async (req, res) => {

    try {

        const {
            identifier,
            otp
        } = req.body;


        if (!identifier || !otp) {

            return res.status(400).json({
                message: "Identifier and OTP are required"
            });

        }


        const storedOTP =
            await Otp.findOne({

                identifier,

                purpose: "login"

            });


        if (!storedOTP) {

            return res.status(400).json({
                message: "OTP expired or not found"
            });

        }


        if (
            storedOTP.expiresAt <
            new Date()
        ) {

            await Otp.deleteOne({
                _id: storedOTP._id
            });


            return res.status(400).json({
                message: "OTP expired"
            });

        }


        if (
            storedOTP.otp !==
            otp.toString()
        ) {

            return res.status(400).json({
                message: "Invalid OTP"
            });

        }


        const parent =
            await findParent(identifier);


        if (!parent) {

            return res.status(404).json({
                message: "Account not found"
            });

        }


        await Otp.deleteOne({
            _id: storedOTP._id
        });


        res.json({

            success: true,

            message:
                "OTP login successful",

            token:
                generateJWT(parent._id),

            parent: {

                id:
                    parent._id,

                fullName:
                    parent.fullName,

                email:
                    parent.email,

                phone:
                    parent.phone

            }

        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// ==========================================
// SEND FORGOT PASSWORD OTP
// ==========================================

const sendForgotPasswordOTP =
async (req, res) => {

    try {

        const {
            identifier
        } = req.body;


        if (!identifier) {

            return res.status(400).json({
                message: "Enter email or phone number"
            });

        }


        const parent =
            await findParent(identifier);


        if (!parent) {

            return res.status(404).json({
                message: "Account not found"
            });

        }


        const otp =
            generateOTP();


        await Otp.deleteMany({

            identifier,

            purpose:
                "forgot-password"

        });


        await Otp.create({

            identifier,

            otp,

            purpose:
                "forgot-password",

            verified: false,

            expiresAt:
                new Date(
                    Date.now() +
                    5 * 60 * 1000
                )

        });


        try {

            await sendOTP(

                identifier,

                otp,

                "forgot-password"

            );

        } catch (sendError) {

            await Otp.deleteMany({

                identifier,

                purpose:
                    "forgot-password"

            });


            throw sendError;

        }


        res.json({

            success: true,

            message:
                "Password reset OTP sent successfully"

        });


    } catch (error) {

        console.error(
            "Forgot Password OTP Error:",
            error
        );


        res.status(500).json({

            message:
                error.message ||
                "Unable to send OTP"

        });

    }

};


// ==========================================
// RESET PASSWORD
// ==========================================

const resetPassword = async (req, res) => {

    try {

        const {
            identifier,
            otp,
            newPassword
        } = req.body;


        if (
            !identifier ||
            !otp ||
            !newPassword
        ) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }
        if (!validatePassword(newPassword)) {

            return res.status(400).json({
                message:"Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."

            });

        }


        const storedOTP =
            await Otp.findOne({

                identifier,

                purpose:
                    "forgot-password"

            });


        if (!storedOTP) {

            return res.status(400).json({
                message: "OTP expired or not found"
            });

        }


        if (
            storedOTP.expiresAt <
            new Date()
        ) {

            await Otp.deleteOne({
                _id: storedOTP._id
            });


            return res.status(400).json({
                message: "OTP expired"
            });

        }


        if (
            storedOTP.otp !==
            otp.toString()
        ) {

            return res.status(400).json({
                message: "Invalid OTP"
            });

        }


        const parent =
            await findParent(identifier);


        if (!parent) {

            return res.status(404).json({
                message: "Account not found"
            });

        }


        parent.password =
            newPassword;


        await parent.save();


        await Otp.deleteOne({
            _id: storedOTP._id
        });


        res.json({

            success: true,

            message:
                "Password updated successfully"

        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
// ==========================================
// GET CURRENT LOGGED-IN PARENT
// ==========================================

const getCurrentParent = async (req, res) => {

    try {

        const parent = req.parent;

        res.json({

            success: true,

            parent: {

                id: parent._id,

                fullName: parent.fullName,

                email: parent.email,

                phone: parent.phone

            }

        });

    } catch (error) {

        res.status(500).json({
            message: "Unable to load user"
        });

    }

};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {

    registerParent,

    sendSignupOTP,

    verifySignupOTP,

    loginParent,

    sendLoginOTP,

    verifyLoginOTP,

    sendForgotPasswordOTP,

    resetPassword,

    getCurrentParent

};