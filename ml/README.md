# Food Classification Model - Pic N Eat

This folder contains the ML model for food classification.

## Files

- **`train_model.py`** - Training script that downloads data from GitHub and trains the model
- **`model.py`** - Inference code for making predictions
- **`inference_server.py`** - Flask server for serving predictions (optional)
- **`food_classifier.pth`** - Trained model weights (generated after training)

## Classes

The model classifies images into 3 categories:
- Pancake
- Pasta  
- Pizza

## Training the Model

To train the model, you need PyTorch installed. Run:

```bash
cd ml
python train_model.py
```

This will:
1. Clone the training data from `https://github.com/mahekparvez/v3picneat.git`
2. Train the CNN for 10 epochs
3. Save the model as `food_classifier.pth`

## Using the Model

Once trained, the model is automatically loaded by the app's `/api/predict` endpoint.

Upload the `food_classifier.pth` file to this folder and the app will use it for predictions.

## Nutrition Data

The nutrition values for each class are defined in `model.py`:

```python
nutrition_data = {
    "pancake": {"calories": 227, "protein": 6, "carbs": 28, "fats": 10},
    "pasta": {"calories": 320, "protein": 12, "carbs": 58, "fats": 4},
    "pizza": {"calories": 285, "protein": 12, "carbs": 36, "fats": 10},
}
```

Update these values as needed for accuracy.

## Model Architecture

```
FoodCNN:
├── Conv2d(3, 16) + ReLU + MaxPool
├── Conv2d(16, 32) + ReLU + MaxPool
├── Conv2d(32, 64) + ReLU + MaxPool
├── Flatten
├── Linear(64*16*16, 128) + ReLU
└── Linear(128, 3) → [pancake, pasta, pizza]
```

Input: 128x128 RGB images
Output: 3-class probabilities
