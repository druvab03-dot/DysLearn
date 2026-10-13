import {
    useState,
    useEffect
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

    // Every individual learning concept contains EXACTLY eight cards (Cards 1–4 Visual, Cards 5–8 Dyslexia Typography)
    const cards =
        currentConcept?.cards || [];

    const currentCard =
        cards[currentCardIndex];

    const progress =
        cards.length > 0
            ? ((currentCardIndex + 1) / cards.length) * 100
            : 0;

    const isGroupA = currentCardIndex < 4;

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

        setCurrentTopicIndex(index);

        setCurrentConceptIndex(0);

        setCurrentCardIndex(0);

    };

    const handleConceptChange = (index) => {

        window.speechSynthesis.cancel();

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

                                    {t("learningModule.card", "Card")} {currentCardIndex + 1} / 8

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
                                    ? `Group A: Real Image ${currentCardIndex + 1} of 4`
                                    : `Group B: Typography Style ${currentCardIndex - 3} of 4`}

                            </span>

                            <span className="conceptProgressTag">

                                Concept {currentConceptIndex + 1} of {concepts.length}: <strong>{currentConcept?.name}</strong> (8 Cards)

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

                        <div className="learningDotsContainer">

                            <div className="learningDotsGroup">

                                <span className="dotsGroupLabel">
                                    {t("learningModule.groupAVisual", "Group A (4 Images)")}
                                </span>

                                <div className="dotsRow">

                                    {cards.slice(0, 4).map((_, index) => (

                                        <button
                                            key={`a-${index}`}
                                            type="button"
                                            className={`learningDot ${
                                                index === currentCardIndex ? "active" : ""
                                            }`}
                                            onClick={() => handleCardSelect(index)}
                                            aria-label={`Visual Card ${index + 1}`}
                                        />

                                    ))}

                                </div>

                            </div>

                            <span className="dotsDivider" aria-hidden="true">|</span>

                            <div className="learningDotsGroup">

                                <span className="dotsGroupLabel">
                                    {t("learningModule.groupBText", "Group B (4 Typography)")}
                                </span>

                                <div className="dotsRow">

                                    {cards.slice(4, 8).map((_, index) => {

                                        const actualIndex = index + 4;

                                        return (

                                            <button
                                                key={`b-${actualIndex}`}
                                                type="button"
                                                className={`learningDot dyslexiaDot ${
                                                    actualIndex === currentCardIndex ? "active" : ""
                                                }`}
                                                onClick={() => handleCardSelect(actualIndex)}
                                                aria-label={`Dyslexia Text Card ${index + 1}`}
                                            />

                                        );

                                    })}

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