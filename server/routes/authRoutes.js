const express = require("express");

const {
    registerParent,
    sendSignupOTP,
    verifySignupOTP,

    loginParent,
    sendLoginOTP,
    verifyLoginOTP,

    sendForgotPasswordOTP,
    resetPassword,

    getCurrentParent,
} = require("../controllers/authController");


const {
    protect,
} = require("../middleware/authMiddleware");


const router = express.Router();


// ==========================================
// SIGNUP
// ==========================================

router.post(
    "/signup",
    registerParent
);


router.post(
    "/signup/send-otp",
    sendSignupOTP
);


router.post(
    "/signup/verify-otp",
    verifySignupOTP
);


// ==========================================
// LOGIN
// ==========================================

router.post(
    "/login",
    loginParent
);


router.post(
    "/send-login-otp",
    sendLoginOTP
);


router.post(
    "/verify-login-otp",
    verifyLoginOTP
);


// ==========================================
// FORGOT PASSWORD
// ==========================================

router.post(
    "/forgot-password/send-otp",
    sendForgotPasswordOTP
);


router.post(
    "/forgot-password/reset",
    resetPassword
);


// ==========================================
// AUTHENTICATED PARENT
// ==========================================

router.get(
    "/me",
    protect,
    getCurrentParent
);


module.exports = router;