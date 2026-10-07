import {
    useState,
    useEffect,
    useRef
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./LearningModule.css";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import {
    CURRICULUM_DATA,
    SUBJECT_METADATA
} from "./curriculumData";

const LANGUAGE_LOCALES = {
    en: "en-IN",
    hi: "hi-IN",
    kn: "kn-IN"
};

function LearningModule() {
    const { classNumber: paramClass = "1", subject: paramSubject = "english" } = useParams();
    const navigate = useNavigate();

    // Active Class (1 - 5) directly derived from URL params
    const selectedClass = ["1", "2", "3", "4", "5"].includes(paramClass) ? paramClass : "1";

    // Active Subject (english, hindi, kannada, maths, evs) directly derived from URL params
    const normalizedSubject = (paramSubject || "english").toLowerCase();
    const selectedSubject = CURRICULUM_DATA[selectedClass]?.[normalizedSubject] ? normalizedSubject : "english";

    // Active Language Toggle (en | hi | kn)
    const [activeLang, setActiveLang] = useState("en");

    // Active Topic within selected Class & Subject
    const [topicIndex, setTopicIndex] = useState(0);

    // Active Unit within selected Topic
    const [unitIndex, setUnitIndex] = useState(0);

    // Active Card within selected Unit (0-3 = Visual Cards, 4-7 = Font Cards)
    const [cardIndex, setCardIndex] = useState(0);

    // Dynamic Filter for Educational Content (all | vocabulary | phonetic_sound)
    const [contentFilter, setContentFilter] = useState("all");

    // Audio Speech Synthesis
    const [isSpeaking, setIsSpeaking] = useState(false);
    const speechRef = useRef(null);

    // Current subject data tree
    const currentClassData = CURRICULUM_DATA[selectedClass] || CURRICULUM_DATA[1];
    const currentSubjectData = currentClassData[selectedSubject] || currentClassData.english;
    const topics = currentSubjectData.topics || [];
    const activeTopic = topics[topicIndex] || topics[0] || { title: {}, units: [] };
    const units = activeTopic.units || [];

    // Filter units based on lesson content category
    const vocabCount = units.filter((u) => u.category === "vocabulary" || !u.category).length;
    const phonicCount = units.filter((u) => u.category === "phonetic_sound").length;

    const displayUnits = units.filter((u) => {
        if (contentFilter === "all") return true;
        if (contentFilter === "vocabulary") return u.category === "vocabulary" || !u.category;
        if (contentFilter === "phonetic_sound") return u.category === "phonetic_sound";
        return true;
    });
    const effectiveUnits = displayUnits.length > 0 ? displayUnits : units;
    const activeUnit = effectiveUnits[unitIndex] || effectiveUnits[0] || { label: "", cards: [] };
    const cards = activeUnit.cards || [];
    const currentCard = cards[cardIndex] || cards[0] || { en: "", hi: "", kn: "", type: "visual" };

    const isVisualCard =
        currentCard.type === "visual" &&
        Boolean(currentCard.image_url || currentCard.imageUrl);
    const fontStyleClass = currentCard.fontClass || "font-dyslexic";

    // Text to display & speak based on active language
    const currentDisplayText = currentCard[activeLang] || currentCard.en || "";

    /* ==========================================================================
       Minimal Audio Text-To-Speech (Rate = 0.8)
       Locale: en-IN, hi-IN, or kn-IN based on active language setting
       ========================================================================== */
    const stopSpeech = () => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const speakCard = () => {
        if (typeof window === "undefined" || !window.speechSynthesis) return;

        if (isSpeaking) {
            stopSpeech();
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(currentDisplayText);
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.lang = LANGUAGE_LOCALES[activeLang] || "en-IN";

        // Find best match voice for Indian English, Hindi, or Kannada
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
            (v) =>
                v.lang.toLowerCase() === utterance.lang.toLowerCase() ||
                v.lang.toLowerCase().startsWith(activeLang)
        );

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    // Stop speaking on unmount
    useEffect(() => {
        return () => {
            if (typeof window !== "undefined" && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    /* ==========================================================================
       Navigation Handlers
       ========================================================================== */
    const handleClassChange = (newClass) => {
        stopSpeech();
        setContentFilter("all");
        setTopicIndex(0);
        setUnitIndex(0);
        setCardIndex(0);
        navigate(`/class/${newClass}/${selectedSubject}`);
    };

    const handleSubjectChange = (newSubject) => {
        stopSpeech();
        setContentFilter("all");
        setTopicIndex(0);
        setUnitIndex(0);
        setCardIndex(0);
        navigate(`/class/${selectedClass}/${newSubject}`);
    };

    const handleTopicChange = (newTopicIdx) => {
        stopSpeech();
        setContentFilter("all");
        setTopicIndex(newTopicIdx);
        setUnitIndex(0);
        setCardIndex(0);
    };

    const handleFilterChange = (newFilter) => {
        stopSpeech();
        setContentFilter(newFilter);
        setUnitIndex(0);
        setCardIndex(0);
    };

    const handleUnitChange = (newUnitIdx) => {
        stopSpeech();
        setUnitIndex(newUnitIdx);
        setCardIndex(0);
    };

    const handleCardSelect = (newCardIdx) => {
        stopSpeech();
        setCardIndex(newCardIdx);
    };

    const handlePrevious = () => {
        stopSpeech();
        if (cardIndex > 0) {
            setCardIndex((prev) => prev - 1);
        } else if (unitIndex > 0) {
            setUnitIndex((prev) => prev - 1);
            setCardIndex(7);
        } else if (topicIndex > 0) {
            const prevTopic = topics[topicIndex - 1];
            setTopicIndex((prev) => prev - 1);
            setUnitIndex(prevTopic.units.length - 1);
            setCardIndex(7);
        }
    };

    const handleNext = () => {
        stopSpeech();
        if (cardIndex < 7) {
            setCardIndex((prev) => prev + 1);
        } else if (unitIndex < effectiveUnits.length - 1) {
            setUnitIndex((prev) => prev + 1);
            setCardIndex(0);
        } else if (topicIndex < topics.length - 1) {
            setTopicIndex((prev) => prev + 1);
            setUnitIndex(0);
            setCardIndex(0);
        }
    };

    // Keyboard navigation (Left, Right, Space/S)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                handlePrevious();
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                handleNext();
            } else if (e.key === " " || e.key.toLowerCase() === "s") {
                e.preventDefault();
                speakCard();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    });

    const isFirstCard = topicIndex === 0 && unitIndex === 0 && cardIndex === 0;
    const isLastCard =
        topicIndex === topics.length - 1 &&
        unitIndex === effectiveUnits.length - 1 &&
        cardIndex === 7;

    return (
        <div className="learningModulePage theme-linen">
            <Header />

            <main className="learningModuleMain">
                <div className="learningModuleContainer">
                    {/* Minimal Top Bar: Navigation Breadcrumb & Multilingual Toggle */}
                    <div className="moduleTopBar">
                        <div className="moduleTitleBlock">
                            <span className="moduleBadge">
                                Class {selectedClass} • {SUBJECT_METADATA[selectedSubject]?.name || "English"}
                            </span>
                            <span className="moduleTopicTitle">
                                {activeTopic.title?.[activeLang] || activeTopic.title?.en || "Learning"}
                            </span>
                        </div>

                        {/* Multilingual Selector: Minimal Top Toggle [EN | HI | KN] */}
                        <div className="langToggleGroup" role="group" aria-label="Language selector">
                            <button
                                type="button"
                                className={`langToggleBtn ${activeLang === "en" ? "active" : ""}`}
                                onClick={() => setActiveLang("en")}
                                aria-label="English language"
                            >
                                EN
                            </button>
                            <button
                                type="button"
                                className={`langToggleBtn ${activeLang === "hi" ? "active" : ""}`}
                                onClick={() => setActiveLang("hi")}
                                aria-label="Hindi language"
                            >
                                HI
                            </button>
                            <button
                                type="button"
                                className={`langToggleBtn ${activeLang === "kn" ? "active" : ""}`}
                                onClick={() => setActiveLang("kn")}
                                aria-label="Kannada language"
                            >
                                KN
                            </button>
                        </div>
                    </div>

                    {/* Class & Subject Selector Tabs */}
                    <div className="curriculumSelectorStrip">
                        {/* Class Pills (1 - 5) */}
                        <div className="classPillGroup" role="tablist" aria-label="Class selection">
                            {["1", "2", "3", "4", "5"].map((cNum) => (
                                <button
                                    key={cNum}
                                    type="button"
                                    className={`classPillBtn ${selectedClass === cNum ? "active" : ""}`}
                                    onClick={() => handleClassChange(cNum)}
                                    aria-selected={selectedClass === cNum}
                                >
                                    Class {cNum}
                                </button>
                            ))}
                        </div>

                        {/* Subject Pills (English, Hindi, Kannada, Maths, EVS) */}
                        <div className="subjectPillGroup" role="tablist" aria-label="Subject selection">
                            {Object.entries(SUBJECT_METADATA).map(([sKey, sMeta]) => {
                                const isActive = selectedSubject === sKey;
                                const subjectLabel =
                                    activeLang === "hi"
                                        ? sMeta.hiName
                                        : activeLang === "kn"
                                        ? sMeta.knName
                                        : sMeta.name;

                                return (
                                    <button
                                        key={sKey}
                                        type="button"
                                        className={`subjectPillBtn ${isActive ? "active" : ""}`}
                                        onClick={() => handleSubjectChange(sKey)}
                                        aria-selected={isActive}
                                    >
                                        <span className="pillIcon">{sMeta.icon}</span>
                                        <span className="pillLabel">{subjectLabel}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Topics Row (if multiple topics in subject) */}
                    {topics.length > 1 && (
                        <div className="topicRibbon" role="tablist" aria-label="Topics">
                            {topics.map((t, idx) => {
                                const isActive = idx === topicIndex;
                                const topicName = t.title[activeLang] || t.title.en;
                                return (
                                    <button
                                        key={t.id}
                                        type="button"
                                        className={`topicBtn ${isActive ? "active" : ""}`}
                                        onClick={() => handleTopicChange(idx)}
                                        aria-selected={isActive}
                                    >
                                        {topicName}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Curriculum Lesson Content Filter: Vocabulary vs Phonetic Sounds */}
                    <div className="contentFilterStrip" role="group" aria-label="Curriculum content filter">
                        <button
                            type="button"
                            className={`contentFilterBtn ${contentFilter === "all" ? "active" : ""}`}
                            onClick={() => handleFilterChange("all")}
                        >
                            All ({units.length})
                        </button>
                        <button
                            type="button"
                            className={`contentFilterBtn ${contentFilter === "vocabulary" ? "active" : ""}`}
                            onClick={() => handleFilterChange("vocabulary")}
                            disabled={vocabCount === 0}
                        >
                            🔤 Vocabulary ({vocabCount})
                        </button>
                        <button
                            type="button"
                            className={`contentFilterBtn ${contentFilter === "phonetic_sound" ? "active" : ""}`}
                            onClick={() => handleFilterChange("phonetic_sound")}
                            disabled={phonicCount === 0}
                        >
                            🎵 Phonetics ({phonicCount})
                        </button>
                    </div>

                    {/* Topic Units Ribbon (e.g. A-Z, Swar, Shapes, Units) */}
                    <nav className="unitRibbonContainer" aria-label="Units ribbon">
                        <div className="unitRibbon">
                            {effectiveUnits.map((item, idx) => {
                                const isSelected = idx === unitIndex;
                                const isPhonic = item.category === "phonetic_sound";
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className={`ribbonUnitBtn ${isSelected ? "active" : ""} ${isPhonic ? "phonicItem" : ""}`}
                                        onClick={() => handleUnitChange(idx)}
                                        aria-label={`Unit ${item.label}`}
                                        aria-current={isSelected ? "true" : undefined}
                                    >
                                        {isPhonic ? `🎵 ${item.label}` : item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Minimal Progress Header: Active Unit & 8 Step Dots - Strictly NO Counter Text */}
                    <div className="cardProgressHeader">
                        <div className="progressLabel">
                            <span className="unitHighlight">{activeUnit.label}</span>
                            {activeUnit.category === "phonetic_sound" && (
                                <span className="phonicHeaderTag">🎵 Phonics</span>
                            )}
                        </div>

                        {/* Minimal Step Dots (Exactly 8 dots, NO numbers or counter text) */}
                        <div className="cardStepPills" role="tablist" aria-label="Card steps">
                            {cards.map((c, i) => {
                                const isActive = i === cardIndex;
                                return (
                                    <button
                                        key={c.id}
                                        type="button"
                                        className={`stepDot ${isActive ? "active" : ""}`}
                                        onClick={() => handleCardSelect(i)}
                                        aria-label={`Step ${i + 1}`}
                                        aria-selected={isActive}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* ==========================================================
                        MAIN CARD (STRICT 8-CARD PATTERN)
                        - Visual Cards (1-4): Image + Minimal Text
                        - Font Cards (5-8): Strictly ONLY Text (NO image container)
                       ========================================================== */}
                    <article className="mainCardWrapper" aria-live="polite">
                        {isVisualCard ? (
                            /* Visual Card Layout: High-Accuracy Image + Minimal Text */
                            <div className="mainCardInner visualLayout">
                                <div className="cardVisualSection">
                                    <img
                                        src={currentCard.image_url || currentCard.imageUrl}
                                        alt={currentDisplayText}
                                        className="cardHeroImage"
                                        onError={(e) => {
                                            const currentSrc = e.target.src || "";
                                            if (currentSrc.includes("/learning/images/") && currentSrc.endsWith(".png")) {
                                                e.target.src = currentSrc.replace("/learning/images/", "/learning/svgs/").replace(".png", ".svg");
                                                return;
                                            }
                                            e.target.onerror = null;
                                            if (currentCard.svg_fallback) {
                                                e.target.src = currentCard.svg_fallback;
                                            } else {
                                                // High contrast minimal placeholder fallback
                                                e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23FEF3C7"/><text x="50%" y="50%" font-family="sans-serif" font-size="32" font-weight="bold" fill="%231E293B" text-anchor="middle" dominant-baseline="middle">${encodeURIComponent(activeUnit.label)}</text></svg>`;
                                            }
                                        }}
                                    />
                                </div>

                                <div className="cardContentSection">
                                    <div className="cardBadgeRow">
                                        {currentCard.category === "phonetic_sound" ? (
                                            <span className="cardTypeBadge phonicBadge">
                                                🎵 Phonics {currentCard.phonetic_sound ? `• ${currentCard.phonetic_sound}` : ""}
                                            </span>
                                        ) : (
                                            <span className="cardTypeBadge vocabBadge">
                                                🔤 Vocabulary
                                            </span>
                                        )}
                                        {currentCard.syllables && (
                                            <span className="cardTypeBadge syllableBadge">
                                                {currentCard.syllables}
                                            </span>
                                        )}
                                    </div>

                                    <div className="cardTextCenter">
                                        <div className="giantLetterDisplay font-dyslexic">
                                            {activeUnit.label}
                                        </div>

                                        <h2 className="minimalCardText font-dyslexic">
                                            {currentDisplayText}
                                        </h2>
                                    </div>

                                    <div className="cardSpeakerRow">
                                        <button
                                            type="button"
                                            className={`minimalSpeakerBtn ${isSpeaking ? "speaking" : ""}`}
                                            onClick={speakCard}
                                            aria-label="Speak text"
                                            title="Speak text"
                                        >
                                            🔊
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Font-Variation Card Layout: Strictly Text ONLY (NO image) */
                            <div className="mainCardInner fontOnlyLayout">
                                <div className="fontOnlyCardContent">
                                    <div className="cardBadgeRow">
                                        {currentCard.category === "phonetic_sound" ? (
                                            <span className="cardTypeBadge phonicBadge">
                                                🎵 Phonics {currentCard.phonetic_sound ? `• ${currentCard.phonetic_sound}` : ""}
                                            </span>
                                        ) : (
                                            <span className="cardTypeBadge vocabBadge">
                                                🔤 Vocabulary
                                            </span>
                                        )}
                                        {currentCard.syllables && (
                                            <span className="cardTypeBadge syllableBadge">
                                                {currentCard.syllables}
                                            </span>
                                        )}
                                    </div>

                                    <div className="cardTextCenter">
                                        <div className={`giantLetterDisplay ${fontStyleClass}`}>
                                            {activeUnit.label}
                                        </div>

                                        <h2 className={`minimalCardText ${fontStyleClass}`}>
                                            {currentDisplayText}
                                        </h2>
                                    </div>

                                    <div className="cardSpeakerRow">
                                        <button
                                            type="button"
                                            className={`minimalSpeakerBtn ${isSpeaking ? "speaking" : ""}`}
                                            onClick={speakCard}
                                            aria-label="Speak text"
                                            title="Speak text"
                                        >
                                            🔊
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </article>

                    {/* Minimal Navigation: Arrows (← and →) ONLY - Strictly NO Counter Text */}
                    <div className="cardNavigationRow">
                        <button
                            type="button"
                            className="minimalNavBtn prev"
                            onClick={handlePrevious}
                            disabled={isFirstCard}
                            aria-label="Previous card"
                            title="Previous card"
                        >
                            ←
                        </button>

                        <div className="navProgressSummary">
                            <strong>{activeUnit.label}</strong>
                        </div>

                        <button
                            type="button"
                            className="minimalNavBtn next"
                            onClick={handleNext}
                            disabled={isLastCard}
                            aria-label="Next card"
                            title="Next card"
                        >
                            →
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default LearningModule;
