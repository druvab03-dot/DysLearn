import argparse
import torch
from PIL import Image
from torchvision import transforms, models
from torch import nn


def build_model(num_classes):
    model = models.mobilenet_v3_small(weights=None)
    model.classifier[-1] = nn.Linear(
        model.classifier[-1].in_features,
        num_classes
    )
    return model


def main():

    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--image",
        required=True,
        help="Path to letter image"
    )

    parser.add_argument(
        "--model",
        default="artifacts/best_model.pt"
    )

    args = parser.parse_args()

    # Select device
    if hasattr(torch, "xpu") and torch.xpu.is_available():
        device = torch.device("xpu")
    elif torch.cuda.is_available():
        device = torch.device("cuda")
    else:
        device = torch.device("cpu")

    print("Device:", device)

    # Load model
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

    # Image preprocessing
    transform = transforms.Compose([
        transforms.Grayscale(num_output_channels=3),
        transforms.Resize((96, 96)),
        transforms.ToTensor(),
        transforms.Normalize(
            [0.485] * 3,
            [0.229] * 3
        )
    ])

    image = Image.open(args.image)

    image = transform(image)

    image = image.unsqueeze(0)

    image = image.to(device)

    # Prediction
    with torch.no_grad():

        output = model(image)

        probabilities = torch.softmax(
            output,
            dim=1
        )[0]

    predicted_index = int(
        probabilities.argmax()
    )

    predicted_class = class_names[
        predicted_index
    ]

    confidence = float(
        probabilities[predicted_index]
    )

    print()
    print("==========================")
    print("HANDWRITING PREDICTION")
    print("==========================")

    print(
        "Prediction:",
        predicted_class
    )

    print(
        "Confidence:",
        f"{confidence * 100:.2f}%"
    )

    print()
    print("Class probabilities:")

    for i, class_name in enumerate(class_names):

        probability = float(
            probabilities[i]
        )

        print(
            f"{class_name:10s}: "
            f"{probability * 100:.2f}%"
        )


if __name__ == "__main__":
    main()