const AssessmentResult = require("../models/AssessmentResult");
const Child = require("../models/Child");

// In-memory active session tracker to validate start times against tampering
const activeSessions = new Map();

/**
 * Start a new assessment session
 * Sets authoritative server start time and 30-minute limit (1800s)
 */
exports.startAssessmentSession = async (req, res) => {
    try {
        const { classNumber, subject, difficulty = "medium", childId } = req.body;

        if (!classNumber || !subject) {
            return res.status(400).json({
                message: "classNumber and subject are required to start an assessment.",
            });
        }

        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const startedAt = new Date();
        const maxDurationSeconds = 1800; // Strictly 30 minutes

        activeSessions.set(sessionId, {
            sessionId,
            startedAt,
            classNumber: Number(classNumber),
            subject: String(subject).toLowerCase().trim(),
            difficulty,
            childId: childId || null,
            parentId: req.parent ? req.parent._id : null,
            maxDurationSeconds,
        });

        // Auto-cleanup stale memory sessions after 2 hours
        setTimeout(() => {
            activeSessions.delete(sessionId);
        }, 2 * 60 * 60 * 1000);

        return res.status(200).json({
            success: true,
            sessionId,
            startedAt: startedAt.toISOString(),
            maxDurationSeconds,
            message: "Assessment session started successfully. 30-minute timer active.",
        });
    } catch (error) {
        console.error("Error starting assessment session:", error);
        return res.status(500).json({
            message: "Failed to start assessment session",
            error: error.message,
        });
    }
};

/**
 * Submit and evaluate assessment
 * Validates server-authoritative 30-minute timer and scores
 */
exports.submitAssessment = async (req, res) => {
    try {
        const {
            sessionId,
            classNumber,
            subject,
            difficulty = "medium",
            childId,
            rawGameScore = 0,
            rawTheoryScore = 0,
            maxGameScore = 60,
            maxTheoryScore = 40,
            roundsCompleted = 0,
            totalRounds = 5,
            gameBreakdown = [],
            conceptsMastered = [],
            conceptsToPractice = [],
            clientStartedAt,
            clientDurationSeconds = 0,
        } = req.body;

        const session = activeSessions.get(sessionId);
        const serverNow = new Date();

        let startedAt = session ? session.startedAt : clientStartedAt ? new Date(clientStartedAt) : new Date(Date.now() - (clientDurationSeconds * 1000));
        let durationSeconds = Math.round((serverNow.getTime() - startedAt.getTime()) / 1000);

        if (isNaN(durationSeconds) || durationSeconds < 0) {
            durationSeconds = clientDurationSeconds || 0;
        }

        const maxDurationSeconds = 1800; // 30 minutes limit
        const gracePeriod = 90; // 90s grace period for network latency and transitions
        const isExpired = durationSeconds > (maxDurationSeconds + gracePeriod);

        // Normalize Scores:
        // Games: out of 60 points
        // Theory: out of 40 points
        // Total: strictly out of 100 points
        const normalizedGameScore = Math.min(
            60,
            Math.max(0, Math.round((Number(rawGameScore) / (Number(maxGameScore) || 60)) * 60))
        );

        const normalizedTheoryScore = Math.min(
            40,
            Math.max(0, Math.round((Number(rawTheoryScore) / (Number(maxTheoryScore) || 40)) * 40))
        );

        const totalScore = Math.min(100, Math.max(0, normalizedGameScore + normalizedTheoryScore));

        // Uplifting child-friendly feedback message
        let feedbackMessage = "";
        if (totalScore >= 85) {
            feedbackMessage = "🌟 Outstanding Achievement! You demonstrated remarkable attention, memory, and subject mastery!";
        } else if (totalScore >= 70) {
            feedbackMessage = "🚀 Fantastic Job! You navigated the interactive challenges with confidence and skill!";
        } else if (totalScore >= 50) {
            feedbackMessage = "🌱 Great Learning Journey! You completed every round thoughtfully and made wonderful progress!";
        } else {
            feedbackMessage = "🌈 Beautiful Effort! Every challenge helps your mind grow stronger. Keep exploring!";
        }

        // Check for existing assessment to prevent duplicate records
        if (sessionId) {
            const existing = await AssessmentResult.findOne({ sessionId });
            if (existing) {
                return res.status(200).json({
                    success: true,
                    assessment: existing,
                    message: "Assessment already finalized for this session.",
                });
            }
        }

        // Parent / Child association & Student Name
        let targetChildId = childId || (session ? session.childId : null);
        let targetParentId = req.parent ? req.parent._id : (session ? session.parentId : null);

        let studentName = req.body.studentName || "Student";
        if (targetChildId && studentName === "Student") {
            try {
                const childDoc = await Child.findById(targetChildId);
                if (childDoc?.name) studentName = childDoc.name;
            } catch (e) {}
        }

        // Calculate aggregated accuracy metrics
        let totalAttempted = 0;
        let totalCorrect = 0;
        let totalIncorrect = 0;
        if (Array.isArray(gameBreakdown)) {
            gameBreakdown.forEach((r) => {
                if (r.gameType === "theoretical-assessment") {
                    const totalQ = r.details?.totalQuestions || 5;
                    const correctQ = r.details?.correctCount || 0;
                    totalAttempted += totalQ;
                    totalCorrect += correctQ;
                    totalIncorrect += totalQ - correctQ;
                } else if (r.gameType === "connect-match" || r.gameType === "memory-challenge") {
                    const pairs = 4;
                    const correct = Math.round(((r.score || 0) / (r.maxScore || 12)) * pairs);
                    totalAttempted += pairs;
                    totalCorrect += correct;
                    totalIncorrect += pairs - correct;
                } else {
                    totalAttempted += 1;
                    if ((r.score || 0) >= (r.maxScore || 12) * 0.8) {
                        totalCorrect += 1;
                    } else {
                        totalIncorrect += 1;
                    }
                }
            });
        }
        const totalUnanswered = isExpired
            ? Math.max(0, (Number(totalRounds) || 6) - (Number(roundsCompleted) || 0))
            : 0;

        // Create Assessment Result in MongoDB
        const assessmentDoc = new AssessmentResult({
            child: targetChildId,
            parent: targetParentId,
            sessionId: sessionId || `session_${Date.now()}`,
            classNumber: Number(classNumber),
            subject: String(subject).toLowerCase().trim(),
            difficulty,
            totalScore,
            percentage: totalScore,
            studentName,
            totalAttempted,
            totalCorrect,
            totalIncorrect,
            totalUnanswered,
            gameScore: normalizedGameScore,
            theoryScore: normalizedTheoryScore,
            durationSeconds: Math.min(durationSeconds, maxDurationSeconds),
            maxDurationSeconds,
            startedAt,
            submittedAt: serverNow,
            isExpired,
            roundsCompleted: Number(roundsCompleted),
            totalRounds: Number(totalRounds),
            gameBreakdown: Array.isArray(gameBreakdown) ? gameBreakdown : [],
            conceptsMastered: Array.isArray(conceptsMastered) ? conceptsMastered : [],
            conceptsToPractice: Array.isArray(conceptsToPractice) ? conceptsToPractice : [],
            feedbackMessage,
            clientMetadata: {
                rawGameScore,
                rawTheoryScore,
                maxGameScore,
                maxTheoryScore,
            },
        });

        await assessmentDoc.save();

        // Update Child document if childId is available
        if (targetChildId) {
            try {
                await Child.findByIdAndUpdate(targetChildId, {
                    latestAssessment: assessmentDoc._id,
                    $push: { assessmentResults: assessmentDoc._id },
                });
            } catch (childErr) {
                console.warn("Could not attach assessment to child document:", childErr.message);
            }
        }

        // Clean up session from memory
        if (sessionId) {
            activeSessions.delete(sessionId);
        }

        return res.status(201).json({
            success: true,
            assessment: assessmentDoc,
            message: "Assessment submitted and evaluated successfully.",
        });
    } catch (error) {
        console.error("Error submitting assessment:", error);
        return res.status(500).json({
            message: "Failed to submit assessment",
            error: error.message,
        });
    }
};

/**
 * Get assessment by ID
 */
exports.getAssessmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const assessment = await AssessmentResult.findById(id).populate("child", "name classNumber");

        if (!assessment) {
            return res.status(404).json({ message: "Assessment record not found." });
        }

        return res.status(200).json({ success: true, assessment });
    } catch (error) {
        console.error("Error fetching assessment:", error);
        return res.status(500).json({ message: "Error fetching assessment", error: error.message });
    }
};

/**
 * Get all assessments for a specific child
 */
exports.getChildAssessments = async (req, res) => {
    try {
        const { childId } = req.params;
        const assessments = await AssessmentResult.find({ child: childId })
            .sort({ createdAt: -1 })
            .limit(20);

        return res.status(200).json({ success: true, assessments });
    } catch (error) {
        console.error("Error fetching child assessments:", error);
        return res.status(500).json({ message: "Error fetching child assessments", error: error.message });
    }
};
