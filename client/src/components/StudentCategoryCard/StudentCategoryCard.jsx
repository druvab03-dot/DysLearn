import { useState, useEffect } from "react";
import "./StudentCategoryCard.css";
import {
    getStudentCategoryStatus,
    downloadPerformanceReport,
    CATEGORY_LABELS,
} from "../../services/studentCategoryService";

function StudentCategoryCard({ child }) {
    const [statusData, setStatusData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        if (!child?._id) return;

        const loadStatus = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getStudentCategoryStatus(child._id);
                if (isMounted) {
                    setStatusData(data);
                }
            } catch (err) {
                if (isMounted) {
                    console.warn("Could not fetch category status:", err.message);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadStatus();
        return () => {
            isMounted = false;
        };
    }, [child?._id, child?.lastCategorisationDate, child?.category]);

    const activeCategory = statusData?.category || child?.category || null;
    const categoryLabel =
        statusData?.categoryLabel ||
        child?.categoryLabel ||
        CATEGORY_LABELS[activeCategory] ||
        "Pending Analysis";

    const categorisationType = statusData?.categorisationType || child?.categorisationType;
    const isCycleEvaluation = categorisationType === "learning_cycle" || categorisationType === "reassessment";
    const lastDate = statusData?.lastCategorisationDate || child?.lastCategorisationDate;
    const formattedDate = lastDate ? new Date(lastDate).toLocaleDateString() : null;

    const scores = statusData?.componentScores || child?.componentScores || {};
    const overallScore = statusData?.categorisationScore ?? child?.categorisationScore;
    const cycles = statusData?.learningCyclesCompleted ?? child?.learningCyclesCompleted ?? 0;
    const history = statusData?.history || [];

    const handleDownloadReport = async () => {
        try {
            setDownloading(true);
            await downloadPerformanceReport(child._id, child.name);
        } catch (err) {
            alert(`Unable to download report: ${err.message}`);
        } finally {
            setDownloading(false);
        }
    };

    // Category explanation text
    const getExplanation = () => {
        if (!activeCategory) {
            return "Handwriting analysis is pending. Once completed, DysLearn will personalise visual cards and exercises to support your child.";
        }
        if (activeCategory === "support_needed") {
            return "Personalised with enhanced visual learning cards, smaller practice steps, and gentle foundational challenges to build learning confidence.";
        }
        if (activeCategory === "progressing_well") {
            return "Personalised with balanced typography reading cards and advanced reasoning challenges to expand curriculum mastery.";
        }
        return "Personalised with an equal combination of visual and text learning cards for balanced, steady skill progression.";
    };

    return (
        <div className="studentCategoryCard">
            {/* Header / Badge */}
            <div className="categoryHeaderRow">
                <span className={`categoryBadge ${activeCategory || "pending"}`}>
                    {activeCategory === "support_needed"
                        ? "🌱 Support Needed"
                        : activeCategory === "progressing_well"
                        ? "🌟 Progressing Well"
                        : activeCategory === "developing"
                        ? "🚀 Developing"
                        : "⏳ Pending Analysis"}
                </span>

                <span className="categoryTypePill">
                    {isCycleEvaluation
                        ? "📊 Learning Cycle Re-Assessment"
                        : activeCategory
                        ? "✍️ Initial Handwriting Analysis"
                        : "Awaiting Input"}
                    {formattedDate && ` • ${formattedDate}`}
                </span>
            </div>

            {/* Non-Technical Explanation */}
            <p className="categoryExplanation">
                {getExplanation()}
            </p>

            <p className="categoryNotice">
                ℹ️ Educational personalisation indicator, not a clinical or medical diagnosis.
            </p>

            {/* Component Scores Breakdown */}
            <div className="componentScoresArea">
                <div className="scoreRow">
                    <span className="scoreLabel">✍️ Handwriting Analysis (30%)</span>
                    <span className="scoreValue">
                        {scores.handwriting !== null && scores.handwriting !== undefined
                            ? `${Math.round(scores.handwriting)} / 100`
                            : "Pending"}
                    </span>
                </div>
                <div className="scoreRow">
                    <span className="scoreLabel">⏱️ Active Learning Time (10%)</span>
                    <span className="scoreValue">
                        {scores.learningTime !== null && scores.learningTime !== undefined
                            ? `${Math.round(scores.learningTime)} / 100`
                            : "Pending Cycle"}
                    </span>
                </div>
                <div className="scoreRow">
                    <span className="scoreLabel">🎯 Training Performance (30%)</span>
                    <span className="scoreValue">
                        {scores.training !== null && scores.training !== undefined
                            ? `${Math.round(scores.training)} / 100`
                            : "Pending Cycle"}
                    </span>
                </div>
                <div className="scoreRow">
                    <span className="scoreLabel">🏆 Gamified Assessment (30%)</span>
                    <span className="scoreValue">
                        {scores.assessment !== null && scores.assessment !== undefined
                            ? `${Math.round(scores.assessment)} / 100`
                            : "Pending Cycle"}
                    </span>
                </div>

                {overallScore !== null && overallScore !== undefined && isCycleEvaluation && (
                    <div className="scoreRow overallScoreRow">
                        <span className="scoreLabel">⭐ Weighted Performance Score</span>
                        <span className="scoreValue">{Math.round(overallScore)} / 100</span>
                    </div>
                )}
            </div>

            {/* Learning Insights */}
            <div className="insightsGrid">
                <div className="insightCard strengths">
                    <div className="insightTitle">✨ Progress Highlights</div>
                    <div>
                        {cycles > 0
                            ? `${cycles} completed learning cycle${cycles > 1 ? "s" : ""}. Consistent interactive engagement across lessons.`
                            : "Starting initial curriculum concepts with visual memory exercises."}
                    </div>
                </div>

                <div className="insightCard practice">
                    <div className="insightTitle">🌱 Next Learning Steps</div>
                    <div>
                        {activeCategory === "support_needed"
                            ? "Practice real-photo card associations and complete guided training modules."
                            : activeCategory === "progressing_well"
                            ? "Explore advanced typography reading and theoretical quiz challenges."
                            : "Explore balanced visual and text modules to strengthen multi-modal recognition."}
                    </div>
                </div>
            </div>

            {/* Category History */}
            {history.length > 1 && (
                <div>
                    <button
                        type="button"
                        className="historyToggleBtn"
                        onClick={() => setShowHistory(!showHistory)}
                    >
                        {showHistory ? "▲ Hide Category History" : `▼ View Category History (${history.length} evaluations)`}
                    </button>
                    {showHistory && (
                        <ul className="historyList">
                            {history.map((h, idx) => (
                                <li key={h._id || idx} className="historyItem">
                                    <strong>{new Date(h.evaluatedAt).toLocaleDateString()}</strong>:{" "}
                                    {h.categoryLabel || h.category} ({h.categorisationType === "initial" ? "Initial Handwriting" : "Learning Cycle"}) — Score: {h.categorisationScore ?? "N/A"}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Download Performance Report */}
            <div className="categoryActionsRow">
                <button
                    type="button"
                    className="downloadReportBtn"
                    onClick={handleDownloadReport}
                    disabled={downloading}
                >
                    {downloading ? "⏳ Preparing Report..." : "📄 Download Student Performance Report (HTML / PDF)"}
                </button>
            </div>
        </div>
    );
}

export default StudentCategoryCard;
