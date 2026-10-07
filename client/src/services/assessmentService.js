/**
 * Assessment Service
 * Handles pre-assessment worksheet downloads and class mapping
 */

export const AVAILABLE_CLASSES = ["1", "2", "3", "4", "5"];

export const CLASS_ASSESSMENT_FILES = {
    "1": "/assessments/class_1_assessment.pdf",
    "2": "/assessments/class_2_assessment.pdf",
    "3": "/assessments/class_3_assessment.pdf",
    "4": "/assessments/class_4_assessment.pdf",
    "5": "/assessments/class_5_assessment.pdf",
};

/**
 * Downloads the pre-assessment document for the given class
 * @param {string|number} classNumber 
 */
export const downloadPreAssessment = async (classNumber) => {
    const classKey = String(classNumber);
    const fileUrl = CLASS_ASSESSMENT_FILES[classKey] || `/assessments/class_${classKey}_assessment.pdf`;
    const fileName = `Class_${classKey}_Assessment.pdf`;

    try {
        // Fetch as blob to force a browser download dialog
        const response = await fetch(fileUrl);
        if (!response.ok) {
            throw new Error(`File not found: ${response.status}`);
        }
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
        return true;
    } catch {
        // Fallback: direct anchor download
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = fileName;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return true;
    }
};
