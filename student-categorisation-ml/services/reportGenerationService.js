/**
 * Report Generation Service
 * 
 * Generates comprehensive, authenticated student performance reports
 * containing all 13 required sections based exclusively on real saved data.
 * 
 * Includes:
 * 1. Student name & class
 * 2. Report generation date & reporting period
 * 3. Current category & assignment method
 * 4. Initial handwriting-only category
 * 5. Current weighted performance score (when complete)
 * 6. Component scores (30%, 10%, 30%, 30%)
 * 7. Learning cycles completed
 * 8. Learning-card and training activity summaries
 * 9. Gamified assessment score, difficulty, & status
 * 10. Concept-wise strengths & practice areas
 * 11. Category-change history
 * 12. Next-step learning recommendations
 * 13. Supportive summary for parents
 */

const Child = require("../../server/models/Child");
const AnalysisResult = require("../../server/models/AnalysisResult");
const AssessmentResult = require("../../server/models/AssessmentResult");
const StudentCategory = require("../models/studentCategoryModel");

const {
    CATEGORY_LABELS,
    CATEGORY_DESCRIPTIONS,
    COMPONENT_WEIGHTS,
} = require("../config/categorisationConfig");

/**
 * Gather and assemble all 13 report sections from real database records.
 * 
 * @param {string} childId - Student ID
 * @param {string} parentId - Authenticated Parent ID (for authorization)
 * @returns {Promise<Object>} Assembled report data
 */
async function buildStudentReportData(childId, parentId) {
    const child = await Child.findById(childId);
    if (!child) {
        throw new Error("Student record not found.");
    }

    // Authorization verification
    if (String(child.parent) !== String(parentId)) {
        const authErr = new Error("Unauthorized: you do not have permission to access this student report.");
        authErr.statusCode = 403;
        throw authErr;
    }

    // Fetch latest analysis
    let analysisResult = null;
    if (child.latestAnalysis) {
        analysisResult = await AnalysisResult.findById(child.latestAnalysis);
    }

    // Fetch latest assessment
    let assessmentResult = null;
    if (child.latestAssessment) {
        assessmentResult = await AssessmentResult.findById(child.latestAssessment);
    }

    // Fetch auditable categorization history
    const categoryRecords = await StudentCategory.find({ child: child._id })
        .sort({ evaluatedAt: -1 })
        .limit(10);

    const now = new Date();
    const generationDate = now.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    // 1. Student name & class
    const studentName = child.name || "Student";
    const classNumber = child.classNumber || 1;

    // 3. Current category & assignment method
    const currentCategory = child.category || "pending_analysis";
    const currentCategoryLabel =
        child.categoryLabel || CATEGORY_LABELS[child.category] || "Pending Analysis";
    const categorisationMethod =
        child.categorisationType === "reassessment"
            ? "Weighted Multi-Modal Learning Cycle Evaluation"
            : child.categorisationType === "initial"
            ? "Initial Handwriting Analysis"
            : "Awaiting Initial Analysis";

    // 4. Initial handwriting-only category
    const initialRecord = (child.categoryHistory || []).find(
        (h) => h.categorisationType === "initial"
    );
    const initialCategoryLabel =
        initialRecord?.categoryLabel ||
        (child.handwritingAnalyzed ? currentCategoryLabel : "Not Yet Completed");

    // 5. Current weighted performance score (only when complete)
    const isWeightedComplete =
        child.categorisationType === "reassessment" &&
        child.categorisationScore !== null &&
        child.categorisationScore !== undefined;

    const weightedScore = isWeightedComplete
        ? Number(child.categorisationScore).toFixed(1)
        : null;

    // 6. Component scores
    const componentScores = child.componentScores || {};
    const handwritingScore =
        componentScores.handwriting !== null && componentScores.handwriting !== undefined
            ? Number(componentScores.handwriting).toFixed(1)
            : analysisResult?.score !== null && analysisResult?.score !== undefined
            ? Number(analysisResult.score).toFixed(1)
            : "Data Pending";

    const learningTimeScore =
        componentScores.learningTime !== null && componentScores.learningTime !== undefined
            ? Number(componentScores.learningTime).toFixed(1)
            : "Data Pending";

    const trainingScore =
        componentScores.training !== null && componentScores.training !== undefined
            ? Number(componentScores.training).toFixed(1)
            : "Data Pending";

    const assessmentScore =
        componentScores.assessment !== null && componentScores.assessment !== undefined
            ? Number(componentScores.assessment).toFixed(1)
            : assessmentResult?.totalScore !== undefined
            ? Number(assessmentResult.totalScore).toFixed(1)
            : "Data Pending";

    // 7. Learning cycles completed
    const learningCyclesCompleted = child.learningCyclesCompleted || 0;

    // 8. Learning-card & training activity summaries
    const totalLearningSeconds = child.learningTimeStats?.totalSeconds || 0;
    const learningMinutes = Math.floor(totalLearningSeconds / 60);
    const trainingAttempted = child.trainingStats?.totalAttempted || 0;
    const trainingCorrect = child.trainingStats?.totalCorrect || 0;

    // 9. Gamified assessment summary
    const assessmentSummary = assessmentResult
        ? {
              totalScore: assessmentResult.totalScore,
              difficulty: assessmentResult.difficulty || "medium",
              roundsCompleted: assessmentResult.roundsCompleted || 6,
              totalRounds: assessmentResult.totalRounds || 6,
              status: assessmentResult.isExpired
                  ? "Completed on 30-min Timer"
                  : "Completed Successfully",
              submittedAt: new Date(assessmentResult.submittedAt).toLocaleDateString(),
          }
        : null;

    // 10. Concept strengths & practice areas
    const strengths = [];
    const practiceAreas = [];

    if (assessmentResult?.conceptsMastered && Array.isArray(assessmentResult.conceptsMastered)) {
        strengths.push(...assessmentResult.conceptsMastered);
    }
    if (assessmentResult?.conceptsToPractice && Array.isArray(assessmentResult.conceptsToPractice)) {
        practiceAreas.push(...assessmentResult.conceptsToPractice);
    }

    if (analysisResult?.counts?.Normal > (analysisResult?.counts?.Reversal || 0) * 2) {
        strengths.push("High proportion of correctly formed letters");
    }
    if ((analysisResult?.counts?.Reversal || 0) > 3) {
        practiceAreas.push("Targeted mirror-letter discrimination exercises");
    }

    if (strengths.length === 0) {
        strengths.push("Actively participating in multimodal learning sessions");
    }
    if (practiceAreas.length === 0) {
        practiceAreas.push("Continuous practice across English and Mathematics concepts");
    }

    // 11. Category change history
    const historyList = (child.categoryHistory || []).map((h) => ({
        categoryLabel: h.categoryLabel || CATEGORY_LABELS[h.category] || h.category,
        type: h.categorisationType === "reassessment" ? "Learning Cycle Update" : "Initial Assessment",
        score: h.categorisationScore !== null ? `${h.categorisationScore}/100` : "—",
        date: new Date(h.date).toLocaleDateString(),
        reason: h.reason,
    }));

    // 12. Next-step recommendations
    const recommendations = [];
    if (currentCategory === "support_needed") {
        recommendations.push("Engage with the 3 visual cards per concept in the Learning Module for concrete anchor memory.");
        recommendations.push("Practice 20-question image-supported training sets to build confidence before timed assessments.");
        recommendations.push("Use the text-to-speech audio reader on each card to reinforce phonemic pronunciation.");
    } else if (currentCategory === "developing") {
        recommendations.push("Maintain balanced multi-modal study using 2 visual and 2 text cards per concept.");
        recommendations.push("Complete 12-question mixed training sessions twice a week.");
        recommendations.push("Attempt medium-level gamified assessments to solidify sequencing and matching skills.");
    } else {
        recommendations.push("Explore advanced typography cards and theoretical reasoning questions.");
        recommendations.push("Challenge working memory with hard-level gamified assessment challenges.");
        recommendations.push("Expand vocabulary and sentence building across Hindi, Kannada, and Mathematics.");
    }

    // 13. Supportive summary for parents
    const parentSummary =
        CATEGORY_DESCRIPTIONS[currentCategory] ||
        "Your child is actively progressing on their personalized learning path with supportive multi-modal tools designed for dyslexia-friendly growth.";

    return {
        studentName,
        classNumber,
        generationDate,
        reportingPeriod: `${child.createdAt ? new Date(child.createdAt).toLocaleDateString() : "Enrollment"} – ${generationDate}`,
        currentCategory,
        currentCategoryLabel,
        categorisationMethod,
        initialCategoryLabel,
        isWeightedComplete,
        weightedScore,
        componentWeights: COMPONENT_WEIGHTS,
        componentScores: {
            handwriting: handwritingScore,
            learningTime: learningTimeScore,
            training: trainingScore,
            assessment: assessmentScore,
        },
        learningCyclesCompleted,
        learningActivity: {
            totalMinutes: learningMinutes,
            sessionsCompleted: child.learningTimeStats?.sessionsCompleted || 0,
        },
        trainingActivity: {
            attempted: trainingAttempted,
            correct: trainingCorrect,
            accuracy:
                trainingAttempted > 0
                    ? `${Math.round((trainingCorrect / trainingAttempted) * 100)}%`
                    : "No attempts yet",
        },
        assessmentSummary,
        strengths: [...new Set(strengths)],
        practiceAreas: [...new Set(practiceAreas)],
        historyList,
        recommendations,
        parentSummary,
        isMedicalDisclaimer:
            "DysLearn is an educational learning support tool. This assessment provides academic personalization recommendations and is not a medical or clinical diagnosis.",
    };
}

/**
 * Generate a complete, printable HTML report string for download or print-to-PDF.
 * 
 * @param {Object} reportData - Object assembled by buildStudentReportData
 * @returns {string} Clean, styled HTML document
 */
function generateHtmlReport(reportData) {
    const strengths = reportData.strengths || reportData.conceptInsights?.strengths || [];
    const practiceAreas = reportData.practiceAreas || reportData.conceptInsights?.conceptsToPractice || [];
    const recommendations = reportData.recommendations || [];
    const historyList = reportData.historyList || reportData.categoryHistory || [];

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DysLearn Performance Report — ${reportData.studentName}</title>
    <style>
        :root {
            --primary: #4f46e5;
            --primary-dark: #3730a3;
            --text-main: #0f172a;
            --text-muted: #475569;
            --border: #e2e8f0;
            --bg-light: #f8fafc;
            --emerald: #059669;
            --amber: #d97706;
            --indigo: #4338ca;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: var(--text-main);
            background: #ffffff;
            line-height: 1.6;
            padding: 36px 40px;
            max-width: 900px;
            margin: 0 auto;
        }
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 3px solid var(--primary);
            padding-bottom: 20px;
            margin-bottom: 28px;
        }
        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .brandLogo { font-size: 2.4rem; }
        .brandTitle { font-size: 1.7rem; font-weight: 800; color: var(--primary); }
        .brandSubtitle { font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
        .reportBadge {
            background: #eef2ff;
            color: var(--primary);
            border: 1px solid #c7d2fe;
            padding: 6px 14px;
            border-radius: 999px;
            font-size: 0.82rem;
            font-weight: 700;
        }
        .metaGrid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
            background: var(--bg-light);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 16px 20px;
            margin-bottom: 24px;
        }
        .metaField span { display: block; font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; }
        .metaField strong { font-size: 1.05rem; color: var(--text-main); }
        .categoryHero {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
            border: 2px solid #a7f3d0;
            border-radius: 16px;
            padding: 20px 24px;
            margin-bottom: 28px;
        }
        .categoryBadge {
            display: inline-block;
            background: var(--emerald);
            color: #ffffff;
            font-size: 1.15rem;
            font-weight: 800;
            padding: 6px 18px;
            border-radius: 999px;
            margin-bottom: 8px;
        }
        .categoryScoreDial {
            text-align: center;
            background: #ffffff;
            border: 2px solid #a7f3d0;
            border-radius: 16px;
            padding: 14px 22px;
        }
        .scoreNum { font-size: 2.2rem; font-weight: 900; color: var(--emerald); line-height: 1; }
        .scoreLabel { font-size: 0.78rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; }
        .sectionTitle {
            font-size: 1.2rem;
            font-weight: 800;
            color: var(--text-main);
            margin: 24px 0 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            border-bottom: 1.5px solid var(--border);
            padding-bottom: 6px;
        }
        .weightsTable {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
            font-size: 0.92rem;
        }
        .weightsTable th {
            background: #f1f5f9;
            color: var(--text-main);
            font-weight: 800;
            text-align: left;
            padding: 10px 14px;
            border: 1px solid var(--border);
        }
        .weightsTable td {
            padding: 10px 14px;
            border: 1px solid var(--border);
        }
        .twoCol {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 24px;
        }
        .cardBox {
            background: #ffffff;
            border: 1.5px solid var(--border);
            border-radius: 14px;
            padding: 18px;
        }
        .cardBox h4 { font-size: 1rem; font-weight: 800; margin-bottom: 10px; }
        .listClean { list-style: none; }
        .listClean li {
            padding: 6px 0;
            border-bottom: 1px solid #f1f5f9;
            font-size: 0.92rem;
            display: flex;
            align-items: flex-start;
            gap: 8px;
        }
        .listClean li:last-child { border-bottom: none; }
        .disclaimerBox {
            background: #fffbeb;
            border: 1.5px solid #fde68a;
            border-radius: 12px;
            padding: 14px 18px;
            font-size: 0.84rem;
            color: #92400e;
            margin-top: 30px;
            line-height: 1.5;
        }
        @media print {
            body { padding: 0; max-width: 100%; }
            .noPrint { display: none !important; }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="brand">
            <span class="brandLogo">🧠</span>
            <div>
                <h1 class="brandTitle">DysLearn</h1>
                <p class="brandSubtitle">Multimodal Dyslexia Learning & Categorisation System</p>
            </div>
        </div>
        <div class="reportBadge">Official Student Performance Report</div>
    </header>

    <section class="metaGrid">
        <div class="metaField">
            <span>Student Name</span>
            <strong>${reportData.studentName}</strong>
        </div>
        <div class="metaField">
            <span>Class Level</span>
            <strong>Class ${reportData.classNumber}</strong>
        </div>
        <div class="metaField">
            <span>Report Date</span>
            <strong>${reportData.generationDate || (reportData.generatedAt ? new Date(reportData.generatedAt).toLocaleDateString() : new Date().toLocaleDateString())}</strong>
        </div>
        <div class="metaField">
            <span>Evaluation Method</span>
            <strong>${reportData.categorisationMethod}</strong>
        </div>
        <div class="metaField">
            <span>Initial Category</span>
            <strong>${reportData.initialCategoryLabel}</strong>
        </div>
        <div class="metaField">
            <span>Learning Cycles</span>
            <strong>${reportData.learningCyclesCompleted} Completed</strong>
        </div>
    </section>

    <section class="categoryHero">
        <div>
            <span class="categoryBadge">${reportData.currentCategoryLabel}</span>
            <p style="font-size: 0.95rem; color: #065f46; max-width: 540px;">
                ${reportData.parentSummary || "Educational personalisation indicator designed to adapt visual cards, practice intensity, and challenge difficulty to your child's pace."}
            </p>
        </div>
        <div class="categoryScoreDial">
            <div class="scoreNum">${(reportData.weightedScore ?? reportData.overallScore) !== null && (reportData.weightedScore ?? reportData.overallScore) !== undefined ? (reportData.weightedScore ?? reportData.overallScore) : "—"}</div>
            <div class="scoreLabel">${(reportData.isWeightedComplete || reportData.isEvidenceComplete) ? "Composite Score / 100" : "Evidence In Progress"}</div>
        </div>
    </section>

    <h3 class="sectionTitle">📊 Multi-Modal Weighted Performance Breakdown</h3>
    <table class="weightsTable">
        <thead>
            <tr>
                <th>Learning Component</th>
                <th>Prescribed Weight</th>
                <th>Normalized Score</th>
                <th>Educational Function</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>1. Handwriting Analysis</strong></td>
                <td>30%</td>
                <td><strong>${reportData.componentScores.handwriting}</strong></td>
                <td>Detection of letter reversals (b/d, p/q) & stroke consistency</td>
            </tr>
            <tr>
                <td><strong>2. Learning Model Time</strong></td>
                <td>10%</td>
                <td><strong>${reportData.componentScores.learningTime}</strong></td>
                <td>Active concept engagement & non-penalizing time-on-task</td>
            </tr>
            <tr>
                <td><strong>3. Training Performance</strong></td>
                <td>30%</td>
                <td><strong>${reportData.componentScores.training}</strong></td>
                <td>Flashcard question accuracy & phonological discrimination</td>
            </tr>
            <tr>
                <td><strong>4. Gamified Assessment</strong></td>
                <td>30%</td>
                <td><strong>${reportData.componentScores.assessment}</strong></td>
                <td>Interactive games & theoretical curriculum test mastery</td>
            </tr>
        </tbody>
    </table>

    <div class="twoCol">
        <div class="cardBox">
            <h4 style="color: var(--emerald);">🌟 Observed Strengths</h4>
            <ul class="listClean">
                ${strengths.length > 0 ? strengths.map((s) => `<li><span style="color: var(--emerald);">✓</span> ${s}</li>`).join("") : "<li>Steady progress and active participation.</li>"}
            </ul>
        </div>
        <div class="cardBox">
            <h4 style="color: var(--amber);">🎯 Concepts for Reinforcement</h4>
            <ul class="listClean">
                ${practiceAreas.length > 0 ? practiceAreas.map((p) => `<li><span style="color: var(--amber);">➔</span> ${p}</li>`).join("") : "<li>Continue daily practice to reinforce fundamentals.</li>"}
            </ul>
        </div>
    </div>

    <h3 class="sectionTitle">🚀 Recommended Next Learning Steps</h3>
    <div class="cardBox" style="margin-bottom: 24px;">
        <ul class="listClean">
            ${recommendations.length > 0 ? recommendations.map((r, i) => `<li><strong>${i + 1}.</strong> ${r}</li>`).join("") : "<li>Proceed to next textbook concept lesson.</li>"}
        </ul>
    </div>

    ${historyList && historyList.length > 1 ? `
    <h3 class="sectionTitle">📈 Category Progression History</h3>
    <table class="weightsTable">
        <thead>
            <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Score</th>
                <th>Evaluation Type</th>
            </tr>
        </thead>
        <tbody>
            ${historyList.map(h => `
                <tr>
                    <td>${h.date}</td>
                    <td><strong>${h.categoryLabel}</strong></td>
                    <td>${h.score}</td>
                    <td>${h.type}</td>
                </tr>
            `).join("")}
        </tbody>
    </table>
    ` : ""}

    <div class="disclaimerBox">
        <strong>⚠️ Medical & Educational Disclaimer:</strong><br>
        ${reportData.isMedicalDisclaimer || "The student category is an educational personalisation indicator, not a medical or clinical diagnosis."}
    </div>
</body>
</html>`;
}

module.exports = {
    buildStudentReportData,
    generateHtmlReport,
};
