# Provisional weights. Calibrate these with handwriting experts and
# page-level validation data before using them for student assessment.

CLASS_WEIGHTS = {
    "Normal": 1.0,
    "Corrected": 0.5,
    "Reversal": 0.0,
}


def calculate_score(predicted_labels):
    total = len(predicted_labels)
    if total == 0:
        return {
            "score": None,
            "level": "No letters detected",
            "counts": {},
            "total_letters": 0,
        }

    counts = {}
    for label in predicted_labels:
        counts[label] = counts.get(label, 0) + 1

    weighted = sum(
        CLASS_WEIGHTS.get(label, 0.0)
        for label in predicted_labels
    )
    score = 100.0 * weighted / total

    # Initial thresholds only. Calibrate from real student/page outcomes.
    if score < 50:
        level = "Support needed"
    elif score < 75:
        level = "Developing"
    else:
        level = "Progressing well"

    return {
        "score": round(score, 2),
        "level": level,
        "counts": counts,
        "total_letters": total,
    }
