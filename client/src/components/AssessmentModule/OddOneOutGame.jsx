import { useState } from "react";

function OddOneOutGame({ roundData, onComplete, onSpeak }) {
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSelect = (id) => {
        if (isSubmitted) return;
        setSelectedItemId(id);
    };

    const handleSubmit = () => {
        if (!selectedItemId || isSubmitted) return;
        setIsSubmitted(true);

        const chosen = roundData.items.find((i) => i.id === selectedItemId);
        const isCorrect = chosen?.isOdd;
        const earnedScore = isCorrect ? roundData.points : Math.round(roundData.points * 0.4);

        setTimeout(() => {
            onComplete({
                score: earnedScore,
                maxScore: roundData.points,
                concept: roundData.categoryTitle,
                isCorrect,
                details: {
                    categoryTitle: roundData.categoryTitle,
                    chosen: chosen?.text,
                    isCorrect,
                    reason: roundData.correctReason,
                },
            });
        }, 2000);
    };

    const chosenItem = roundData.items.find((i) => i.id === selectedItemId);

    return (
        <div className="gameCard oddGameContainer">
            <div className="gameRoundHeader">
                <div className="gameSkillTag">
                    <span>🧩 {roundData.skill}</span>
                    <span className="gameSkillBadge">Pattern Detective</span>
                </div>
                <h3 className="gameTitle">{roundData.title}</h3>
                <div className="gamePromptRow">
                    <p className="gamePromptText">{roundData.prompt}</p>
                    {onSpeak && (
                        <button
                            type="button"
                            className="gameAudioBtn"
                            onClick={() => onSpeak(roundData.prompt)}
                            title="Listen to question"
                        >
                            🔊 Listen
                        </button>
                    )}
                </div>
            </div>

            <div className="categoryThemeHeader">
                <span className="themeTag">Topic: {roundData.categoryTitle}</span>
                <span className="themeInstruction">
                    Three items follow a shared textbook rule. Spot the one that does NOT belong!
                </span>
            </div>

            {/* 4 Items Grid */}
            <div className="oddItemsGrid" role="radiogroup" aria-label="Odd-one-out choices">
                {roundData.items.map((item) => {
                    const isSelected = selectedItemId === item.id;
                    let cardClass = "";

                    if (isSubmitted) {
                        if (item.isOdd) cardClass = "oddCardCorrect";
                        else if (isSelected && !item.isOdd) cardClass = "oddCardWrong";
                    } else if (isSelected) {
                        cardClass = "oddCardSelected";
                    }

                    return (
                        <div
                            key={item.id}
                            role="radio"
                            aria-checked={isSelected}
                            tabIndex={0}
                            className={`oddItemCard ${cardClass}`}
                            onClick={() => handleSelect(item.id)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handleSelect(item.id);
                                }
                            }}
                        >
                            <div className="oddItemHeader">
                                <span className="oddItemIndex">
                                    {isSelected ? "●" : "○"}
                                </span>
                                <strong className="oddItemText">{item.text}</strong>
                            </div>

                            {item.detail && (
                                <p className="oddItemDetail">{item.detail}</p>
                            )}

                            {isSubmitted && item.isOdd && (
                                <div className="oddReasonBadge">
                                    <span>🎯 Odd One Out!</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Micro Feedback */}
            {isSubmitted && (
                <div
                    className={`gameFeedbackBanner ${
                        chosenItem?.isOdd ? "feedbackSuccess" : "feedbackGuidance"
                    }`}
                >
                    <p>
                        <strong>Explanation:</strong> {roundData.correctReason}
                    </p>
                </div>
            )}

            {/* Footer Action */}
            <div className="gameFooterActions">
                <button
                    type="button"
                    className="gameActionPrimaryBtn"
                    onClick={handleSubmit}
                    disabled={!selectedItemId || isSubmitted}
                >
                    {isSubmitted ? "Evaluating Reason..." : "Check Odd-One-Out ✓"}
                </button>
            </div>
        </div>
    );
}

export default OddOneOutGame;
