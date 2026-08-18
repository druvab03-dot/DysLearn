const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { execFile } = require("child_process");


const executeFile = promisify(
    execFile
);


const projectRoot =
    path.resolve(
        __dirname,
        "../.."
    );


const pythonExecutable =
    process.env.HANDWRITING_PYTHON ||
    path.join(
        projectRoot,
        "ml",
        "venv",
        "bin",
        "python"
    );


const readResult = (
    output
) => {

    const lines =
        output
            .trim()
            .split("\n")
            .reverse();


    for (const line of lines) {

        try {

            return JSON.parse(line);

        } catch {

            // TensorFlow may emit informational lines before the JSON result.

        }

    }


    throw new Error(
        "The handwriting model returned an invalid result"
    );

};


const analyzeHandwriting = async (
    imagePath
) => {

    if (!fs.existsSync(pythonExecutable)) {

        const error = new Error(
            "Handwriting analysis runtime is not available"
        );

        error.code = "MODEL_UNAVAILABLE";

        throw error;

    }


    try {

        const { stdout } =
            await executeFile(
                pythonExecutable,
                [
                    "-m",
                    "ml.handwriting_analysis.inference.predictor",
                    imagePath,
                ],
                {
                    cwd: projectRoot,
                    env: {
                        ...process.env,
                        TF_CPP_MIN_LOG_LEVEL: "2",
                        KERAS_HOME: path.join(projectRoot, "ml", ".keras"),
                        MPLCONFIGDIR: path.join(projectRoot, "ml", ".matplotlib"),
                        HF_HOME: path.join(projectRoot, "ml", ".hf"),
                    },
                    timeout: 120000,
                    maxBuffer: 1024 * 1024,
                }
            );


        return readResult(
            stdout
        );


    } catch (error) {

        if (
            error.code ===
            "MODEL_UNAVAILABLE"
        ) {

            throw error;

        }


        const modelError = new Error(
            "Handwriting model is not ready. Train the model before analysis."
        );

        modelError.code =
            "MODEL_NOT_READY";


        throw modelError;

    }

};


module.exports = {
    analyzeHandwriting,
};
