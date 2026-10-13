import { useState } from "react";

function PictureDetectiveGame({ roundData, onComplete, onSpeak }) {
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSelect = (id) => {
        if (isSubmitted) return;
        setSelectedItemId(id);
    };

    const handleSubmit = () => {
        if (!selectedItemId || isSubmitted) return;
        setIsSubmitted(true);

        const chosen = roundData.items.find((item) => item.id === selectedItemId);
        const isCorrect = chosen?.isTarget;
        const earnedScore = isCorrect ? roundData.points : Math.round(roundData.points * 0.4);

        setTimeout(() => {
            onComplete({
                score: earnedScore,
                maxScore: roundData.points,
                concept: roundData.targetConcept,
                isCorrect,
                details: {
                    targetConcept: roundData.targetConcept,
                    chosenConcept: chosen?.concept,
                    isCorrect,
                },
            });
        }, 1600);
    };

    const chosenItem = roundData.items.find((item) => item.id === selectedItemId);

    return (
        <div className="gameCard detectiveGameContainer">
            <div className="gameRoundHeader">
                <div className="gameSkillTag">
                    <span>🔍 {roundData.skill}</span>
                    <span className="gameSkillBadge">Visual Detective</span>
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
                            aria-label="Listen to question"
                        >
                            🔊 Listen
                        </button>
                    )}
                </div>
            </div>

            <div className="detectiveInstructions">
                <span>💡 Clue:</span> {roundData.hint}
            </div>

            {/* Grid of Verified Images */}
            <div
                className={`detectiveGrid detectiveGrid-${roundData.items.length}`}
                role="radiogroup"
                aria-label="Detective scene items"
            >
                {roundData.items.map((item) => {
                    const isSelected = selectedItemId === item.id;
                    let cardStateClass = "";
                    if (isSubmitted) {
                        if (item.isTarget) cardStateClass = "detectiveTargetRevealed";
                        else if (isSelected && !item.isTarget) cardStateClass = "detectiveWrongChoice";
                    } else if (isSelected) {
                        cardStateClass = "detectiveSelected";
                    }

                    return (
                        <div
                            key={item.id}
                            role="radio"
                            aria-checked={isSelected}
                            tabIndex={0}
                            className={`detectiveCard ${cardStateClass}`}
                            onClick={() => handleSelect(item.id)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handleSelect(item.id);
                                }
                            }}
                        >
                            <div className="detectiveImageFrame">
                                <img
                                    src={item.image}
                                    alt={item.concept}
                                    className="detectiveImage"
                                    loading="lazy"
                                />
                                {isSelected && (
                                    <div className="detectiveBadge">
                                        <span>🔎 Selected</span>
                                    </div>
                                )}
                                {isSubmitted && item.isTarget && (
                                    <div className="detectiveFoundBadge">
                                        <span>✓ Target Found!</span>
                                    </div>
                                )}
                            </div>
                            <span className="detectiveItemLabel">{item.concept}</span>
                        </div>
                    );
                })}
            </div>

            {/* Micro Feedback Bar */}
            {isSubmitted && (
                <div
                    className={`gameFeedbackBanner ${
                        chosenItem?.isTarget ? "feedbackSuccess" : "feedbackGuidance"
                    }`}
                >
                    {chosenItem?.isTarget ? (
                        <span>🎉 Outstanding Detective Work! You found the {roundData.targetConcept}!</span>
                    ) : (
                        <span>💡 Good observation! The {roundData.targetConcept} is highlighted above!</span>
                    )}
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
                    {isSubmitted ? "Loading Next Activity..." : "Confirm Detective Choice ✓"}
                </button>
            </div>
        </div>
    );
}

export default PictureDetectiveGame;
