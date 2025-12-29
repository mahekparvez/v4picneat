# Food Classification Model Integration

This folder contains the ML model integration code for the Pic N Eat app.

## Current Status

The app currently uses a **mock prediction** endpoint that returns random food predictions. 

## To Integrate Your PyTorch Model

### Step 1: Upload Your Model
Place your trained model file (`food_classifier.pth`) in this `ml/` folder.

### Step 2: Model Architecture
Your model should match this architecture (from your training code):

```python
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
            nn.Linear(128, 3)  # pizza, pasta, pancake
        )
```

### Step 3: Update Class Names
Edit `ml/model.py` and update the `class_names` list to match your model's classes:

```python
class_names = ["pancake", "pasta", "pizza"]  # Update these
```

### Step 4: Add Nutrition Data
Update the `nutrition_data` dictionary in `ml/model.py` with real nutrition values:

```python
nutrition_data = {
    "pancake": {"calories": 227, "protein": 6, "carbs": 28, "fats": 10},
    "pasta": {"calories": 320, "protein": 12, "carbs": 58, "fats": 4},
    "pizza": {"calories": 285, "protein": 12, "carbs": 36, "fats": 10},
}
```

### Step 5: Run the ML Server
Once PyTorch is properly installed, you can run:

```bash
cd ml
python inference_server.py
```

Then update `server/routes.ts` to forward requests to the Python server instead of using mock data.

## Alternative: Use OpenAI Vision API

For more accurate and robust food recognition, consider using OpenAI's Vision API:

1. Add your OpenAI API key
2. Update the `/api/predict` endpoint to call the Vision API
3. The API can identify virtually any food with detailed nutrition estimates
