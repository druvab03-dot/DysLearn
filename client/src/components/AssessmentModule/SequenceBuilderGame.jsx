import { useState } from "react";

function SequenceBuilderGame({ roundData, onComplete, onSpeak }) {
    // placedTiles: array of tile objects or null, e.g. [tile1, null, tile2]
    const [placedTiles, setPlacedTiles] = useState(
        new Array(roundData.targetSequence.length).fill(null)
    );
    // availableTiles: list of tile objects currently in the pool
    const [poolTiles, setPoolTiles] = useState(roundData.availableTiles);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Tap to place tile in first empty slot
    const handleTileTap = (tile) => {
        if (isSubmitted) return;
        const emptyIndex = placedTiles.findIndex((t) => t === null);
        if (emptyIndex === -1) return; // All slots full

        const nextPlaced = [...placedTiles];
        nextPlaced[emptyIndex] = tile;
        setPlacedTiles(nextPlaced);
        setPoolTiles((prev) => prev.filter((t) => t.id !== tile.id));
    };

    // Tap to remove tile from slot and return to pool
    const handleSlotTap = (index) => {
        if (isSubmitted) return;
        const tile = placedTiles[index];
        if (!tile) return;

        const nextPlaced = [...placedTiles];
        nextPlaced[index] = null;
        setPlacedTiles(nextPlaced);
        setPoolTiles((prev) => [...prev, tile]);
    };

    // Drag & Drop handlers
    const handleDragStart = (e, tile) => {
        e.dataTransfer.setData("text/plain", tile.id);
    };

    const handleDrop = (e, slotIndex) => {
        e.preventDefault();
        if (isSubmitted) return;
        const tileId = e.dataTransfer.getData("text/plain");
        const tile = poolTiles.find((t) => t.id === tileId);
        if (!tile) return;

        const nextPlaced = [...placedTiles];
        const existingSlotTile = nextPlaced[slotIndex];

        nextPlaced[slotIndex] = tile;
        setPlacedTiles(nextPlaced);

        // If slot already had a tile, return it to pool; otherwise remove tile from pool
        let nextPool = poolTiles.filter((t) => t.id !== tile.id);
        if (existingSlotTile) {
            nextPool.push(existingSlotTile);
        }
        setPoolTiles(nextPool);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleReset = () => {
        if (isSubmitted) return;
        setPlacedTiles(new Array(roundData.targetSequence.length).fill(null));
        setPoolTiles(roundData.availableTiles);
    };

    const handleSubmit = () => {
        if (isSubmitted) return;
        setIsSubmitted(true);

        const currentAnswer = placedTiles.map((t) => (t ? t.label : ""));
        let correctCount = 0;
        roundData.targetSequence.forEach((expected, idx) => {
            if (currentAnswer[idx] === expected) correctCount++;
        });

        const isFullyCorrect = correctCount === roundData.targetSequence.length;
        const earnedScore = Math.round(
            (correctCount / roundData.targetSequence.length) * roundData.points
        );

        setTimeout(() => {
            onComplete({
                score: earnedScore,
                maxScore: roundData.points,
                concept: `Sequence: ${roundData.targetWord}`,
                isCorrect: isFullyCorrect,
                details: {
                    userSequence: currentAnswer.join(" - "),
                    expectedSequence: roundData.targetSequence.join(" - "),
                    isFullyCorrect,
                },
            });
        }, 1800);
    };

    const allSlotsFilled = placedTiles.every((t) => t !== null);

    return (
        <div className="gameCard sequenceGameContainer">
            <div className="gameRoundHeader">
                <div className="gameSkillTag">
                    <span>🔤 {roundData.skill}</span>
                    <span className="gameSkillBadge">Sequencing Challenge</span>
                </div>
                <h3 className="gameTitle">{roundData.title}</h3>
                <div className="gamePromptRow">
                    <p className="gamePromptText">{roundData.prompt}</p>
                    {onSpeak && (
                        <button
                            type="button"
                            className="gameAudioBtn"
                            onClick={() => onSpeak(roundData.prompt)}
                            title="Listen to clue"
                        >
                            🔊 Listen
                        </button>
                    )}
                </div>
            </div>

            <div className="sequenceClueCard">
                <span className="clueEyebrow">💡 Clue:</span>
                <p className="clueDescription">{roundData.clue}</p>
                <span className="tapInstructionHint">
                    ✨ Accessible: Tap a piece to place it, or tap a slot to remove it. You can also drag!
                </span>
            </div>

            {/* Target Slots */}
            <div className="slotsContainer" aria-label="Target sequence slots">
                {placedTiles.map((tile, idx) => {
                    const isCorrectSlot =
                        isSubmitted && tile?.label === roundData.targetSequence[idx];
                    const isWrongSlot =
                        isSubmitted && tile?.label !== roundData.targetSequence[idx];

                    return (
                        <div
                            key={`slot_${idx}`}
                            className={`sequenceSlot ${
                                tile ? "slotFilled" : "slotEmpty"
                            } ${isCorrectSlot ? "slotCorrect" : ""} ${
                                isWrongSlot ? "slotWrong" : ""
                            }`}
                            onDrop={(e) => handleDrop(e, idx)}
                            onDragOver={handleDragOver}
                            onClick={() => handleSlotTap(idx)}
                            role="button"
                            tabIndex={0}
                            title={tile ? "Tap to remove" : "Drop or tap piece here"}
                        >
                            <span className="slotIndexNumber">{idx + 1}</span>
                            {tile ? (
                                <span className="slotTileLabel">{tile.label}</span>
                            ) : (
                                <span className="slotPlaceholder">Drop Here</span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Available Tiles Pool */}
            <div className="tilesPoolSection">
                <span className="poolHeaderTag">Available Pieces (Tap or Drag):</span>
                <div className="tilesPoolGrid">
                    {poolTiles.map((tile) => (
                        <button
                            key={tile.id}
                            type="button"
                            draggable={!isSubmitted}
                            onDragStart={(e) => handleDragStart(e, tile)}
                            onClick={() => handleTileTap(tile)}
                            className="sequenceTileBtn"
                        >
                            {tile.label}
                        </button>
                    ))}
                    {poolTiles.length === 0 && (
                        <span className="poolEmptyHint">✓ All pieces placed in slots!</span>
                    )}
                </div>
            </div>

            {/* Micro Feedback */}
            {isSubmitted && (
                <div
                    className={`gameFeedbackBanner ${
                        placedTiles.every(
                            (t, idx) => t?.label === roundData.targetSequence[idx]
                        )
                            ? "feedbackSuccess"
                            : "feedbackGuidance"
                    }`}
                >
                    <span>
                        Target: <strong>{roundData.targetSequence.join(" ")}</strong>
                    </span>
                </div>
            )}

            {/* Footer Action */}
            <div className="gameFooterActions">
                <button
                    type="button"
                    className="gameActionSecondaryBtn"
                    onClick={handleReset}
                    disabled={isSubmitted || poolTiles.length === roundData.availableTiles.length}
                >
                    🔄 Clear & Start Over
                </button>
                <button
                    type="button"
                    className="gameActionPrimaryBtn"
                    onClick={handleSubmit}
                    disabled={!allSlotsFilled || isSubmitted}
                >
                    {isSubmitted ? "Evaluating Sequence..." : "Check Sequence ✓"}
                </button>
            </div>
        </div>
    );
}

export default SequenceBuilderGame;
