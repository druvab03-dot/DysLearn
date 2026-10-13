import { useTranslation } from "react-i18next";
import "./DyslexiaTextCard.css";

function DyslexiaTextCard({
    card,
    onSpeak,
    lessonNumber = 1
}) {
    const { t } = useTranslation();
    if (!card) return null;

    const typoStyle = card.typoStyle || 1;
    const styleClass = `typoStyle${typoStyle}`;

    const styleNames = {
        1: t("learningModule.styleBalanced", "Balanced Reading"),
        2: t("learningModule.stylePhonics", "Phonics & Sounds"),
        3: t("learningModule.styleRhythm", "Syllable Rhythm & Spacing"),
        4: t("learningModule.styleContext", "Sentence Context")
    };

    const styleBadges = {
        1: "📖 Style 1/4: Balanced Reading",
        2: "🔊 Style 2/4: Phonics & Sounds",
        3: "✨ Style 3/4: Rhythmic Spacing",
        4: "🎯 Style 4/4: Sentence Context"
    };

    return (
        <article className={`dyslexiaTextCard ${styleClass}`}>
            {/* Visual Header Banner */}
            <div className="dyslexiaCardHeader">
                <div className="dyslexiaBadgeRow">
                    <span className="dyslexiaModeBadge">
                        {card.badge || styleBadges[typoStyle] || `📖 Typography Style ${typoStyle} of 4`}
                    </span>
                    <span className="conceptReinforceBadge">
                        {card.conceptTitle ? `${card.conceptTitle} (Card ${card.cardNumber || 5} of 8)` : `Concept ${card.conceptNumber || 1}`}
                    </span>
                </div>

                <h2 className="dyslexiaCardTitle">
                    {card.heading}
                </h2>

                <p className="dyslexiaCardSubheading">
                    {card.subheading || styleNames[typoStyle]}
                </p>
            </div>

            {/* Main Reading Canvas */}
            <div className="dyslexiaReadingArea">
                {/* Large Focus Box */}
                {(card.highlightLetter || card.highlightWord || card.phonicsSound) && (
                    <div className="dyslexiaFocusBox">
                        {card.highlightLetter && (
                            <div className="dyslexiaLetterPill">
                                <span className="pillLabel">{t("learningModule.letter", "Letter")}</span>
                                <strong className="pillValue">{card.highlightLetter}</strong>
                            </div>
                        )}
                        {card.highlightWord && (
                            <div className="dyslexiaWordPill">
                                <span className="pillLabel">{t("learningModule.word", "Word")}</span>
                                <strong className="pillValue">{card.highlightWord}</strong>
                            </div>
                        )}
                        {card.phonicsSound && (
                            <div className="dyslexiaSoundPill">
                                <span className="pillLabel">{t("learningModule.sound", "Sound")}</span>
                                <span className="pillValue">{card.phonicsSound}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Chunked Short Reading Sentences */}
                <div className="dyslexiaChunksList">
                    {card.chunks?.map((chunk, idx) => (
                        <div key={idx} className="dyslexiaChunkItem">
                            <span className="chunkDot">•</span>
                            <span className="chunkText">{chunk}</span>
                        </div>
                    ))}
                </div>

                {/* Example metadata box */}
                {card.example && (
                    <div className="dyslexiaExampleBox">
                        <span className="exampleTitle">{t("learningModule.examplePractice", "Example Practice:")}</span>
                        <p className="exampleContent">{card.example}</p>
                    </div>
                )}
            </div>

            {/* Footer with Speaker Button */}
            <div className="dyslexiaCardFooter">
                <button
                    type="button"
                    className="dyslexiaSpeakerButton"
                    onClick={onSpeak}
                    aria-label="Listen to dyslexia reading card"
                >
                    <span className="speakerIcon">🔊</span>
                    <span>{t("learningModule.listenAloud", "Listen Aloud")}</span>
                </button>
            </div>
        </article>
    );
}

export default DyslexiaTextCard;
