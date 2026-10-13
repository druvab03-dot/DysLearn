/**
 * Handwriting Feature Service
 * 
 * Inspects and extracts structured features from DysLearn's handwriting analysis:
 * - Character count
 * - Label breakdown (Normal, Corrected, Reversal)
 * - Error/reversal ratios
 * - Confidence metrics
 * - Normalized 0-100 handwriting assessment score
 */

const { normalizeHandwritingScore } = require("../utils/scoreCalculator");

/**
 * Extract structured handwriting features from an AnalysisResult document or raw analysis.
 * 
 * @param {Object} analysis - AnalysisResult document or raw predictor object
 * @returns {Object} Extracted features and quality indicators
 */
function extractHandwritingFeatures(analysis) {
    if (!analysis) {
        return {
            hasValidAnalysis: false,
            score: null,
            totalLetters: 0,
            normalCount: 0,
            correctedCount: 0,
            reversalCount: 0,
            reversalRate: 0,
            normalRate: 0,
            qualityLevel: "No Data",
            isPending: true,
        };
    }

    const counts = analysis.counts || {};
    const normalCount = Number(counts.Normal || 0);
    const correctedCount = Number(counts.Corrected || 0);
    const reversalCount = Number(counts.Reversal || 0);
    const totalLetters =
        analysis.totalLetters ||
        analysis.characters_analysed ||
        normalCount + correctedCount + reversalCount;

    const normalizedScore = normalizeHandwritingScore(analysis);

    // Safeguard: need at least 3 detected letters to produce reliable evaluation
    const hasSufficientLetters = totalLetters >= 3;
    const isCompletedStatus =
        analysis.status === "completed" ||
        analysis.score !== undefined ||
        analysis.counts !== undefined;

    const hasValidAnalysis = isCompletedStatus && hasSufficientLetters && normalizedScore !== null;

    const normalRate = totalLetters > 0 ? parseFloat((normalCount / totalLetters).toFixed(3)) : 0;
    const reversalRate = totalLetters > 0 ? parseFloat((reversalCount / totalLetters).toFixed(3)) : 0;
    const correctedRate = totalLetters > 0 ? parseFloat((correctedCount / totalLetters).toFixed(3)) : 0;

    return {
        hasValidAnalysis,
        score: normalizedScore,
        totalLetters,
        normalCount,
        correctedCount,
        reversalCount,
        normalRate,
        reversalRate,
        correctedRate,
        qualityLevel: analysis.category || analysis.level || "Completed",
        pdfUrl: analysis.pdfUrl || null,
        uploadId: analysis.uploadId || null,
        isPending: !hasValidAnalysis,
    };
}

module.exports = {
    extractHandwritingFeatures,
};
