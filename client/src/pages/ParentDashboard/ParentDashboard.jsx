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
import PdfReportModal from "../../components/PdfReportModal/PdfReportModal";

import {
    getChildren,
    deleteChild,
    uploadChildHandwriting,
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

    const [uploadingId, setUploadingId] =
        useState(null);

    const [analyzingId, setAnalyzingId] =
        useState(null);

    const [analysisResults, setAnalysisResults] =
        useState({});

    // PDF Report Modal state
    const [activeReportPdf, setActiveReportPdf] =
        useState(null); // { pdfUrl, childName }


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
    // SELECT CHILD (START LEARNING)
    // ==========================================

    const handleSelectChild = (
        child
    ) => {

        if (!child.handwritingAnalyzed || !child.analysisReportPdf) {
            return;
        }

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
    // HANDWRITING IMAGE UPLOAD
    // ==========================================

    const handleUploadHandwriting = async (child, file) => {
        if (!file) return;

        try {
            setUploadingId(child._id);
            setError("");

            const data = await uploadChildHandwriting(child._id, file);

            setChildren((currentChildren) =>
                currentChildren.map((currentChild) =>
                    currentChild._id === child._id
                        ? data.child
                        : currentChild
                )
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                t("child.uploadFailed")
            );
        } finally {
            setUploadingId(null);
        }
    };


    // ==========================================
    // HANDWRITING ANALYSIS
    // ==========================================

    const handleAnalyzeHandwriting =
        async (child) => {

            setError("");

            if (!child.handwritingImage) {
                setError(
                    t("child.handwritingRequired")
                );
                return;
            }

            try {

                setAnalyzingId(
                    child._id
                );


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

                    // Show PDF modal popup with generated PDF
                    if (data.analysis.pdfUrl) {
                        setActiveReportPdf({
                            pdfUrl: data.analysis.pdfUrl,
                            childName: child.name,
                        });
                    }

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
                                    (child) => {
                                        const isAnalyzed = Boolean(child.handwritingAnalyzed && child.analysisReportPdf);
                                        const hasHandwriting = Boolean(child.handwritingImage);
                                        const isAnalyzing = analyzingId === child._id;
                                        const isUploading = uploadingId === child._id;

                                        return (

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

                                            {child.classNumber && (
                                                <div className="childClassBadge">
                                                    {t("child.classLabel")} {child.classNumber}
                                                </div>
                                            )}


                                            {/* Handwriting Preview / Upload on Card */}
                                            {child.handwritingImage ? (

                                                <div className="handwritingPreviewCard">

                                                    <img
                                                        src={
                                                            `http://localhost:5001${child.handwritingImage}`
                                                        }
                                                        alt={
                                                            t(
                                                                "child.handwritingSampleLabel"
                                                            )
                                                        }
                                                        className="handwritingImg"
                                                    />


                                                    <label className="changeImageLabel">
                                                        <input
                                                            type="file"
                                                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) handleUploadHandwriting(child, file);
                                                            }}
                                                            disabled={isUploading || isAnalyzing}
                                                            style={{ display: "none" }}
                                                        />
                                                        <span>
                                                            {isUploading
                                                                ? t("child.uploadingImage")
                                                                : t("child.chooseImage")}
                                                        </span>
                                                    </label>

                                                </div>

                                            ) : (

                                                <div className="cardUploadBox">
                                                    <label className="cardUploadButton">
                                                        <input
                                                            type="file"
                                                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) handleUploadHandwriting(child, file);
                                                            }}
                                                            disabled={isUploading || isAnalyzing}
                                                            style={{ display: "none" }}
                                                        />
                                                        <span className="cardUploadIcon">📷</span>
                                                        <span>
                                                            {isUploading
                                                                ? t("child.uploadingImage")
                                                                : t("child.uploadHandwriting")}
                                                        </span>
                                                    </label>
                                                    <span className="cardUploadHelp">
                                                        {t("child.imageHelp")}
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


                                            {/* Report Download Button if analyzed */}
                                            {child.analysisReportPdf && (
                                                <button
                                                    type="button"
                                                    className="viewReportPopupButton"
                                                    onClick={() =>
                                                        setActiveReportPdf({
                                                            pdfUrl: child.analysisReportPdf,
                                                            childName: child.name,
                                                        })
                                                    }
                                                >
                                                    📄 {t("child.downloadPdfReport")}
                                                </button>
                                            )}


                                            {/* Analysis trigger button */}
                                            <button
                                                type="button"
                                                className="analyzeHandwritingButton"
                                                onClick={() =>
                                                    handleAnalyzeHandwriting(
                                                        child
                                                    )
                                                }
                                                disabled={
                                                    isAnalyzing || isUploading
                                                }
                                            >

                                                {
                                                    isAnalyzing

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


                                            {/* Start Learning Button: enabled ONLY if analysis & report are complete */}
                                            <button
                                                type="button"
                                                className={`viewChildButton ${isAnalyzed ? "enabled" : "locked"}`}
                                                onClick={() =>
                                                    handleSelectChild(
                                                        child
                                                    )
                                                }
                                                disabled={!isAnalyzed}
                                                title={
                                                    isAnalyzed
                                                        ? t("child.startLearning")
                                                        : t("child.analysisPending")
                                                }
                                            >

                                                {
                                                    t(
                                                        "child.startLearning"
                                                    )
                                                }

                                            </button>

                                        </article>

                                    );
                                    }
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


            {/* ================= PDF REPORT MODAL ================= */}

            {activeReportPdf && (

                <PdfReportModal
                    pdfUrl={activeReportPdf.pdfUrl}
                    childName={activeReportPdf.childName}
                    onClose={() => setActiveReportPdf(null)}
                />

            )}

        </div>

    );

}


export default ParentDashboard;