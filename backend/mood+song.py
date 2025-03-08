import cv2
import numpy as np
import time
import pandas as pd
import joblib
import requests
from flask import Flask, request, jsonify
from deepface import DeepFace
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Load dataset
data = pd.read_csv("songs.csv").dropna()

# Spotify API Credentials
SPOTIFY_CLIENT_ID = "7735f30fc4e64582bf33099b52b0ffd9"
SPOTIFY_CLIENT_SECRET = "8c2a99e059d8415592aeb4ec1fd11d9a"

# Emotion tracking variables (Session-based)
emotion_start_time = None
previous_emotion = None
emotion_durations = {}  # Stores time spent in each emotion
session_start_time = time.time()

### 🔹 Function: Get Spotify Access Token
def get_spotify_access_token():
    url = "https://accounts.spotify.com/api/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {"grant_type": "client_credentials"}

    response = requests.post(url, headers=headers, data=data, auth=(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET))
    return response.json().get("access_token")

### 🔹 Function: Recommend Songs for the Current Session
def recommend_songs_for_session(emotion, top_n=5):
    emotion = emotion.capitalize()
    recommended_songs = data[data["Initial Emotion"] == emotion]["Song Title"]

    return recommended_songs.sample(frac=1).head(top_n).tolist() if not recommended_songs.empty else []

### 🔹 Function: Get Spotify Track ID
def search_song_on_spotify(song_name):
    token = get_spotify_access_token()
    search_url = f"https://api.spotify.com/v1/search?q={song_name}&type=track&limit=1"
    headers = {"Authorization": f"Bearer {token}"}

    response = requests.get(search_url, headers=headers)
    data = response.json()

    if data.get("tracks") and data["tracks"]["items"]:
        return data["tracks"]["items"][0]["id"]
    return None

### 🔹 Route: Detect Emotion & Track Session Stats
@app.route('/detect_emotion', methods=['POST'])
def detect_emotion():
    global emotion_start_time, previous_emotion, emotion_durations

    try:
        file = request.files['image']
        np_img = np.frombuffer(file.read(), np.uint8)
        frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        # Analyze emotion
        predictions = DeepFace.analyze(frame, actions=["emotion"], enforce_detection=False)
        dominant_emotion = predictions[0]["dominant_emotion"] if predictions else "No Face Detected"

        print(f"Detected Emotion: {dominant_emotion}")
        # Track consistent emotions for 2 seconds
        current_time = time.time()
        if dominant_emotion == previous_emotion:
            if emotion_start_time and (current_time - emotion_start_time >= 2):
                emotion_durations[dominant_emotion] = emotion_durations.get(dominant_emotion, 0) + 2
                emotion_start_time = None  # Reset timer
        else:
            emotion_start_time = current_time  # Start tracking new emotion
            previous_emotion = dominant_emotion  # Update previous emotion
        return jsonify({"emotion": dominant_emotion, "session_stats": emotion_durations})

    except Exception as e:
        return jsonify({"error": str(e)})

### 🔹 Route: Get Current Session Stats & Recommend a Song
@app.route('/session_stats', methods=['GET'])
def get_session_stats():
    global session_start_time, emotion_durations

    total_session_time = time.time() - session_start_time  # Total session duration

    # Compute percentage time spent in each emotion
    emotion_percentages = {
        emotion: round((duration / total_session_time) * 100, 2)
        for emotion, duration in emotion_durations.items()
    }

    # Get the most frequent emotion
    if emotion_durations:
        most_common_emotion = max(emotion_durations, key=emotion_durations.get)
        recommended_songs = recommend_songs_for_session(most_common_emotion)

        if recommended_songs:
            song_name = recommended_songs[0]  # Pick the first recommended song
            track_id = search_song_on_spotify(song_name)

            return jsonify({
                "session_stats": emotion_percentages,
                "most_common_emotion": most_common_emotion,
                "recommended_song": song_name,
                "spotify_play_url": f"https://open.spotify.com/track/{track_id}" if track_id else "Not found"
            })

    return jsonify({"session_stats": emotion_percentages, "message": "No dominant emotion detected"})

### 🔹 Route: Reset Session Data (Optional)
@app.route('/reset_session', methods=['POST'])
def reset_session():
    global emotion_durations, session_start_time
    emotion_durations = {}  # Reset emotion tracking
    session_start_time = time.time()  # Restart session timer
    return jsonify({"message": "Session reset successful"})

if __name__ == '__main__':
    app.run(debug=True)
