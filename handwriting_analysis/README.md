# Handwriting Analysis Model

Pipeline:
1. Notebook page -> letter candidates with OpenCV.
2. Letter crop -> Normal / Reversal / Corrected with MobileNetV3-Small.
3. Aggregate predictions into a 0-100 handwriting-performance score.
4. Map score to Support needed / Developing / Progressing well.

The supplied dataset has a prepared split at:
`datasets/mobilenet_prepared/{train,val,test}/{Normal,Reversal,Corrected}`

The current page segmentation is a baseline. For production, replace it with a
trained letter detector/instance-segmentation model because connected letters,
cursive writing, touching strokes, and notebook lines can confuse contours.

This is a handwriting-support/performance model, not a dyslexia diagnostic tool.

## Install

    pip install -r requirements.txt

## Train

    python train.py --data_dir /path/to/datasets/mobilenet_prepared --epochs 15 --batch_size 128

Best model:
`artifacts/best_model.pt`

## Analyse a page

    python predict_page.py --image notebook_page.jpg --model artifacts/best_model.pt

An annotated page is saved to `artifacts/annotated_page.jpg`.


## Grad-CAM visual result sheet

The page predictor can now create a visual HTML result sheet containing the overall score/category, counts for Normal/Corrected/Reversal, each character's prediction and confidence, and a Grad-CAM panel showing the character crop, heatmap, and overlay. Grad-CAM is generated for the model's raw predicted class; the final class may differ when a letter-aware rule is applied.

Run the predictor after the existing preprocessing and segmentation steps have produced `*_28x28.png` character crops:

```bash
python predict_page.py \
  --characters artifacts/page_test/characters_v2 \
  --model artifacts/best_model.pt \
  --report artifacts/page_test/handwriting_report.txt \
  --html-report artifacts/page_test/handwriting_result_sheet.html \
  --gradcam-dir artifacts/page_test/gradcam
```

Open `artifacts/page_test/handwriting_result_sheet.html` in a browser. The HTML report links to the generated images in the `gradcam` folder, so keep that folder alongside the HTML file when sharing the report. For faster runs without visual explanations, pass `--no-gradcam`.

**Important:** Grad-CAM explains which image regions influenced the classifier; it does not establish that a prediction is correct and does not diagnose dyslexia. The current API upload endpoint still only receives and stores images; automatically running preprocessing, segmentation, prediction, and returning a per-upload result URL is a separate integration step.

## Automatic upload → analysis → Grad-CAM PDF

The FastAPI endpoint now runs the complete pipeline when a photo is uploaded:

1. Validate and save the image with the selected class number.
2. OpenCV preprocessing and handwriting-line detection.
3. Word segmentation.
4. Class-specific expected-text matching and character segmentation.
5. MobileNet classification, letter-aware rules, scoring, and Grad-CAM generation.
6. Build a PDF result sheet and return it directly from the upload request.

Start the API from this project directory:

```bash
python -m pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

`POST http://localhost:8000/upload` expects `multipart/form-data` fields:
- `class_number`: `1`, `2`, `3`, `4`, or `5`
- `image`: JPG, PNG, or WEBP handwriting photo (maximum 15 MB)

The successful response body is the PDF (`application/pdf`), not JSON. The report is also saved under `results/<upload_id>/handwriting_gradcam_report.pdf`. The response includes `X-Upload-ID` and `X-Class-Number` headers. A saved report can be fetched again from `GET /results/<upload_id>`.

### Example frontend JavaScript

```javascript
async function submitHandwriting(imageFile, classNumber) {
  const form = new FormData();
  form.append("class_number", String(classNumber));
  form.append("image", imageFile);

  const response = await fetch("http://localhost:8000/upload", {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Handwriting analysis failed.");
  }

  const pdfBlob = await response.blob();
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.download = `handwriting-result-class-${classNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(pdfUrl);
}
```

### Important behaviour

The segmentation stage compares the detected word count with the complete passage for the selected class. If they do not match, the API returns an error rather than generating a report with potentially misaligned expected letters. In that case, check the photo is clear, shows the whole passage, and has visible gaps between words. The current OpenCV segmenter is a prototype and may need improvement for joined-up handwriting or uneven spacing.

Grad-CAM is an explanation of the model's raw character prediction, not proof of correctness and not a dyslexia diagnosis. The score/category is a prototype handwriting-performance metric.


## DysLearn branded PDF layout

The automatic upload response now uses `pdf_result.py` to build a branded landscape PDF with the supplied DysLearn logo and the title **DysLearn Handwriting Analysis**. It includes the summary donut and score/category, the selected class's full assessment passage and uploaded image, a compact character grid showing only the original character crop, Grad-CAM heatmap, and predicted class, plus three original/heatmap/overlay examples. The detailed per-character grid intentionally omits extra columns to keep the result easy for families to read.
