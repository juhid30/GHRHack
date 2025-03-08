from flask import Flask, request, jsonify
import requests
import os
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app) 
# Replace with your Spotify API credentials
SPOTIFY_CLIENT_ID = "7735f30fc4e64582bf33099b52b0ffd9"
SPOTIFY_CLIENT_SECRET = "8c2a99e059d8415592aeb4ec1fd11d9a"

def get_spotify_access_token():
    url = "https://accounts.spotify.com/api/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {"grant_type": "client_credentials"}
    
    response = requests.post(url, headers=headers, data=data, auth=(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET))
    return response.json().get("access_token")

@app.route("/search_song", methods=["GET"])
def search_song():
    song_name = request.args.get("song")
    if not song_name:
        return jsonify({"error": "Missing song name"}), 400

    token = get_spotify_access_token()
    search_url = f"https://api.spotify.com/v1/search?q={song_name}&type=track&limit=1"
    headers = {"Authorization": f"Bearer {token}"}
  


    response = requests.get(search_url, headers=headers)
    data = response.json()

    if data.get("tracks") and data["tracks"]["items"]:
        track_id = data["tracks"]["items"][0]["id"]
        return jsonify({"track_id": track_id})
    
    return jsonify({"error": "Song not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)
