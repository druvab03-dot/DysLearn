import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./TrainingModule.css";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useTheme } from "../../context/ThemeContext";
import { getTrainingQuestions, getTrainingSummary } from "./trainingData";

function TrainingModule({ defaultMode = "image" }) {
    const { classNumber = "1", subject = "english" } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { t } = useTranslation();

    const [mode, setMode] = useState(defaultMode); // 'image' | 'text'
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // Normalize subject
    const normSubject = String(subject).toLowerCase().trim();
    const aliasMap = {
        science: "evs",
        gk: "evs",
        "general knowledge": "evs",
        maths: "mathematics",
        math: "mathematics"
    };
    const resolvedSubject = aliasMap[normSubject] || normSubject;
    const displaySubjectName =
        resolvedSubject.charAt(0).toUpperCase() + resolvedSubject.slice(1);

    // Get questions for active class, subject, and mode
    const questions = getTrainingQuestions(classNumber, resolvedSubject, mode);
    const currentQuestion = questions[currentIndex] || null;
    const totalQuestions = questions.length;

    // Reset session whenever class, subject, or mode changes
    useEffect(() => {
        window.speechSynthesis.cancel();
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsRevealed(false);
        setIsCompleted(false);
    }, [classNumber, resolvedSubject, mode]);

    // Stop TTS when leaving page
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    /* ===================================================
       SPEECH SYNTHESIS (TTS) FOR DYSLEXIA READABILITY
    =================================================== */
    const speakText = (text) => {
        if (!text) return;
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang =
            resolvedSubject === "kannada"
                ? "kn-IN"
                : resolvedSubject === "hindi"
                ? "hi-IN"
                : "en-IN";
        utterance.rate = 0.8;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    };

    /* ===================================================
       INTERACTION HANDLERS
    =================================================== */
    const handleSelectOption = (option) => {
        if (isRevealed) return; // Locked once answer is revealed
        setSelectedOption(option);
    };

    const handleRevealAnswer = () => {
        if (!currentQuestion) return;
        setIsRevealed(true);

        // Announce encouraging audio feedback
        if (selectedOption === currentQuestion.correctAnswer) {
            speakText(`Correct! The answer is ${currentQuestion.correctAnswer}. ${currentQuestion.explanation}`);
        } else if (selectedOption) {
            speakText(`Nice try. The correct answer is ${currentQuestion.correctAnswer}. ${currentQuestion.explanation}`);
        } else {
            speakText(`The correct answer is ${currentQuestion.correctAnswer}. ${currentQuestion.explanation}`);
        }
    };

    const handleNextQuestion = () => {
        window.speechSynthesis.cancel();
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
            setIsRevealed(false);
        } else {
            setIsCompleted(true);
        }
    };

    const handleRestart = () => {
        window.speechSynthesis.cancel();
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsRevealed(false);
        setIsCompleted(false);
    };

    const handleSwitchMode = (newMode) => {
        if (newMode === mode) return;
        window.speechSynthesis.cancel();
        setMode(newMode);
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsRevealed(false);
        setIsCompleted(false);
    };

    const progressPercentage =
        totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

    return (
        <div className={`trainingPage theme-${theme}`}>
            <Header />

            <main className="trainingMain">
                {/* TOP NAVIGATION & CONTEXT BAR */}
                <div className="trainingTopBar">
                    <button
                        type="button"
                        className="trainingBackBtn"
                        onClick={() => navigate(`/class/${classNumber}`)}
                        aria-label="Back to Class Dashboard"
                    >
                        ← {t("classDashboard.class", "Class")} {classNumber}
                    </button>

                    <div className="trainingBreadcrumb">
                        <span className="trainingClassBadge">
                            Class {classNumber}
                        </span>
                        <span className="trainingSubjectBadge">
                            {displaySubjectName}
                        </span>
                    </div>

                    <button
                        type="button"
                        className="trainingLessonsBtn"
                        onClick={() => navigate(`/class/${classNumber}/${resolvedSubject}`)}
                    >
                        📖 {t("training.viewLessons", "Concept Lessons")}
                    </button>
                </div>

                {/* MODE SELECTOR SWITCH */}
                <div className="trainingModeSelector">
                    <button
                        type="button"
                        className={`modeTabBtn ${mode === "image" ? "active" : ""}`}
                        onClick={() => handleSwitchMode("image")}
                        aria-pressed={mode === "image"}
                    >
                        <span className="modeIcon">🖼️</span>
                        <span className="modeLabel">
                            Image-Based Training
                        </span>
                    </button>

                    <button
                        type="button"
                        className={`modeTabBtn ${mode === "text" ? "active" : ""}`}
                        onClick={() => handleSwitchMode("text")}
                        aria-pressed={mode === "text"}
                    >
                        <span className="modeIcon">📝</span>
                        <span className="modeLabel">
                            Text-Based Training
                        </span>
                    </button>
                </div>

                {/* PROGRESS TRACKER */}
                {!isCompleted && totalQuestions > 0 && (
                    <div className="trainingProgressContainer">
                        <div className="progressLabels">
                            <span className="progressCount">
                                Question {currentIndex + 1} of {totalQuestions}
                            </span>
                            <span className="progressTopic">
                                {currentQuestion?.topic || "Textbook Topic"}
                            </span>
                        </div>
                        <div className="trainingProgressBarTrack">
                            <div
                                className="trainingProgressBarFill"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* QUESTION CONTAINER OR COMPLETION CARD */}
                {!isCompleted && currentQuestion ? (
                    <div className="trainingCardWrapper">
                        <article className={`trainingCard card-${mode}`}>
                            {/* QUESTION HEADER WITH AUDIO SPEAKER */}
                            <div className="questionHeader">
                                <div className="questionTextGroup">
                                    <span className="questionBadge">
                                        {mode === "image"
                                            ? "Visual Recognition"
                                            : "Text Learning"}
                                    </span>
                                    <h1 className="questionPrompt">
                                        {currentQuestion.question}
                                    </h1>
                                </div>
                                <button
                                    type="button"
                                    className="questionSpeakerBtn"
                                    onClick={() => speakText(currentQuestion.question)}
                                    title="Listen to question"
                                    aria-label="Listen to question aloud"
                                >
                                    🔊
                                </button>
                            </div>

                            {/* IMAGE CARD (ONLY FOR IMAGE-BASED MODE) */}
                            {mode === "image" && currentQuestion.image && (
                                <div className="questionImageFrame">
                                    <img
                                        src={currentQuestion.image}
                                        alt={currentQuestion.concept || "Educational picture"}
                                        className="questionRealPhoto"
                                        loading="eager"
                                    />
                                </div>
                            )}

                            {/* MULTIPLE CHOICE OPTIONS */}
                            <div className="optionsGrid">
                                {currentQuestion.options.map((option, idx) => {
                                    const optionLetter = String.fromCharCode(65 + idx);
                                    const isSelected = selectedOption === option;
                                    const isCorrect = option === currentQuestion.correctAnswer;

                                    let optionClass = "optionBtn";
                                    if (isSelected) optionClass += " selected";
                                    if (isRevealed) {
                                        if (isCorrect) optionClass += " revealed-correct";
                                        else if (isSelected) optionClass += " revealed-incorrect";
                                        else optionClass += " revealed-muted";
                                    }

                                    return (
                                        <button
                                            key={`${currentQuestion.id}-opt-${idx}`}
                                            type="button"
                                            className={optionClass}
                                            onClick={() => handleSelectOption(option)}
                                            disabled={isRevealed}
                                            aria-pressed={isSelected}
                                        >
                                            <span className="optionMarker">
                                                {optionLetter}
                                            </span>
                                            <span className="optionText">
                                                {option}
                                            </span>
                                            {isRevealed && isCorrect && (
                                                <span className="optionStatusIcon correct">
                                                    ✓
                                                </span>
                                            )}
                                            {isRevealed && isSelected && !isCorrect && (
                                                <span className="optionStatusIcon incorrect">
                                                    ✗
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* REVEALED ANSWER & EXPLANATION BANNER (ON THE SAME CARD) */}
                            {isRevealed && (
                                <div className="revealedAnswerContainer">
                                    <div
                                        className={`feedbackBanner ${
                                            selectedOption === currentQuestion.correctAnswer
                                                ? "feedback-correct"
                                                : "feedback-support"
                                        }`}
                                    >
                                        <div className="feedbackHeader">
                                            <span className="feedbackEmoji">
                                                {selectedOption === currentQuestion.correctAnswer
                                                    ? "🌟"
                                                    : "💡"}
                                            </span>
                                            <strong>
                                                {selectedOption === currentQuestion.correctAnswer
                                                    ? "Wonderful! That's correct!"
                                                    : selectedOption
                                                    ? "Good try! Here is the correct answer:"
                                                    : "Here is the textbook answer:"}
                                            </strong>
                                        </div>

                                        <p className="revealedCorrectText">
                                            <strong>Correct Answer:</strong>{" "}
                                            <span>{currentQuestion.correctAnswer}</span>
                                        </p>

                                        {currentQuestion.explanation && (
                                            <div className="explanationBox">
                                                <div className="explanationHeader">
                                                    <span>📖 Why this is correct:</span>
                                                    <button
                                                        type="button"
                                                        className="explanationSpeakerBtn"
                                                        onClick={() =>
                                                            speakText(currentQuestion.explanation)
                                                        }
                                                        title="Listen to explanation"
                                                        aria-label="Listen to explanation aloud"
                                                    >
                                                        🔊 Listen
                                                    </button>
                                                </div>
                                                <p className="explanationText">
                                                    {currentQuestion.explanation}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ACTION BUTTONS */}
                            <div className="trainingActionBar">
                                {!isRevealed ? (
                                    <button
                                        type="button"
                                        className="revealBtn"
                                        onClick={handleRevealAnswer}
                                    >
                                        <span className="btnIcon">👁️</span>
                                        <span>Reveal Answer</span>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="nextQuestionBtn"
                                        onClick={handleNextQuestion}
                                    >
                                        <span>
                                            {currentIndex < totalQuestions - 1
                                                ? "Next Question →"
                                                : "Complete Training 🎉"}
                                        </span>
                                    </button>
                                )}
                            </div>
                        </article>
                    </div>
                ) : isCompleted ? (
                    /* COMPLETION CELEBRATION CARD */
                    <div className="trainingCompletionContainer">
                        <div className="completionCard">
                            <span className="completionEmoji">🎉</span>
                            <h2>Well Done!</h2>
                            <p className="completionMessage">
                                You have finished all questions in{" "}
                                <strong>
                                    {mode === "image" ? "Image-Based" : "Text-Based"} Training
                                </strong>{" "}
                                for <strong>Class {classNumber} {displaySubjectName}</strong>!
                            </p>
                            <p className="completionSub">
                                Training helps us learn and remember educational concepts with confidence.
                            </p>

                            <div className="completionActionGrid">
                                <button
                                    type="button"
                                    className="completionBtn restartBtn"
                                    onClick={handleRestart}
                                >
                                    🔄 Practice Again
                                </button>

                                <button
                                    type="button"
                                    className="completionBtn switchModeBtn"
                                    onClick={() =>
                                        handleSwitchMode(mode === "image" ? "text" : "image")
                                    }
                                >
                                    🔀 Try {mode === "image" ? "Text-Based" : "Image-Based"} Training
                                </button>

                                <button
                                    type="button"
                                    className="completionBtn lessonsBtn"
                                    onClick={() =>
                                        navigate(`/class/${classNumber}/${resolvedSubject}`)
                                    }
                                >
                                    📖 Back to Concept Lessons
                                </button>

                                <button
                                    type="button"
                                    className="completionBtn dashboardBtn"
                                    onClick={() => navigate(`/class/${classNumber}`)}
                                >
                                    🏫 Back to Class Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="trainingEmptyState">
                        <p>No training questions available for this selection.</p>
                        <button
                            type="button"
                            className="btnPrimary"
                            onClick={() => navigate(`/class/${classNumber}`)}
                        >
                            Back to Class {classNumber}
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default TrainingModule;
