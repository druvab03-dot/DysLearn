import api from "./api";


// ==========================================
// GET ALL CHILDREN
// ==========================================

export const getChildren = async () => {

    const response = await api.get(
        "/children"
    );

    return response.data;

};


// ==========================================
// ADD CHILD
// ==========================================

export const addChild = async (name, classNumber) => {
    const response = await api.post("/children", {
        name,
        classNumber,
    });

    return response.data;
};


// ==========================================
// UPLOAD CHILD HANDWRITING
// ==========================================

export const uploadChildHandwriting = async (childId, handwritingImage) => {
    const formData = new FormData();
    formData.append("handwritingImage", handwritingImage);

    const response = await api.post(`/children/${childId}/handwriting`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};


// ==========================================
// GET SINGLE CHILD
// ==========================================

export const getChild = async (
    childId
) => {

    const response = await api.get(
        `/children/${childId}`
    );

    return response.data;

};


// ==========================================
// ANALYZE HANDWRITING
// ==========================================

export const analyzeChildHandwriting = async (
    childId
) => {

    const response = await api.post(
        `/children/${childId}/analyze`
    );

    return response.data;

};


// ==========================================
// GET CHILD ANALYSES HISTORY
// ==========================================

export const getChildAnalyses = async (
    childId
) => {

    const response = await api.get(
        `/children/${childId}/analyses`
    );

    return response.data;

};


// ==========================================
// GET LATEST CHILD ANALYSIS
// ==========================================

export const getLatestChildAnalysis = async (
    childId
) => {

    const response = await api.get(
        `/children/${childId}/analysis`
    );

    return response.data;

};


// ==========================================
// DELETE CHILD
// ==========================================

export const deleteChild = async (
    childId
) => {

    const response = await api.delete(
        `/children/${childId}`
    );

    return response.data;

};
