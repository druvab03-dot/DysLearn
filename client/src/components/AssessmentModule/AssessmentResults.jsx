import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function AssessmentResults({ assessmentData, onRestart }) {
    const navigate = useNavigate();
    const [showReviewModal, setShowReviewModal] = useState(false);

    // Retrieve active student name
    let studentName = assessmentData?.studentName;
    if (!studentName) {
        try {
            const rawChild = localStorage.getItem("activeChild");
            if (rawChild) {
                const parsed = JSON.parse(rawChild);
                studentName = parsed.name || "Student";
            }
        } catch (e) {
            studentName = "Student";
        }
    }
    if (!studentName) studentName = "Student";

    const {
        classNumber,
        subject,
        difficulty = "medium",
        totalScore = 0,
        gameScore = 0,
        theoryScore = 0,
        durationSeconds = 0,
        maxDurationSeconds = 1800,
        roundsCompleted = 6,
        totalRounds = 6,
        gameBreakdown = [],
        conceptsMastered = [],
        conceptsToPractice = [],
        feedbackMessage = "",
        isExpired = false,
        submittedAt = new Date().toISOString(),
    } = assessmentData || {};

    const formattedSubject = subject
        ? subject.charAt(0).toUpperCase() + subject.slice(1)
        : "Subject";

    const minutesUsed = Math.floor(durationSeconds / 60);
    const secondsUsed = durationSeconds % 60;
    const timeDisplay = `${minutesUsed}m ${secondsUsed < 10 ? "0" : ""}${secondsUsed}s`;

    // Completion Status
    const completionStatus = isExpired
        ? "Submitted on 30-Min Time Expiry"
        : roundsCompleted >= (totalRounds || 6)
        ? "Completed in Full"
        : `Partially Completed (${roundsCompleted}/${totalRounds || 6} Rounds)`;

    // Calculate aggregated item statistics
    let totalItemsAttempted = 0;
    let totalItemsCorrect = 0;
    let totalItemsIncorrect = 0;

    gameBreakdown.forEach((r) => {
        if (r.gameType === "theoretical-assessment") {
            const totalQ = r.details?.totalQuestions || 5;
            const correctQ = r.details?.correctCount || 0;
            totalItemsAttempted += totalQ;
            totalItemsCorrect += correctQ;
            totalItemsIncorrect += totalQ - correctQ;
        } else if (r.gameType === "connect-match") {
            const totalPairs = 4;
            const accuracyRatio = (r.score || 0) / (r.maxScore || 12);
            const correctPairs = Math.round(accuracyRatio * totalPairs);
            totalItemsAttempted += totalPairs;
            totalItemsCorrect += correctPairs;
            totalItemsIncorrect += totalPairs - correctPairs;
        } else if (r.gameType === "memory-challenge") {
            const totalPairs = 4;
            const accuracyRatio = (r.score || 0) / (r.maxScore || 12);
            const correctPairs = Math.round(accuracyRatio * totalPairs);
            totalItemsAttempted += totalPairs;
            totalItemsCorrect += correctPairs;
            totalItemsIncorrect += totalPairs - correctPairs;
        } else {
            // Single-item games (Picture Detective, Sequence Builder, Odd One Out)
            totalItemsAttempted += 1;
            if ((r.score || 0) >= (r.maxScore || 12) * 0.8) {
                totalItemsCorrect += 1;
            } else {
                totalItemsIncorrect += 1;
            }
        }
    });

    const totalUnanswered = isExpired
        ? Math.max(0, (totalRounds || 6) - (roundsCompleted || 0))
        : 0;

    const percentage = Math.round(totalScore);

    // Award Badge Calculation
    let awardBadge = {
        icon: "🌟",
        title: "Brilliant Thinker",
        colorClass: "badgeGold",
    };
    if (totalScore >= 90) {
        awardBadge = { icon: "👑", title: "Master Explorer", colorClass: "badgeCrown" };
    } else if (totalScore >= 75) {
        awardBadge = { icon: "🚀", title: "Super Learner", colorClass: "badgeRocket" };
    } else if (totalScore >= 60) {
        awardBadge = { icon: "🌱", title: "Curious Mind", colorClass: "badgeSprout" };
    } else {
        awardBadge = { icon: "🌈", title: "Inspiring Explorer", colorClass: "badgeRainbow" };
    }

    // Specific Practice Recommendations
    const practiceRecommendations = conceptsToPractice.map((c) => {
        const lower = c.toLowerCase();
        if (lower.includes("rhyme") || lower.includes("spelling") || lower.includes("vowel")) {
            return `Review phonics, rhyming patterns, and letter sounds for "${c}" using text flashcards.`;
        } else if (lower.includes("shape") || lower.includes("count") || lower.includes("number")) {
            return `Explore visual counting and hands-on number sequencing for "${c}" in the Math Training Module.`;
        } else if (lower.includes("plant") || lower.includes("animal") || lower.includes("body")) {
            return `Reinforce real-world nature and science associations for "${c}" with picture-based identification.`;
        } else {
            return `Practice visual word-association and concept flashcards for "${c}" in the DysLearn Training Module.`;
        }
    });

    const handlePrintReport = () => {
        window.print();
    };

    const formattedDate = new Date(submittedAt).toLocaleDateString("en-IN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="assessmentResultsPage">
            <div className="noPrintArea">
                <Header />
            </div>

            <main className="resultsMainContainer">
                {/* Print & Action Controls Bar */}
                <div className="resultsTopToolbar noPrintArea">
                    <button
                        type="button"
                        className="toolbarBtn printReportBtn"
                        onClick={handlePrintReport}
                        title="Download or print this assessment analysis report"
                    >
                        📄 Download Report (PDF)
                    </button>
                    <button
                        type="button"
                        className="toolbarBtn reviewBtn"
                        onClick={() => setShowReviewModal(true)}
                    >
                        📋 Review Questions
                    </button>
                    {onRestart && (
                        <button
                            type="button"
                            className="toolbarBtn restartBtn"
                            onClick={onRestart}
                        >
                            🔄 Try Another Test
                        </button>
                    )}
                    <button
                        type="button"
                        className="toolbarBtn backBtn"
                        onClick={() => navigate(`/class/${classNumber}`)}
                    >
                        🏠 Class Dashboard
                    </button>
                </div>

                {/* Official Printable Assessment Report Document */}
                <article className="officialReportSheet">
                    {/* Report Header */}
                    <header className="reportHeader">
                        <div className="reportHeaderBrand">
                            <div className="brandLogo">
                                <span className="brandGlyph">🧠</span>
                                <div>
                                    <h2 className="brandName">DysLearn</h2>
                                    <span className="brandTagline">
                                        Multimodal Dyslexia-Friendly Learning & Assessment System
                                    </span>
                                </div>
                            </div>
                            <span className="reportTypeBadge">Official Assessment Report</span>
                        </div>

                        {/* Student & Session Metadata Banner */}
                        <div className="reportMetaGrid">
                            <div className="metaField">
                                <span className="metaLabel">Student Name:</span>
                                <strong className="metaVal">{studentName}</strong>
                            </div>
                            <div className="metaField">
                                <span className="metaLabel">Class & Subject:</span>
                                <strong className="metaVal">
                                    Class {classNumber} • {formattedSubject} ({difficulty.toUpperCase()})
                                </strong>
                            </div>
                            <div className="metaField">
                                <span className="metaLabel">Assessment Date:</span>
                                <strong className="metaVal">{formattedDate}</strong>
                            </div>
                            <div className="metaField">
                                <span className="metaLabel">Time Spent:</span>
                                <strong className="metaVal">{timeDisplay} (Limit: 30m)</strong>
                            </div>
                            <div className="metaField">
                                <span className="metaLabel">Completion Status:</span>
                                <strong className="metaVal statusCompleted">{completionStatus}</strong>
                            </div>
                            <div className="metaField">
                                <span className="metaLabel">Rounds Finished:</span>
                                <strong className="metaVal">
                                    {roundsCompleted} of {totalRounds || 6} Rounds
                                </strong>
                            </div>
                        </div>
                    </header>

                    {/* Overall Score Dial & Metrics */}
                    <section className="overallMetricsSection">
                        <div className="overallScoreDialBox">
                            <div className="bigScoreCircle">
                                <span className="bigScoreNumber">{totalScore}</span>
                                <span className="bigScoreMax">/ 100</span>
                            </div>
                            <div className="overallPercentageBadge">
                                Final Percentage: <strong>{percentage}%</strong>
                            </div>
                        </div>

                        <div className="metricsCardsGrid">
                            <div className="metricCard metricGames">
                                <span className="metricIcon">🎮</span>
                                <div>
                                    <span className="metricTitle">Interactive Games</span>
                                    <strong className="metricValue">{gameScore} / 60 pts</strong>
                                    <span className="metricSub">5 Gamified Rounds</span>
                                </div>
                            </div>

                            <div className="metricCard metricTheory">
                                <span className="metricIcon">📖</span>
                                <div>
                                    <span className="metricTitle">Theoretical Knowledge</span>
                                    <strong className="metricValue">{theoryScore} / 40 pts</strong>
                                    <span className="metricSub">Curriculum Test</span>
                                </div>
                            </div>

                            <div className="metricCard metricAccuracy">
                                <span className="metricIcon">🎯</span>
                                <div>
                                    <span className="metricTitle">Items Attempted</span>
                                    <strong className="metricValue">{totalItemsAttempted} Items</strong>
                                    <span className="metricSub">
                                        ✓ {totalItemsCorrect} Correct • ✕ {totalItemsIncorrect} Incorrect
                                    </span>
                                </div>
                            </div>

                            <div className="metricCard metricTime">
                                <span className="metricIcon">⏱️</span>
                                <div>
                                    <span className="metricTitle">Assessment Time</span>
                                    <strong className="metricValue">{timeDisplay}</strong>
                                    <span className="metricSub">Max 30m Authoritative</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Round-Wise Performance Table */}
                    <section className="reportSection roundWiseSection">
                        <h3 className="sectionHeading">
                            <span>📊</span> Round-Wise Performance & Activity Analysis
                        </h3>
                        <div className="tableContainer">
                            <table className="roundWiseTable">
                                <thead>
                                    <tr>
                                        <th>Round</th>
                                        <th>Activity Name</th>
                                        <th>Skill Evaluated</th>
                                        <th>Key Topic / Concept</th>
                                        <th>Score</th>
                                        <th>Points Max</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gameBreakdown.map((r, idx) => {
                                        const pts = r.score ?? 0;
                                        const maxPts = r.maxScore ?? 12;
                                        const isFull = pts === maxPts;
                                        return (
                                            <tr key={idx}>
                                                <td>
                                                    <strong>#{r.roundIndex || idx + 1}</strong>
                                                </td>
                                                <td>
                                                    <span className="tableActivityTitle">{r.title}</span>
                                                </td>
                                                <td>
                                                    <span className="tableSkillBadge">{r.skill}</span>
                                                </td>
                                                <td>
                                                    <span className="tableConcept">{r.concept || "Curriculum topic"}</span>
                                                </td>
                                                <td>
                                                    <strong className={isFull ? "scoreFull" : "scorePartial"}>
                                                        {pts}
                                                    </strong>
                                                </td>
                                                <td>{maxPts}</td>
                                                <td>
                                                    <span
                                                        className={`statusBadge ${
                                                            isFull ? "statusSuccess" : "statusComplete"
                                                        }`}
                                                    >
                                                        {isFull ? "✓ Mastered" : "Completed"}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Learning Analysis & Recommendations */}
                    <section className="reportSection learningAnalysisSection">
                        <h3 className="sectionHeading">
                            <span>💡</span> Comprehensive Learning Analysis
                        </h3>

                        <div className="learningColumns">
                            {/* Mastered Concepts */}
                            <div className="learningCard masteredCard">
                                <h4 className="learningCardTitle">
                                    <span className="cardTitleIcon">✓</span> Concepts Demonstrated Successfully (
                                    {conceptsMastered.length})
                                </h4>
                                <p className="learningCardIntro">
                                    {studentName} demonstrated strong visual recognition and conceptual accuracy in:
                                </p>
                                <ul className="conceptBulletList">
                                    {conceptsMastered.map((c, i) => (
                                        <li key={i} className="conceptBulletItem">
                                            <span className="bulletStar">★</span>
                                            <span>{c}</span>
                                        </li>
                                    ))}
                                    {conceptsMastered.length === 0 && (
                                        <li className="conceptBulletItem">
                                            <span>Active participation across all rounds!</span>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            {/* Practice Concepts */}
                            <div className="learningCard practiceCard">
                                <h4 className="learningCardTitle">
                                    <span className="cardTitleIcon">🌱</span> Concepts for Supportive Practice (
                                    {conceptsToPractice.length})
                                </h4>
                                <p className="learningCardIntro">
                                    Areas that will benefit from joyful, low-stress reinforcement in DysLearn:
                                </p>
                                <ul className="conceptBulletList">
                                    {conceptsToPractice.map((c, i) => (
                                        <li key={i} className="conceptBulletItem">
                                            <span className="bulletArrow">➜</span>
                                            <span>{c}</span>
                                        </li>
                                    ))}
                                    {conceptsToPractice.length === 0 && (
                                        <li className="conceptBulletItem">
                                            <span className="bulletStar">★</span>
                                            <span>All evaluated concepts answered with high accuracy!</span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Actionable Practice Recommendations */}
                        <div className="recommendationsBox">
                            <h4 className="recHeading">
                                <span>🎯</span> Supportive Next Steps & Training Recommendations:
                            </h4>
                            <div className="recList">
                                {practiceRecommendations.length > 0 ? (
                                    practiceRecommendations.map((rec, i) => (
                                        <div key={i} className="recItem">
                                            <span className="recNum">{i + 1}</span>
                                            <span className="recText">{rec}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="recItem">
                                        <span className="recNum">1</span>
                                        <span className="recText">
                                            Continue regular exploratory training in the DysLearn Training Module to maintain high fluency and confidence.
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Encouraging Final Summary */}
                        <div className="encouragingSummaryBox">
                            <span className="summaryIcon">{awardBadge.icon}</span>
                            <div>
                                <h5 className="summaryTitle">Educator & System Feedback</h5>
                                <p className="summaryText">
                                    {feedbackMessage ||
                                        `Superb effort, ${studentName}! You engaged attentively with every multimodal challenge, showing curiosity, resilience, and steady thinking. Keep enjoying learning!`}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Report Footer */}
                    <footer className="reportFooter">
                        <div className="footerSignature">
                            <span>Evaluated by: DysLearn Adaptive Assessment Engine</span>
                            <span>Standard: CBSE / NCERT Aligned</span>
                        </div>
                        <p className="footerDisclaimer">
                            * Note: This educational assessment reflects subject comprehension and multimodal task interaction for educational support. It is designed to encourage learning growth.
                        </p>
                    </footer>
                </article>

                {/* Bottom Action Buttons */}
                <section className="resultsActionsBar noPrintArea">
                    <button
                        type="button"
                        className="resultsReviewBtn"
                        onClick={() => setShowReviewModal(true)}
                    >
                        📋 Detailed Activity Review
                    </button>

                    <button
                        type="button"
                        className="resultsActionPrimary"
                        onClick={handlePrintReport}
                    >
                        📄 Download Report (PDF)
                    </button>

                    {onRestart && (
                        <button
                            type="button"
                            className="resultsActionSecondary"
                            onClick={onRestart}
                        >
                            🔄 Try Another Test
                        </button>
                    )}

                    <button
                        type="button"
                        className="resultsActionSecondary"
                        onClick={() => navigate(`/class/${classNumber}`)}
                    >
                        📚 Return to Dashboard
                    </button>
                </section>

                {/* Review Modal */}
                {showReviewModal && (
                    <div className="modalBackdrop noPrintArea" onClick={() => setShowReviewModal(false)}>
                        <div
                            className="reviewModalCard"
                            onClick={(e) => e.stopPropagation()}
                            role="dialog"
                            aria-modal="true"
                        >
                            <div className="reviewModalHeader">
                                <h3>Activity & Question Review</h3>
                                <button
                                    type="button"
                                    className="closeModalBtn"
                                    onClick={() => setShowReviewModal(false)}
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="reviewModalBody">
                                {gameBreakdown.map((r, i) => (
                                    <div key={i} className="reviewRoundItem">
                                        <div className="reviewRoundTitleRow">
                                            <h4>
                                                #{r.roundIndex || i + 1} {r.title} ({r.score}/{r.maxScore} pts)
                                            </h4>
                                            <span className="reviewSkillBadge">{r.skill}</span>
                                        </div>
                                        <p className="reviewConceptText">
                                            <strong>Key Concept:</strong> {r.concept}
                                        </p>
                                        {r.details?.questionReview && (
                                            <div className="reviewQuestionsSubList">
                                                {r.details.questionReview.map((q, qIdx) => (
                                                    <div
                                                        key={qIdx}
                                                        className={`reviewQItem ${
                                                            q.isCorrect ? "qCorrect" : "qIncorrect"
                                                        }`}
                                                    >
                                                        <p className="reviewQText">
                                                            <strong>Q{qIdx + 1}:</strong> {q.question}
                                                        </p>
                                                        <div className="reviewQAnswers">
                                                            <span>
                                                                Your Answer: <em>{q.chosen || "Unanswered"}</em>
                                                            </span>
                                                            <span>
                                                                Correct Answer: <strong>{q.correctAnswer}</strong>
                                                            </span>
                                                        </div>
                                                        {q.explanation && (
                                                            <p className="reviewQExplanation">
                                                                💡 {q.explanation}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="reviewModalFooter">
                                <button
                                    type="button"
                                    className="gameActionPrimaryBtn"
                                    onClick={() => setShowReviewModal(false)}
                                >
                                    Close Review
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <div className="noPrintArea">
                <Footer />
            </div>
        </div>
    );
}

export default AssessmentResults;
