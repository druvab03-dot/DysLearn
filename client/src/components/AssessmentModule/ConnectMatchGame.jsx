import { useState } from "react";

function ConnectMatchGame({ roundData, onComplete, onSpeak }) {
    // connections: { [leftId]: rightId }
    const [connections, setConnections] = useState({});
    const [selectedLeftId, setSelectedLeftId] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleLeftClick = (leftId) => {
        if (isSubmitted) return;
        setSelectedLeftId(leftId);
    };

    const handleRightClick = (rightId) => {
        if (isSubmitted) return;
        if (!selectedLeftId) {
            // If right was clicked first, look if it's already connected to disconnect it
            const existingLeft = Object.keys(connections).find((l) => connections[l] === rightId);
            if (existingLeft) {
                const next = { ...connections };
                delete next[existingLeft];
                setConnections(next);
            }
            return;
        }

        // Link selectedLeftId with rightId
        setConnections((prev) => ({
            ...prev,
            [selectedLeftId]: rightId,
        }));
        setSelectedLeftId(null);
    };

    const handleRemoveLink = (leftId) => {
        if (isSubmitted) return;
        const next = { ...connections };
        delete next[leftId];
        setConnections(next);
    };

    const handleSubmit = () => {
        if (isSubmitted) return;
        setIsSubmitted(true);

        let correctMatches = 0;
        roundData.leftItems.forEach((left) => {
            const connectedRightId = connections[left.id];
            const rightItem = roundData.rightItems.find((r) => r.id === connectedRightId);
            if (rightItem && left.matchKey === rightItem.matchKey) {
                correctMatches++;
            }
        });

        const totalPairs = roundData.totalPairs;
        const earnedScore = Math.round((correctMatches / totalPairs) * roundData.points);

        setTimeout(() => {
            onComplete({
                score: earnedScore,
                maxScore: roundData.points,
                concept: `${correctMatches}/${totalPairs} Pairs Connected`,
                isCorrect: correctMatches === totalPairs,
                details: {
                    correctMatches,
                    totalPairs,
                },
            });
        }, 1800);
    };

    const allConnected = Object.keys(connections).length === roundData.leftItems.length;

    return (
        <div className="gameCard connectGameContainer">
            <div className="gameRoundHeader">
                <div className="gameSkillTag">
                    <span>🔗 {roundData.skill}</span>
                    <span className="gameSkillBadge">Match the Following</span>
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

            <div className="connectColumnsLayout">
                {/* Left Column: Big Image Cards */}
                <div className="connectColumn leftColumn">
                    <span className="columnHeaderTag">Pictures & Concepts</span>
                    {roundData.leftItems.map((left) => {
                        const isSelected = selectedLeftId === left.id;
                        const isConnected = !!connections[left.id];
                        const connectedRight = roundData.rightItems.find(
                            (r) => r.id === connections[left.id]
                        );

                        let cardClass = "";
                        if (isSubmitted) {
                            const isMatchCorrect =
                                connectedRight && left.matchKey === connectedRight.matchKey;
                            cardClass = isMatchCorrect ? "matchCardCorrect" : "matchCardWrong";
                        } else if (isSelected) {
                            cardClass = "matchCardActive";
                        } else if (isConnected) {
                            cardClass = "matchCardLinked";
                        }

                        return (
                            <div
                                key={left.id}
                                className={`connectCard connectImageCard ${cardClass}`}
                                onClick={() => handleLeftClick(left.id)}
                                tabIndex={0}
                                role="button"
                                aria-label={`Select picture ${left.text}`}
                            >
                                {left.image && (
                                    <div className="connectImageWrapper">
                                        <img
                                            src={left.image}
                                            alt={left.text}
                                            className="connectCardImageLarge"
                                            loading="eager"
                                        />
                                    </div>
                                )}
                                <div className="connectCardBody">
                                    <strong className="connectCardLabel">{left.text}</strong>
                                    {isConnected && (
                                        <div className="connectedPill">
                                            <span>➔ Linked: {connectedRight?.text}</span>
                                            {!isSubmitted && (
                                                <button
                                                    type="button"
                                                    className="disconnectBtn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveLink(left.id);
                                                    }}
                                                    title="Remove link"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="connectDivider">
                    <span>⇄</span>
                    <span className="connectDividerText">Match</span>
                </div>

                {/* Right Column: Matched Words & Descriptions */}
                <div className="connectColumn rightColumn">
                    <span className="columnHeaderTag">Matching Words & Definitions</span>
                    {roundData.rightItems.map((right) => {
                        const connectedLeftId = Object.keys(connections).find(
                            (l) => connections[l] === right.id
                        );
                        const isConnected = !!connectedLeftId;
                        const connectedLeft = roundData.leftItems.find(
                            (l) => l.id === connectedLeftId
                        );

                        let cardClass = "";
                        if (isSubmitted) {
                            const isMatchCorrect =
                                connectedLeft && connectedLeft.matchKey === right.matchKey;
                            cardClass = isMatchCorrect ? "matchCardCorrect" : "matchCardWrong";
                        } else if (isConnected) {
                            cardClass = "matchCardLinked";
                        }

                        return (
                            <div
                                key={right.id}
                                className={`connectCard connectTextCard ${cardClass}`}
                                onClick={() => handleRightClick(right.id)}
                                tabIndex={0}
                                role="button"
                                aria-label={`Match definition ${right.text}`}
                            >
                                <div className="connectCardBody">
                                    <strong className="connectTextCardLabel">{right.text}</strong>
                                    {right.subtext && (
                                        <span className="connectSubtext">{right.subtext}</span>
                                    )}
                                    {isConnected && (
                                        <div className="connectedPill">
                                            <span>✓ Partnered with {connectedLeft?.text}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer Action */}
            <div className="gameFooterActions">
                <button
                    type="button"
                    className="gameActionPrimaryBtn"
                    onClick={handleSubmit}
                    disabled={!allConnected || isSubmitted}
                >
                    {isSubmitted ? "Checking Matches..." : "Check All Connections ✓"}
                </button>
            </div>
        </div>
    );
}

export default ConnectMatchGame;
