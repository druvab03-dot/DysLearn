import "./Dashboard.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


function Dashboard() {

    const { t } =
        useTranslation();

    const navigate =
        useNavigate();


    const classes = [
        {
            number: 1,
            objects: ["A", "B", "✎", "★", "📖", "ABC"]
        },
        {
            number: 2,
            objects: ["1", "2", "＋", "△", "✏", "123"]
        },
        {
            number: 3,
            objects: ["A", "B", "C", "✎", "📚", "★"]
        },
        {
            number: 4,
            objects: ["+", "−", "×", "÷", "△", "123"]
        },
        {
            number: 5,
            objects: ["A", "B", "1", "2", "★", "📖"]
        }
    ];


    const handleClassSelect =
        (classNumber) => {

            navigate(
                `/class/${classNumber}`
            );

        };


    return (

        <div className="dashboardPage">

            <Header />


            <main className="dashboardMain">

                <section className="classSection">


                    <div className="classHeading">

                        <h1 className="classTitle">

                            {
                                t(
                                    "dashboard.chooseClass"
                                )
                            }

                        </h1>


                        <p className="classSubtitle">

                            {
                                t(
                                    "dashboard.chooseClassDescription"
                                )
                            }

                        </p>

                    </div>


                    <div className="classGrid">

                        {
                            classes.map(
                                (classItem) => (

                                    <button
                                        key={
                                            classItem.number
                                        }
                                        type="button"
                                        className={
                                            `classCard classCard${classItem.number}`
                                        }
                                        onClick={() =>
                                            handleClassSelect(
                                                classItem.number
                                            )
                                        }
                                    >

                                        <span
                                            className="classBackgroundNumber"
                                            aria-hidden="true"
                                        >
                                            {
                                                classItem.number
                                            }
                                        </span>


                                        <div
                                            className="classBackgroundObjects"
                                            aria-hidden="true"
                                        >

                                            {
                                                classItem.objects.map(
                                                    (
                                                        object,
                                                        index
                                                    ) => (

                                                        <span
                                                            key={
                                                                index
                                                            }
                                                            className={
                                                                `backgroundObject object${index + 1}`
                                                            }
                                                        >
                                                            {
                                                                object
                                                            }
                                                        </span>

                                                    )
                                                )
                                            }

                                        </div>


                                        <div className="classCardContent">

                                            <span className="classSmallLabel">

                                                {
                                                    t(
                                                        "dashboard.classLabel"
                                                    )
                                                }

                                            </span>


                                            <span className="classNumber">

                                                {
                                                    classItem.number
                                                }

                                            </span>


                                            <span className="classLabel">

                                                {
                                                    t(
                                                        "dashboard.class"
                                                    )
                                                }{" "}

                                                {
                                                    classItem.number
                                                }

                                            </span>


                                            <span className="startLearning">

                                                {
                                                    t(
                                                        "dashboard.startLearning"
                                                    )
                                                }

                                                <span className="arrow">
                                                    →
                                                </span>

                                            </span>

                                        </div>

                                    </button>

                                )
                            )
                        }

                    </div>


                    <section className="recentActivity">

                        <div className="recentActivityHeader">

                            <h2>

                                {
                                    t(
                                        "dashboard.recentActivity"
                                    )
                                }

                            </h2>


                            <span>

                                {
                                    t(
                                        "dashboard.keepLearning"
                                    )
                                }

                            </span>

                        </div>


                        <div className="activityEmpty">

                            <div className="activityIcon">
                                +
                            </div>


                            <div>

                                <h3>

                                    {
                                        t(
                                            "dashboard.learningJourney"
                                        )
                                    }

                                </h3>


                                <p>

                                    {
                                        t(
                                            "dashboard.selectClassMessage"
                                        )
                                    }

                                </p>

                            </div>

                        </div>

                    </section>

                </section>

            </main>


            <Footer />

        </div>

    );

}


export default Dashboard;