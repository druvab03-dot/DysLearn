"""Upload API that automatically analyses handwriting and returns a PDF report.

Frontend request: multipart/form-data with `class_number` (1..5) and `image`.
Successful response: application/pdf containing the summary and Grad-CAM panels.
"""
import os
import sys
import uuid
import subprocess
from pathlib import Path
from typing import Annotated

import cv2
import numpy as np
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import FileResponse

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = Path(os.getenv("HANDWRITING_UPLOAD_DIR", str(BASE_DIR / "uploads"))).resolve()
RESULTS_DIR = Path(os.getenv("HANDWRITING_RESULTS_DIR", str(BASE_DIR / "results"))).resolve()
MODEL_PATH = Path(os.getenv("HANDWRITING_MODEL_PATH", str(BASE_DIR / "artifacts" / "best_model.pt"))).resolve()
MAX_UPLOAD_BYTES = 15 * 1024 * 1024
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
PIPELINE_TIMEOUT_SECONDS = int(os.getenv("HANDWRITING_PIPELINE_TIMEOUT", "300"))

app = FastAPI(
    title="Handwriting Analysis API",
    version="2.0.0",
    description="Receives a class number and handwriting photo, runs analysis and returns a Grad-CAM PDF.",
)

origins_env = os.getenv(
    "FRONTEND_ORIGINS",
    "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173",
)
origins = [origin.strip() for origin in origins_env.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition", "X-Upload-ID", "X-Class-Number"],
)


def run_step(command: list[str], step_name: str) -> None:
    """Run a pipeline script and surface a readable error if it fails."""
    try:
        completed = subprocess.run(
            command,
            cwd=BASE_DIR,
            capture_output=True,
            text=True,
            timeout=PIPELINE_TIMEOUT_SECONDS,
            check=False,
        )
    except subprocess.TimeoutExpired as exc:
        raise RuntimeError(f"{step_name} exceeded the {PIPELINE_TIMEOUT_SECONDS}s time limit.") from exc
    if completed.returncode != 0:
        details = (completed.stdout + "\n" + completed.stderr).strip()
        details = details[-5000:] if details else "No diagnostic output was produced."
        raise RuntimeError(f"{step_name} failed.\n{details}")


def run_full_analysis(image_path: Path, class_number: int, job_dir: Path, upload_id: str) -> Path:
    """Run preprocessing -> word segmentation -> character segmentation -> prediction -> PDF."""
    if not MODEL_PATH.is_file():
        raise RuntimeError(f"Trained model weights were not found at {MODEL_PATH}")

    processed_dir = job_dir / "processed"
    words_dir = processed_dir / "words_v2"
    characters_dir = processed_dir / "characters_v2"
    gradcam_dir = job_dir / "gradcam"
    report_txt = job_dir / "handwriting_report.txt"
    report_html = job_dir / "handwriting_result_sheet.html"
    report_json = job_dir / "analysis.json"
    report_pdf = job_dir / "handwriting_gradcam_report.pdf"

    run_step([
        sys.executable, str(BASE_DIR / "page_preprocess.py"),
        "--image", str(image_path), "--output_dir", str(processed_dir),
    ], "Page preprocessing")

    lines_dir = processed_dir / "lines"
    if not any(lines_dir.glob("line_*.png")):
        raise RuntimeError("No handwriting lines were detected. Please upload a clear photo showing the full passage.")

    run_step([
        sys.executable, str(BASE_DIR / "word_segment.py"),
        "--line_dir", str(lines_dir), "--output_dir", str(words_dir),
    ], "Word segmentation")

    run_step([
        sys.executable, str(BASE_DIR / "character_segment_v2.py"),
        "--word_dir", str(words_dir), "--output_dir", str(characters_dir),
        "--class_number", str(class_number),
    ], "Character segmentation")

    run_step([
        sys.executable, str(BASE_DIR / "predict_page.py"),
        "--characters", str(characters_dir),
        "--model", str(MODEL_PATH),
        "--report", str(report_txt),
        "--html-report", str(report_html),
        "--gradcam-dir", str(gradcam_dir),
        "--json-report", str(report_json),
    ], "Classification and Grad-CAM")

    run_step([
        sys.executable, str(BASE_DIR / "pdf_result.py"),
        "--json", str(report_json),
        "--output", str(report_pdf),
        "--class-number", str(class_number),
        "--upload-id", upload_id,
        "--source-image", str(image_path),
        "--words-dir", str(words_dir),
        "--logo", str(BASE_DIR / "dyslearn_logo.png"),
        "--characters-dir", str(characters_dir),
    ], "PDF report generation")

    if not report_pdf.is_file() or report_pdf.stat().st_size == 0:
        raise RuntimeError("The analysis finished, but the PDF report could not be created.")
    return report_pdf


@app.get("/health")
def health():
    return {"status": "ok", "model_exists": MODEL_PATH.is_file(), "analysis_on_upload": True}


@app.post("/upload", response_class=FileResponse, responses={200: {"content": {"application/pdf": {}}}})
async def upload_handwriting(
    class_number: Annotated[int, Form(...)],
    image: Annotated[UploadFile, File(...)],
):
    """Receive photo + class, run the full pipeline, and return the PDF file."""
    if class_number not in {1, 2, 3, 4, 5}:
        raise HTTPException(status_code=422, detail="class_number must be between 1 and 5.")
    if image.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=415, detail="Upload a JPG, PNG, or WEBP image.")

    raw = await image.read(MAX_UPLOAD_BYTES + 1)
    if not raw:
        raise HTTPException(status_code=400, detail="The uploaded image is empty.")
    if len(raw) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Image must be 15 MB or smaller.")
    decoded = cv2.imdecode(np.frombuffer(raw, dtype=np.uint8), cv2.IMREAD_COLOR)
    if decoded is None or decoded.size == 0:
        raise HTTPException(status_code=400, detail="The uploaded file is not a valid image.")

    extension = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}[image.content_type]
    upload_id = uuid.uuid4().hex
    class_dir = UPLOAD_DIR / f"class_{class_number}"
    class_dir.mkdir(parents=True, exist_ok=True)
    saved_image = class_dir / f"{upload_id}{extension}"
    saved_image.write_bytes(raw)

    job_dir = RESULTS_DIR / upload_id
    job_dir.mkdir(parents=True, exist_ok=True)
    try:
        pdf_path = await run_in_threadpool(run_full_analysis, saved_image, class_number, job_dir, upload_id)
    except RuntimeError as exc:
        # Include a concise actionable error. The raw image remains available for debugging/retry.
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Unexpected analysis error: {type(exc).__name__}: {exc}") from exc

    filename = f"handwriting_result_class_{class_number}_{upload_id[:8]}.pdf"
    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=filename,
        headers={
            "X-Upload-ID": upload_id,
            "X-Class-Number": str(class_number),
            "Access-Control-Expose-Headers": "Content-Disposition, X-Upload-ID, X-Class-Number",
        },
    )


@app.get("/results/{upload_id}")
def get_result_pdf(upload_id: str):
    """Download a previously generated PDF if the frontend needs a separate GET request."""
    if not upload_id.isalnum() or len(upload_id) != 32:
        raise HTTPException(status_code=404, detail="Result not found.")
    pdf_path = RESULTS_DIR / upload_id / "handwriting_gradcam_report.pdf"
    if not pdf_path.is_file():
        raise HTTPException(status_code=404, detail="Result PDF not found.")
    return FileResponse(pdf_path, media_type="application/pdf", filename=f"handwriting_result_{upload_id[:8]}.pdf")
