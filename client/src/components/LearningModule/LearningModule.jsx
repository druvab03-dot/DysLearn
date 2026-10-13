import {
    useState,
    useEffect,
    useRef
} from "react";

import {
    useParams,
    useNavigate
} from "react-router-dom";

import {
    useTranslation
} from "react-i18next";

import "./LearningModule.css";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import DyslexiaTextCard from "./DyslexiaTextCard";
import { getLearningContent } from "./contentRegistry";
import {
    selectPersonalisedCards,
    recordLearningTime,
    CATEGORY_LABELS,
} from "../../services/studentCategoryService";


function LearningModule({
    subject: propSubject = "English"
}) {

    const navigate = useNavigate();

    const { classNumber, subject: paramSubject } =
        useParams();

    const effectiveSubject =
        paramSubject || propSubject || "English";

    const displaySubject =
        effectiveSubject.charAt(0).toUpperCase() + effectiveSubject.slice(1);

    const { t } =
        useTranslation();

    const [
        currentTopicIndex,
        setCurrentTopicIndex
    ] = useState(0);

    const [
        currentConceptIndex,
        setCurrentConceptIndex
    ] = useState(0);

    const [
        currentCardIndex,
        setCurrentCardIndex
    ] = useState(0);

    const [studentCategory, setStudentCategory] = useState("developing");
    const [childId, setChildId] = useState(null);

    // Active learning time and idle detection
    const activeSecondsRef = useRef(0);
    const idleSecondsRef = useRef(0);
    const lastInteractionRef = useRef(Date.now());

    // Load active child category
    useEffect(() => {
        try {
            const raw = localStorage.getItem("activeChild");
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.category) setStudentCategory(parsed.category);
                if (parsed._id) setChildId(parsed._id);
            }
        } catch (e) {}
    }, []);

    // Track active and idle time (excluding idle time > 30s)
    useEffect(() => {
        const markActive = () => {
            lastInteractionRef.current = Date.now();
        };

        window.addEventListener("mousemove", markActive);
        window.addEventListener("keydown", markActive);
        window.addEventListener("click", markActive);
        window.addEventListener("touchstart", markActive);

        const timer = setInterval(() => {
            if (document.hidden) {
                idleSecondsRef.current += 1;
                return;
            }
            const idleFor = Date.now() - lastInteractionRef.current;
            if (idleFor > 30000) {
                idleSecondsRef.current += 1;
            } else {
                activeSecondsRef.current += 1;
            }
        }, 1000);

        return () => {
            window.removeEventListener("mousemove", markActive);
            window.removeEventListener("keydown", markActive);
            window.removeEventListener("click", markActive);
            window.removeEventListener("touchstart", markActive);
            clearInterval(timer);
        };
    }, []);

    // Flush active learning time on unmount or concept change
    const flushLearningTime = () => {
        if (childId && activeSecondsRef.current >= 3) {
            recordLearningTime({
                childId,
                activeSeconds: activeSecondsRef.current,
                idleSeconds: idleSecondsRef.current,
                conceptTitle: currentConcept?.name || "",
            });
            activeSecondsRef.current = 0;
            idleSecondsRef.current = 0;
        }
    };

    useEffect(() => {
        return () => {
            flushLearningTime();
        };
    }, [childId]);

    // Reset navigation indices whenever class or subject changes
    useEffect(() => {
        window.speechSynthesis.cancel();
        setCurrentTopicIndex(0);
        setCurrentConceptIndex(0);
        setCurrentCardIndex(0);
    }, [classNumber, effectiveSubject]);

    const learningContent =
        getLearningContent(classNumber, effectiveSubject);

    const currentTopic =
        learningContent[currentTopicIndex] ||
        learningContent[0] ||
        { concepts: [] };

    const concepts =
        currentTopic?.concepts || [];

    const currentConcept =
        concepts[currentConceptIndex] ||
        concepts[0] ||
        { cards: [] };

    // Exactly four cards per concept selected according to student category:
    // Support Needed: 3 visual + 1 text = 4
    // Developing: 2 visual + 2 text = 4
    // Progressing Well: 1 visual + 3 text = 4
    const cards =
        selectPersonalisedCards(currentConcept?.cards, studentCategory);

    const currentCard =
        cards[currentCardIndex] || cards[0];

    const progress =
        cards.length > 0
            ? ((currentCardIndex + 1) / cards.length) * 100
            : 0;

    const isGroupA = currentCard?.cardType === "visual";

    /* =========================
       STOP SPEECH ON EXIT/CHANGE
    ========================= */

    useEffect(() => {

        return () => {

            window.speechSynthesis.cancel();

        };

    }, []);

    const handleTopicChange = (index) => {
        window.speechSynthesis.cancel();
        flushLearningTime();
        setCurrentTopicIndex(index);
        setCurrentConceptIndex(0);
        setCurrentCardIndex(0);
    };

    const handleConceptChange = (index) => {
        window.speechSynthesis.cancel();
        flushLearningTime();
        setCurrentConceptIndex(index);
        setCurrentCardIndex(0);
    };

    /* =========================
       SPEAKER
    ========================= */

    const speakContent = () => {

        if (
            !currentCard ||
            !currentCard.speakText
        ) {

            return;

        }

        window.speechSynthesis.cancel();

        const speech =
            new SpeechSynthesisUtterance(
                currentCard.speakText
            );

        speech.lang =
            effectiveSubject.toLowerCase() === "kannada"
                ? "kn-IN"
                : effectiveSubject.toLowerCase() === "hindi"
                ? "hi-IN"
                : "en-IN";

        speech.rate = 0.75;

        speech.pitch = 1;

        window.speechSynthesis.speak(
            speech
        );

    };

    /* =========================
       PREVIOUS
    ========================= */

    const handlePrevious = () => {

        window.speechSynthesis.cancel();

        if (currentCardIndex > 0) {

            setCurrentCardIndex(
                currentCardIndex - 1
            );

        } else if (currentConceptIndex > 0) {

            // Step back to Card 8 of the previous concept
            const prevConcept = concepts[currentConceptIndex - 1];

            const prevCards = prevConcept?.cards || [];

            setCurrentConceptIndex(currentConceptIndex - 1);

            setCurrentCardIndex(prevCards.length > 0 ? prevCards.length - 1 : 0);

        }

    };

    /* =========================
       NEXT
    ========================= */

    const handleNext = () => {

        window.speechSynthesis.cancel();

        if (
            currentCardIndex <
            cards.length - 1
        ) {

            setCurrentCardIndex(
                currentCardIndex + 1
            );

        } else if (
            currentConceptIndex <
            concepts.length - 1
        ) {

            // Advance to Card 1 of the next concept
            setCurrentConceptIndex(currentConceptIndex + 1);

            setCurrentCardIndex(0);

        }

    };

    /* =========================
       SELECT CARD
    ========================= */

    const handleCardSelect = (index) => {

        window.speechSynthesis.cancel();

        setCurrentCardIndex(index);

    };


    return (

        <div className="learningModulePage">


            {/* =========================
                HEADER
            ========================= */}

            <Header />


            {/* =========================
                MAIN
            ========================= */}

            <main className="learningModuleMain">

                <section className="learningModuleContainer">


                    {/* =========================
                        TOP HEADER
                    ========================= */}

                    <div className="learningModuleHeader">

                        <div className="learningTitleArea">

                            <div className="learningEyebrowRow">

                                <span className="learningEyebrow">

                                    {t("classDashboard.learning", "LEARNING")} • CLASS {classNumber} • {displaySubject}

                                </span>

                                <button
                                    type="button"
                                    className="learningTrainingLinkBtn"
                                    onClick={() => navigate(`/class/${classNumber}/${effectiveSubject}/training`)}
                                    title="Open Training Module for this subject"
                                >
                                    🎯 Training Mode
                                </button>

                                <button
                                    type="button"
                                    className="learningAssessmentLinkBtn"
                                    onClick={() => navigate(`/class/${classNumber}/${effectiveSubject}/assessment`)}
                                    title="Start 30-minute Gamified Assessment for this subject"
                                >
                                    🏆 Assessment
                                </button>

                            </div>

                            <h1>

                                {currentTopic?.title} — {currentConcept?.name}

                            </h1>

                            <p className="learningSourceCitation">

                                📖 {currentTopic?.textbookSource}

                            </p>

                        </div>


                        {/* PROGRESS */}

                        <div className="learningProgressBox">

                            <div className="learningProgressText">
                                <span>
                                    {t("learningModule.card", "Card")} {currentCardIndex + 1} / {cards.length || 4}
                                </span>
                                <strong>
                                    {Math.round(progress)}%
                                </strong>
                            </div>

                            <div className="learningProgressTrack">
                                <div
                                    className="learningProgressFill"
                                    style={{
                                        width: `${progress}%`
                                    }}
                                />
                            </div>

                            <span className="learningGroupHint">
                                {isGroupA
                                    ? `🖼️ Visual Learning Card (${currentCardIndex + 1} of ${cards.filter(c => c.cardType === "visual").length} visual)`
                                    : `🔤 Dyslexia Typography Card (${cards.filter(c => c.cardType === "typography").length} typography)`}
                            </span>

                            <span className="conceptProgressTag">
                                Concept {currentConceptIndex + 1} of {concepts.length}: <strong>{currentConcept?.name}</strong> (4 Cards • {CATEGORY_LABELS[studentCategory] || "Personalised"})
                            </span>

                        </div>

                    </div>


                    {/* =========================
                        TOPIC SELECTOR TABS
                    ========================= */}

                    <nav
                        className="learningTopicBar"
                        aria-label={`Class ${classNumber} ${displaySubject} Topics`}
                    >

                        <span className="topicBarLabel">

                            {t("learningModule.textbookTopics", "Textbook Topics:")}

                        </span>

                        <div className="topicTabsList">

                            {learningContent.map((topic, idx) => (

                                <button
                                    key={topic.id}
                                    type="button"
                                    className={`topicTabButton ${
                                        idx === currentTopicIndex ? "active" : ""
                                    }`}
                                    onClick={() => handleTopicChange(idx)}
                                >

                                    <span className="topicTabNumber">

                                        {idx + 1}

                                    </span>

                                    <span className="topicTabTitle">

                                        {topic.title}

                                    </span>

                                    <span className="topicConceptCount">

                                        ({topic.concepts?.length || 0})

                                    </span>

                                </button>

                            ))}

                        </div>

                    </nav>


                    {/* =========================
                        CONCEPT SELECTOR BAR (EACH WITH EXACTLY 8 CARDS)
                    ========================= */}

                    <nav
                        className="learningConceptBar"
                        aria-label="Lesson Concepts"
                    >

                        <div className="conceptBarHeader">

                            <span className="conceptBarLabel">

                                {t("learningModule.conceptsLabel", "Concepts in this Lesson")} ({concepts.length}):

                            </span>

                            <span className="conceptBarCounter">

                                {concepts.length * 8} total cards in this topic (8 cards per concept)

                            </span>

                        </div>

                        <div className="conceptTabsList">

                            {concepts.map((concept, cIdx) => (

                                <button
                                    key={concept.id}
                                    type="button"
                                    className={`conceptTabButton ${
                                        cIdx === currentConceptIndex ? "active" : ""
                                    }`}
                                    onClick={() => handleConceptChange(cIdx)}
                                    aria-label={`Select Concept ${concept.name}`}
                                >

                                    <span className="conceptTabNumber">

                                        {cIdx + 1}

                                    </span>

                                    <span className="conceptTabName">

                                        {concept.name}

                                    </span>

                                    <span className="conceptTabBadge">

                                        8 Cards

                                    </span>

                                </button>

                            ))}

                        </div>

                    </nav>


                    {/* =========================
                        LEARNING CARD DISPLAY (8 CARDS PER CONCEPT)
                        Group A (1-4): 4 Real Image Cards
                        Group B (5-8): 4 Typography Cards
                    ========================= */}

                    {currentCard && (

                        currentCard.cardType === "visual" ? (

                            <article className="learningCard visualCard">

                                {/* =========================
                                    IMAGE
                                ========================= */}

                                <div className="learningImageSection">

                                    <div className="learningImageBackground">

                                        <span>

                                            IMAGE {currentCard.imageNumber || currentCardIndex + 1} / 4

                                        </span>

                                    </div>

                                    <img
                                        src={currentCard.image}
                                        alt={currentCard.imageAlt || currentCard.heading}
                                        className="learningImage"
                                    />

                                </div>


                                {/* =========================
                                    CONTENT
                                ========================= */}

                                <div className="learningContent">

                                    <div className="visualGroupHeader">

                                        <span className="visualBadge">

                                            🖼️ Group A: Real Image {currentCard.imageNumber || currentCardIndex + 1} of 4

                                        </span>

                                        <span className="conceptPillBadge">

                                            Concept: {currentConcept?.name}

                                        </span>

                                    </div>

                                    <span className="lessonNumber">

                                        {currentConcept?.name} • REAL IMAGE {currentCard.imageNumber || currentCardIndex + 1} OF 4

                                    </span>

                                    <h2>

                                        {currentCard.heading}

                                    </h2>

                                    <p className="visualCardText">

                                        {currentCard.text}

                                    </p>

                                    {currentCard.label && (

                                        <div className="visualTagContainer">

                                            <span className="visualConceptTag">

                                                {currentCard.label}

                                            </span>

                                        </div>

                                    )}

                                    {currentCard.example && (

                                        <div className="visualExampleBox">

                                            <strong>{t("learningModule.example", "Example:")} </strong>

                                            <span>{currentCard.example}</span>

                                        </div>

                                    )}

                                    {/* SPEAKER */}

                                    <button
                                        type="button"
                                        className="learningSpeakerButton"
                                        onClick={speakContent}
                                        aria-label="Listen to lesson content"
                                    >

                                        <span className="speakerIcon">

                                            🔊

                                        </span>

                                        <span>

                                            {t("learningModule.listen", "Listen")}

                                        </span>

                                    </button>

                                </div>

                            </article>

                        ) : (

                            <DyslexiaTextCard
                                card={currentCard}
                                onSpeak={speakContent}
                                lessonNumber={currentCardIndex + 1}
                            />

                        )

                    )}


                    {/* =========================
                        NAVIGATION (8 CARDS PER CONCEPT)
                    ========================= */}

                    <div className="learningNavigation">

                        {/* PREVIOUS */}

                        <button
                            type="button"
                            className="learningNavButton learningPrevious"
                            onClick={handlePrevious}
                            disabled={currentCardIndex === 0 && currentConceptIndex === 0}
                        >

                            <span>

                                ←

                            </span>

                            {t("learningModule.previous", "Previous")}

                        </button>


                        {/* 8 CARD DOTS WITH GROUP DIVISION */}

                        {/* 4 PERSONALISED CARDS DOTS */}
                        <div className="learningDotsContainer">
                            <div className="learningDotsGroup">
                                <span className="dotsGroupLabel">
                                    {CATEGORY_LABELS[studentCategory] || "Personalised"} (4 Cards)
                                </span>
                                <div className="dotsRow">
                                    {cards.map((c, index) => (
                                        <button
                                            key={`card-dot-${index}`}
                                            type="button"
                                            className={`learningDot ${c.cardType === "typography" ? "dyslexiaDot" : ""} ${
                                                index === currentCardIndex ? "active" : ""
                                            }`}
                                            onClick={() => handleCardSelect(index)}
                                            aria-label={`Card ${index + 1}: ${c.cardType === "visual" ? "Visual" : "Typography"}`}
                                            title={`Card ${index + 1}: ${c.cardType === "visual" ? "Visual" : "Typography"}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>


                        {/* NEXT */}

                        <button
                            type="button"
                            className="learningNavButton learningNext"
                            onClick={handleNext}
                            disabled={
                                currentCardIndex >= cards.length - 1 &&
                                currentConceptIndex >= concepts.length - 1
                            }
                        >

                            {t("learningModule.next", "Next")}

                            <span>

                                →

                            </span>

                        </button>

                    </div>


                </section>

            </main>


            {/* =========================
                FOOTER
            ========================= */}

            <Footer />

        </div>

    );

}


export default LearningModule;