const { spawn } = require("child_process");
const path = require("path");

exports.analyzeHandwriting = (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: "Image is required",
        });
    }

    const imagePath = path.resolve(req.file.path);

    const pythonPath =
        "/Users/druvab/Desktop/db/projects/reactDL/ml/venv/bin/python";

    const pythonProcess = spawn(
        pythonPath,
        [
            "-m",
            "handwriting_analysis.inference.predictor",
            imagePath,
        ],
        {
            cwd: path.resolve(__dirname, "../../ml"),
        }
    );

    let output = "";
    let error = "";

    pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        error += data.toString();
    });

    pythonProcess.on("close", (code) => {
        if (code !== 0) {
            return res.status(500).json({
                message: "ML process failed",
                error,
            });
        }

        try {
            const result = JSON.parse(output.trim());
            return res.json(result);
        } catch (e) {
            return res.status(500).json({
                message: "Invalid JSON from predictor",
                output,
                error,
            });
        }
    });
};