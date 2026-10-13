import argparse
import hashlib
import re
from pathlib import Path
from collections import Counter, defaultdict

from PIL import Image


VALID_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff", ".webp"
}

SPLITS = ["train", "val", "test"]
CLASSES = ["Corrected", "Normal", "Reversal"]


def get_image_files(folder):
    """Return all image files recursively."""
    if not folder.exists():
        return []

    return [
        p for p in folder.rglob("*")
        if p.is_file() and p.suffix.lower() in VALID_EXTENSIONS
    ]


def md5_hash(path, chunk_size=1024 * 1024):
    """Calculate exact file hash."""
    h = hashlib.md5()

    with open(path, "rb") as f:
        while True:
            chunk = f.read(chunk_size)

            if not chunk:
                break

            h.update(chunk)

    return h.hexdigest()


def get_image_info(path):
    """Get image dimensions and basic information."""
    try:
        with Image.open(path) as img:
            return {
                "width": img.width,
                "height": img.height,
                "mode": img.mode,
                "format": img.format,
            }

    except Exception:
        return None


def possible_letter_from_filename(filename):
    """
    Try to extract possible letter information from filenames.

    This is intentionally conservative.
    It does NOT assume that the filename contains the letter.
    """

    name = Path(filename).stem

    # Remove common class names.
    cleaned = re.sub(
        r"(normal|reversal|corrected)",
        "",
        name,
        flags=re.IGNORECASE
    )

    # Look for simple patterns such as:
    # a-123
    # b_123
    # 1_123
    # e-479
    match = re.search(
        r"(^|[_\-])([a-zA-Z])([_\-]|$)",
        cleaned
    )

    if match:
        return match.group(2).lower()

    return None


def print_header(title):
    print()
    print("=" * 70)
    print(title)
    print("=" * 70)


def main():

    parser = argparse.ArgumentParser(
        description="Audit handwriting classification dataset."
    )

    parser.add_argument(
        "--data_dir",
        default="datasets/datasets/mobilenet_prepared",
        help="Path to mobilenet_prepared"
    )

    parser.add_argument(
        "--hashes",
        action="store_true",
        help="Check exact duplicate images across splits"
    )

    args = parser.parse_args()

    data_dir = Path(args.data_dir)

    if not data_dir.exists():

        print("ERROR: Dataset directory does not exist:")
        print(data_dir.resolve())

        return

    print_header("HANDWRITING DATASET AUDIT")

    print("Dataset:")
    print(data_dir.resolve())

    # ---------------------------------------------------------
    # 1. Count images
    # ---------------------------------------------------------

    print_header("1. DATASET SIZE")

    split_files = {}

    total_images = 0

    for split in SPLITS:

        split_path = data_dir / split

        files = get_image_files(split_path)

        split_files[split] = files

        print(
            f"{split:8s}: {len(files):,} images"
        )

        total_images += len(files)

    print("-" * 30)
    print(f"TOTAL    : {total_images:,} images")

    # ---------------------------------------------------------
    # 2. Class distribution
    # ---------------------------------------------------------

    print_header("2. CLASS DISTRIBUTION")

    distribution = {}

    for split in SPLITS:

        distribution[split] = {}

        print(f"\n{split.upper()}")

        for class_name in CLASSES:

            folder = data_dir / split / class_name

            files = get_image_files(folder)

            distribution[split][class_name] = len(files)

            print(
                f"  {class_name:10s}: {len(files):,}"
            )

    # ---------------------------------------------------------
    # 3. Percentages
    # ---------------------------------------------------------

    print_header("3. CLASS PERCENTAGES")

    for split in SPLITS:

        counts = distribution[split]

        total = sum(counts.values())

        print(f"\n{split.upper()}")

        for class_name in CLASSES:

            percentage = (
                counts[class_name] / total * 100
                if total
                else 0
            )

            print(
                f"  {class_name:10s}: "
                f"{percentage:6.2f}%"
            )

    # ---------------------------------------------------------
    # 4. Image dimensions
    # ---------------------------------------------------------

    print_header("4. IMAGE DIMENSIONS")

    dimension_counts = Counter()
    mode_counts = Counter()

    sample_limit = 10000

    for split in SPLITS:

        files = split_files[split]

        for path in files[:sample_limit]:

            info = get_image_info(path)

            if info:

                dimension_counts[
                    (info["width"], info["height"])
                ] += 1

                mode_counts[
                    info["mode"]
                ] += 1

    print("Most common dimensions:")

    for (width, height), count in dimension_counts.most_common(15):

        print(
            f"  {width} x {height}: {count:,}"
        )

    print("\nImage modes:")

    for mode, count in mode_counts.most_common():

        print(
            f"  {mode}: {count:,}"
        )

    # ---------------------------------------------------------
    # 5. Possible filename letter information
    # ---------------------------------------------------------

    print_header("5. POSSIBLE LETTER INFORMATION")

    print(
        "Trying to infer letter identity from filenames."
    )

    print(
        "IMPORTANT: this is only a heuristic."
    )

    for split in SPLITS:

        counter = Counter()

        for path in split_files[split]:

            letter = possible_letter_from_filename(
                path.name
            )

            if letter:

                counter[letter] += 1

        print(f"\n{split.upper()}")

        if counter:

            for letter, count in sorted(counter.items()):

                print(
                    f"  {letter}: {count:,}"
                )

        else:

            print(
                "  No obvious letter information found."
            )

    # ---------------------------------------------------------
    # 6. Compare possible letter distribution by class
    # ---------------------------------------------------------

    print_header("6. POSSIBLE LETTER × CLASS DISTRIBUTION")

    for split in SPLITS:

        print(f"\n{split.upper()}")

        table = defaultdict(Counter)

        for class_name in CLASSES:

            folder = data_dir / split / class_name

            for path in get_image_files(folder):

                letter = possible_letter_from_filename(
                    path.name
                )

                if letter:

                    table[letter][class_name] += 1

        if not table:

            print("  No usable filename-letter information.")

            continue

        letters = sorted(table.keys())

        print(
            f"\n{'Letter':<10}"
            f"{'Corrected':>12}"
            f"{'Normal':>12}"
            f"{'Reversal':>12}"
        )

        print("-" * 46)

        for letter in letters:

            print(
                f"{letter:<10}"
                f"{table[letter]['Corrected']:>12,}"
                f"{table[letter]['Normal']:>12,}"
                f"{table[letter]['Reversal']:>12,}"
            )

    # ---------------------------------------------------------
    # 7. Exact duplicates
    # ---------------------------------------------------------

    if args.hashes:

        print_header("7. EXACT DUPLICATE CHECK")

        print(
            "Calculating MD5 hashes."
        )

        hash_locations = defaultdict(list)

        for split in SPLITS:

            print(
                f"Hashing {split}..."
            )

            for path in split_files[split]:

                try:

                    file_hash = md5_hash(path)

                    hash_locations[file_hash].append(
                        (split, path)
                    )

                except Exception as e:

                    print(
                        "Could not hash:",
                        path,
                        e
                    )

        duplicate_groups = []

        for file_hash, locations in hash_locations.items():

            splits_found = {
                location[0]
                for location in locations
            }

            if len(splits_found) > 1:

                duplicate_groups.append(
                    (file_hash, locations)
                )

        print()

        print(
            "Duplicate groups crossing train/val/test:",
            len(duplicate_groups)
        )

        if duplicate_groups:

            print(
                "\nWARNING: Exact duplicates exist "
                "across dataset splits!"
            )

            for file_hash, locations in duplicate_groups[:20]:

                print()

                print("Hash:", file_hash)

                for split, path in locations:

                    print(
                        f"  {split}: {path}"
                    )

        else:

            print(
                "No exact duplicate files found across splits."
            )

    # ---------------------------------------------------------
    # 8. Summary
    # ---------------------------------------------------------

    print_header("AUDIT SUMMARY")

    print(
        f"Total images: {total_images:,}"
    )

    print(
        "Class distribution:"
    )

    for split in SPLITS:

        print(
            f"  {split}:",
            distribution[split]
        )

    print()

    print(
        "Audit complete."
    )

    if not args.hashes:

        print()
        print(
            "For duplicate checking, run:"
        )

        print(
            "python audit_dataset.py "
            "--data_dir datasets/datasets/mobilenet_prepared "
            "--hashes"
        )


if __name__ == "__main__":
    main()