import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./PdfReportModal.css";

function PdfReportModal({ pdfUrl, childName, onClose }) {
    const { t } = useTranslation();
    const [downloading, setDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState("");

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleDownload = () => {
        try {
            setDownloading(true);
            setDownloadError("");

            const fullUrl = pdfUrl.startsWith("http")
                ? pdfUrl
                : `http://localhost:5001${pdfUrl}`;

            const link = document.createElement("a");
            link.href = fullUrl;
            link.download = `${childName ? childName.replace(/\s+/g, "_") : "Child"}_Handwriting_Report.pdf`;
            link.target = "_blank";
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("PDF download error:", err);
            setDownloadError(t("child.downloadPdfFailed"));
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div
            className="modalOverlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="pdfReportModal">
                <div className="pdfModalHeader">
                    <div className="pdfSuccessBadge">
                        <span>✓</span>
                    </div>
                    <h2>{t("child.analysisReportReady")}</h2>
                    <p>{t("child.analysisSuccessDesc")}</p>
                    <button
                        type="button"
                        className="modalCloseButton"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                {downloadError && (
                    <div className="pdfModalError">{downloadError}</div>
                )}

                <div className="pdfPreviewBox">
                    <div className="pdfDocIcon">📄</div>
                    <div className="pdfDocInfo">
                        <span className="pdfDocTitle">
                            {childName ? `${childName}'s ` : ""}
                            DysLearn Handwriting Report
                        </span>
                        <span className="pdfDocSubtitle">PDF Document • Grad-CAM Analysis</span>
                    </div>
                </div>

                <div className="pdfModalActions">
                    <button
                        type="button"
                        className="pdfCloseButton"
                        onClick={onClose}
                    >
                        {t("child.closeModal")}
                    </button>

                    <button
                        type="button"
                        className="pdfDownloadButton"
                        onClick={handleDownload}
                        disabled={downloading}
                    >
                        {downloading
                            ? t("child.downloadingPdf")
                            : t("child.downloadPdfReport")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PdfReportModal;
