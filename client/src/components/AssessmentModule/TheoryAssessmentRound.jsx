import { useState } from "react";

function TheoryAssessmentRound({ roundData, onComplete, onSpeak }) {
    const [currentQIndex, setCurrentQIndex] = useState(0);
    // userAnswers: { [questionId]: chosenOptionString }
    const [userAnswers, setUserAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const questions = roundData.questions || [];
    const currentQuestion = questions[currentQIndex] || questions[0];

    const handleOptionSelect = (option) => {
        if (isSubmitted || !currentQuestion) return;
        setUserAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: option,
        }));
    };

    const handleNext = () => {
        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex((idx) => idx + 1);
        }
    };

    const handlePrev = () => {
        if (currentQIndex > 0) {
            setCurrentQIndex((idx) => idx - 1);
        }
    };

    const handleSubmit = () => {
        if (isSubmitted) return;
        setIsSubmitted(true);

        let correctCount = 0;
        const masteredConcepts = [];
        const practiceConcepts = [];
        const questionReview = [];

        questions.forEach((q) => {
            const chosen = userAnswers[q.id];
            const isCorrect = chosen === q.correctAnswer;
            if (isCorrect) {
                correctCount++;
                masteredConcepts.push(q.concept || q.question);
            } else {
                practiceConcepts.push(q.concept || q.question);
            }

            questionReview.push({
                id: q.id,
                question: q.question,
                chosen,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                isCorrect,
                concept: q.concept,
            });
        });

        // 8 points per question x 5 = 40 points
        const pointsPerQuestion = roundData.points / questions.length;
        const earnedScore = Math.round(correctCount * pointsPerQuestion);

        setTimeout(() => {
            onComplete({
                score: earnedScore,
                maxScore: roundData.points,
                concept: `Theoretical Knowledge (${correctCount}/${questions.length} Correct)`,
                isCorrect: correctCount === questions.length,
                masteredConcepts,
                practiceConcepts,
                details: {
                    correctCount,
                    totalQuestions: questions.length,
                    questionReview,
                },
            });
        }, 1600);
    };

    const answeredCount = Object.keys(userAnswers).length;
    const allAnswered = answeredCount === questions.length;

    return (
        <div className="gameCard theoryGameContainer">
            <div className="gameRoundHeader">
                <div className="gameSkillTag">
                    <span>📖 {roundData.skill}</span>
                    <span className="gameSkillBadge">Knowledge Check</span>
                </div>
                <h3 className="gameTitle">{roundData.title}</h3>
                <div className="gamePromptRow">
                    <p className="gamePromptText">{roundData.prompt}</p>
                </div>
            </div>

            {/* Questions Step Dots */}
            <div className="theoryStepBar" aria-label="Question progress">
                {questions.map((q, idx) => {
                    const isAnswered = !!userAnswers[q.id];
                    const isActive = idx === currentQIndex;

                    return (
                        <button
                            key={q.id}
                            type="button"
                            className={`theoryStepDot ${isActive ? "stepActive" : ""} ${
                                isAnswered ? "stepAnswered" : ""
                            }`}
                            onClick={() => setCurrentQIndex(idx)}
                            title={`Jump to Question ${idx + 1}`}
                        >
                            <span>Q{idx + 1}</span>
                            {isAnswered && <span className="stepCheckMark">✓</span>}
                        </button>
                    );
                })}
            </div>

            {/* Active Question Box */}
            {currentQuestion && (
                <div className="theoryQuestionBox">
                    <div className="theoryQuestionHeader">
                        <span className="questionNumberTag">
                            Question {currentQIndex + 1} of {questions.length}
                        </span>
                        {currentQuestion.topic && (
                            <span className="questionTopicTag">
                                📚 {currentQuestion.topic}
                            </span>
                        )}
                        {onSpeak && (
                            <button
                                type="button"
                                className="gameAudioBtn"
                                onClick={() =>
                                    onSpeak(
                                        `${currentQuestion.question}. Options are: ${currentQuestion.options.join(
                                            ", "
                                        )}`
                                    )
                                }
                                title="Listen to question and options"
                            >
                                🔊 Read Question
                            </button>
                        )}
                    </div>

                    <h4 className="theoryQuestionTitle">{currentQuestion.question}</h4>

                    {/* Options List */}
                    <div className="theoryOptionsList" role="radiogroup">
                        {currentQuestion.options.map((opt, optIdx) => {
                            const isChosen = userAnswers[currentQuestion.id] === opt;
                            const optionLetters = ["A", "B", "C", "D"];

                            return (
                                <button
                                    key={optIdx}
                                    type="button"
                                    role="radio"
                                    aria-checked={isChosen}
                                    className={`theoryOptionBtn ${
                                        isChosen ? "optionSelected" : ""
                                    }`}
                                    onClick={() => handleOptionSelect(opt)}
                                    disabled={isSubmitted}
                                >
                                    <span className="optionLetterBadge">
                                        {optionLetters[optIdx] || "•"}
                                    </span>
                                    <span className="optionText">{opt}</span>
                                    {isChosen && <span className="optionSelectedIcon">✓</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Navigation & Submit Actions */}
            <div className="theoryNavigationRow">
                <button
                    type="button"
                    className="gameActionSecondaryBtn"
                    onClick={handlePrev}
                    disabled={currentQIndex === 0 || isSubmitted}
                >
                    ← Previous Question
                </button>

                <span className="theoryAnsweredHint">
                    {answeredCount} of {questions.length} Questions Answered
                </span>

                {currentQIndex < questions.length - 1 ? (
                    <button
                        type="button"
                        className="gameActionPrimaryBtn"
                        onClick={handleNext}
                        disabled={isSubmitted}
                    >
                        Next Question →
                    </button>
                ) : (
                    <button
                        type="button"
                        className="gameActionPrimaryBtn submitTheoryBtn"
                        onClick={handleSubmit}
                        disabled={!allAnswered || isSubmitted}
                    >
                        {isSubmitted
                            ? "Finalizing Assessment..."
                            : "Submit Theoretical Challenge ✓"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default TheoryAssessmentRound;
