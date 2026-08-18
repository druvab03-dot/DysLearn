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

    const [
        handwritingImage,
        setHandwritingImage
    ] = useState(null);

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


            if (!handwritingImage) {

                setError(
                    t(
                        "child.handwritingRequired"
                    )
                );

                return;

            }


            try {

                setLoading(true);


                const data =
                    await addChild(
                        name.trim(),
                        handwritingImage
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

                        <label htmlFor="handwritingImage">

                            {
                                t(
                                    "child.handwritingSample"
                                )
                            }

                        </label>


                        <div className="fileUploadBox">

                            <input
                                id="handwritingImage"
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                onChange={(event) => {

                                    const file =
                                        event.target
                                            .files?.[0];

                                    setHandwritingImage(
                                        file || null
                                    );

                                    setError("");

                                }}
                                disabled={loading}
                            />


                            <label
                                htmlFor="handwritingImage"
                                className="fileUploadButton"
                            >

                                {
                                    t(
                                        "child.chooseImage"
                                    )
                                }

                            </label>


                            <span className="selectedFileName">

                                {
                                    handwritingImage
                                        ? handwritingImage.name
                                        : t(
                                            "child.noFileSelected"
                                        )
                                }

                            </span>

                        </div>


                        <p className="fileHelp">

                            {
                                t(
                                    "child.imageHelp"
                                )
                            }

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
                            disabled={loading}
                        >

                            {
                                loading
                                    ? t(
                                        "child.adding"
                                    )
                                    : t(
                                        "child.addChild"
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