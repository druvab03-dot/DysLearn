
"""Create a summary-only DysLearn Handwriting Analysis PDF."""

import argparse
import json
from datetime import datetime
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image,
    HRFlowable,
)
from reportlab.platypus.flowables import Flowable


# ------------------------------------------------------------
# COLORS
# ------------------------------------------------------------

NAVY = colors.HexColor("#142b59")
BLUE = colors.HexColor("#3c9fe8")
PURPLE = colors.HexColor("#8760d8")
GREEN = colors.HexColor("#39c963")
ORANGE = colors.HexColor("#ffb324")
RED = colors.HexColor("#ff4147")
PALE_PURPLE = colors.HexColor("#f0eaff")
PALE = colors.HexColor("#f7f9fc")
BORDER = colors.HexColor("#d9e2f1")
MUTED = colors.HexColor("#5b6577")


# ------------------------------------------------------------
# DONUT CHART
# ------------------------------------------------------------

class DonutChart(Flowable):

    def __init__(self, counts, total,
                 width=4.8 * inch, height=2.0 * inch):
        super().__init__()
        self.counts = counts
        self.total = total
        self.width = width
        self.height = height

    def draw(self):
        canvas = self.canv

        cx = self.width * 0.30
        cy = self.height * 0.50
        radius = min(self.height * 0.38, self.width * 0.22)
        inner_radius = radius * 0.55

        labels = [
            ("Normal", GREEN),
            ("Reversal", RED),
            ("Corrected", ORANGE),
        ]

        values = [
            max(0, int(self.counts.get(name, 0)))
            for name, _ in labels
        ]

        chart_total = sum(values)
        start_angle = 90

        if chart_total == 0:
            canvas.setFillColor(colors.HexColor("#e8edf4"))
            canvas.circle(cx, cy, radius, stroke=0, fill=1)
        else:
            for value, (_, color) in zip(values, labels):
                if value <= 0:
                    continue

                extent = 360 * value / chart_total

                canvas.setFillColor(color)
                canvas.wedge(
                    cx - radius,
                    cy - radius,
                    cx + radius,
                    cy + radius,
                    start_angle,
                    extent,
                    stroke=0,
                    fill=1,
                )

                start_angle += extent

        # White centre of donut
        canvas.setFillColor(colors.white)
        canvas.circle(cx, cy, inner_radius, stroke=0, fill=1)

        canvas.setFillColor(NAVY)
        canvas.setFont("Helvetica-Bold", 16)
        canvas.drawCentredString(cx, cy + 2, str(self.total))

        canvas.setFont("Helvetica", 7)
        canvas.drawCentredString(cx, cy - 10, "characters")

        # Legend
        legend_x = self.width * 0.59
        legend_y = self.height - 0.40 * inch

        for (name, color), value in zip(labels, values):
            percentage = (
                value / self.total * 100
                if self.total else 0
            )

            canvas.setFillColor(color)
            canvas.circle(
                legend_x, legend_y + 3, 4,
                stroke=0, fill=1
            )

            canvas.setFillColor(NAVY)
            canvas.setFont("Helvetica", 9)
            canvas.drawString(
                legend_x + 10, legend_y, name
            )

            canvas.setFont("Helvetica-Bold", 9)
            canvas.drawRightString(
                self.width - 3,
                legend_y,
                f"{value} ({percentage:.1f}%)",
            )

            legend_y -= 0.38 * inch


# ------------------------------------------------------------
# HELPERS
# ------------------------------------------------------------

def para(text, style):
    return Paragraph(str(text), style)


def safe_logo(path, width=0.82 * inch, height=0.62 * inch):
    if path:
        logo_path = Path(path)
    else:
        logo_path = (
            Path(__file__).resolve().parent
            / "dyslearn_logo.png"
        )

    if logo_path.is_file():
        try:
            return Image(
                str(logo_path),
                width=width,
                height=height,
                kind="proportional",
            )
        except Exception:
            pass

    return para(
        "<b>DL</b>",
        getSampleStyleSheet()["Title"]
    )


# ------------------------------------------------------------
# BUILD PDF
# ------------------------------------------------------------

def make_pdf(
    json_path: Path,
    output_path: Path,
    class_number: int,
    upload_id="",
    source_image=None,
    words_dir=None,
    logo_path=None,
    characters_dir=None,
):
    """
    Generate a summary PDF containing:
    - Normal, Reversal, Corrected counts
    - Percentages and donut chart
    - Overall score
    - Performance category

    Extra arguments are retained for compatibility with app.py.
    """

    data = json.loads(
        Path(json_path).read_text(encoding="utf-8")
    )

    output_path = Path(output_path)
    output_path.parent.mkdir(
        parents=True, exist_ok=True
    )

    # --------------------------------------------------------
    # COUNTS
    # --------------------------------------------------------

    raw_counts = data.get("counts", {}) or {}

    counts = {
        "Normal": int(raw_counts.get("Normal", 0) or 0),
        "Reversal": int(raw_counts.get("Reversal", 0) or 0),
        "Corrected": int(raw_counts.get("Corrected", 0) or 0),
    }

    # If counts are missing, derive them from predictions.
    if sum(counts.values()) == 0:
        for item in data.get("results", []):
            prediction = item.get("prediction")

            if prediction in counts:
                counts[prediction] += 1

    total = sum(counts.values())

    score = float(data.get("score", 0) or 0)
    level = str(data.get("level", "Not available"))

    # --------------------------------------------------------
    # STYLES
    # --------------------------------------------------------

    styles = getSampleStyleSheet()

    styles.add(ParagraphStyle(
        name="BrandTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=21,
        leading=25,
        alignment=TA_LEFT,
        textColor=NAVY,
        spaceAfter=0,
    ))

    styles.add(ParagraphStyle(
        name="SectionBlue",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#07549a"),
        spaceBefore=0,
        spaceAfter=7,
    ))

    styles.add(ParagraphStyle(
        name="Small",
        parent=styles["BodyText"],
        fontSize=9,
        leading=12,
        textColor=MUTED,
    ))

    styles.add(ParagraphStyle(
        name="SmallCenter",
        parent=styles["BodyText"],
        fontSize=9,
        leading=12,
        textColor=NAVY,
        alignment=TA_CENTER,
    ))

    styles.add(ParagraphStyle(
        name="Metric",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=19,
        leading=23,
        alignment=TA_CENTER,
        textColor=NAVY,
    ))

    styles.add(ParagraphStyle(
        name="MetricLabel",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=12,
        alignment=TA_CENTER,
        textColor=MUTED,
    ))

    styles.add(ParagraphStyle(
        name="FooterNote",
        parent=styles["BodyText"],
        fontSize=8,
        leading=11,
        textColor=MUTED,
    ))

    # --------------------------------------------------------
    # DOCUMENT
    # --------------------------------------------------------

    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=landscape(A4),
        rightMargin=0.42 * inch,
        leftMargin=0.42 * inch,
        topMargin=0.34 * inch,
        bottomMargin=0.42 * inch,
        title="DysLearn Handwriting Analysis Summary",
        author="DysLearn",
    )

    story = []

    # --------------------------------------------------------
    # HEADER
    # --------------------------------------------------------

    brand = para(
        '<font color="#8760d8">Dys</font>'
        '<font color="#3c9fe8">Learn</font> '
        '<font color="#142b59">Handwriting Analysis</font>',
        styles["BrandTitle"],
    )

    meta = para(
        f"<b>Class:</b> {class_number}<br/>"
        f"<b>Test date:</b> {datetime.now().strftime('%d %b %Y')}<br/>"
        f"<b>Reference:</b> "
        f"{upload_id[:8] if upload_id else '—'}",
        styles["Small"],
    )

    header = Table(
        [[safe_logo(logo_path), brand, meta]],
        colWidths=[
            1.0 * inch,
            6.7 * inch,
            2.5 * inch,
        ],
        rowHeights=[0.70 * inch],
    )

    header.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        (
            "LINEBELOW",
            (0, 0),
            (-1, -1),
            1.5,
            colors.HexColor("#c7ccff"),
        ),
    ]))

    story += [
        header,
        Spacer(1, 0.30 * inch),
    ]

    # --------------------------------------------------------
    # SCORE AND PERFORMANCE SUMMARY
    # --------------------------------------------------------

    metrics = Table(
        [
            [
                para(
                    "OVERALL HANDWRITING SCORE",
                    styles["MetricLabel"],
                ),
                para(
                    "PERFORMANCE CATEGORY",
                    styles["MetricLabel"],
                ),
                para(
                    "CHARACTERS CLASSIFIED",
                    styles["MetricLabel"],
                ),
            ],
            [
                para(
                    f"{score:.1f}/100",
                    styles["Metric"],
                ),
                para(
                    level,
                    styles["Metric"],
                ),
                para(
                    str(total),
                    styles["Metric"],
                ),
            ],
        ],
        colWidths=[
            3.45 * inch,
            3.45 * inch,
            3.45 * inch,
        ],
        rowHeights=[
            0.35 * inch,
            0.62 * inch,
        ],
    )

    metrics.setStyle(TableStyle([
        (
            "BACKGROUND",
            (0, 0),
            (-1, -1),
            PALE_PURPLE,
        ),
        (
            "BOX",
            (0, 0),
            (-1, -1),
            0.7,
            colors.HexColor("#d4c4ff"),
        ),
        (
            "INNERGRID",
            (0, 0),
            (-1, -1),
            0.5,
            colors.HexColor("#d4c4ff"),
        ),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))

    story += [
        metrics,
        Spacer(1, 0.30 * inch),
        para(
            "Classification Counts",
            styles["SectionBlue"],
        ),
    ]

    # --------------------------------------------------------
    # COUNTS TABLE
    # --------------------------------------------------------

    table_rows = [
        ["Classification", "Count", "Percentage"]
    ]

    class_colors = {
        "Normal": GREEN,
        "Reversal": RED,
        "Corrected": ORANGE,
    }

    for name in ("Normal", "Reversal", "Corrected"):
        count = counts[name]

        percentage = (
            count / total * 100
            if total else 0
        )

        table_rows.append([
            name,
            str(count),
            f"{percentage:.1f}%",
        ])

    summary_table = Table(
        table_rows,
        colWidths=[
            1.75 * inch,
            1.0 * inch,
            1.2 * inch,
        ],
        rowHeights=[
            0.38 * inch,
            0.48 * inch,
            0.48 * inch,
            0.48 * inch,
        ],
    )

    table_style = [
        (
            "BACKGROUND",
            (0, 0),
            (-1, 0),
            NAVY,
        ),
        (
            "TEXTCOLOR",
            (0, 0),
            (-1, 0),
            colors.white,
        ),
        (
            "FONTNAME",
            (0, 0),
            (-1, 0),
            "Helvetica-Bold",
        ),
        (
            "FONTSIZE",
            (0, 0),
            (-1, -1),
            10,
        ),
        (
            "GRID",
            (0, 0),
            (-1, -1),
            0.5,
            BORDER,
        ),
        (
            "VALIGN",
            (0, 0),
            (-1, -1),
            "MIDDLE",
        ),
        (
            "ALIGN",
            (1, 0),
            (-1, -1),
            "CENTER",
        ),
        (
            "LEFTPADDING",
            (0, 0),
            (-1, -1),
            8,
        ),
        (
            "RIGHTPADDING",
            (0, 0),
            (-1, -1),
            8,
        ),
    ]

    for row, name in enumerate(
        ("Normal", "Reversal", "Corrected"),
        start=1,
    ):
        table_style.append((
            "TEXTCOLOR",
            (0, row),
            (0, row),
            class_colors[name],
        ))

        table_style.append((
            "FONTNAME",
            (0, row),
            (0, row),
            "Helvetica-Bold",
        ))

        background = (
            colors.white if row % 2 else PALE
        )

        table_style.append((
            "BACKGROUND",
            (0, row),
            (-1, row),
            background,
        ))

    summary_table.setStyle(
        TableStyle(table_style)
    )

    # --------------------------------------------------------
    # CHART AND TABLE
    # --------------------------------------------------------

    chart = DonutChart(
        counts,
        total,
        width=5.0 * inch,
        height=2.15 * inch,
    )

    results_panel = Table(
        [[chart, summary_table]],
        colWidths=[
            5.35 * inch,
            4.35 * inch,
        ],
    )

    results_panel.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        (
            "BOX",
            (0, 0),
            (-1, -1),
            0.7,
            BORDER,
        ),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
    ]))

    story += [
        results_panel,
        Spacer(1, 0.28 * inch),
        HRFlowable(
            width="100%",
            thickness=0.6,
            color=BORDER,
        ),
        Spacer(1, 0.12 * inch),
        para(
            "These counts reflect the model's current classifications. "
            "They do not independently verify whether expected letters "
            "were omitted or written incorrectly, and they are not "
            "a diagnosis of dyslexia.",
            styles["FooterNote"],
        ),
    ]

    # --------------------------------------------------------
    # FOOTER
    # --------------------------------------------------------

    def footer(canvas, doc_obj):
        canvas.saveState()

        canvas.setFont("Helvetica", 7)
        canvas.setFillColor(MUTED)

        canvas.drawString(
            0.42 * inch,
            0.18 * inch,
            "DysLearn Handwriting Analysis | "
            "Experimental support tool, not a diagnosis",
        )

        canvas.drawRightString(
            landscape(A4)[0] - 0.42 * inch,
            0.18 * inch,
            f"Page {doc_obj.page}",
        )

        canvas.restoreState()

    doc.build(
        story,
        onFirstPage=footer,
        onLaterPages=footer,
    )

    return output_path


# ------------------------------------------------------------
# COMMAND LINE
# ------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser()

    parser.add_argument("--json", required=True)
    parser.add_argument("--output", required=True)

    parser.add_argument(
        "--class-number",
        type=int,
        choices=[1, 2, 3, 4, 5],
        required=True,
    )

    parser.add_argument("--upload-id", default="")
    parser.add_argument("--source-image")
    parser.add_argument("--words-dir")
    parser.add_argument("--logo")
    parser.add_argument("--characters-dir")

    args = parser.parse_args()

    make_pdf(
        Path(args.json),
        Path(args.output),
        args.class_number,
        args.upload_id,
        args.source_image,
        args.words_dir,
        args.logo,
        args.characters_dir,
    )


if __name__ == "__main__":
    main()
