import { useState, useEffect } from "react";

function MemoryCardGame({ roundData, onComplete, onSpeak }) {
    // matchedPairs: Set of pairIds that have been matched
    const [matchedPairIds, setMatchedPairIds] = useState(new Set());
    // flippedCardIds: Array of up to 2 currently flipped card ids
    const [flippedCardIds, setFlippedCardIds] = useState([]);
    const [isChecking, setIsChecking] = useState(false);
    const [turnsCount, setTurnsCount] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const totalPairs = roundData.totalPairs;

    const handleCardClick = (card) => {
        if (isChecking || isFinished) return;
        // If already matched or already flipped, ignore
        if (matchedPairIds.has(card.pairId) || flippedCardIds.includes(card.id)) return;

        if (flippedCardIds.length === 0) {
            setFlippedCardIds([card.id]);
        } else if (flippedCardIds.length === 1) {
            const firstCardId = flippedCardIds[0];
            const firstCard = roundData.cards.find((c) => c.id === firstCardId);
            setFlippedCardIds([firstCardId, card.id]);
            setTurnsCount((t) => t + 1);
            setIsChecking(true);

            // Compare pairIds
            if (firstCard.pairId === card.pairId) {
                // Match found!
                setTimeout(() => {
                    const nextMatched = new Set(matchedPairIds);
                    nextMatched.add(card.pairId);
                    setMatchedPairIds(nextMatched);
                    setFlippedCardIds([]);
                    setIsChecking(false);

                    // Check if all matched
                    if (nextMatched.size === totalPairs) {
                        finishGame(nextMatched.size);
                    }
                }, 700);
            } else {
                // Not a match: flip back after 1.2s
                setTimeout(() => {
                    setFlippedCardIds([]);
                    setIsChecking(false);
                }, 1200);
            }
        }
    };

    const finishGame = (matchedCount) => {
        setIsFinished(true);
        const earnedScore = Math.round((matchedCount / totalPairs) * roundData.points);

        setTimeout(() => {
            onComplete({
                score: earnedScore,
                maxScore: roundData.points,
                concept: `Memory: ${matchedCount}/${totalPairs} Pairs Discovered`,
                isCorrect: matchedCount === totalPairs,
                details: {
                    matchedPairs: matchedCount,
                    totalPairs,
                    turnsCount,
                },
            });
        }, 1800);
    };

    return (
        <div className="gameCard memoryGameContainer">
            <div className="gameRoundHeader">
                <div className="gameSkillTag">
                    <span>🧠 {roundData.skill}</span>
                    <span className="gameSkillBadge">Memory Explorer</span>
                </div>
                <h3 className="gameTitle">{roundData.title}</h3>
                <div className="gamePromptRow">
                    <p className="gamePromptText">{roundData.prompt}</p>
                    {onSpeak && (
                        <button
                            type="button"
                            className="gameAudioBtn"
                            onClick={() => onSpeak(roundData.prompt)}
                            title="Listen to instructions"
                        >
                            🔊 Listen
                        </button>
                    )}
                </div>
            </div>

            <div className="memoryStatusBar">
                <span className="pairsFoundPill">
                    ★ Pairs Found: {matchedPairIds.size} / {totalPairs}
                </span>
                <span className="memoryTurnsPill">Flips: {turnsCount}</span>
            </div>

            {/* 3D Card Grid */}
            <div
                className={`memoryCardsGrid memoryGrid-${roundData.cards.length}`}
                role="region"
                aria-label="Memory cards grid"
            >
                {roundData.cards.map((card) => {
                    const isMatched = matchedPairIds.has(card.pairId);
                    const isFlipped = isMatched || flippedCardIds.includes(card.id);

                    return (
                        <div
                            key={card.id}
                            className={`memoryCardScene ${isFlipped ? "cardFlipped" : ""} ${
                                isMatched ? "cardMatched" : ""
                            }`}
                            onClick={() => handleCardClick(card)}
                            tabIndex={0}
                            role="button"
                            aria-label={
                                isFlipped
                                    ? `Card showing ${card.label}`
                                    : "Face down memory card"
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handleCardClick(card);
                                }
                            }}
                        >
                            <div className="memoryCardInner">
                                {/* Card Front (Face Down) */}
                                <div className="cardFace cardFaceFront">
                                    <span className="cardHiddenIcon">?</span>
                                    <span className="cardHiddenLabel">Tap to Flip</span>
                                </div>

                                {/* Card Back (Face Up) */}
                                <div className="cardFace cardFaceBack">
                                    {card.type === "image" ? (
                                        <div className="memoryImageWrapper">
                                            <img
                                                src={card.content}
                                                alt={card.label}
                                                className="memoryCardImg"
                                            />
                                            <span className="memoryCardCaption">{card.label}</span>
                                        </div>
                                    ) : (
                                        <div className="memoryTextWrapper">
                                            <span className="memoryCardWord">{card.content}</span>
                                        </div>
                                    )}
                                    {isMatched && <span className="matchedStarBadge">★</span>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Micro Feedback */}
            {matchedPairIds.size === totalPairs && (
                <div className="gameFeedbackBanner feedbackSuccess">
                    <span>🎉 Fantastic Memory! You paired all concepts with high precision!</span>
                </div>
            )}

            {/* Footer Action */}
            <div className="gameFooterActions">
                {matchedPairIds.size < totalPairs && matchedPairIds.size > 0 && (
                    <button
                        type="button"
                        className="gameActionSecondaryBtn"
                        onClick={() => finishGame(matchedPairIds.size)}
                        disabled={isFinished}
                    >
                        Save Progress & Continue →
                    </button>
                )}
            </div>
        </div>
    );
}

export default MemoryCardGame;
