const express = require("express");
const multer = require("multer");
const path = require("path");

const { analyzeHandwriting } = require("../controllers/analysisController");

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, Date.now() + ext);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, JPEG, and PNG images are allowed"));
    }
};

const upload = multer({
    storage,
    fileFilter,
});

router.get("/test", (req, res) => {
    res.json({
        message: "Analysis route working",
    });
});

router.post(
    "/handwriting",
    upload.single("image"),
    analyzeHandwriting
);

module.exports = router;