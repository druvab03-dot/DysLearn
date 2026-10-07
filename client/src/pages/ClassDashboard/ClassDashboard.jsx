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
            title: "English",
            progress: 0
        },
        {
            key: "hindi",
            letter: "हि",
            title: "Hindi",
            progress: 0
        },
        {
            key: "kannada",
            letter: "ಕ",
            title: "Kannada",
            progress: 0
        },
        {
            key: "maths",
            letter: "M",
            title: "Maths",
            progress: 0
        },
        {
            key: "evs",
            letter: "GK",
            title: "EVS / GK",
            progress: 0
        }
    ];


    const handleSubjectSelect =
        (subject) => {
            navigate(
                `/class/${classNumber}/${subject}`
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