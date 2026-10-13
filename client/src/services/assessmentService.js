import api from "./api";

/**
 * Start an authoritative assessment session on the server
 */
export async function startAssessmentSession({ classNumber, subject, difficulty = "medium", childId = null }) {
    try {
        const response = await api.post("/assessment/session/start", {
            classNumber: Number(classNumber),
            subject,
            difficulty,
            childId,
        });
        return response.data;
    } catch (error) {
        console.warn("Server session start failed, falling back to local session:", error.message);
        // Fallback local session if server has connectivity issue
        return {
            success: true,
            sessionId: `local_session_${Date.now()}`,
            startedAt: new Date().toISOString(),
            maxDurationSeconds: 1800,
        };
    }
}

/**
 * Submit assessment results to server for evaluation and persistence
 */
export async function submitAssessment(payload) {
    try {
        const response = await api.post("/assessment/session/submit", payload);
        return response.data;
    } catch (error) {
        console.warn("Server assessment submission failed, generating local evaluation:", error.message);
        // Local evaluation fallback so child never loses progress or sees an error
        const totalScore = Math.min(
            100,
            Math.max(0, Math.round(((payload.rawGameScore || 0) / (payload.maxGameScore || 60)) * 60 +
                ((payload.rawTheoryScore || 0) / (payload.maxTheoryScore || 40)) * 40))
        );

        let feedbackMessage = "🌟 Great Effort! You completed the learning journey and discovered many new concepts!";
        if (totalScore >= 85) feedbackMessage = "🌟 Outstanding Achievement! You showed incredible attention, memory, and subject mastery!";
        else if (totalScore >= 70) feedbackMessage = "🚀 Fantastic Job! You navigated the interactive challenges with skill!";

        return {
            success: true,
            assessment: {
                sessionId: payload.sessionId || `local_${Date.now()}`,
                classNumber: payload.classNumber,
                subject: payload.subject,
                difficulty: payload.difficulty,
                totalScore,
                gameScore: Math.round(((payload.rawGameScore || 0) / (payload.maxGameScore || 60)) * 60),
                theoryScore: Math.round(((payload.rawTheoryScore || 0) / (payload.maxTheoryScore || 40)) * 40),
                durationSeconds: payload.clientDurationSeconds || 0,
                maxDurationSeconds: 1800,
                roundsCompleted: payload.roundsCompleted || 5,
                totalRounds: payload.totalRounds || 5,
                gameBreakdown: payload.gameBreakdown || [],
                conceptsMastered: payload.conceptsMastered || [],
                conceptsToPractice: payload.conceptsToPractice || [],
                feedbackMessage,
                isExpired: false,
                createdAt: new Date().toISOString(),
            },
        };
    }
}

/**
 * Fetch past assessment records for a child
 */
export async function getChildAssessments(childId) {
    try {
        const response = await api.get(`/assessment/child/${childId}`);
        return response.data.assessments || [];
    } catch (error) {
        console.warn("Could not fetch child assessments:", error.message);
        return [];
    }
}

/**
 * Fetch a specific assessment record by ID
 */
export async function getAssessmentById(id) {
    try {
        const response = await api.get(`/assessment/${id}`);
        return response.data.assessment;
    } catch (error) {
        console.error("Could not fetch assessment:", error);
        return null;
    }
}
