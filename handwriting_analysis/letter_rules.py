# ============================================================
# LETTER-AWARE CLASSIFICATION RULES
# ============================================================

# Based on the current dataset audit.
#
# These letters had only Normal examples in the prepared
# dataset and therefore should not be interpreted as
# Corrected/Reversal by the current prototype.
#
# IMPORTANT:
# This is a dataset-specific rule, not a clinical rule.

FORCED_NORMAL_LETTERS = {
    "i",
    "o",
    "t",
    "u",
    "v",
    "x",
    "y",
}


def apply_letter_rule(
    letter,
    predicted_class
):
    """
    Apply dataset-aware correction.

    Returns:
        corrected class
    """

    letter = letter.lower()

    if letter in FORCED_NORMAL_LETTERS:

        return "Normal"

    return predicted_class