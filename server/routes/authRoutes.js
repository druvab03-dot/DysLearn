const express = require("express");

const {
    registerParent,
    loginParent,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", registerParent);

router.post("/login", loginParent);

module.exports = router;