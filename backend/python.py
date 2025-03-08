import os
import cv2
import numpy as np
import pandas as pd
import requests
from flask import Flask, request, jsonify
from deepface import DeepFace
from flask_cors import CORS  # Enable CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})  # Allow your React frontend
CORS(app)

# Load dataset for song recommendations
data = pd.read_csv("songs.csv").dropna()

# Spotify API Credentials
SPOTIFY_CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
SPOTIFY_CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')

# Function to get a Spotify access token
def get_spotify_access_token():
    url = "https://accounts.spotify.com/api/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {"grant_type": "client_credentials"}
    
    response = requests.post(url, headers=headers, data=data, auth=(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET))
    return response.json().get("access_token")

# Function to recommend songs based on emotion
def recommend_songs(emotion, top_n=5):
    emotion = emotion.capitalize()  # Ensure case consistency
    
    # Filter songs matching the emotion
    recommended_songs = data[data["Initial Emotion"] == emotion]["Song Title"]
    
    # Shuffle and return top N
    return recommended_songs.sample(frac=1).head(top_n).tolist() if not recommended_songs.empty else []

# Function to get Spotify Track ID
def search_song_on_spotify(song_name):
    token = get_spotify_access_token()
    search_url = f"https://api.spotify.com/v1/search?q={song_name}&type=track&limit=1"
    headers = {"Authorization": f"Bearer {token}"}

    response = requests.get(search_url, headers=headers)
    data = response.json()
    print(data["tracks"])
    if data.get("tracks") and data["tracks"]["items"]:
        track_id = data["tracks"]["items"][0]["id"]
        return track_id
    return None

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

@app.route("/recommend", methods=["GET"])
def recommend_and_search():
    emotion = request.args.get("emotion")
    print(emotion)
    if not emotion:
        return jsonify({"error": "Missing emotion parameter"}), 400

    # Get recommended songs
    recommended_songs = recommend_songs(emotion)
    print(recommended_songs)
    if not recommended_songs:
        return jsonify({"error": f"No songs found for emotion: {emotion}"}), 404
    
    # recommend_songs_with_url = []
    # Search the first recommended song on Spotify
    recommend_songs_with_id = []
    for song in recommended_songs:
        song_name = song  # Take the first song
        track_id = search_song_on_spotify(song_name)
        
        print(song_name, track_id)
    
        if not track_id:
            continue  # Skip this song if track ID is not found

        recommend_songs_with_id.append({
            "recommended_song": song,
            "track_id": track_id
        })

    if not recommend_songs_with_id:
        return jsonify({"error": "No valid Spotify tracks found."}), 404

    return jsonify(recommend_songs_with_id)

if __name__ == "__main__":
    app.run(debug=True)