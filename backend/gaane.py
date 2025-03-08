import pandas as pd
# import joblib
from flask import Flask, request, jsonify
import requests
from flask_cors import CORS  # Enable CORS

app = Flask(__name__)
CORS(app) 

# Load trained model and encoder
# target_encoder = joblib.load("target_encoder.pkl")

# Load dataset
data = pd.read_csv("songs.csv").dropna()

# Spotify API Credentials
SPOTIFY_CLIENT_ID = "7735f30fc4e64582bf33099b52b0ffd9"
SPOTIFY_CLIENT_SECRET = "8c2a99e059d8415592aeb4ec1fd11d9a"

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

    if data.get("tracks") and data["tracks"]["items"]:
        track_id = data["tracks"]["items"][0]["id"]
        return track_id
    return None

@app.route("/recommend", methods=["GET"])
def recommend_and_search():
    emotion = request.args.get("emotion")
    
    if not emotion:
        return jsonify({"error": "Missing emotion parameter"}), 400

    # Get recommended songs
    recommended_songs = recommend_songs(emotion)

    if not recommended_songs:
        return jsonify({"error": f"No songs found for emotion: {emotion}"}), 404

    # Search the first recommended song on Spotify
    song_name = recommended_songs[0]  # Take the first song
    track_id = search_song_on_spotify(song_name)

    if not track_id:
        return jsonify({"error": f"Spotify track not found for {song_name}"}), 404

    # Return the recommended song and Spotify play URL
    return jsonify({
        "recommended_song": song_name,
        "spotify_play_url": f"https://open.spotify.com/track/{track_id}"
    })

if __name__ == "__main__":
    app.run(debug=True)
