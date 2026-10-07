import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    useTranslation
} from "react-i18next";

import "./ParentDashboard.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import AddChildModal from "../../components/AddChildModal/AddChildModal";

import {
    getChildren,
    deleteChild,
    analyzeChildHandwriting
} from "../../services/childService";


function ParentDashboard() {

    const navigate =
        useNavigate();

    const { t } =
        useTranslation();


    const [children, setChildren] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [showAddChild, setShowAddChild] =
        useState(false);

    const [deletingId, setDeletingId] =
        useState(null);

    const [analyzingId, setAnalyzingId] =
        useState(null);

    const [analysisResults, setAnalysisResults] =
        useState({});


    // ==========================================
    // LOAD CHILDREN
    // ==========================================

    useEffect(() => {

        const loadChildren =
            async () => {

                try {

                    setLoading(true);

                    setError("");


                    const data =
                        await getChildren();


                    setChildren(
                        data.children || []
                    );


                } catch (error) {

                    setError(
                        error.response
                            ?.data
                            ?.message ||
                        t(
                            "child.loadFailed"
                        )
                    );


                } finally {

                    setLoading(false);

                }

            };


        loadChildren();

    }, [t]);


    // ==========================================
    // CHILD ADDED
    // ==========================================

    const handleChildAdded = (
        child
    ) => {

        setChildren(
            (currentChildren) => [

                child,

                ...currentChildren

            ]
        );


        setShowAddChild(false);

    };


    // ==========================================
    // SELECT CHILD
    // ==========================================

    const handleSelectChild = (
        child
    ) => {

        localStorage.setItem(
            "activeChild",
            JSON.stringify(child)
        );


        navigate(
            "/dashboard"
        );

    };


    // ==========================================
    // DELETE CHILD
    // ==========================================

    const handleDeleteChild =
        async (child) => {

            const confirmed =
                window.confirm(
                    t(
                        "child.deleteConfirm",
                        {
                            name:
                                child.name
                        }
                    )
                );


            if (!confirmed) {

                return;

            }


            try {

                setDeletingId(
                    child._id
                );

                setError("");


                await deleteChild(
                    child._id
                );


                const storedActiveChild =
                    localStorage.getItem(
                        "activeChild"
                    );


                if (storedActiveChild) {

                    try {

                        const activeChild =
                            JSON.parse(
                                storedActiveChild
                            );


                        if (
                            activeChild?._id ===
                            child._id
                        ) {

                            localStorage.removeItem(
                                "activeChild"
                            );

                        }


                    } catch {

                        localStorage.removeItem(
                            "activeChild"
                        );

                    }

                }


                setChildren(
                    (
                        currentChildren
                    ) =>
                        currentChildren.filter(
                            (
                                currentChild
                            ) =>
                                currentChild._id !==
                                child._id
                        )
                );


            } catch (error) {

                setError(
                    error.response
                        ?.data
                        ?.message ||
                    t(
                        "child.deleteFailed"
                    )
                );


            } finally {

                setDeletingId(null);

            }

        };


    // ==========================================
    // HANDWRITING ANALYSIS
    // ==========================================

    const handleAnalyzeHandwriting =
        async (child) => {

            try {

                setAnalyzingId(
                    child._id
                );

                setError("");


                const data =
                    await analyzeChildHandwriting(
                        child._id
                    );


                setChildren(
                    (currentChildren) =>
                        currentChildren.map(
                            (currentChild) =>
                                currentChild._id ===
                                child._id
                                    ? data.child
                                    : currentChild
                        )
                );


                if (data.analysis) {

                    setAnalysisResults(
                        (prev) => ({

                            ...prev,

                            [child._id]:
                                data.analysis

                        })
                    );

                }


            } catch (error) {

                setError(
                    error.response
                        ?.data
                        ?.message ||
                    t(
                        "child.analysisFailed"
                    )
                );


            } finally {

                setAnalyzingId(null);

            }

        };


    // ==========================================
    // LEARNING CATEGORY
    // ==========================================

    const getLearningCategory = (
        learningLevel
    ) => ({

        "below-average":
            t(
                "child.supportNeeded"
            ),

        average:
            t(
                "child.developingWell"
            ),

        "above-average":
            t(
                "child.progressingWell"
            )

    }[learningLevel] ||
        t(
            "child.analysisComplete"
        ));


    return (

        <div className="parentDashboardPage">

            <Header />


            <main className="parentDashboardMain">

                <section className="parentDashboardSection">


                    {/* ================= HEADING ================= */}

                    <div className="parentDashboardHeading">

                        <div>

                            <h1>

                                {
                                    t(
                                        "child.parentDashboard"
                                    )
                                }

                            </h1>


                            <p>

                                {
                                    t(
                                        "child.manageChildren"
                                    )
                                }

                            </p>

                        </div>


                        <button
                            type="button"
                            className="openAddChildButton"
                            onClick={() =>
                                setShowAddChild(
                                    true
                                )
                            }
                        >

                            +

                            {" "}

                            {
                                t(
                                    "child.addChild"
                                )
                            }

                        </button>

                    </div>


                    {/* ================= ERROR ================= */}

                    {error && (

                        <div className="dashboardError">

                            {error}

                        </div>

                    )}


                    {/* ================= CONTENT ================= */}

                    {loading ? (

                        <div className="childrenState">

                            {
                                t(
                                    "child.loadingChildren"
                                )
                            }

                        </div>

                    ) : children.length === 0 ? (

                        <div className="emptyChildren">

                            <div className="emptyChildIcon">
                                +
                            </div>


                            <h2>

                                {
                                    t(
                                        "child.noChildren"
                                    )
                                }

                            </h2>


                            <p>

                                {
                                    t(
                                        "child.noChildrenDescription"
                                    )
                                }

                            </p>


                            <button
                                type="button"
                                onClick={() =>
                                    setShowAddChild(
                                        true
                                    )
                                }
                            >

                                {
                                    t(
                                        "child.addFirstChild"
                                    )
                                }

                            </button>

                        </div>

                    ) : (

                        <div className="childrenGrid">

                            {
                                children.map(
                                    (child) => (

                                        <article
                                            className="childCard"
                                            key={
                                                child._id
                                            }
                                        >


                                            <div className="childCardTop">

                                                <div className="childAvatar">

                                                    {
                                                        child.name
                                                            ?.charAt(
                                                                0
                                                            )
                                                            .toUpperCase()
                                                    }

                                                </div>


                                                <button
                                                    type="button"
                                                    className="removeChildButton"
                                                    onClick={() =>
                                                        handleDeleteChild(
                                                            child
                                                        )
                                                    }
                                                    disabled={
                                                        deletingId ===
                                                        child._id
                                                    }
                                                >

                                                    {
                                                        deletingId ===
                                                        child._id
                                                            ? "..."
                                                            : t(
                                                                "child.remove"
                                                            )
                                                    }

                                                </button>

                                            </div>


                                            <h2>

                                                {
                                                    child.name
                                                }

                                            </h2>


                                            {child.class && (

                                                <div className="childClassBadge">

                                                    <span>
                                                        {t("child.class", "Class")} {child.class}
                                                    </span>

                                                </div>

                                            )}


                                            {child.handwritingImage && (

                                                <div className="handwritingPreviewCard">

                                                    <img
                                                        src={
                                                            `${child.handwritingImage}`
                                                        }
                                                        alt={
                                                            t(
                                                                "child.handwritingSampleLabel"
                                                            )
                                                        }
                                                        className="handwritingImg"
                                                    />


                                                    <span className="handwritingBadge">

                                                        {
                                                            t(
                                                                "child.handwritingSampleLabel"
                                                            )
                                                        }

                                                    </span>

                                                </div>

                                            )}


                                            <div
                                                className={
                                                    child.handwritingAnalyzed
                                                        ? "analysisStatus analyzed"
                                                        : "analysisStatus pending"
                                                }
                                            >

                                                {
                                                    child.handwritingAnalyzed

                                                        ? getLearningCategory(
                                                            child.learningLevel
                                                        )

                                                        : t(
                                                            "child.analysisPending"
                                                        )
                                                }

                                            </div>


                                            {analysisResults[
                                                child._id
                                            ] && (

                                                <div className="analysisDetailsCard">


                                                    <div className="categoryHeader">

                                                        {
                                                            t(
                                                                "child.predictedCategory"
                                                            )
                                                        }

                                                        :

                                                        {" "}

                                                        <strong>

                                                            {
                                                                analysisResults[
                                                                    child._id
                                                                ].category
                                                            }

                                                        </strong>

                                                    </div>


                                                    {
                                                        analysisResults[
                                                            child._id
                                                        ].probabilities && (

                                                            <div className="probBars">

                                                                {
                                                                    Object.entries(
                                                                        analysisResults[
                                                                            child._id
                                                                        ].probabilities
                                                                    ).map(
                                                                        (
                                                                            [
                                                                                cat,
                                                                                prob
                                                                            ]
                                                                        ) => (

                                                                            <div
                                                                                key={
                                                                                    cat
                                                                                }
                                                                                className="probRow"
                                                                            >

                                                                                <span className="probLabel">

                                                                                    {
                                                                                        cat
                                                                                    }

                                                                                </span>


                                                                                <div className="probTrack">

                                                                                    <div
                                                                                        className="probFill"
                                                                                        style={{
                                                                                            width:
                                                                                                `${(
                                                                                                    prob *
                                                                                                    100
                                                                                                ).toFixed(
                                                                                                    1
                                                                                                )}%`
                                                                                        }}
                                                                                    />

                                                                                </div>


                                                                                <span className="probVal">

                                                                                    {
                                                                                        (
                                                                                            prob *
                                                                                            100
                                                                                        ).toFixed(
                                                                                            0
                                                                                        )
                                                                                    }%

                                                                                </span>

                                                                            </div>

                                                                        )
                                                                    )
                                                                }

                                                            </div>

                                                        )
                                                    }


                                                    {
                                                        analysisResults[
                                                            child._id
                                                        ].heatmap_url && (

                                                            <div className="heatmapContainer">

                                                                <span className="heatmapLabel">

                                                                    {
                                                                        t(
                                                                            "child.gradCamHeatmap"
                                                                        )
                                                                    }

                                                                </span>


                                                                <img
                                                                    src={
                                                                        `${analysisResults[
                                                                            child._id
                                                                        ].heatmap_url}`
                                                                    }
                                                                    alt={
                                                                        t(
                                                                            "child.gradCamExplanation"
                                                                        )
                                                                    }
                                                                    className="heatmapImg"
                                                                />

                                                            </div>

                                                        )
                                                    }

                                                </div>

                                            )}


                                            <button
                                                type="button"
                                                className="analyzeHandwritingButton"
                                                onClick={() =>
                                                    handleAnalyzeHandwriting(
                                                        child
                                                    )
                                                }
                                                disabled={
                                                    analyzingId ===
                                                    child._id
                                                }
                                            >

                                                {
                                                    analyzingId ===
                                                    child._id

                                                        ? t(
                                                            "child.analyzingHandwriting"
                                                        )

                                                        : child.handwritingAnalyzed

                                                            ? t(
                                                                "child.reanalyzeHandwriting"
                                                            )

                                                            : t(
                                                                "child.submitForAnalysis"
                                                            )
                                                }

                                            </button>


                                            <button
                                                type="button"
                                                className="viewChildButton"
                                                onClick={() =>
                                                    handleSelectChild(
                                                        child
                                                    )
                                                }
                                            >

                                                {
                                                    t(
                                                        "child.startLearning"
                                                    )
                                                }

                                            </button>

                                        </article>

                                    )
                                )
                            }

                        </div>

                    )}

                </section>

            </main>


            <Footer />


            {/* ================= ADD CHILD MODAL ================= */}

            {showAddChild && (

                <AddChildModal
                    onClose={() =>
                        setShowAddChild(
                            false
                        )
                    }
                    onChildAdded={
                        handleChildAdded
                    }
                />

            )}

        </div>

    );

}


export default ParentDashboard;