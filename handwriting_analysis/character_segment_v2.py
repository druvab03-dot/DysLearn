import argparse
from pathlib import Path

import cv2
import numpy as np
from assessment_texts import get_assessment_words


# ============================================================
# EXPECTED TEXT
# ============================================================

EXPECTED_TEXT = [
    ["This", "is", "a", "simple", "text"],
    ["to", "test", "the", "model", "of", "the"],
    ["letter", "detector", "model"],
]


# ============================================================
# IMAGE
# ============================================================

def load_binary(path):
    image = cv2.imread(
        str(path),
        cv2.IMREAD_GRAYSCALE
    )

    if image is None:
        raise FileNotFoundError(
            f"Cannot read: {path}"
        )

    _, binary = cv2.threshold(
        image,
        0,
        255,
        cv2.THRESH_BINARY | cv2.THRESH_OTSU
    )

    # handwriting must be white
    if np.mean(binary) > 127:
        binary = 255 - binary

    return binary


def clean_image(binary):
    kernel = np.ones(
        (2, 2),
        np.uint8
    )

    return cv2.morphologyEx(
        binary,
        cv2.MORPH_OPEN,
        kernel
    )


# ============================================================
# BOUNDS
# ============================================================

def ink_bounds(image):
    ys, xs = np.where(
        image > 0
    )

    if len(xs) == 0:
        return None

    return (
        int(xs.min()),
        int(ys.min()),
        int(xs.max()) + 1,
        int(ys.max()) + 1
    )


# ============================================================
# PROJECTION
# ============================================================

def projection(image):
    """
    Number of ink pixels in each column.
    """

    return np.sum(
        image > 0,
        axis=0
    ).astype(np.float32)


def smooth_projection(p, kernel_size=5):
    if len(p) < kernel_size:
        return p

    if kernel_size % 2 == 0:
        kernel_size += 1

    kernel = np.ones(
        kernel_size,
        dtype=np.float32
    ) / kernel_size

    return np.convolve(
        p,
        kernel,
        mode="same"
    )


# ============================================================
# BOUNDARY SCORE
# ============================================================

def boundary_cost(p, x):
    """
    Low cost = good place to cut.

    We inspect a small neighborhood around the
    proposed boundary instead of only one pixel.
    """

    left = max(
        0,
        x - 2
    )

    right = min(
        len(p),
        x + 3
    )

    local = p[left:right]

    if len(local) == 0:
        return 1.0

    return float(
        np.mean(local)
    )


# ============================================================
# DYNAMIC PROGRAMMING
# ============================================================

def find_character_boundaries(
    image,
    character_count
):
    """
    Find exactly character_count-1 boundaries.

    The algorithm prefers:
      1. low-ink vertical valleys
      2. reasonable character widths
      3. boundaries away from word edges

    This is much better than equal-width splitting.
    """

    if character_count <= 1:
        return []

    h, w = image.shape

    p = projection(image)

    # Smooth only for boundary detection.
    ps = smooth_projection(
        p,
        5
    )

    # Tight word bounds.
    bounds = ink_bounds(image)

    if bounds is None:
        return []

    left_bound, _, right_bound, _ = bounds

    left_bound = max(
        1,
        left_bound
    )

    right_bound = min(
        w - 1,
        right_bound
    )

    usable_width = (
        right_bound -
        left_bound
    )

    if usable_width <= character_count:
        return [
            int(
                left_bound +
                usable_width * i /
                character_count
            )
            for i in range(
                1,
                character_count
            )
        ]

    # --------------------------------------------------------
    # Estimate average character width.
    # --------------------------------------------------------

    target_width = (
        usable_width /
        character_count
    )

    # --------------------------------------------------------
    # DP
    #
    # dp[k][x] =
    # best cost for creating k character segments
    # ending at x.
    # --------------------------------------------------------

    INF = 1e18

    dp = np.full(
        (
            character_count + 1,
            w
        ),
        INF,
        dtype=np.float64
    )

    previous = np.full(
        (
            character_count + 1,
            w
        ),
        -1,
        dtype=np.int32
    )

    # First segment
    for x in range(
        left_bound + 1,
        right_bound
    ):

        width = (
            x -
            left_bound
        )

        if width < 2:
            continue

        width_penalty = (
            (width - target_width)
            / target_width
        ) ** 2

        cut_penalty = boundary_cost(
            ps,
            x
        )

        dp[1, x] = (
            1.2 * cut_penalty +
            0.35 * width_penalty
        )

    # --------------------------------------------------------
    # Additional segments
    # --------------------------------------------------------

    for k in range(
        2,
        character_count + 1
    ):

        for x in range(
            left_bound + 1,
            right_bound
        ):

            # Need enough pixels for k segments.
            min_x = (
                left_bound +
                2 * k
            )

            if x < min_x:
                continue

            # Try previous boundaries.
            search_start = max(
                left_bound + 1,
                int(
                    x -
                    target_width * 2.0
                )
            )

            search_end = x - 2

            best_cost = INF
            best_previous = -1

            for prev_x in range(
                search_start,
                search_end + 1
            ):

                previous_cost = dp[
                    k - 1,
                    prev_x
                ]

                if previous_cost >= INF:
                    continue

                segment_width = (
                    x -
                    prev_x
                )

                width_penalty = (
                    (
                        segment_width -
                        target_width
                    )
                    / target_width
                ) ** 2

                cut_penalty = boundary_cost(
                    ps,
                    x
                )

                # Very small segments are strongly discouraged.
                if segment_width < 4:
                    continue

                cost = (
                    previous_cost
                    +
                    1.5 * cut_penalty
                    +
                    0.30 * width_penalty
                )

                if cost < best_cost:

                    best_cost = cost
                    best_previous = prev_x

            dp[k, x] = best_cost
            previous[k, x] = best_previous

    # --------------------------------------------------------
    # Find best final endpoint
    # --------------------------------------------------------

    final_x = -1
    final_cost = INF

    for x in range(
        left_bound + 1,
        right_bound
    ):

        cost = dp[
            character_count,
            x
        ]

        if cost >= INF:
            continue

        final_width = (
            right_bound -
            x
        )

        if final_width < 2:
            continue

        width_penalty = (
            (
                final_width -
                target_width
            )
            / target_width
        ) ** 2

        total_cost = (
            cost +
            0.30 * width_penalty
        )

        if total_cost < final_cost:

            final_cost = total_cost
            final_x = x

    # --------------------------------------------------------
    # Fallback
    # --------------------------------------------------------

    if final_x == -1:

        return fallback_boundaries(
            image,
            character_count
        )

    # --------------------------------------------------------
    # Backtrack
    # --------------------------------------------------------

    boundaries = []

    x = final_x

    for k in range(
        character_count,
        1,
        -1
    ):

        boundaries.append(x)

        x = previous[
            k,
            x
        ]

        if x < 0:
            return fallback_boundaries(
                image,
                character_count
            )

    boundaries.reverse()

    return boundaries


# ============================================================
# FALLBACK
# ============================================================

def fallback_boundaries(
    image,
    character_count
):
    """
    Projection-based fallback.
    """

    bounds = ink_bounds(image)

    if bounds is None:
        return []

    x1, _, x2, _ = bounds

    width = (
        x2 -
        x1
    )

    p = projection(image)

    cumulative = np.cumsum(
        p
    )

    total = float(
        cumulative[-1]
    )

    if total <= 0:

        return [
            int(
                x1 +
                width * i /
                character_count
            )
            for i in range(
                1,
                character_count
            )
        ]

    result = []

    for i in range(
        1,
        character_count
    ):

        target = (
            total *
            i /
            character_count
        )

        relative = int(
            np.searchsorted(
                cumulative,
                target
            )
        )

        x = max(
            x1 + 2,
            min(
                x2 - 2,
                relative
            )
        )

        result.append(x)

    return result


# ============================================================
# BUILD BOXES
# ============================================================

def make_boxes(
    image,
    boundaries
):
    h, w = image.shape

    bounds = ink_bounds(image)

    if bounds is None:
        return []

    x_start, _, x_end, _ = bounds

    cuts = [
        x_start
    ] + sorted(
        boundaries
    ) + [
        x_end
    ]

    boxes = []

    for i in range(
        len(cuts) - 1
    ):

        x1 = cuts[i]
        x2 = cuts[i + 1]

        if x2 <= x1:
            continue

        segment = image[
            :,
            x1:x2
        ]

        segment_bounds = ink_bounds(
            segment
        )

        if segment_bounds is None:

            boxes.append(
                (
                    x1,
                    0,
                    x2,
                    h
                )
            )

            continue

        sx1, sy1, sx2, sy2 = (
            segment_bounds
        )

        boxes.append(
            (
                x1 + sx1,
                sy1,
                x1 + sx2,
                sy2
            )
        )

    return boxes


# ============================================================
# CHARACTER CROP
# ============================================================

def crop_character(
    image,
    box,
    padding=4
):
    x1, y1, x2, y2 = box

    x1 = max(
        0,
        x1 - padding
    )

    y1 = max(
        0,
        y1 - padding
    )

    x2 = min(
        image.shape[1],
        x2 + padding
    )

    y2 = min(
        image.shape[0],
        y2 + padding
    )

    return image[
        y1:y2,
        x1:x2
    ]


# ============================================================
# NORMALIZE FOR MOBILENET
# ============================================================

def normalize_character(
    image,
    size=28
):
    """
    Convert character to approximately the format
    used by the original dataset.

    Preserve aspect ratio and center it.
    """

    bounds = ink_bounds(image)

    canvas = np.zeros(
        (
            size,
            size
        ),
        dtype=np.uint8
    )

    if bounds is None:
        return canvas

    x1, y1, x2, y2 = bounds

    crop = image[
        y1:y2,
        x1:x2
    ]

    h, w = crop.shape

    if h == 0 or w == 0:
        return canvas

    margin = 3

    available = size - (
        margin * 2
    )

    scale = min(
        available / w,
        available / h
    )

    new_w = max(
        1,
        int(
            w * scale
        )
    )

    new_h = max(
        1,
        int(
            h * scale
        )
    )

    resized = cv2.resize(
        crop,
        (
            new_w,
            new_h
        ),
        interpolation=cv2.INTER_AREA
    )

    x = (
        size -
        new_w
    ) // 2

    y = (
        size -
        new_h
    ) // 2

    canvas[
        y:y + new_h,
        x:x + new_w
    ] = resized

    return canvas


# ============================================================
# VISUALIZATION
# ============================================================

def create_visualization(
    image,
    boxes,
    expected_chars,
    output_path
):
    """
    Draw segmentation boxes.
    """

    vis = cv2.cvtColor(
        image,
        cv2.COLOR_GRAY2BGR
    )

    for i, box in enumerate(
        boxes
    ):

        x1, y1, x2, y2 = box

        cv2.rectangle(
            vis,
            (x1, y1),
            (x2, y2),
            (0, 255, 0),
            2
        )

        if i < len(
            expected_chars
        ):

            label = (
                f"{i + 1}:{expected_chars[i]}"
            )

        else:

            label = str(
                i + 1
            )

        cv2.putText(
            vis,
            label,
            (
                x1,
                max(
                    15,
                    y1 - 5
                )
            ),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            (0, 255, 0),
            1
        )

    cv2.imwrite(
        str(output_path),
        vis
    )


# ============================================================
# PROCESS WORD
# ============================================================

def process_word(
    word_path,
    expected_word,
    output_dir
):
    binary = load_binary(
        word_path
    )

    binary = clean_image(
        binary
    )

    expected_chars = list(
        expected_word
    )

    expected_count = len(
        expected_chars
    )

    if expected_count == 1:

        bounds = ink_bounds(
            binary
        )

        boxes = (
            [bounds]
            if bounds is not None
            else []
        )

    else:

        boundaries = find_character_boundaries(
            binary,
            expected_count
        )

        boxes = make_boxes(
            binary,
            boundaries
        )

    # --------------------------------------------------------
    # If count is wrong, use fallback
    # --------------------------------------------------------

    if len(boxes) != expected_count:

        boundaries = fallback_boundaries(
            binary,
            expected_count
        )

        boxes = make_boxes(
            binary,
            boundaries
        )

    # --------------------------------------------------------
    # Save
    # --------------------------------------------------------

    output_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    for i, box in enumerate(
        boxes
    ):

        character = (
            expected_chars[i]
            if i < len(expected_chars)
            else "?"
        )

        raw = crop_character(
            binary,
            box
        )

        normalized = normalize_character(
            raw,
            28
        )

        raw_path = (
            output_dir /
            f"char_{i + 1:02d}_{character}.png"
        )

        normalized_path = (
            output_dir /
            f"char_{i + 1:02d}_{character}_28x28.png"
        )

        cv2.imwrite(
            str(raw_path),
            raw
        )

        cv2.imwrite(
            str(normalized_path),
            normalized
        )

    create_visualization(
        binary,
        boxes,
        expected_chars,
        output_dir /
        "visualization.png"
    )

    return len(boxes)


# ============================================================
# MAIN
# ============================================================

def main():

    parser = argparse.ArgumentParser()
    parser.add_argument("--word_dir", default="artifacts/page_test/words_v2")
    parser.add_argument("--output_dir", default="artifacts/page_test/characters_v2")
    parser.add_argument("--class_number", type=int, choices=[1, 2, 3, 4, 5], default=1)
    args = parser.parse_args()

    word_dir = Path(args.word_dir)
    output_dir = Path(args.output_dir)
    if not word_dir.exists():
        raise FileNotFoundError(f"Word directory not found: {word_dir.resolve()}")

    # Rebuild only this job's character output so old crops cannot leak into a new report.
    if output_dir.exists():
        import shutil
        shutil.rmtree(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    expected_words = get_assessment_words(args.class_number)
    detected_words = []
    for line_dir in sorted(word_dir.glob("line_*")):
        if not line_dir.is_dir():
            continue
        detected_words.extend(sorted(line_dir.glob("word_*.png")))

    print("=" * 70)
    print(f"CHARACTER SEGMENTATION — CLASS {args.class_number}")
    print("=" * 70)
    print(f"Expected words in assessment: {len(expected_words)}")
    print(f"Detected word crops:          {len(detected_words)}")

    if not detected_words:
        raise RuntimeError("No word crops were detected. Check the page photo and preprocessing.")
    if len(detected_words) != len(expected_words):
        print(
            f"WARNING: Word-count mismatch for Class {args.class_number}: "
            f"expected {len(expected_words)}, detected {len(detected_words)}. "
            "Continuing with available word crops; alignment may be uncertain."
        )

    total_expected = 0
    total_detected = 0
    for index, (word_file, expected_word) in enumerate(zip(detected_words, expected_words), start=1):
        word_output = output_dir / f"word_{index:03d}_{expected_word}"
        detected = process_word(word_file, expected_word, word_output)
        total_expected += len(expected_word)
        total_detected += detected
        status = "OK" if detected == len(expected_word) else "CHECK"
        print(f"{index:03d}. {expected_word:<18} expected={len(expected_word):2d} detected={detected:2d} [{status}]")

    print("=" * 70)
    print(f"Expected letter regions: {total_expected}")
    print(f"Created character crops: {total_detected}")
    print(f"Output: {output_dir.resolve()}")
    print("Done.")


if __name__ == "__main__":
    main()