from flask import Flask, request, jsonify
from flask_cors import CORS
from model import load_model, predict_from_base64
import os

app = Flask(__name__)
CORS(app)

print("Loading food classification model...")
model_loaded = load_model()
if model_loaded:
    print("Model loaded successfully!")
else:
    print("Running with untrained model (demo mode)")

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model_loaded": model_loaded})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        if not data or "image" not in data:
            return jsonify({"error": "No image data provided"}), 400
        
        image_base64 = data["image"]
        result = predict_from_base64(image_base64)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("ML_PORT", 5001))
    print(f"Starting ML inference server on port {port}")
    app.run(host="0.0.0.0", port=port, debug=False)
