import argparse
from pathlib import Path
import json
import numpy as np
import torch
from torch import nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
from sklearn.metrics import classification_report, confusion_matrix
from tqdm import tqdm


def build_model(num_classes=3):
    model = models.mobilenet_v3_small(
        weights=models.MobileNet_V3_Small_Weights.DEFAULT
    )
    model.classifier[-1] = nn.Linear(
        model.classifier[-1].in_features, num_classes
    )
    return model


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data_dir", required=True)
    ap.add_argument("--epochs", type=int, default=15)
    ap.add_argument("--batch_size", type=int, default=128)
    ap.add_argument("--lr", type=float, default=1e-3)
    ap.add_argument("--workers", type=int, default=4)
    ap.add_argument("--out", default="artifacts")
    args = ap.parse_args()

    data_dir = Path(args.data_dir)
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    train_tfms = transforms.Compose([
        transforms.Grayscale(num_output_channels=3),
        transforms.Resize((96, 96)),
        transforms.RandomAffine(
            degrees=8,
            translate=(0.08, 0.08),
            scale=(0.90, 1.10),
            shear=5,
        ),
        transforms.ToTensor(),
        transforms.Normalize([0.485]*3, [0.229]*3),
    ])

    eval_tfms = transforms.Compose([
        transforms.Grayscale(num_output_channels=3),
        transforms.Resize((96, 96)),
        transforms.ToTensor(),
        transforms.Normalize([0.485]*3, [0.229]*3),
    ])

    train_ds = datasets.ImageFolder(data_dir / "train", transform=train_tfms)
    val_ds = datasets.ImageFolder(data_dir / "val", transform=eval_tfms)
    test_ds = datasets.ImageFolder(data_dir / "test", transform=eval_tfms)

    print("Class mapping:", train_ds.class_to_idx)
    print("Train/Val/Test:", len(train_ds), len(val_ds), len(test_ds))

    # Compensate for class imbalance.
    counts = np.bincount(train_ds.targets, minlength=len(train_ds.classes))
    weights = counts.sum() / (len(counts) * counts)
    class_weights = torch.tensor(weights, dtype=torch.float32)

    if hasattr(torch, "xpu") and torch.xpu.is_available():
        device = torch.device("xpu")
    elif torch.cuda.is_available():
        device = torch.device("cuda")
    else:
        device = torch.device("cpu")

    print("Device:", device)

    if device.type == "xpu":
        print("Intel XPU device:", torch.xpu.get_device_name(0))

    train_loader = DataLoader(
        train_ds, batch_size=args.batch_size, shuffle=True,
        num_workers=args.workers, pin_memory=True
    )
    val_loader = DataLoader(
        val_ds, batch_size=args.batch_size, shuffle=False,
        num_workers=args.workers, pin_memory=True
    )
    test_loader = DataLoader(
        test_ds, batch_size=args.batch_size, shuffle=False,
        num_workers=args.workers, pin_memory=True
    )

    model = build_model(len(train_ds.classes)).to(device)
    criterion = nn.CrossEntropyLoss(weight=class_weights.to(device))
    optimizer = torch.optim.AdamW(
        model.parameters(), lr=args.lr, weight_decay=1e-4
    )
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(
        optimizer, T_max=args.epochs
    )

    best_val_acc = 0.0

    for epoch in range(args.epochs):
        model.train()
        correct = total = 0
        loss_sum = 0.0

        for x, y in tqdm(train_loader, desc=f"Epoch {epoch+1}/{args.epochs}"):
            x, y = x.to(device), y.to(device)
            optimizer.zero_grad()
            logits = model(x)
            loss = criterion(logits, y)
            loss.backward()
            optimizer.step()

            loss_sum += loss.item() * x.size(0)
            correct += (logits.argmax(1) == y).sum().item()
            total += x.size(0)

        scheduler.step()

        model.eval()
        vcorrect = vtotal = 0
        with torch.no_grad():
            for x, y in val_loader:
                x, y = x.to(device), y.to(device)
                logits = model(x)
                vcorrect += (logits.argmax(1) == y).sum().item()
                vtotal += x.size(0)

        val_acc = vcorrect / max(vtotal, 1)
        print(
            f"epoch={epoch+1} "
            f"train_loss={loss_sum/max(total,1):.4f} "
            f"train_acc={correct/max(total,1):.4f} "
            f"val_acc={val_acc:.4f}"
        )

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save({
                "model_state": model.state_dict(),
                "class_to_idx": train_ds.class_to_idx,
                "class_names": train_ds.classes,
            }, out / "best_model.pt")

    checkpoint = torch.load(out / "best_model.pt", map_location=device)
    model.load_state_dict(checkpoint["model_state"])
    model.eval()

    ys, preds = [], []
    with torch.no_grad():
        for x, y in test_loader:
            logits = model(x.to(device))
            preds.extend(logits.argmax(1).cpu().numpy())
            ys.extend(y.numpy())

    print("\nTEST REPORT")
    print(classification_report(
        ys, preds, target_names=test_ds.classes, digits=4
    ))
    print("Confusion matrix:")
    print(confusion_matrix(ys, preds))

    with open(out / "class_mapping.json", "w") as f:
        json.dump(train_ds.class_to_idx, f, indent=2)


if __name__ == "__main__":
    main()
