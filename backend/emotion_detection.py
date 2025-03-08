import cv2
import numpy as np
from flask import Flask, request, jsonify
from deepface import DeepFace
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

@app.route('/detect_emotion', methods=['POST'])
def detect_emotion():
    try:
        file = request.files['image']
        np_img = np.frombuffer(file.read(), np.uint8)
        frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        # Analyze emotion
        predictions = DeepFace.analyze(frame, actions=["emotion"], enforce_detection=False)
        dominant_emotion = predictions[0]["dominant_emotion"] if predictions else "No Face Detected"

        return jsonify({"emotion": dominant_emotion})

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
