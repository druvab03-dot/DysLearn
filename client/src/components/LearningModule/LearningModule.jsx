import {
    useState,
    useEffect
} from "react";

import {
    useParams
} from "react-router-dom";

import "./LearningModule.css";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";


function LearningModule({
    subject = "English"
}) {

    const { classNumber } =
        useParams();


    const lessons = [

        {
            title: "A for Apple",

            image:
                "/learning/English_Learning_Materials_Class1_Illustrated/01_alphabet_A-Z/A_Apple.svg",

            text:
                "A for Apple",

            speakText:
                "A for Apple"
        },

        {
            title: "B for Ball",

            image:
                "/learning/English_Learning_Materials_Class1_Illustrated/01_alphabet_A-Z/B_Ball.svg",

            text:
                "B for Ball",

            speakText:
                "B for Ball"
        },

        {
            title: "C for Cat",

            image:
                "/learning/English_Learning_Materials_Class1_Illustrated/01_alphabet_A-Z/C_Cat.svg",

            text:
                "C for Cat",

            speakText:
                "C for Cat"
        },

        {
            title: "D for Dog",

            image:
                "/learning/English_Learning_Materials_Class1_Illustrated/01_alphabet_A-Z/D_Dog.svg",

            text:
                "D for Dog",

            speakText:
                "D for Dog"
        }

    ];


    const [
        currentLesson,
        setCurrentLesson
    ] = useState(0);


    const lesson =
        lessons[currentLesson];


    const progress =
        (
            (currentLesson + 1) /
            lessons.length
        ) * 100;


    /* =========================
       STOP SPEECH ON EXIT
    ========================= */

    useEffect(() => {

        return () => {

            window.speechSynthesis.cancel();

        };

    }, []);


    /* =========================
       SPEAKER
    ========================= */

    const speakContent = () => {

        if (
            !lesson ||
            !lesson.speakText
        ) {

            return;

        }


        window.speechSynthesis.cancel();


        const speech =
            new SpeechSynthesisUtterance(
                lesson.speakText
            );


        speech.lang = "en-IN";

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

        if (currentLesson > 0) {

            window.speechSynthesis.cancel();

            setCurrentLesson(
                currentLesson - 1
            );

        }

    };


    /* =========================
       NEXT
    ========================= */

    const handleNext = () => {

        if (
            currentLesson <
            lessons.length - 1
        ) {

            window.speechSynthesis.cancel();

            setCurrentLesson(
                currentLesson + 1
            );

        }

    };


    /* =========================
       SELECT LESSON
    ========================= */

    const handleLessonSelect =
        (index) => {

            window.speechSynthesis.cancel();

            setCurrentLesson(index);

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

                            <span className="learningEyebrow">

                                LEARNING

                            </span>


                            <h1>

                                {subject}

                            </h1>


                            <p>

                                Class {classNumber}

                            </p>

                        </div>


                        {/* PROGRESS */}

                        <div className="learningProgressBox">

                            <div className="learningProgressText">

                                <span>

                                    Lesson{" "}

                                    {currentLesson + 1}

                                    {" / "}

                                    {lessons.length}

                                </span>

                                <strong>

                                    {Math.round(progress)}%

                                </strong>

                            </div>


                            <div className="learningProgressTrack">

                                <div
                                    className="learningProgressFill"
                                    style={{
                                        width:
                                            `${progress}%`
                                    }}
                                />

                            </div>

                        </div>

                    </div>


                    {/* =========================
                        LEARNING CARD
                    ========================= */}

                    <article className="learningCard">


                        {/* =========================
                            IMAGE
                        ========================= */}

                        <div className="learningImageSection">

                            <div className="learningImageBackground">

                                <span>

                                    {currentLesson + 1}

                                </span>

                            </div>


                            <img
                                src={
                                    lesson.image
                                }
                                alt={
                                    lesson.title
                                }
                                className="learningImage"
                            />

                        </div>


                        {/* =========================
                            CONTENT
                        ========================= */}

                        <div className="learningContent">


                            <span className="lessonNumber">

                                LESSON{" "}

                                {currentLesson + 1}

                            </span>


                            <h2>

                                {lesson.title}

                            </h2>


                            <p>

                                {lesson.text}

                            </p>


                            {/* SPEAKER */}

                            <button
                                type="button"
                                className="learningSpeakerButton"
                                onClick={
                                    speakContent
                                }
                                aria-label="Listen to lesson content"
                            >

                                <span className="speakerIcon">

                                    🔊

                                </span>


                                <span>

                                    Listen

                                </span>

                            </button>

                        </div>

                    </article>


                    {/* =========================
                        NAVIGATION
                    ========================= */}

                    <div className="learningNavigation">


                        {/* PREVIOUS */}

                        <button
                            type="button"
                            className="learningNavButton learningPrevious"
                            onClick={
                                handlePrevious
                            }
                            disabled={
                                currentLesson === 0
                            }
                        >

                            <span>

                                ←

                            </span>

                            Previous

                        </button>


                        {/* LESSON DOTS */}

                        <div className="learningDots">

                            {
                                lessons.map(
                                    (_, index) => (

                                        <button
                                            key={index}
                                            type="button"
                                            className={
                                                `learningDot ${
                                                    index === currentLesson
                                                        ? "active"
                                                        : ""
                                                }`
                                            }
                                            onClick={() =>
                                                handleLessonSelect(
                                                    index
                                                )
                                            }
                                            aria-label={
                                                `Lesson ${index + 1}`
                                            }
                                        />

                                    )
                                )
                            }

                        </div>


                        {/* NEXT */}

                        <button
                            type="button"
                            className="learningNavButton learningNext"
                            onClick={
                                handleNext
                            }
                            disabled={
                                currentLesson ===
                                lessons.length - 1
                            }
                        >

                            Next

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