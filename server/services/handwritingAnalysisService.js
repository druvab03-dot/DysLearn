const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { execFile } = require("child_process");

const executeFile = promisify(execFile);

const projectRoot = path.resolve(__dirname, "../..");
const handwritingAnalysisDir = path.join(projectRoot, "handwriting_analysis");

const pythonExecutable =
    process.env.HANDWRITING_PYTHON ||
    path.join(handwritingAnalysisDir, ".venv", "bin", "python");

const modelPath =
    process.env.HANDWRITING_MODEL_PATH ||
    path.join(handwritingAnalysisDir, "artifacts", "best_model.pt");

const PIPELINE_TIMEOUT_MS = 180000;

const runPipelineStep = async (scriptName, args, stepName) => {
    try {
        const fullArgs = [path.join(handwritingAnalysisDir, scriptName), ...args];
        await executeFile(pythonExecutable, fullArgs, {
            cwd: handwritingAnalysisDir,
            timeout: PIPELINE_TIMEOUT_MS,
            maxBuffer: 10 * 1024 * 1024,
        });
    } catch (error) {
        const details = (error.stdout || "") + "\n" + (error.stderr || "") + "\n" + (error.message || "");
        const cleanDetails = details.trim().slice(-1500);
        throw new Error(`${stepName} failed: ${cleanDetails}`);
    }
};

const analyzeHandwriting = async (imagePath, classNumber = 1) => {
    if (!fs.existsSync(pythonExecutable)) {
        const error = new Error("Handwriting analysis runtime is not available.");
        error.code = "MODEL_UNAVAILABLE";
        throw error;
    }

    if (!fs.existsSync(modelPath)) {
        const error = new Error("Handwriting analysis model weights not found.");
        error.code = "MODEL_NOT_READY";
        throw error;
    }

    const classNum = parseInt(classNumber, 10);
    if (![1, 2, 3, 4, 5].includes(classNum)) {
        throw new Error("Invalid class number. Must be between 1 and 5.");
    }

    const uploadId = Date.now() + "_" + Math.round(Math.random() * 1e9);
    const jobDir = path.join(handwritingAnalysisDir, "results", uploadId);
    fs.mkdirSync(jobDir, { recursive: true });

    const processedDir = path.join(jobDir, "processed");
    const wordsDir = path.join(processedDir, "words_v2");
    const charactersDir = path.join(processedDir, "characters_v2");
    const gradcamDir = path.join(jobDir, "gradcam");
    const reportTxt = path.join(jobDir, "handwriting_report.txt");
    const reportHtml = path.join(jobDir, "handwriting_result_sheet.html");
    const reportJson = path.join(jobDir, "analysis.json");
    const reportPdf = path.join(jobDir, "handwriting_gradcam_report.pdf");

    try {
        // Step 1: Preprocessing
        await runPipelineStep("page_preprocess.py", [
            "--image", imagePath,
            "--output_dir", processedDir,
        ], "Image preprocessing");

        const linesDir = path.join(processedDir, "lines");
        if (!fs.existsSync(linesDir) || fs.readdirSync(linesDir).filter(f => f.startsWith("line_")).length === 0) {
            throw new Error("No handwriting lines were detected. Please upload a clear photo showing the full passage.");
        }

        // Step 2: Word segmentation
        await runPipelineStep("word_segment.py", [
            "--line_dir", linesDir,
            "--output_dir", wordsDir,
        ], "Word segmentation");

        // Step 3: Character segmentation
        await runPipelineStep("character_segment_v2.py", [
            "--word_dir", wordsDir,
            "--output_dir", charactersDir,
            "--class_number", String(classNum),
        ], "Character segmentation");

        // Step 4: Classification and Grad-CAM
        await runPipelineStep("predict_page.py", [
            "--characters", charactersDir,
            "--model", modelPath,
            "--report", reportTxt,
            "--html-report", reportHtml,
            "--gradcam-dir", gradcamDir,
            "--json-report", reportJson,
        ], "Classification and Grad-CAM");

        // Step 5: PDF Generation
        await runPipelineStep("pdf_result.py", [
            "--json", reportJson,
            "--output", reportPdf,
            "--class-number", String(classNum),
            "--upload-id", uploadId,
            "--source-image", imagePath,
            "--words-dir", wordsDir,
            "--logo", path.join(handwritingAnalysisDir, "dyslearn_logo.png"),
            "--characters-dir", charactersDir,
        ], "PDF report generation");

        if (!fs.existsSync(reportPdf) || fs.statSync(reportPdf).size === 0) {
            throw new Error("Analysis completed, but the PDF report could not be generated.");
        }

        // Copy generated PDF to server's public reports folder
        const serverReportsDir = path.join(__dirname, "..", "uploads", "reports");
        fs.mkdirSync(serverReportsDir, { recursive: true });
        const pdfFileName = `handwriting_report_class_${classNum}_${uploadId}.pdf`;
        const destPdfPath = path.join(serverReportsDir, pdfFileName);
        fs.copyFileSync(reportPdf, destPdfPath);

        let parsedJson = null;
        if (fs.existsSync(reportJson)) {
            try {
                parsedJson = JSON.parse(fs.readFileSync(reportJson, "utf8"));
            } catch (err) {
                console.warn("Could not parse analysis.json:", err);
            }
        }

        return {
            uploadId,
            pdfUrl: `/uploads/reports/${pdfFileName}`,
            category: parsedJson?.level || "Analysis Complete",
            score: parsedJson?.score ?? null,
            totalLetters: parsedJson?.total_letters ?? 0,
            counts: parsedJson?.counts || {},
            details: parsedJson,
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    analyzeHandwriting,
};
