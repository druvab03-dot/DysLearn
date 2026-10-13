import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { generateAssessmentSession } from "./assessmentCurriculum.js";
import { startAssessmentSession, submitAssessment } from "../../services/assessmentService";

import PictureDetectiveGame from "./PictureDetectiveGame";
import ConnectMatchGame from "./ConnectMatchGame";
import SequenceBuilderGame from "./SequenceBuilderGame";
import MemoryCardGame from "./MemoryCardGame";
import OddOneOutGame from "./OddOneOutGame";
import TheoryAssessmentRound from "./TheoryAssessmentRound";
import AssessmentResults from "./AssessmentResults";

import "./AssessmentModule.css";

const MAX_DURATION_SECONDS = 1800; // 30 minutes authoritative limit

function AssessmentSession() {
    const { classNumber: paramClass, subject: paramSubject } = useParams();
    const navigate = useNavigate();

    // Session Parameters
    const classNumber = Number(paramClass) || 1;
    const subject = paramSubject || "english";
    const [difficulty, setDifficulty] = useState("medium");

    // Session States: 'intro' | 'active' | 'transition' | 'completed'
    const [sessionState, setSessionState] = useState("intro");
    const [sessionData, setSessionData] = useState(null);
    const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
    const [roundResults, setRoundResults] = useState([]);
    const [masteredConcepts, setMasteredConcepts] = useState([]);
    const [practiceConcepts, setPracticeConcepts] = useState([]);
    const [finalAssessmentResult, setFinalAssessmentResult] = useState(null);

    // In-progress saved session banner (if exists in localStorage)
    const [savedSessionBanner, setSavedSessionBanner] = useState(null);

    // Timer States
    const [timeLeftSeconds, setTimeLeftSeconds] = useState(MAX_DURATION_SECONDS);
    const [sessionId, setSessionId] = useState(null);
    const [sessionStartedAt, setSessionStartedAt] = useState(null);
    const timerRef = useRef(null);

    // Initialize Assessment on Mount:
    // If active in-flight attempt exists in localStorage, restore it without reshuffling.
    // Otherwise, generate preview curriculum for the Intro screen.
    useEffect(() => {
        try {
            const saved = localStorage.getItem("dyslearn_active_session");
            if (saved) {
                const parsed = JSON.parse(saved);
                if (
                    parsed.classNumber === classNumber &&
                    parsed.subject.toLowerCase() === subject.toLowerCase() &&
                    parsed.startedAt &&
                    parsed.sessionData &&
                    Array.isArray(parsed.sessionData.rounds) &&
                    parsed.sessionData.rounds.length > 0
                ) {
                    const elapsed = Math.floor(
                        (Date.now() - new Date(parsed.startedAt).getTime()) / 1000
                    );
                    if (elapsed < MAX_DURATION_SECONDS) {
                        // In-flight active session found: restore exactly without reshuffling
                        setSessionId(parsed.sessionId);
                        setSessionStartedAt(parsed.startedAt);
                        setTimeLeftSeconds(MAX_DURATION_SECONDS - elapsed);
                        setDifficulty(parsed.difficulty || "medium");
                        setCurrentRoundIdx(parsed.currentRoundIdx || 0);
                        setRoundResults(parsed.roundResults || []);
                        setSessionData(parsed.sessionData);
                        setSavedSessionBanner({
                            roundIndex: (parsed.currentRoundIdx || 0) + 1,
                            totalRounds: parsed.sessionData.rounds.length,
                            currentRoundTitle:
                                parsed.sessionData.rounds[parsed.currentRoundIdx || 0]?.title ||
                                `Round ${(parsed.currentRoundIdx || 0) + 1}`,
                            secondsLeft: MAX_DURATION_SECONDS - elapsed,
                        });
                        setSessionState("active");
                        return;
                    } else {
                        localStorage.removeItem("dyslearn_active_session");
                    }
                }
            }
        } catch (e) {
            console.warn("Could not restore saved session:", e);
        }

        // Preview curriculum for intro screen with randomized schedule
        const previewCurriculum = generateAssessmentSession(classNumber, subject, difficulty);
        setSessionData(previewCurriculum);
    }, [classNumber, subject]);

    // Authoritative 30-Minute Timer
    useEffect(() => {
        if (sessionState === "active" || sessionState === "transition") {
            timerRef.current = setInterval(() => {
                setTimeLeftSeconds((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleAutoSubmitOnExpiry();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [sessionState]);

    // Speech Narration Helper
    const handleSpeak = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8; // Gentle pace for dyslexia comprehension

        let lang = "en-IN";
        const normSub = subject.toLowerCase();
        if (normSub === "hindi") lang = "hi-IN";
        else if (normSub === "kannada") lang = "kn-IN";

        utterance.lang = lang;
        window.speechSynthesis.speak(utterance);
    };

    // Difficulty switch on Intro Screen
    const handleDifficultyChange = (newLevel) => {
        setDifficulty(newLevel);
        const newPreview = generateAssessmentSession(classNumber, subject, newLevel);
        setSessionData(newPreview);
    };

    // Reroll schedule on Intro Screen
    const handleRerollSchedule = () => {
        const fresh = generateAssessmentSession(classNumber, subject, difficulty);
        setSessionData(fresh);
    };

    // Resume in-progress session if user was on intro
    const handleResumeExistingSession = () => {
        try {
            const saved = localStorage.getItem("dyslearn_active_session");
            if (saved) {
                const parsed = JSON.parse(saved);
                const elapsed = Math.floor(
                    (Date.now() - new Date(parsed.startedAt).getTime()) / 1000
                );
                if (elapsed < MAX_DURATION_SECONDS) {
                    setSessionId(parsed.sessionId);
                    setSessionStartedAt(parsed.startedAt);
                    setTimeLeftSeconds(MAX_DURATION_SECONDS - elapsed);
                    setDifficulty(parsed.difficulty || "medium");
                    setCurrentRoundIdx(parsed.currentRoundIdx || 0);
                    setRoundResults(parsed.roundResults || []);
                    setSessionData(parsed.sessionData);
                    setSessionState("active");
                    return;
                }
            }
        } catch (e) {}
        handleStartNewSession();
    };

    // Start Session Action - Generates a genuinely NEW randomized curriculum and freezes it for this attempt
    const handleStartNewSession = async () => {
        // Clear any old active session
        localStorage.removeItem("dyslearn_active_session");
        setSavedSessionBanner(null);

        let activeChild = null;
        try {
            const rawChild = localStorage.getItem("activeChild");
            if (rawChild) activeChild = JSON.parse(rawChild);
        } catch (e) {}

        // 1. Generate a new balanced, randomly shuffled assessment session for this attempt
        const freshCurriculum = generateAssessmentSession(classNumber, subject, difficulty);

        // 2. Start server-tracked session
        const serverSession = await startAssessmentSession({
            classNumber,
            subject,
            difficulty,
            childId: activeChild?._id || null,
        });

        const startTimestamp = serverSession.startedAt || new Date().toISOString();
        const activeSessionId = serverSession.sessionId || `session_${Date.now()}`;

        // 3. Freeze into localStorage: refreshing will NOT reshuffle this attempt
        localStorage.setItem(
            "dyslearn_active_session",
            JSON.stringify({
                sessionId: activeSessionId,
                classNumber,
                subject,
                difficulty,
                startedAt: startTimestamp,
                currentRoundIdx: 0,
                roundResults: [],
                sessionData: freshCurriculum,
            })
        );

        // 4. Update state to begin Round 1
        setSessionId(activeSessionId);
        setSessionStartedAt(startTimestamp);
        setTimeLeftSeconds(MAX_DURATION_SECONDS);
        setCurrentRoundIdx(0);
        setRoundResults([]);
        setMasteredConcepts([]);
        setPracticeConcepts([]);
        setSessionData(freshCurriculum);
        setSessionState("active");
    };

    // Handle completion of each round
    const handleRoundComplete = (result) => {
        const currentRound = sessionData.rounds[currentRoundIdx];
        const updatedRoundResults = [
            ...roundResults,
            {
                roundIndex: currentRound.roundIndex,
                gameType: currentRound.gameType,
                title: currentRound.title,
                skill: currentRound.skill,
                score: result.score,
                maxScore: result.maxScore,
                concept: result.concept,
                details: result.details,
            },
        ];

        setRoundResults(updatedRoundResults);

        // Track concepts mastered vs practice
        if (result.isCorrect) {
            setMasteredConcepts((prev) => [...prev, result.concept]);
        } else if (result.concept) {
            setPracticeConcepts((prev) => [...prev, result.concept]);
        }
        if (result.masteredConcepts) {
            setMasteredConcepts((prev) => [...prev, ...result.masteredConcepts]);
        }
        if (result.practiceConcepts) {
            setPracticeConcepts((prev) => [...prev, ...result.practiceConcepts]);
        }

        // Check if last round completed
        if (currentRoundIdx >= sessionData.rounds.length - 1) {
            finalizeAssessment(updatedRoundResults);
        } else {
            // Show brief encouraging transition
            setSessionState("transition");
        }
    };

    const handleContinueNextRound = () => {
        const nextIdx = currentRoundIdx + 1;
        setCurrentRoundIdx(nextIdx);
        setSessionState("active");

        // Update local session storage
        try {
            const saved = localStorage.getItem("dyslearn_active_session");
            if (saved) {
                const parsed = JSON.parse(saved);
                parsed.currentRoundIdx = nextIdx;
                parsed.roundResults = roundResults;
                localStorage.setItem("dyslearn_active_session", JSON.stringify(parsed));
            }
        } catch (e) {}
    };

    // Auto submit if 30-minute timer expires
    const handleAutoSubmitOnExpiry = () => {
        finalizeAssessment(roundResults, true);
    };

    // Finalize assessment on server & local state
    const finalizeAssessment = async (resultsToSubmit, isExpired = false) => {
        if (timerRef.current) clearInterval(timerRef.current);
        localStorage.removeItem("dyslearn_active_session");
        setSavedSessionBanner(null);

        let activeChild = null;
        try {
            const rawChild = localStorage.getItem("activeChild");
            if (rawChild) activeChild = JSON.parse(rawChild);
        } catch (e) {}

        // Calculate scores:
        // Games: rounds 1-5 (max 60 points)
        // Theory: round 6 (max 40 points)
        let gameScore = 0;
        let theoryScore = 0;

        resultsToSubmit.forEach((r) => {
            if (r.gameType === "theoretical-assessment") {
                theoryScore += r.score;
            } else {
                gameScore += r.score;
            }
        });

        const durationSeconds = MAX_DURATION_SECONDS - timeLeftSeconds;

        const payload = {
            sessionId,
            classNumber,
            subject,
            difficulty,
            childId: activeChild?._id || null,
            studentName: activeChild?.name || "Student",
            rawGameScore: gameScore,
            rawTheoryScore: theoryScore,
            maxGameScore: 60,
            maxTheoryScore: 40,
            roundsCompleted: resultsToSubmit.length,
            totalRounds: sessionData ? sessionData.rounds.length : 6,
            gameBreakdown: resultsToSubmit,
            conceptsMastered: [...new Set(masteredConcepts)],
            conceptsToPractice: [...new Set(practiceConcepts)],
            clientStartedAt: sessionStartedAt,
            clientDurationSeconds: durationSeconds,
        };

        const serverResponse = await submitAssessment(payload);
        setFinalAssessmentResult(serverResponse.assessment);
        setSessionState("completed");
    };

    // Format remaining time MM:SS
    const minutesLeft = Math.floor(timeLeftSeconds / 60);
    const secondsLeft = timeLeftSeconds % 60;
    const formattedTimer = `${minutesLeft}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
    const isTimerWarning = timeLeftSeconds < 300; // < 5 mins
    const isTimerDanger = timeLeftSeconds < 120; // < 2 mins

    const currentRoundData =
        sessionData && sessionData.rounds ? sessionData.rounds[currentRoundIdx] : null;

    // -------------------------------------------------------------
    // RENDER: Completed Stage
    // -------------------------------------------------------------
    if (sessionState === "completed" && finalAssessmentResult) {
        return (
            <AssessmentResults
                assessmentData={finalAssessmentResult}
                onRestart={() => {
                    localStorage.removeItem("dyslearn_active_session");
                    setSavedSessionBanner(null);
                    setCurrentRoundIdx(0);
                    setRoundResults([]);
                    setMasteredConcepts([]);
                    setPracticeConcepts([]);
                    setFinalAssessmentResult(null);
                    const freshCurriculum = generateAssessmentSession(classNumber, subject, difficulty);
                    setSessionData(freshCurriculum);
                    setSessionState("intro");
                }}
            />
        );
    }

    return (
        <div className="assessmentSessionPage">
            <Header />

            <main className="assessmentMainContainer">
                {/* =========================================================
                    INTRO SCREEN
                ========================================================= */}
                {sessionState === "intro" && (
                    <section className="assessmentIntroCard">
                        {savedSessionBanner && (
                            <div className="activeAttemptBanner">
                                <div>
                                    <div className="bannerInfoTitle">
                                        <span>⏳</span> In-Progress Attempt Found
                                    </div>
                                    <p className="bannerInfoDetail">
                                        You have an active session at{" "}
                                        <strong>{savedSessionBanner.currentRoundTitle}</strong> (
                                        {Math.floor(savedSessionBanner.secondsLeft / 60)}m{" "}
                                        {savedSessionBanner.secondsLeft % 60}s remaining).
                                    </p>
                                </div>
                                <div className="bannerActionsRow">
                                    <button
                                        type="button"
                                        className="bannerResumeBtn"
                                        onClick={handleResumeExistingSession}
                                    >
                                        ▶ Resume Attempt
                                    </button>
                                    <button
                                        type="button"
                                        className="bannerNewAttemptBtn"
                                        onClick={handleStartNewSession}
                                    >
                                        🎲 Start Fresh Attempt
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="introHeaderArea">
                            <span className="introEyebrow">
                                DYSLEARN MULTIMODAL ASSESSMENT
                            </span>
                            <h1>
                                Class {classNumber} •{" "}
                                {subject.charAt(0).toUpperCase() + subject.slice(1)} Assessment
                            </h1>
                            <p className="introSubtitle">
                                An interactive, low-stress, curriculum-based evaluation uniting
                                educational games and textbook theoretical knowledge. Every new
                                attempt features a freshly randomized game order!
                            </p>
                        </div>

                        {/* Difficulty Selector */}
                        <div className="difficultySelectorArea">
                            <label className="difficultyLabel">Select Challenge Level:</label>
                            <div className="difficultyButtonsRow">
                                {["easy", "medium", "hard"].map((level) => (
                                    <button
                                        key={level}
                                        type="button"
                                        className={`diffBtn diff-${level} ${
                                            difficulty === level ? "diffBtnActive" : ""
                                        }`}
                                        onClick={() => handleDifficultyChange(level)}
                                    >
                                        <span className="diffIcon">
                                            {level === "easy"
                                                ? "🌱"
                                                : level === "medium"
                                                ? "🚀"
                                                : "👑"}
                                        </span>
                                        <span className="diffTitle">
                                            {level.charAt(0).toUpperCase() + level.slice(1)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Live Randomized Schedule Preview */}
                        <div className="upcomingRoundsPreview">
                            <div className="previewHeaderRow">
                                <h4>🎲 Dynamic Round Schedule for This Attempt:</h4>
                                <button
                                    type="button"
                                    className="rerollBtn"
                                    onClick={handleRerollSchedule}
                                    title="Shuffle the game round sequence"
                                >
                                    🎲 Reroll Schedule
                                </button>
                            </div>
                            <div className="roundSchedulePills">
                                {sessionData?.rounds?.map((round, idx) => (
                                    <div key={idx} className="roundSchedulePill">
                                        <span className="roundScheduleNum">#{idx + 1}</span>
                                        <span>{round.gameLabel}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="roundScheduleNote">
                                ✨ Rounds are dynamically shuffled at the start of every new attempt
                                without fixed positions or duplicates.
                            </p>
                        </div>

                        {/* 30-Minute Time Budget Guide */}
                        <div className="timeBudgetSection">
                            <h3>⏱️ Unified 30-Minute Assessment Structure</h3>
                            <div className="budgetGrid">
                                <div className="budgetItem">
                                    <span className="budgetTime">~3 Mins</span>
                                    <strong>Introduction & Setup</strong>
                                    <p>Understand the rules at your own relaxed pace.</p>
                                </div>
                                <div className="budgetItem">
                                    <span className="budgetTime">~15 Mins</span>
                                    <strong>5 Interactive Game Rounds</strong>
                                    <p>
                                        Randomized sequence covering Match the Following, Picture Detective,
                                        Sequence Builder, Memory, and Odd-One-Out.
                                    </p>
                                </div>
                                <div className="budgetItem">
                                    <span className="budgetTime">~12 Mins</span>
                                    <strong>Theoretical Challenge</strong>
                                    <p>5 textbook questions evaluating core understanding.</p>
                                </div>
                            </div>
                        </div>

                        {/* Dyslexia-Friendly Learning Principles */}
                        <div className="dyslexiaPrinciplesCard">
                            <h4>✨ Designed for Comfortable Learning</h4>
                            <ul className="principlesList">
                                <li>
                                    <span>✓</span> No speed pressure inside individual games. Take
                                    your time to think and observe.
                                </li>
                                <li>
                                    <span>✓</span> Large, clear image cards with high-contrast visuals
                                    in Match the Following and Detective games.
                                </li>
                                <li>
                                    <span>✓</span> Tap-to-place alternatives for all activities.
                                </li>
                                <li>
                                    <span>✓</span> Optional audio read-aloud available on all
                                    activities.
                                </li>
                            </ul>
                        </div>

                        {/* Start Action */}
                        <div className="introActionRow">
                            <button
                                type="button"
                                className="startAssessmentBtn"
                                onClick={handleStartNewSession}
                            >
                                🚀 Start Assessment Attempt (30 Mins Max)
                            </button>
                            <button
                                type="button"
                                className="cancelAssessmentBtn"
                                onClick={() => navigate(`/class/${classNumber}`)}
                            >
                                Back to Lessons
                            </button>
                        </div>
                    </section>
                )}

                {/* =========================================================
                    ACTIVE SESSION HEADER & TOP BAR
                ========================================================= */}
                {(sessionState === "active" || sessionState === "transition") && (
                    <div className="assessmentTopBar">
                        <div className="sessionMetadataCol">
                            <span className="sessionClassSubject">
                                Class {classNumber} •{" "}
                                {subject.charAt(0).toUpperCase() + subject.slice(1)}
                            </span>
                            <span className="sessionDifficultyTag">
                                Level: {difficulty.toUpperCase()}
                            </span>
                        </div>

                        <div className="sessionProgressCol">
                            <span className="roundCounterLabel">
                                Round {currentRoundIdx + 1} of{" "}
                                {sessionData?.rounds?.length || 6}:{" "}
                                <strong>
                                    {currentRoundData?.gameLabel || currentRoundData?.title}
                                </strong>
                            </span>
                            <div className="roundProgressTrack">
                                <div
                                    className="roundProgressFill"
                                    style={{
                                        width: `${
                                            ((currentRoundIdx + 1) /
                                                (sessionData?.rounds?.length || 6)) *
                                            100
                                        }%`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Authoritative Overall Countdown Timer & Restart Action */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div
                                className={`sessionTimerBox ${
                                    isTimerDanger
                                        ? "timerDanger"
                                        : isTimerWarning
                                        ? "timerWarning"
                                        : ""
                                }`}
                                title="Total remaining session time (30 minutes max)"
                            >
                                <span className="timerIcon">⏱️</span>
                                <span className="timerValue">{formattedTimer}</span>
                            </div>
                            <button
                                type="button"
                                className="newAttemptTopBarBtn"
                                onClick={() => {
                                    if (
                                        window.confirm(
                                            "Start a fresh assessment attempt with a new randomized game order? Current in-progress score will be reset."
                                        )
                                    ) {
                                        handleStartNewSession();
                                    }
                                }}
                                title="Start a fresh attempt with a new randomized game order"
                            >
                                🔄 New Attempt
                            </button>
                        </div>
                    </div>
                )}

                {/* =========================================================
                    TRANSITION RECAP SCREEN
                ========================================================= */}
                {sessionState === "transition" && (
                    <section className="roundTransitionCard">
                        <div className="transitionIcon">🎉</div>
                        <h2>
                            Round {currentRoundIdx + 1} of{" "}
                            {sessionData?.rounds?.length || 6} Complete!
                        </h2>
                        <p className="transitionFeedback">
                            Great work! You have finished <strong>{currentRoundData?.title}</strong>.
                        </p>
                        <div className="transitionProgressInfoGrid">
                            <div className="transitionInfoItem">
                                <span className="transitionInfoLabel">Completed</span>
                                <strong className="transitionInfoVal">
                                    Activity {currentRoundIdx + 1} of{" "}
                                    {sessionData?.rounds?.length || 6}
                                </strong>
                            </div>
                            <div className="transitionInfoItem">
                                <span className="transitionInfoLabel">Remaining</span>
                                <strong className="transitionInfoVal">
                                    {(sessionData?.rounds?.length || 6) - (currentRoundIdx + 1)}{" "}
                                    Activities
                                </strong>
                            </div>
                            <div className="transitionInfoItem">
                                <span className="transitionInfoLabel">Session Time Left</span>
                                <strong className="transitionInfoVal">{formattedTimer}</strong>
                            </div>
                        </div>
                        {currentRoundIdx + 1 < (sessionData?.rounds?.length || 6) && (
                            <p style={{ marginTop: "16px", fontWeight: "700", color: "var(--assess-primary)" }}>
                                Next Up: Round {currentRoundIdx + 2} —{" "}
                                {sessionData.rounds[currentRoundIdx + 1]?.gameLabel}
                            </p>
                        )}
                        <p className="transitionEncouragement">
                            Take a deep breath and keep going! Your comprehensive performance summary
                            will be revealed when all rounds are completed.
                        </p>
                        <button
                            type="button"
                            className="gameActionPrimaryBtn continueRoundBtn"
                            onClick={handleContinueNextRound}
                        >
                            Continue to Next Activity →
                        </button>
                    </section>
                )}

                {/* =========================================================
                    ACTIVE ROUND CONTENT
                ========================================================= */}
                {sessionState === "active" && currentRoundData && (
                    <div className="activeRoundContainer">
                        {currentRoundData.gameType === "picture-detective" && (
                            <PictureDetectiveGame
                                key={`${currentRoundData.gameType}_${currentRoundData.roundIndex}_${sessionId}`}
                                roundData={currentRoundData}
                                onComplete={handleRoundComplete}
                                onSpeak={handleSpeak}
                            />
                        )}

                        {currentRoundData.gameType === "connect-match" && (
                            <ConnectMatchGame
                                key={`${currentRoundData.gameType}_${currentRoundData.roundIndex}_${sessionId}`}
                                roundData={currentRoundData}
                                onComplete={handleRoundComplete}
                                onSpeak={handleSpeak}
                            />
                        )}

                        {currentRoundData.gameType === "sequence-builder" && (
                            <SequenceBuilderGame
                                key={`${currentRoundData.gameType}_${currentRoundData.roundIndex}_${sessionId}`}
                                roundData={currentRoundData}
                                onComplete={handleRoundComplete}
                                onSpeak={handleSpeak}
                            />
                        )}

                        {currentRoundData.gameType === "memory-challenge" && (
                            <MemoryCardGame
                                key={`${currentRoundData.gameType}_${currentRoundData.roundIndex}_${sessionId}`}
                                roundData={currentRoundData}
                                onComplete={handleRoundComplete}
                                onSpeak={handleSpeak}
                            />
                        )}

                        {currentRoundData.gameType === "odd-one-out" && (
                            <OddOneOutGame
                                key={`${currentRoundData.gameType}_${currentRoundData.roundIndex}_${sessionId}`}
                                roundData={currentRoundData}
                                onComplete={handleRoundComplete}
                                onSpeak={handleSpeak}
                            />
                        )}

                        {currentRoundData.gameType === "theoretical-assessment" && (
                            <TheoryAssessmentRound
                                key={`${currentRoundData.gameType}_${currentRoundData.roundIndex}_${sessionId}`}
                                roundData={currentRoundData}
                                onComplete={handleRoundComplete}
                                onSpeak={handleSpeak}
                            />
                        )}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default AssessmentSession;
