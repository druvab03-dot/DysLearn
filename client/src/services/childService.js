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

export const addChild = async (name, handwritingImage) => {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("handwritingImage", handwritingImage);

    const response = await api.post("/children", formData);

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
