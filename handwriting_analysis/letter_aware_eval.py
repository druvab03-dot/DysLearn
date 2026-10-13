import argparse
import re
from collections import defaultdict, Counter
from pathlib import Path

import torch
from PIL import Image
from torchvision import transforms, models
from torch import nn


CLASSES = ["Corrected", "Normal", "Reversal"]

VALID_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".bmp",
    ".tif", ".tiff", ".webp"
}


def build_model(num_classes):
    model = models.mobilenet_v3_small(weights=None)

    model.classifier[-1] = nn.Linear(
        model.classifier[-1].in_features,
        num_classes
    )

    return model


def infer_letter(filename):
    """
    Try to infer the letter from the filename.

    This is only a heuristic.
    We will validate it against the original dataset later.
    """

    stem = Path(filename).stem

    stem = re.sub(
        r"(normal|reversal|corrected)",
        "",
        stem,
        flags=re.IGNORECASE
    )

    match = re.search(
        r"(^|[_-])([a-zA-Z])([_-]|$)",
        stem
    )

    if match:
        return match.group(2).lower()

    return None


def choose_device():

    if hasattr(torch, "xpu") and torch.xpu.is_available():
        return torch.device("xpu")

    if torch.cuda.is_available():
        return torch.device("cuda")

    return torch.device("cpu")


def main():

    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--data_dir",
        default="datasets/datasets/mobilenet_prepared"
    )

    parser.add_argument(
        "--model",
        default="artifacts/best_model.pt"
    )

    args = parser.parse_args()

    device = choose_device()

    print("=" * 70)
    print("LETTER-AWARE MODEL EVALUATION")
    print("=" * 70)

    print("Dataset:", args.data_dir)
    print("Model:", args.model)
    print("Device:", device)

    # ---------------------------------------------------------
    # Load model
    # ---------------------------------------------------------

    checkpoint = torch.load(
        args.model,
        map_location=device
    )

    class_names = checkpoint["class_names"]

    model = build_model(
        len(class_names)
    )

    model.load_state_dict(
        checkpoint["model_state"]
    )

    model = model.to(device)
    model.eval()

    transform = transforms.Compose([
        transforms.Grayscale(
            num_output_channels=3
        ),

        transforms.Resize(
            (96, 96)
        ),

        transforms.ToTensor(),

        transforms.Normalize(
            [0.485] * 3,
            [0.229] * 3
        ),
    ])

    # ---------------------------------------------------------
    # Evaluate
    # ---------------------------------------------------------

    results = defaultdict(Counter)

    total_evaluated = 0
    skipped = 0

    print()
    print("Evaluating test images...")

    for actual_class in CLASSES:

        folder = (
            Path(args.data_dir)
            / "test"
            / actual_class
        )

        if not folder.exists():

            print(
                "Missing:",
                folder
            )

            continue

        for path in folder.rglob("*"):

            if (
                not path.is_file()
                or path.suffix.lower()
                not in VALID_EXTENSIONS
            ):
                continue

            letter = infer_letter(
                path.name
            )

            if letter is None:

                skipped += 1

                continue

            try:

                with Image.open(path) as img:

                    x = transform(
                        img
                    ).unsqueeze(0).to(device)

                with torch.no_grad():

                    prediction = int(
                        model(x)
                        .argmax(1)
                        .item()
                    )

                predicted_class = (
                    class_names[prediction]
                )

                results[letter][
                    (actual_class, predicted_class)
                ] += 1

                total_evaluated += 1

            except Exception as e:

                print(
                    "Could not process:",
                    path,
                    "|",
                    e
                )

                skipped += 1

    print()
    print(
        "Images evaluated:",
        total_evaluated
    )

    print(
        "Images skipped:",
        skipped
    )

    # ---------------------------------------------------------
    # Per-letter results
    # ---------------------------------------------------------

    print()
    print("=" * 70)
    print("PER-LETTER RESULTS")
    print("=" * 70)

    overall_correct = 0
    overall_total = 0

    for letter in sorted(results):

        matrix = results[letter]

        actual_counts = Counter()

        correct = 0
        total = 0

        for (
            actual,
            predicted
        ), count in matrix.items():

            actual_counts[actual] += count

            total += count

            if actual == predicted:

                correct += count

        accuracy = (
            correct / total
            if total
            else 0
        )

        print()
        print(
            f"Letter '{letter}' | "
            f"accuracy={accuracy * 100:.2f}% | "
            f"n={total}"
        )

        print(
            f"  Actual: "
            f"Corrected={actual_counts['Corrected']}, "
            f"Normal={actual_counts['Normal']}, "
            f"Reversal={actual_counts['Reversal']}"
        )

        for actual in CLASSES:

            if actual_counts[actual] == 0:
                continue

            row = []

            for predicted in CLASSES:

                count = matrix[
                    (actual, predicted)
                ]

                row.append(
                    f"{predicted}={count}"
                )

            print(
                f"  {actual:10s}: "
                + ", ".join(row)
            )

        overall_correct += correct
        overall_total += total

    # ---------------------------------------------------------
    # Majority class baseline
    # ---------------------------------------------------------

    print()
    print("=" * 70)
    print("LETTER-IDENTITY BASELINE")
    print("=" * 70)

    baseline_correct = 0
    baseline_total = 0

    for letter in sorted(results):

        actual_counts = Counter()

        for (
            actual,
            _
        ), count in results[letter].items():

            actual_counts[actual] += count

        majority_class, majority_count = (
            actual_counts.most_common(1)[0]
        )

        total = sum(
            actual_counts.values()
        )

        baseline_correct += (
            majority_count
        )

        baseline_total += total

        print(
            f"Letter '{letter}': "
            f"majority={majority_class}, "
            f"baseline="
            f"{majority_count / total * 100:.2f}% "
            f"(n={total})"
        )

    print()
    print(
        "Overall model accuracy:",
        f"{overall_correct / overall_total * 100:.2f}%"
        if overall_total
        else "N/A"
    )

    print(
        "Overall majority-letter baseline:",
        f"{baseline_correct / baseline_total * 100:.2f}%"
        if baseline_total
        else "N/A"
    )

    if overall_total and baseline_total:

        improvement = (
            overall_correct / overall_total
            -
            baseline_correct / baseline_total
        ) * 100

        print(
            "Model improvement over baseline:",
            f"{improvement:+.2f} percentage points"
        )

    # ---------------------------------------------------------
    # Same-letter class availability
    # ---------------------------------------------------------

    print()
    print("=" * 70)
    print("SAME-LETTER CLASSIFICATION CHECK")
    print("=" * 70)

    multi_class_letters = []

    for letter in sorted(results):

        actual_counts = Counter()

        for (
            actual,
            _
        ), count in results[letter].items():

            actual_counts[actual] += count

        present = [
            c
            for c in CLASSES
            if actual_counts[c] > 0
        ]

        if len(present) >= 2:

            multi_class_letters.append(
                (letter, present)
            )

    print(
        "Letters with at least 2 classes:",
        len(multi_class_letters)
    )

    for letter, present in multi_class_letters:

        print(
            f"  {letter}:",
            ", ".join(present)
        )

    print()
    print(
        "IMPORTANT:"
    )

    print(
        "Filename-derived letter identity is only "
        "a heuristic. Validate it against the "
        "original dataset metadata before treating "
        "this as a scientific conclusion."
    )


if __name__ == "__main__":
    main() 