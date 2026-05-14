import io
import os
from typing import Dict, List

import torch
import torch.nn as nn
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from torchvision import models, transforms


CLASS_NAMES = ["1st Degree", "2nd Degree", "3rd Degree"]
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]
WEIGHTS_PATH = os.getenv(
    "BURN_MODEL_WEIGHTS",
    os.path.join(os.path.dirname(__file__), "..", "temp-burn-model", "models", "best_burn_model_v4.pth"),
)


def build_model(num_classes: int = 3, dropout_p: float = 0.4) -> nn.Module:
    model = models.efficientnet_b3(weights=models.EfficientNet_B3_Weights.DEFAULT)
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=dropout_p),
        nn.Linear(in_features, 512),
        nn.SiLU(),
        nn.Dropout(p=dropout_p * 0.5),
        nn.Linear(512, num_classes),
    )
    return model


def build_transform() -> transforms.Compose:
    return transforms.Compose(
        [
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
        ]
    )


def load_model() -> nn.Module:
    if not os.path.exists(WEIGHTS_PATH):
        raise FileNotFoundError(f"Model weights not found at: {WEIGHTS_PATH}")

    model = build_model(num_classes=3, dropout_p=0.4)
    state_dict = torch.load(WEIGHTS_PATH, map_location="cpu")
    model.load_state_dict(state_dict, strict=True)
    model.eval()
    return model


def get_recommendations(prediction_label: str) -> Dict[str, str | List[str]]:
    label = prediction_label.lower()
    if "1st" in label or "first" in label:
        return {
            "description": "First-degree burn. Usually superficial with redness and mild pain.",
            "recommendations": [
                "Cool the area under running water for 20 minutes.",
                "Use a clean non-stick dressing.",
                "Avoid ice, oils, or toothpaste.",
            ],
        }
    if "2nd" in label or "second" in label:
        return {
            "description": "Second-degree burn. May include blisters with moderate to severe pain.",
            "recommendations": [
                "Cool under running water immediately.",
                "Do not break blisters.",
                "Seek urgent care if the area is large or on face/hands/feet/genitals.",
            ],
        }
    return {
        "description": "Third-degree burn. Medical emergency requiring immediate professional care.",
        "recommendations": [
            "Call emergency services now.",
            "Cover with a clean, dry cloth.",
            "Do not apply water, ice, creams, or remove stuck clothing.",
        ],
    }


app = FastAPI(title="Burn Model API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

inference_model = load_model()
inference_transform = build_transform()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed.")

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty image file.")

    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid image format.") from exc

    tensor = inference_transform(image).unsqueeze(0)
    with torch.no_grad():
        logits = inference_model(tensor)
        probs = torch.softmax(logits, dim=1)[0]
        confidence, idx = torch.max(probs, dim=0)

    prediction = CLASS_NAMES[idx.item()]
    extra = get_recommendations(prediction)
    return {
        "prediction": prediction,
        "confidence": float(confidence.item()),
        "probabilities": {name: float(probs[i].item()) for i, name in enumerate(CLASS_NAMES)},
        "description": extra["description"],
        "recommendations": extra["recommendations"],
    }
