/**
 * Sample Training & Reference Datasets for Student Categorisation Model
 * 
 * Provides reference student trajectories, handwriting analysis results,
 * learning session events, training metrics, and assessment records.
 */

const sampleStudents = [
    {
        id: "sample_student_support_needed",
        name: "Aarav Sharma",
        classNumber: 1,
        profile: "Initial Support Needed learner with frequent letter reversals (b/d, p/q)",
        handwritingAnalysis: {
            score: 35.0,
            level: "Support needed",
            totalLetters: 24,
            counts: {
                Normal: 6,
                Corrected: 4,
                Reversal: 14,
            },
            status: "completed",
        },
        learningTime: {
            activeSeconds: 90,
            idleSeconds: 20,
            sessionsCompleted: 2,
        },
        training: {
            totalAttempted: 20,
            totalCorrect: 5,
            score: 25.0,
        },
        assessment: {
            totalScore: 28,
            difficulty: "easy",
            roundsCompleted: 6,
            totalRounds: 6,
        },
        expectedCategory: "support_needed",
        expectedWeightedScore: 33.2,
    },
    {
        id: "sample_student_developing",
        name: "Diya Patel",
        classNumber: 2,
        profile: "Developing learner with steady letter formations and occasional corrections",
        handwritingAnalysis: {
            score: 62.0,
            level: "Developing",
            totalLetters: 30,
            counts: {
                Normal: 18,
                Corrected: 6,
                Reversal: 6,
            },
            status: "completed",
        },
        learningTime: {
            activeSeconds: 240,
            idleSeconds: 15,
            sessionsCompleted: 4,
        },
        training: {
            totalAttempted: 12,
            totalCorrect: 7,
            score: 58.33,
        },
        assessment: {
            totalScore: 60,
            difficulty: "medium",
            roundsCompleted: 6,
            totalRounds: 6,
        },
        expectedCategory: "developing",
    },
    {
        id: "sample_student_progressing_well",
        name: "Rohan Nair",
        classNumber: 3,
        profile: "Progressing well student with strong visual recall and consistent letter forms",
        handwritingAnalysis: {
            score: 88.0,
            level: "Progressing well",
            totalLetters: 35,
            counts: {
                Normal: 30,
                Corrected: 4,
                Reversal: 1,
            },
            status: "completed",
        },
        learningTime: {
            activeSeconds: 210,
            idleSeconds: 10,
            sessionsCompleted: 5,
        },
        training: {
            totalAttempted: 8,
            totalCorrect: 7,
            score: 87.5,
        },
        assessment: {
            totalScore: 84,
            difficulty: "hard",
            roundsCompleted: 6,
            totalRounds: 6,
        },
        expectedCategory: "progressing_well",
    },
    {
        id: "sample_student_incomplete",
        name: "Ishaan Verma",
        classNumber: 1,
        profile: "Student with handwriting analysis only, no learning cycle data yet",
        handwritingAnalysis: {
            score: 52.0,
            level: "Developing",
            totalLetters: 25,
            counts: {
                Normal: 13,
                Corrected: 5,
                Reversal: 7,
            },
            status: "completed",
        },
        learningTime: null,
        training: null,
        assessment: null,
        expectedCategory: "developing", // Initial category retained because evidence is incomplete
        isCompleteEvidence: false,
    },
];

sampleStudents.supportNeededProfile = sampleStudents[0];
sampleStudents.developingProfile = sampleStudents[1];
sampleStudents.progressingWellProfile = sampleStudents[2];
sampleStudents.incompleteEvidenceProfile = sampleStudents[3];

module.exports = {
    sampleStudents,
    supportNeededProfile: sampleStudents[0],
    developingProfile: sampleStudents[1],
    progressingWellProfile: sampleStudents[2],
    incompleteEvidenceProfile: sampleStudents[3],
};
