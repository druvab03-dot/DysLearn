const path = require("path");
const { analyzeHandwriting } = require("../services/handwritingAnalysisService");

exports.analyzeHandwriting = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: "Image is required",
        });
    }

    try {
        const imagePath = path.resolve(req.file.path);
        const result = await analyzeHandwriting(imagePath);
        return res.json(result);
    } catch (error) {
        console.error("Handwriting analysis controller error:", error);
        return res.status(500).json({
            message: error.message || "Failed to analyze handwriting",
        });
    }
};
