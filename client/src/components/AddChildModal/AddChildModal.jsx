import {
    useEffect,
    useState
} from "react";

import { useTranslation } from "react-i18next";

import "./AddChildModal.css";

import {
    addChild
} from "../../services/childService";


function AddChildModal({
    onClose,
    onChildAdded
}) {

    const { t } =
        useTranslation();

    const [name, setName] =
        useState("");

    const [classNumber, setClassNumber] =
        useState("");

    const [catDownloaded, setCatDownloaded] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // Prevent background scrolling
    useEffect(() => {

        document.body.style.overflow =
            "hidden";


        return () => {

            document.body.style.overflow =
                "";

        };

    }, []);


    const handleDownloadAssessment = () => {
        if (!classNumber) {
            setError(t("child.classRequired"));
            return;
        }

        setError("");
        const assessmentPath = `/assessments/DysLearn_Class_${classNumber}_Assessment.pdf`;
        const link = document.createElement("a");
        link.href = assessmentPath;
        link.download = `DysLearn_Class_${classNumber}_Assessment.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();

        setCatDownloaded(true);
    };


    const handleSubmit =
        async (event) => {

            event.preventDefault();

            setError("");


            if (!name.trim()) {

                setError(
                    t("child.enterNameError")
                );

                return;

            }


            if (!classNumber) {

                setError(
                    t("child.classRequired")
                );

                return;

            }

            if (!catDownloaded) {
                setError(
                    t("child.downloadCatNotice")
                );
                return;
            }


            try {

                setLoading(true);


                const data =
                    await addChild(
                        name.trim(),
                        parseInt(classNumber, 10)
                    );


                onChildAdded(
                    data.child
                );


            } catch (error) {

                setError(
                    error.response
                        ?.data
                        ?.message ||
                    t("child.addFailed")
                );


            } finally {

                setLoading(false);

            }

        };


    const isCatButtonEnabled = Boolean(name.trim() && classNumber);


    return (

        <div
            className="modalOverlay"
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {

                    onClose();

                }

            }}
        >

            <div className="addChildModal">

                <div className="modalHeader">

                    <div>

                        <h2>
                            {t("child.addChild")}
                        </h2>

                        <p>
                            {
                                t(
                                    "child.addDescription"
                                )
                            }
                        </p>

                    </div>


                    <button
                        type="button"
                        className="modalCloseButton"
                        onClick={onClose}
                        aria-label="Close"
                    >

                        ×

                    </button>

                </div>


                <form
                    className="addChildForm"
                    onSubmit={handleSubmit}
                >

                    {error && (

                        <div className="addChildError">

                            {error}

                        </div>

                    )}


                    <div className="childFormGroup">

                        <label htmlFor="childName">

                            {t("child.childName")}

                        </label>


                        <input
                            id="childName"
                            type="text"
                            value={name}
                            placeholder={
                                t(
                                    "child.namePlaceholder"
                                )
                            }
                            onChange={(event) => {

                                setName(
                                    event.target.value
                                );

                                setError("");

                            }}
                            disabled={loading}
                        />

                    </div>


                    <div className="childFormGroup">

                        <label htmlFor="childClass">

                            {t("child.childClass")}

                        </label>


                        <select
                            id="childClass"
                            className="childClassSelect"
                            value={classNumber}
                            onChange={(event) => {

                                setClassNumber(
                                    event.target.value
                                );

                                setCatDownloaded(false);

                                setError("");

                            }}
                            disabled={loading}
                        >

                            <option value="">
                                {t("child.selectClass")}
                            </option>

                            {[1, 2, 3, 4, 5].map((cls) => (

                                <option key={cls} value={cls}>
                                    {t("child.classOption", { num: cls })}
                                </option>

                            ))}

                        </select>

                    </div>


                    {/* CAT Assessment Download Button */}
                    <div className="catDownloadSection">

                        <button
                            type="button"
                            className={`catDownloadButton ${catDownloaded ? "downloaded" : ""}`}
                            onClick={handleDownloadAssessment}
                            disabled={!isCatButtonEnabled || loading}
                        >

                            <span className="catIcon">📄</span>

                            <span>
                                {classNumber
                                    ? t("child.downloadCatAssessment", { num: classNumber })
                                    : t("child.downloadCatAssessment", { num: "-" })}
                            </span>

                            {catDownloaded && (
                                <span className="catCheckBadge">✓</span>
                            )}

                        </button>

                        <p className="catHelpText">
                            {catDownloaded
                                ? t("child.assessmentDownloaded")
                                : t("child.downloadCatNotice")}
                        </p>

                    </div>


                    <div className="modalActions">

                        <button
                            type="button"
                            className="cancelChildButton"
                            onClick={onClose}
                            disabled={loading}
                        >

                            {t("child.cancel")}

                        </button>


                        <button
                            type="submit"
                            className="addChildButton"
                            disabled={loading || !catDownloaded}
                        >

                            {
                                loading
                                    ? t(
                                        "child.adding"
                                    )
                                    : t(
                                        "child.completeRegistration"
                                    )
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}


export default AddChildModal;