import argparse
import html
import json
from pathlib import Path
from collections import Counter

import torch
from PIL import Image
from torchvision import transforms, models
from torch import nn


# ============================================================
# CONFIGURATION
# ============================================================

DEFAULT_MODEL = "artifacts/best_model.pt"

DEFAULT_CHARACTERS = (
    "artifacts/page_test/characters_v2"
)

DEFAULT_REPORT = (
    "artifacts/page_test/handwriting_report.txt"
)

CLASS_NAMES_DEFAULT = [
    "Corrected",
    "Normal",
    "Reversal",
]


# ============================================================
# LETTER-AWARE RULES
# ============================================================

# Based on the current dataset audit.
#
# These letters appeared only as Normal in the prepared
# dataset:
#
#     i, o, t, u, v, x, y
#
# Therefore, for this prototype, if MobileNet predicts
# Corrected or Reversal for one of these letters, we
# override it to Normal.
#
# IMPORTANT:
# This is a dataset-specific prototype rule.
# It is NOT a clinical rule or medical conclusion.

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
    prediction
):
    """
    Apply dataset-aware correction.

    Parameters
    ----------
    letter : str
        Expected character from the segmented filename.

    prediction : str
        Raw MobileNet prediction.

    Returns
    -------
    str
        Final prediction.
    """

    letter = letter.lower()

    if letter in FORCED_NORMAL_LETTERS:

        return "Normal"

    return prediction


# ============================================================
# DEVICE
# ============================================================

def get_device():

    # Intel Arc / Intel XPU
    if hasattr(
        torch,
        "xpu"
    ) and torch.xpu.is_available():

        return torch.device(
            "xpu"
        )

    # NVIDIA GPU fallback
    if torch.cuda.is_available():

        return torch.device(
            "cuda"
        )

    return torch.device(
        "cpu"
    )


# ============================================================
# MODEL
# ============================================================

def build_model(
    num_classes
):

    model = models.mobilenet_v3_small(
        weights=None
    )

    model.classifier[-1] = nn.Linear(
        model.classifier[-1].in_features,
        num_classes
    )

    return model


def load_model(
    model_path,
    device
):

    print()
    print(
        "Loading model:"
    )

    print(
        model_path
    )

    # Load checkpoint on CPU first.
    # This works safely with Intel XPU.
    checkpoint = torch.load(
        model_path,
        map_location="cpu"
    )

    # --------------------------------------------------------
    # CLASS NAMES
    # --------------------------------------------------------

    if "class_names" in checkpoint:

        class_names = checkpoint[
            "class_names"
        ]

    else:

        class_names = CLASS_NAMES_DEFAULT

    # --------------------------------------------------------
    # MODEL STATE
    # --------------------------------------------------------

    if "model_state" in checkpoint:

        state_dict = checkpoint[
            "model_state"
        ]

    elif "model_state_dict" in checkpoint:

        state_dict = checkpoint[
            "model_state_dict"
        ]

    elif "state_dict" in checkpoint:

        state_dict = checkpoint[
            "state_dict"
        ]

    else:

        raise KeyError(
            "Could not find model state "
            "inside checkpoint."
        )

    # --------------------------------------------------------
    # BUILD MODEL
    # --------------------------------------------------------

    model = build_model(
        len(class_names)
    )

    # --------------------------------------------------------
    # Remove DataParallel prefix if present
    # --------------------------------------------------------

    cleaned_state_dict = {}

    for key, value in state_dict.items():

        if key.startswith(
            "module."
        ):

            key = key[
                len("module."):]
            

        cleaned_state_dict[
            key
        ] = value

    model.load_state_dict(
        cleaned_state_dict
    )

    model = model.to(
        device
    )

    model.eval()

    return model, class_names


# ============================================================
# IMAGE TRANSFORMATION
# ============================================================

def create_transform():

    return transforms.Compose([

        transforms.Grayscale(
            num_output_channels=3
        ),

        transforms.Resize(
            (96, 96)
        ),

        transforms.ToTensor(),

        transforms.Normalize(
            [0.485, 0.485, 0.485],
            [0.229, 0.229, 0.229]
        ),
    ])


# ============================================================
# EXTRACT EXPECTED LETTER
# ============================================================

def get_letter_from_filename(
    image_path
):
    """
    Character files generated by character_segment_v2.py
    look like:

        char_01_T_28x28.png
        char_02_h_28x28.png
        char_03_i_28x28.png

    Extract the expected character.
    """

    filename = image_path.name

    parts = filename.split(
        "_"
    )

    if len(parts) >= 3:

        letter = parts[2]

        # Remove extension if present.
        letter = (
            letter
            .split(".")[0]
            .lower()
        )

        return letter

    return "?"


# ============================================================
# PREDICT ONE CHARACTER
# ============================================================

def predict_character(
    model,
    image_path,
    transform,
    device
):

    image = Image.open(
        image_path
    ).convert("L")

    tensor = transform(
        image
    ).unsqueeze(0)

    tensor = tensor.to(
        device
    )

    with torch.no_grad():

        output = model(
            tensor
        )

        probabilities = torch.softmax(
            output,
            dim=1
        )[0]

    confidence, index = torch.max(
        probabilities,
        dim=0
    )

    return (
        int(index.item()),
        float(confidence.item()),
        probabilities.cpu().numpy()
    )


# ============================================================
# GRAD-CAM EXPLANATIONS
# ============================================================

def generate_gradcam(model, image_path, transform, device, target_class, output_path):
    """Create a per-character Grad-CAM panel for the selected model class.

    The heatmap explains which regions influenced this character-level
    classification. It is an explanation of the model prediction, not proof
    that the prediction is correct or a clinical finding.
    """
    import cv2
    import numpy as np
    import torch.nn.functional as F

    original = Image.open(image_path).convert("L")
    input_tensor = transform(original).unsqueeze(0).to(device)
    activations = {}
    gradients = {}
    target_layer = model.features[-3]

    def forward_hook(_module, _inputs, output):
        activations["value"] = output
        output.register_hook(lambda grad: gradients.__setitem__("value", grad))

    handle = target_layer.register_forward_hook(forward_hook)
    try:
        model.zero_grad(set_to_none=True)
        with torch.enable_grad():
            logits = model(input_tensor)
            score = logits[:, int(target_class)].sum()
            score.backward()
        activation = activations.get("value")
        gradient = gradients.get("value")
        if activation is None or gradient is None:
            raise RuntimeError("Grad-CAM could not capture feature gradients.")
        weights = gradient.mean(dim=(2, 3), keepdim=True)
        cam = torch.relu((weights * activation).sum(dim=1, keepdim=True))
        cam = F.interpolate(cam, size=(96, 96), mode="bilinear", align_corners=False)
        cam = cam[0, 0].detach().cpu().numpy()
        cam -= cam.min()
        maximum = float(cam.max())
        if maximum > 0:
            cam /= maximum
        cam = cv2.resize(cam, (original.width, original.height))
        heatmap = cv2.applyColorMap(np.uint8(255 * cam), cv2.COLORMAP_JET)
        gray = np.array(original)
        base_bgr = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)
        overlay = cv2.addWeighted(base_bgr, 0.55, heatmap, 0.45, 0)

        label_height = 22
        def labeled(img, label):
            canvas = np.full((img.shape[0] + label_height, img.shape[1], 3), 255, dtype=np.uint8)
            canvas[label_height:, :] = img
            cv2.putText(canvas, label, (4, 15), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (25, 25, 25), 1, cv2.LINE_AA)
            return canvas
        panel = np.concatenate([
            labeled(base_bgr, "Character"),
            labeled(heatmap, "Grad-CAM"),
            labeled(overlay, "Overlay"),
        ], axis=1)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        cv2.imwrite(str(output_path), panel)
        return True
    finally:
        handle.remove()
        model.zero_grad(set_to_none=True)


def save_html_result_sheet(output_path, results, counts, score, level):
    """Write an HTML result sheet with summary and linked Grad-CAM panels."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    total = len(results)
    rows = []
    for i, item in enumerate(results, start=1):
        cam_path = item.get("gradcam_path")
        cam_rel = ""
        if cam_path:
            try:
                cam_rel = Path(cam_path).resolve().relative_to(output_path.parent.resolve()).as_posix()
            except ValueError:
                cam_rel = Path(cam_path).as_posix()
        image_cell = (f'<a href="{html.escape(cam_rel, quote=True)}" target="_blank">'
                      f'<img class="cam" src="{html.escape(cam_rel, quote=True)}" alt="Grad-CAM for character {i}"></a>') if cam_rel else "Not generated"
        rows.append(
            "<tr>"
            f"<td>{i}</td>"
            f"<td>{html.escape(str(item.get('letter', '?')))}</td>"
            f"<td>{html.escape(str(item.get('raw_prediction', '')))}</td>"
            f"<td><strong>{html.escape(str(item.get('prediction', '')))}</strong></td>"
            f"<td>{float(item.get('confidence', 0)) * 100:.1f}%</td>"
            f"<td>{'Yes' if item.get('rule_applied') else 'No'}</td>"
            f"<td>{image_cell}</td>"
            "</tr>"
        )
    class_order = ["Normal", "Corrected", "Reversal"]
    stat_cards = "".join(
        f'<div class="stat"><span>{html.escape(name)}</span><b>{counts.get(name, 0)}</b>'
        f'<small>{(counts.get(name, 0) / total * 100 if total else 0):.1f}% of analysed characters</small></div>'
        for name in class_order
    )
    table_rows = "\n".join(rows)
    document = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Handwriting Analysis Result Sheet</title>
<style>
:root{{font-family:Arial,Helvetica,sans-serif;color:#202938;background:#f4f6fa}}body{{margin:0;padding:24px}}main{{max-width:1200px;margin:auto}}header,.summary,.panel{{background:#fff;border:1px solid #e1e6ef;border-radius:14px;padding:22px;margin-bottom:18px}}h1{{margin:0 0 8px}}.muted{{color:#5f6b7b}}.stats{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}}.stat{{background:#f7f9fc;border-radius:10px;padding:14px}}.stat span,.stat small{{display:block;color:#5f6b7b}}.stat b{{display:block;font-size:28px;margin:6px 0}}.score{{font-size:30px;font-weight:700}}table{{width:100%;border-collapse:collapse;font-size:14px}}th,td{{padding:10px;border-bottom:1px solid #e6eaf1;text-align:left;vertical-align:middle}}th{{background:#f7f9fc;position:sticky;top:0}}.cam{{width:210px;max-width:100%;height:auto;border:1px solid #d8deea;border-radius:6px}}.table-wrap{{overflow-x:auto}}.note{{font-size:13px;line-height:1.5;color:#5f6b7b}}@media(max-width:650px){{body{{padding:10px}}.stats{{grid-template-columns:1fr}}}}
</style></head><body><main>
<header><h1>Handwriting Analysis Result Sheet</h1><p class="muted">Character-level classification with Grad-CAM visual explanations</p>
<div class="score">{score:.1f}/100</div><p><strong>Prototype category:</strong> {html.escape(level)} &nbsp; <strong>Characters analysed:</strong> {total}</p></header>
<section class="summary"><h2>Classification summary</h2><div class="stats">{stat_cards}</div></section>
<section class="panel"><h2>Character-level results and Grad-CAM</h2><p class="note">Grad-CAM highlights image regions that contributed to the selected model class. The heatmap explains model behaviour; it is not a diagnosis or proof that the prediction is correct. Confidence is the raw model confidence; letter-aware rules may change the final class for some letters.</p>
<div class="table-wrap"><table><thead><tr><th>#</th><th>Expected letter</th><th>Raw model class</th><th>Final class</th><th>Confidence</th><th>Rule applied</th><th>Grad-CAM: character / heatmap / overlay</th></tr></thead><tbody>{table_rows}</tbody></table></div></section>
<footer class="note">This tool provides experimental handwriting-pattern feedback. It is not a dyslexia diagnosis. Results can be affected by photo quality, segmentation errors, and limitations in the training data.</footer>
</main></body></html>"""
    output_path.write_text(document, encoding="utf-8")


# ============================================================
# SCORE
# ============================================================

def calculate_score(
    counts
):
    """
    Prototype handwriting score.

    Normal    = 100 points
    Corrected = 60 points
    Reversal  = 0 points

    Formula:

        score =
        (
            Normal * 100
            +
            Corrected * 60
            +
            Reversal * 0
        )
        / total
    """

    total = sum(
        counts.values()
    )

    if total == 0:

        return 0.0

    score = (
        counts["Normal"] * 100
        +
        counts["Corrected"] * 60
        +
        counts["Reversal"] * 0
    ) / total

    return score


def classify_score(
    score
):

    if score < 50:

        return "Support needed"

    elif score < 75:

        return "Developing"

    else:

        return "Progressing well"


# ============================================================
# FIND CHARACTER IMAGES
# ============================================================

def find_character_images(
    character_dir
):

    # IMPORTANT:
    # Only use the normalized crops produced by V2.

    images = sorted(
        character_dir.rglob(
            "*_28x28.png"
        )
    )

    return images


# ============================================================
# SAVE REPORT
# ============================================================

def save_report(
    output_path,
    results,
    counts,
    score,
    level,
    adjustment_count
):

    output_path.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    total = len(
        results
    )

    lines = []

    lines.append(
        "HANDWRITING ANALYSIS REPORT"
    )

    lines.append(
        "========================================"
    )

    lines.append(
        f"Characters analysed: {total}"
    )

    lines.append("")

    # --------------------------------------------------------
    # Final counts
    # --------------------------------------------------------

    lines.append(
        "FINAL CLASSIFICATION"
    )

    lines.append(
        "----------------------------------------"
    )

    for class_name in CLASS_NAMES_DEFAULT:

        count = counts[
            class_name
        ]

        percentage = (
            count /
            total *
            100
            if total > 0
            else 0
        )

        lines.append(
            f"{class_name}: "
            f"{count} "
            f"({percentage:.2f}%)"
        )

    lines.append("")

    lines.append(
        f"Handwriting Score: "
        f"{score:.2f}/100"
    )

    lines.append(
        f"Student Level: "
        f"{level}"
    )

    lines.append("")

    lines.append(
        f"Letter-aware adjustments: "
        f"{adjustment_count}"
    )

    lines.append("")

    lines.append(
        "CHARACTER PREDICTIONS"
    )

    lines.append(
        "========================================"
    )

    lines.append(
        "file,letter,raw_prediction,"
        "final_prediction,confidence,"
        "rule_applied"
    )

    for item in results:

        lines.append(
            f"{item['file']},"
            f"{item['letter']},"
            f"{item['raw_prediction']},"
            f"{item['prediction']},"
            f"{item['confidence']:.4f},"
            f"{item['rule_applied']}"
        )

    output_path.write_text(
        "\n".join(lines),
        encoding="utf-8"
    )


# ============================================================
# MAIN
# ============================================================

def main():

    parser = argparse.ArgumentParser(
        description=(
            "Handwriting page analysis using "
            "MobileNet + letter-aware rules."
        )
    )

    parser.add_argument(
        "--characters",
        default=DEFAULT_CHARACTERS
    )

    parser.add_argument(
        "--model",
        default=DEFAULT_MODEL
    )

    parser.add_argument(
        "--report",
        default=DEFAULT_REPORT
    )

    parser.add_argument(
        "--html-report",
        default="artifacts/page_test/handwriting_result_sheet.html",
        help="HTML result sheet with summary and Grad-CAM explanations"
    )

    parser.add_argument(
        "--gradcam-dir",
        default="artifacts/page_test/gradcam",
        help="Directory where per-character Grad-CAM panels are saved"
    )

    parser.add_argument(
        "--json-report",
        default=None,
        help="Optional machine-readable JSON results for PDF/API integration"
    )

    parser.add_argument(
        "--no-gradcam",
        action="store_true",
        help="Skip Grad-CAM generation (faster, but no visual explanations)"
    )

    args = parser.parse_args()

    character_dir = Path(
        args.characters
    )

    model_path = Path(
        args.model
    )

    report_path = Path(
        args.report
    )

    html_report_path = Path(args.html_report)
    gradcam_dir = Path(args.gradcam_dir)

    # ========================================================
    # CHECK PATHS
    # ========================================================

    if not model_path.exists():

        raise FileNotFoundError(
            f"\nModel not found:\n"
            f"{model_path.resolve()}"
        )

    if not character_dir.exists():

        raise FileNotFoundError(
            f"\nCharacter directory not found:\n"
            f"{character_dir.resolve()}"
        )

    # ========================================================
    # DEVICE
    # ========================================================

    device = get_device()

    print()
    print("=" * 70)
    print(
        "HANDWRITING PAGE ANALYSIS"
    )
    print("=" * 70)

    print()

    print(
        "Device:",
        device
    )

    if device.type == "xpu":

        print(
            "Intel GPU:",
            torch.xpu.get_device_name(0)
        )

    elif device.type == "cuda":

        print(
            "CUDA GPU:",
            torch.cuda.get_device_name(0)
        )

    else:

        print(
            "WARNING: Running on CPU"
        )

    # ========================================================
    # LOAD MODEL
    # ========================================================

    model, class_names = load_model(
        model_path,
        device
    )

    print()

    print(
        "Class mapping:",
        {
            name: i
            for i, name in enumerate(
                class_names
            )
        }
    )

    # ========================================================
    # FIND CHARACTER CROPS
    # ========================================================

    images = find_character_images(
        character_dir
    )

    print()

    print(
        "Character crops found:",
        len(images)
    )

    if len(images) == 0:

        raise RuntimeError(
            "\nNo *_28x28.png character "
            "crops found.\n\n"
            "Run:\n"
            "python character_segment_v2.py"
        )

    # ========================================================
    # TRANSFORM
    # ========================================================

    transform = create_transform()

    # ========================================================
    # PREDICTIONS
    # ========================================================

    counts = Counter()

    results = []

    adjustment_count = 0

    print()

    print(
        "Running character classification..."
    )

    print()

    for index, image_path in enumerate(
        images,
        start=1
    ):

        class_index, confidence, probabilities = (
            predict_character(
                model,
                image_path,
                transform,
                device
            )
        )

        # ----------------------------------------------------
        # Raw MobileNet prediction
        # ----------------------------------------------------

        raw_prediction = class_names[
            class_index
        ]

        # ----------------------------------------------------
        # Get expected letter
        # ----------------------------------------------------

        expected_letter = (
            get_letter_from_filename(
                image_path
            )
        )

        # ----------------------------------------------------
        # Letter-aware correction
        # ----------------------------------------------------

        final_prediction = (
            apply_letter_rule(
                expected_letter,
                raw_prediction
            )
        )

        rule_applied = (
            raw_prediction !=
            final_prediction
        )

        if rule_applied:

            adjustment_count += 1

        # ----------------------------------------------------
        # Count FINAL prediction
        # ----------------------------------------------------

        counts[
            final_prediction
        ] += 1

        # ----------------------------------------------------
        # Generate Grad-CAM for this character's raw prediction
        # ----------------------------------------------------

        gradcam_path = None
        if not args.no_gradcam:
            safe_name = f"{index:04d}_{image_path.stem}_gradcam.png"
            gradcam_path = gradcam_dir / safe_name
            try:
                generate_gradcam(
                    model, image_path, transform, device, class_index, gradcam_path
                )
            except Exception as exc:
                print(f"WARNING: Grad-CAM failed for {image_path.name}: {exc}")
                gradcam_path = None

        # ----------------------------------------------------
        # Save result
        # ----------------------------------------------------

        results.append({
            "file": str(image_path.relative_to(character_dir)),
            "letter": expected_letter,
            "raw_prediction": raw_prediction,
            "prediction": final_prediction,
            "confidence": confidence,
            "rule_applied": rule_applied,
            "gradcam_path": str(gradcam_path) if gradcam_path else None,
        })

        # ----------------------------------------------------
        # Terminal output
        # ----------------------------------------------------

        if rule_applied:

            print(
                f"[{index:02d}/{len(images)}] "
                f"{expected_letter:<2} "
                f"{raw_prediction:<10} "
                f"-> "
                f"{final_prediction:<10} "
                f"{confidence * 100:6.2f}% "
                f"[LETTER RULE]"
            )

        else:

            print(
                f"[{index:02d}/{len(images)}] "
                f"{expected_letter:<2} "
                f"{final_prediction:<10} "
                f"{confidence * 100:6.2f}%"
            )

    # ========================================================
    # MAKE SURE ALL CLASSES EXIST
    # ========================================================

    for class_name in CLASS_NAMES_DEFAULT:

        if class_name not in counts:

            counts[
                class_name
            ] = 0

    # ========================================================
    # SCORE
    # ========================================================

    score = calculate_score(
        counts
    )

    level = classify_score(
        score
    )

    # ========================================================
    # FINAL REPORT
    # ========================================================

    total = len(
        images
    )

    print()

    print("=" * 70)
    print(
        "HANDWRITING ANALYSIS REPORT"
    )
    print("=" * 70)

    print()

    print(
        f"Characters analysed : "
        f"{total}"
    )

    print()

    print(
        "FINAL CLASSIFICATION"
    )

    print(
        "----------------------------------------"
    )

    for class_name in CLASS_NAMES_DEFAULT:

        count = counts[
            class_name
        ]

        percentage = (
            count /
            total *
            100
        )

        print(
            f"{class_name:<12}: "
            f"{count:3d} "
            f"({percentage:6.2f}%)"
        )

    print()

    print(
        f"Letter-aware adjustments : "
        f"{adjustment_count}"
    )

    print()

    print(
        f"Handwriting Score : "
        f"{score:.2f} / 100"
    )

    print(
        f"Student Level     : "
        f"{level}"
    )

    print()

    # ========================================================
    # RECOMMENDATION
    # ========================================================

    print(
        "Recommendation:"
    )

    if level == "Support needed":

        print(
            "The handwriting shows a relatively "
            "high frequency of reversal/correction "
            "patterns."
        )

        print(
            "Additional handwriting support and "
            "targeted practice may be beneficial."
        )

    elif level == "Developing":

        print(
            "The handwriting demonstrates developing "
            "consistency."
        )

        print(
            "Continue structured handwriting practice "
            "and monitor progress."
        )

    else:

        print(
            "The handwriting demonstrates relatively "
            "strong consistency."
        )

        print(
            "Continue regular practice and monitoring."
        )

    print()

    # ========================================================
    # RULE INFORMATION
    # ========================================================

    print(
        "Letter-aware rules:"
    )

    print(
        "i, o, t, u, v, x, y "
        "are forced to Normal."
    )

    print(
        "This rule is based on the current "
        "dataset distribution."
    )

    print()

    # ========================================================
    # SAVE REPORT
    # ========================================================

    save_report(
        report_path,
        results,
        counts,
        score,
        level,
        adjustment_count
    )

    save_html_result_sheet(
        html_report_path,
        results,
        counts,
        score,
        level,
    )

    if args.json_report:
        json_path = Path(args.json_report)
        json_path.parent.mkdir(parents=True, exist_ok=True)
        payload = {
            "characters_analysed": len(results),
            "counts": {name: int(counts.get(name, 0)) for name in CLASS_NAMES_DEFAULT},
            "score": float(score),
            "level": level,
            "letter_rule_adjustments": int(adjustment_count),
            "results": [
                {**item, "confidence": float(item["confidence"]),
                 "rule_applied": bool(item["rule_applied"])}
                for item in results
            ],
        }
        json_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        print("JSON result data saved:")
        print(json_path.resolve())

    print("HTML result sheet saved:")
    print(html_report_path.resolve())
    if not args.no_gradcam:
        print("Grad-CAM images saved:")
        print(gradcam_dir.resolve())

    print(
        "Report saved:"
    )

    print(
        report_path.resolve()
    )

    print()

    print("=" * 70)
    print(
        "ANALYSIS COMPLETE"
    )
    print("=" * 70)


if __name__ == "__main__":
    main()