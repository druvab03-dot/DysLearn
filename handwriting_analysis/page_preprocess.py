import argparse
from pathlib import Path

import cv2
import numpy as np


def resize_for_processing(image, max_width=1600):
    h, w = image.shape[:2]

    if w <= max_width:
        return image

    scale = max_width / w

    return cv2.resize(
        image,
        (int(w * scale), int(h * scale)),
        interpolation=cv2.INTER_AREA
    )


def preprocess(image):
    """
    Convert the photographed page into a clean binary handwriting image.
    """

    # Grayscale
    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    # Small blur removes camera noise
    gray = cv2.GaussianBlur(
        gray,
        (5, 5),
        0
    )

    # Adaptive threshold works better than a fixed threshold
    # for photographed paper with uneven lighting.
    binary = cv2.adaptiveThreshold(
        gray,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        31,
        15
    )

    # Remove tiny noise
    kernel = np.ones(
        (2, 2),
        np.uint8
    )

    binary = cv2.morphologyEx(
        binary,
        cv2.MORPH_OPEN,
        kernel
    )

    return gray, binary


def detect_lines(binary):
    """
    Detect horizontal handwriting lines using horizontal projection.
    """

    # Count foreground pixels in every row
    horizontal_projection = np.sum(
        binary > 0,
        axis=1
    )

    # Threshold for rows containing handwriting
    threshold = max(
        5,
        int(binary.shape[1] * 0.01)
    )

    active = (
        horizontal_projection > threshold
    ).astype(np.uint8)

    # Join nearby rows belonging to the same handwriting line
    kernel = cv2.getStructuringElement(
        cv2.MORPH_RECT,
        (31, 5)
    )

    joined = cv2.morphologyEx(
        active.reshape(-1, 1),
        cv2.MORPH_CLOSE,
        kernel
    ).reshape(-1)

    lines = []

    in_line = False
    start = 0

    for y, value in enumerate(joined):

        if value and not in_line:
            start = y
            in_line = True

        elif not value and in_line:

            end = y

            if end - start >= 8:
                lines.append(
                    (start, end)
                )

            in_line = False

    if in_line:
        lines.append(
            (start, len(joined))
        )

    # Merge very close detections
    merged = []

    for start, end in lines:

        if not merged:

            merged.append(
                [start, end]
            )

        else:

            previous = merged[-1]

            if start - previous[1] < 15:

                previous[1] = end

            else:

                merged.append(
                    [start, end]
                )

    return merged


def save_line_images(binary, lines, output_dir):

    output_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    saved = []

    for index, (y1, y2) in enumerate(lines):

        # Add a little padding
        padding = 10

        y1 = max(
            0,
            y1 - padding
        )

        y2 = min(
            binary.shape[0],
            y2 + padding
        )

        line = binary[
            y1:y2,
            :
        ]

        path = (
            output_dir
            / f"line_{index + 1:02d}.png"
        )

        cv2.imwrite(
            str(path),
            line
        )

        saved.append(path)

    return saved


def create_visualization(
    image,
    lines,
    output_path
):

    visualization = image.copy()

    for index, (y1, y2) in enumerate(lines):

        cv2.rectangle(
            visualization,
            (0, y1),
            (
                visualization.shape[1] - 1,
                y2
            ),
            (0, 255, 0),
            2
        )

        cv2.putText(
            visualization,
            f"Line {index + 1}",
            (10, max(25, y1 + 25)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 0),
            2
        )

    cv2.imwrite(
        str(output_path),
        visualization
    )


def main():

    parser = argparse.ArgumentParser(
        description="Preprocess handwritten notebook page."
    )

    parser.add_argument(
        "--image",
        required=True,
        help="Path to handwritten page"
    )

    parser.add_argument(
        "--output_dir",
        default="artifacts/page_test"
    )

    args = parser.parse_args()

    image_path = Path(
        args.image
    )

    output_dir = Path(
        args.output_dir
    )

    output_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    print("=" * 60)
    print("HANDWRITING PAGE PREPROCESSING")
    print("=" * 60)

    print(
        "Input:",
        image_path
    )

    image = cv2.imread(
        str(image_path)
    )

    if image is None:

        raise FileNotFoundError(
            f"Could not read image: {image_path}"
        )

    print(
        "Original size:",
        image.shape[1],
        "x",
        image.shape[0]
    )

    # Resize
    image = resize_for_processing(
        image
    )

    print(
        "Processing size:",
        image.shape[1],
        "x",
        image.shape[0]
    )

    # Preprocess
    gray, binary = preprocess(
        image
    )

    cv2.imwrite(
        str(output_dir / "01_gray.png"),
        gray
    )

    cv2.imwrite(
        str(output_dir / "02_binary.png"),
        binary
    )

    # Detect lines
    lines = detect_lines(
        binary
    )

    print()
    print(
        "Detected handwriting lines:",
        len(lines)
    )

    for index, (y1, y2) in enumerate(lines):

        print(
            f"  Line {index + 1}: "
            f"y={y1} → {y2}"
        )

    # Save lines
    saved = save_line_images(
        binary,
        lines,
        output_dir / "lines"
    )

    print()
    print(
        "Saved line images:",
        len(saved)
    )

    # Visualization
    create_visualization(
        image,
        lines,
        output_dir / "03_line_detection.png"
    )

    print()
    print(
        "Output directory:"
    )

    print(
        output_dir.resolve()
    )

    print()
    print(
        "Done."
    )


if __name__ == "__main__":
    main()