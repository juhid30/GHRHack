import pandas as pd
import joblib

# Load trained model and encoder
target_encoder = joblib.load("target_encoder.pkl")

# Load dataset
data = pd.read_csv("songs.csv")
data = data.dropna()

# Function to recommend songs based on emotion
def recommend_songs(emotion, top_n=5):
    # Ensure the emotion is in the dataset (case-insensitive)
    emotion = emotion.capitalize()  # Assuming emotions are stored as "Happy", "Sad", etc.
    
    # Filter songs directly using text emotion (No need to encode)
    recommended_songs = data[data["Initial Emotion"] == emotion]["Song Title"]

    # Return top N song titles as a list
    return recommended_songs.sample(frac=1).head(top_n).tolist() if not recommended_songs.empty else [f"No songs found for emotion: {emotion}"]
    
# Example usage
emotion_input = "happy"  # User input (case-insensitive)
print(recommend_songs(emotion_input))
