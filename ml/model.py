import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import io
import base64
import json
import sys

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class FoodCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 16, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(16, 32, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(32, 64, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2)
        )

        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64 * 16 * 16, 128),
            nn.ReLU(),
            nn.Linear(128, 3)
        )

    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x

class_names = ["pancake", "pasta", "pizza"]

nutrition_data = {
    "pancake": {"calories": 227, "protein": 6, "carbs": 28, "fats": 10},
    "pasta": {"calories": 320, "protein": 12, "carbs": 58, "fats": 4},
    "pizza": {"calories": 285, "protein": 12, "carbs": 36, "fats": 10},
}

transform = transforms.Compose([
    transforms.Resize((128, 128)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
])

model = None

def load_model(model_path="ml/food_classifier.pth"):
    global model
    model = FoodCNN().to(device)
    try:
        model.load_state_dict(torch.load(model_path, map_location=device))
        model.eval()
        return True
    except FileNotFoundError:
        print(f"Model file not found at {model_path}. Using random weights for demo.", file=sys.stderr)
        model.eval()
        return False

def predict_from_base64(image_base64):
    global model
    if model is None:
        load_model()
    
    if "," in image_base64:
        image_base64 = image_base64.split(",")[1]
    
    image_data = base64.b64decode(image_base64)
    image = Image.open(io.BytesIO(image_data)).convert("RGB")
    
    input_tensor = transform(image).unsqueeze(0).to(device)
    
    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = torch.softmax(outputs, dim=1)
        confidence, predicted_idx = torch.max(probabilities, 1)
    
    predicted_class = class_names[predicted_idx.item()]
    confidence_score = confidence.item()
    
    nutrition = nutrition_data.get(predicted_class, {"calories": 300, "protein": 15, "carbs": 30, "fats": 12})
    
    return {
        "food_name": predicted_class.title(),
        "confidence": round(confidence_score * 100, 1),
        "calories": nutrition["calories"],
        "protein": nutrition["protein"],
        "carbs": nutrition["carbs"],
        "fats": nutrition["fats"]
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        image_base64 = sys.argv[1]
        result = predict_from_base64(image_base64)
        print(json.dumps(result))
    else:
        load_model()
        print(json.dumps({"status": "Model loaded", "classes": class_names}))
