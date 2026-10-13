import argparse
from pathlib import Path

import cv2
import numpy as np


def load_binary(path):
    image = cv2.imread(
        str(path),
        cv2.IMREAD_GRAYSCALE
    )

    if image is None:
        raise FileNotFoundError(path)

    # Foreground = white
    _, binary = cv2.threshold(
        image,
        0,
        255,
        cv2.THRESH_BINARY |
        cv2.THRESH_OTSU
    )

    # Make sure handwriting is white
    if np.mean(binary) > 127:
        binary = 255 - binary

    return binary


def remove_small_noise(binary):
    kernel = np.ones(
        (2, 2),
        np.uint8
    )

    return cv2.morphologyEx(
        binary,
        cv2.MORPH_OPEN,
        kernel
    )


def connect_letters(binary):
    """
    Connect letters within words.

    The important parameter here is the horizontal kernel.
    We use a fairly wide kernel because the handwritten letters
    have much smaller gaps than the gaps between words.
    """

    kernel = cv2.getStructuringElement(
        cv2.MORPH_RECT,
        (45, 5)
    )

    connected = cv2.morphologyEx(
        binary,
        cv2.MORPH_CLOSE,
        kernel
    )

    return connected


def detect_word_boxes(binary):
    """
    Detect candidate word regions.
    """

    connected = connect_letters(
        binary
    )

    contours, _ = cv2.findContours(
        connected,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )

    boxes = []

    for contour in contours:

        x, y, w, h = cv2.boundingRect(
            contour
        )

        # Ignore tiny regions
        if w < 20:
            continue

        if h < 20:
            continue

        if w * h < 300:
            continue

        boxes.append(
            (x, y, w, h)
        )

    boxes.sort(
        key=lambda b: b[0]
    )

    return boxes


def merge_close_boxes(boxes, max_gap=35):
    """
    Merge boxes that are close enough to belong to
    the same word.
    """

    if not boxes:
        return []

    merged = []

    current = list(boxes[0])

    for box in boxes[1:]:

        x, y, w, h = box

        current_x, current_y, current_w, current_h = current

        current_right = (
            current_x +
            current_w
        )

        gap = x - current_right

        # Merge nearby components
        if gap <= max_gap:

            new_left = min(
                current_x,
                x
            )

            new_right = max(
                current_right,
                x + w
            )

            new_top = min(
                current_y,
                y
            )

            new_bottom = max(
                current_y + current_h,
                y + h
            )

            current = [
                new_left,
                new_top,
                new_right - new_left,
                new_bottom - new_top
            ]

        else:

            merged.append(
                tuple(current)
            )

            current = list(box)

    merged.append(
        tuple(current)
    )

    return merged


def detect_words(binary):
    """
    Full word detection pipeline.
    """

    binary = remove_small_noise(
        binary
    )

    boxes = detect_word_boxes(
        binary
    )

    boxes = merge_close_boxes(
        boxes,
        max_gap=35
    )

    return boxes


def save_words(
    binary,
    boxes,
    output_dir,
    line_number
):

    line_dir = (
        output_dir /
        f"line_{line_number:02d}"
    )

    line_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    saved = []

    for index, (x, y, w, h) in enumerate(
        boxes,
        start=1
    ):

        padding_x = 8
        padding_y = 8

        x1 = max(
            0,
            x - padding_x
        )

        y1 = max(
            0,
            y - padding_y
        )

        x2 = min(
            binary.shape[1],
            x + w + padding_x
        )

        y2 = min(
            binary.shape[0],
            y + h + padding_y
        )

        crop = binary[
            y1:y2,
            x1:x2
        ]

        path = (
            line_dir /
            f"word_{index:02d}.png"
        )

        cv2.imwrite(
            str(path),
            crop
        )

        saved.append(path)

    return saved


def create_visualization(
    binary,
    boxes,
    output_path
):

    # Convert to normal black/white display
    visualization = cv2.cvtColor(
        binary,
        cv2.COLOR_GRAY2BGR
    )

    for index, (x, y, w, h) in enumerate(
        boxes,
        start=1
    ):

        cv2.rectangle(
            visualization,
            (x, y),
            (x + w, y + h),
            (0, 255, 0),
            2
        )

        cv2.putText(
            visualization,
            str(index),
            (x, max(20, y - 5)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 255, 0),
            2
        )

    cv2.imwrite(
        str(output_path),
        visualization
    )


def main():

    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--line_dir",
        default="artifacts/page_test/lines"
    )

    parser.add_argument(
        "--output_dir",
        default="artifacts/page_test/words_v2"
    )

    args = parser.parse_args()

    line_dir = Path(
        args.line_dir
    )

    output_dir = Path(
        args.output_dir
    )

    output_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    line_files = sorted(
        line_dir.glob("*.png")
    )

    print("=" * 60)
    print("HANDWRITING WORD SEGMENTATION V2")
    print("=" * 60)

    total_words = 0

    for line_number, line_path in enumerate(
        line_files,
        start=1
    ):

        binary = load_binary(
            line_path
        )

        boxes = detect_words(
            binary
        )

        print()
        print(
            f"Line {line_number}: "
            f"{len(boxes)} word regions"
        )

        for index, (x, y, w, h) in enumerate(
            boxes,
            start=1
        ):

            print(
                f"  Word {index}: "
                f"x={x}, y={y}, "
                f"w={w}, h={h}"
            )

        save_words(
            binary,
            boxes,
            output_dir,
            line_number
        )

        create_visualization(
            binary,
            boxes,
            output_dir /
            f"line_{line_number:02d}_words.png"
        )

        total_words += len(boxes)

    print()
    print("=" * 60)

    print(
        "TOTAL WORD REGIONS:",
        total_words
    )

    print("=" * 60)

    print()
    print(
        "Output:",
        output_dir.resolve()
    )


if __name__ == "__main__":
    main()