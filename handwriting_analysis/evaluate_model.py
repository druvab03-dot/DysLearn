import torch
from torchvision import datasets, transforms, models
from torch import nn
from torch.utils.data import DataLoader
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    classification_report
)
import numpy as np


DATA_DIR = "datasets/mobilenet_prepared/test"
MODEL_PATH = "artifacts/best_model.pt"

# Same preprocessing used during training
transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=3),
    transforms.Resize((96, 96)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

dataset = datasets.ImageFolder(
    DATA_DIR,
    transform=transform
)

loader = DataLoader(
    dataset,
    batch_size=128,
    shuffle=False
)

# Create MobileNetV3-Small
model = models.mobilenet_v3_small(weights=None)

num_classes = len(dataset.classes)

model.classifier[-1] = nn.Linear(
    model.classifier[-1].in_features,
    num_classes
)

checkpoint = torch.load(
    MODEL_PATH,
    map_location="cpu"
)

if "model_state_dict" in checkpoint:
    model.load_state_dict(checkpoint["model_state_dict"])
else:
    model.load_state_dict(checkpoint)

model.eval()

all_predictions = []
all_targets = []

with torch.no_grad():

    for images, labels in loader:

        outputs = model(images)

        predictions = torch.argmax(
            outputs,
            dim=1
        )

        all_predictions.extend(
            predictions.numpy()
        )

        all_targets.extend(
            labels.numpy()
        )


# Accuracy
accuracy = accuracy_score(
    all_targets,
    all_predictions
)

print("\n==============================")
print("MODEL EVALUATION")
print("==============================")

print(
    f"\nAccuracy: {accuracy * 100:.2f}%"
)


# Confusion Matrix
cm = confusion_matrix(
    all_targets,
    all_predictions
)

print("\nConfusion Matrix:")
print(cm)


# Classification report
print("\nClassification Report:")

print(
    classification_report(
        all_targets,
        all_predictions,
        target_names=dataset.classes,
        digits=4
    )
)