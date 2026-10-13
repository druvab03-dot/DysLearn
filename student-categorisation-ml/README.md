# DysLearn — Student Categorisation ML Model

## Overview

The `student-categorisation-ml` engine provides continuous, multi-modal educational personalisation for students using **DysLearn**. It dynamically adapts visual versus text learning cards, training question quotas, and gamified challenge difficulty to match each student's current learning profile.

> [!IMPORTANT]
> **Educational Personalisation Indicator — Not a Medical Diagnosis**
> The student category is strictly an adaptive educational personalisation indicator designed to tailor multi-sensory scaffolding to each learner's needs. The system does not claim to diagnose, confirm, or rule out dyslexia or any medical condition.

---

## 1. Directory Structure

```text
student-categorisation-ml/
├── README.md                               # System documentation, thresholds, formulas, and workflows
├── config/
│   └── categorisationConfig.js             # Configurable weights, thresholds, rules, card quotas, and training mixes
├── data/
│   └── sampleTrainingData.js               # Reference student trajectories, verification cases, and incomplete profiles
├── models/
│   └── studentCategoryModel.js             # Mongoose schema for auditable categorisation history
├── services/
│   ├── handwritingFeatureService.js        # Feature extraction from handwriting OCR and reversal analysis
│   ├── performanceAnalysisService.js       # 4-component aggregation, evidence validation, strengths/weaknesses
│   ├── categoryAssignmentService.js        # Initial assignment & idempotent learning cycle re-evaluation
│   ├── personalisedLearningService.js      # Exactly 4 cards selection, training question mixes, and difficulty mapping
│   └── reportGenerationService.js          # Assembly of all 13 mandated performance report sections and HTML/print generator
├── utils/
│   ├── scoreCalculator.js                  # Component normalisation (0–100) & exact weighted score calculation
│   ├── categoryRules.js                    # Threshold boundaries for initial & re-assessment categories
│   └── dataValidation.js                   # ObjectId, score clamping, and payload validators
├── controllers/
│   └── studentCategoryController.js        # Express controller endpoints for status, triggers, metrics, and reports
├── routes/
│   └── studentCategoryRoutes.js            # API router mounted at /api/student-category
└── tests/
    ├── categoryAssignment.test.js          # Tests for initial handwriting-only assignment and weighted thresholds
    ├── performanceAnalysis.test.js         # Tests for normalisation, non-penalizing curves, and sample student profiles
    ├── personalisedLearning.test.js        # Tests for card selection (3v+1t, 2v+2t, 1v+3t), training mixes, and difficulty
    └── integration.test.js                 # Tests for report generation (all 13 points) and payload validation
```

---

## 2. The Three Student Categories

The system defines three educational categories with stable internal identifiers:

| Internal Identifier | Display Label | Pedagogical Focus |
|---|---|---|
| `support_needed` | **Support Needed** | High visual scaffolding, concrete multi-sensory anchors, smaller practice steps, and gentle challenge pacing to build phonological confidence. |
| `developing` | **Developing** | Balanced multi-modal learning combining visual and text-based typography challenges for steady fluency and sequencing growth. |
| `progressing_well` | **Progressing Well** | High confidence and emerging mastery. Richer typography reading, abstract reasoning, and advanced curriculum challenges. |

---

## 3. Initial Categorisation (Handwriting Analysis Only)

When a student first enters DysLearn and completes handwriting analysis, the system evaluates their letter stroke stability and reversal tendencies before any learning cycle data exists.

### Feature Mapping & Normalisation
- **Input:** Analysis output from `ml/handwriting_analysis/predict_page.py` stored in `AnalysisResult`.
- **Extracted Features:**
  - Character count (`totalLetters` / `characters_analysed`)
  - Label breakdown: `Normal` (weight: 1.0), `Corrected` (weight: 0.5), `Reversal` (weight: 0.0)
  - Calculated score: `((Normal × 1.0 + Corrected × 0.5 + Reversal × 0.0) / totalLetters) × 100`
- **Safeguards:** Requires at least 3 detected characters. If missing or invalid, category remains `pending_analysis` rather than misclassifying the student as poor performing.

### Initial Thresholds (`INITIAL_HANDWRITING_THRESHOLDS`)

| Score Range | Assigned Category |
|---|---|
| **0.0 – 49.9** | `support_needed` |
| **50.0 – 74.9** | `developing` |
| **75.0 – 100.0** | `progressing_well` |

*Note: Initial categorisation does NOT include learning duration, training performance, or gamified test scores.*

---

## 4. Re-Categorisation After Learning Cycles

Once a student completes learning cycles, the system reassesses their category using the exact prescribed weights:

$$\text{Overall Score} = (\text{Handwriting} \times 0.30) + (\text{Learning Time} \times 0.10) + (\text{Training} \times 0.30) + (\text{Assessment} \times 0.30)$$

All four components are normalised to a common 0–100 scale prior to calculating the weighted score.

### Component Breakdown

1. **Handwriting Analysis (30% weight):**
   - Normalised 0–100 stroke stability and reversal index from the student's latest handwriting analysis.
2. **Active Learning Time (10% weight):**
   - Active interaction duration on textbook concept cards recorded from the frontend.
   - Excludes idle time (> 30 seconds of inactivity).
   - Uses a non-penalizing logarithmic/piecewise curve: fast learners who spend 2–5 focused minutes per concept receive 85–100 points without unfair penalty.
3. **Training Performance (30% weight):**
   - Question correctness from recorded practice sessions: `(totalCorrect / totalAttempted) × 100`.
4. **Gamified Assessment Performance (30% weight):**
   - Final assessment score (0–100 points, 60 game points + 40 theory points).

### Missing Components & Incomplete Evidence Guardrail
- The weighted re-evaluation triggers **only** when all four components are present and valid.
- If a student has only completed part of a cycle, the system **retains the previous category** and records that additional cycle evidence is required.
- Missing components are **never** treated as zero and weights are **never** silently redistributed.

### Re-Assessment Thresholds (`REASSESSMENT_THRESHOLDS`)

| Composite Score | Assigned Category | Boundary Rule |
|---|---|---|
| **0.0 – 39.9** | `support_needed` | Scores strictly below 40.0 |
| **40.0 – 69.9** | `developing` | Exactly 40.0 belongs to Developing |
| **70.0 – 100.0** | `progressing_well` | Exactly 70.0 belongs to Progressing Well |

---

## 5. Personalised Learning Model (Exactly 4 Cards Per Concept)

The DysLearn curriculum provides 8 cards per concept (Cards 1–4 Visual, Cards 5–8 Dyslexia Typography). Each student receives **exactly four cards** per concept according to their current category:

| Category | Visual Cards | Text Typography Cards | Total Cards |
|---|:---:|:---:|:---:|
| **Support Needed** | 3 | 1 | **4** |
| **Developing** | 2 | 2 | **4** |
| **Progressing Well** | 1 | 3 | **4** |

- **Preservation of meaning:** Source cards are selected directly from verified textbook content.
- **Card stability:** Card sequences do not change midway through an active concept lesson.
- **Safe fallback:** If a concept contains fewer than 8 cards, available cards are selected without duplicates to reach up to 4 cards safely.

---

## 6. Personalised Training Module

| Category | Questions Per Session | Content Mix |
|---|:---:|---|
| **Support Needed** | 20 | Mostly visual-based questions (up to 15 visual + 5 text) |
| **Developing** | 12 | Balanced mix (6 visual + 6 text questions) |
| **Progressing Well** | 8 | Mostly text-based questions (2 visual + 6 text questions) |

- Questions are sourced from the verified 500-question textbook training bank.
- Attempted and correct answers are stored against the authenticated student record upon completion.

---

## 7. Personalised Gamified Assessment

| Student Category | Assessment Challenge Difficulty |
|---|---|
| **Support Needed** | `easy` |
| **Developing** | `medium` |
| **Progressing Well** | `hard` |

- **Attempt Difficulty Lock:** The difficulty level active at the start of an assessment session is locked for the entire attempt. Category updates never modify difficulty mid-session.
- Randomised game order and session persistence in `localStorage` prevent duplicate generation or sequence reset on refresh.

---

## 8. Parent Dashboard & Downloadable Performance Report

### Dashboard Display
- Current category badge (`Support Needed`, `Developing`, `Progressing Well`, or `Pending Analysis`).
- Evaluation date and method tag (`Initial Handwriting Analysis` vs `Learning Cycle Re-Evaluation`).
- Supportive non-technical explanation and clinical disclaimer.
- 4-component score cards with prescribed weights.
- Completed learning cycles and progress summary.
- Progress highlights (strengths) and next learning steps (practice areas).
- Auditable category history dropdown.
- One-click **Download Student Performance Report (HTML / Printable PDF)** button.

### 13 Mandated Report Sections
1. Student name and class from authenticated database record.
2. Report generation date and reporting period.
3. Current category and assignment method.
4. Initial handwriting-only category and date.
5. Current weighted performance score (when complete).
6. 4-component scores with explicit weights (30%, 10%, 30%, 30%).
7. Completed learning cycles.
8. Learning-card and training activity summaries.
9. Gamified assessment score, difficulty, and status.
10. Concept-wise strengths and practice areas.
11. Auditable category progression history table.
12. Actionable next-step learning recommendations.
13. Supportive summary for parents.

---

## 9. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/student-category/config` | Retrieve active categorisation weights, thresholds, and card quotas |
| `GET` | `/api/student-category/status/:childId` | Get current category, component breakdown, and evaluation history |
| `POST` | `/api/student-category/initial/:childId` | Trigger initial categorisation based exclusively on handwriting analysis |
| `POST` | `/api/student-category/evaluate/:childId` | Trigger multi-component re-evaluation for completed learning cycle |
| `POST` | `/api/student-category/record-learning-time` | Record active and idle learning seconds from frontend |
| `POST` | `/api/student-category/record-training` | Record attempted and correct questions from training sessions |
| `GET` | `/api/student-category/report/:childId?format=html` | Download authenticated, printable comprehensive performance report |

---

## 10. Automated Tests & Validation

Run the test suite using Node's native test runner:

```bash
# From workspace root
node --test student-categorisation-ml/tests/*.test.js

# Or from server directory
cd server && npm test
```

### Test Coverage (39 Tests Passed)
- **Categorisation Rules:** Initial handwriting-only thresholds, boundary testing (40.0, 70.0), missing data safeguards, idempotency.
- **Performance Analysis:** Normalisation, non-penalizing engagement curve, accuracy scoring, and reference student trajectories.
- **Personalised Learning:** 3v+1t, 2v+2t, and 1v+3t card quotas, training question mixes, and difficulty mapping.
- **Integration & Reporting:** All 13 performance report points, payload validation, and authorization guards.
