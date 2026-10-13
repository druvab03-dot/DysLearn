import "./ClassDashboard.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    useTranslation
} from "react-i18next";


function ClassDashboard() {

    const { t } =
        useTranslation();

    const navigate =
        useNavigate();

    const { classNumber } =
        useParams();


    const subjects = [
        {
            key: "english",
            letter: "E",
            progress: 0
        },
        {
            key: "kannada",
            letter: "ಕ",
            progress: 0
        },
        {
            key: "mathematics",
            letter: "M",
            progress: 0
        },
        {
            key: "evs",
            letter: "EVS",
            progress: 0
        },
        {
            key: "hindi",
            letter: "हि",
            progress: 0
        }
    ];


    const handleSubjectSelect =
        (subject) => {

            if (["english", "kannada", "mathematics", "science", "evs", "hindi"].includes(subject)) {

                navigate(
                    `/class/${classNumber}/${subject}`
                );

                return;

            }

            console.log(
                `Selected ${subject}`
            );

        };


    return (

        <div className="classDashboardPage">

            <Header />


            <main className="classDashboardMain">

                <section className="classDashboardSection">


                    <div className="classDashboardHeader">

                        <div>

                            <span className="classDashboardEyebrow">

                                {
                                    t(
                                        "classDashboard.learning"
                                    )
                                }

                            </span>


                            <h1>

                                {
                                    t(
                                        "dashboard.class"
                                    )
                                }{" "}

                                {classNumber}

                            </h1>


                            <p>

                                {
                                    t(
                                        "classDashboard.chooseSubject"
                                    )
                                }

                            </p>

                        </div>

                    </div>


                    <div className="dashboardBannersGrid">
                        <div className="dashboardTrainingBanner">
                            <div className="trainingBannerContent">
                                <span className="trainingBannerBadge">🎯 PRACTICE & REVISION</span>
                                <h3>{t("classDashboard.trainingModule", "Student Training Module")}</h3>
                                <p>{t("classDashboard.trainingDesc", "Practice image-based and text-based questions with instant answer reveals!")}</p>
                            </div>
                            <button
                                type="button"
                                className="trainingBannerActionBtn"
                                onClick={() => navigate(`/class/${classNumber}/english/training`)}
                            >
                                Start Training →
                            </button>
                        </div>

                        <div className="dashboardAssessmentBanner">
                            <div className="trainingBannerContent">
                                <span className="assessmentBannerBadge">🏆 30-MIN EVALUATION</span>
                                <h3>Gamified Assessment System</h3>
                                <p>Interactive multimodal games & curriculum theory assessment in a unified 30-min challenge!</p>
                            </div>
                            <button
                                type="button"
                                className="assessmentBannerActionBtn"
                                onClick={() => navigate(`/class/${classNumber}/english/assessment`)}
                            >
                                Start Assessment 🚀
                            </button>
                        </div>
                    </div>

                    <div className="subjectList">

                        {
                            subjects.map(
                                (subject) => (

                                    <button
                                        key={
                                            subject.key
                                        }
                                        type="button"
                                        className={
                                            `subjectCard subject-${subject.key}`
                                        }
                                        onClick={() =>
                                            handleSubjectSelect(
                                                subject.key
                                            )
                                        }
                                    >

                                        <div className="subjectIcon">

                                            {
                                                subject.letter
                                            }

                                        </div>


                                        <div className="subjectContent">

                                            <h2>

                                                {
                                                    t(
                                                        `classDashboard.${subject.key}`
                                                    )
                                                }

                                            </h2>


                                            <p>

                                                {
                                                    t(
                                                        `classDashboard.${subject.key}Description`
                                                    )
                                                }

                                            </p>


                                            <div className="subjectActionRow">
                                                <span className="subjectAction">

                                                    {
                                                        t(
                                                            "classDashboard.startLearning"
                                                        )
                                                    }

                                                    <span>
                                                        →
                                                    </span>

                                                </span>

                                                <span
                                                    role="button"
                                                    tabIndex={0}
                                                    className="subjectTrainingBadge"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(
                                                            `/class/${classNumber}/${subject.key}/training`
                                                        );
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" || e.key === " ") {
                                                            e.stopPropagation();
                                                            navigate(
                                                                `/class/${classNumber}/${subject.key}/training`
                                                            );
                                                        }
                                                    }}
                                                >
                                                    🎯 Training
                                                </span>

                                                <span
                                                    role="button"
                                                    tabIndex={0}
                                                    className="subjectAssessmentBadge"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(
                                                            `/class/${classNumber}/${subject.key}/assessment`
                                                        );
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" || e.key === " ") {
                                                            e.stopPropagation();
                                                            navigate(
                                                                `/class/${classNumber}/${subject.key}/assessment`
                                                            );
                                                        }
                                                    }}
                                                >
                                                    🏆 Assessment
                                                </span>
                                            </div>

                                        </div>


                                        <div className="subjectProgress">

                                            <div className="progressHeader">

                                                <span>

                                                    {
                                                        t(
                                                            "classDashboard.progress"
                                                        )
                                                    }

                                                </span>


                                                <strong>

                                                    {
                                                        subject.progress
                                                    }%

                                                </strong>

                                            </div>


                                            <div className="progressTrack">

                                                <div
                                                    className="progressFill"
                                                    style={{
                                                        width:
                                                            `${subject.progress}%`
                                                    }}
                                                />

                                            </div>


                                            <span className="lessonText">

                                                0{" "}

                                                {
                                                    t(
                                                        "classDashboard.lessons"
                                                    )
                                                }

                                            </span>

                                        </div>

                                    </button>

                                )
                            )
                        }

                    </div>

                </section>

            </main>


            <Footer />

        </div>

    );

}


export default ClassDashboard;