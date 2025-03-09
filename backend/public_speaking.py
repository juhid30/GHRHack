from flask import Blueprint,Flask, request, jsonify
import numpy as np
import librosa
import pickle
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import soundfile as sf
# app = Flask(__name__)

# CORS(app, resources={r"/*": {"origins": "*"}})
pub_speak = Blueprint("pub_speak", __name__)

UPLOAD_FOLDER = 'public/temp'

# Ensure the folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
# UPLOAD_FOLDER = 'public/temp'
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# Ensure the folder exists
# if not os.path.exists(UPLOAD_FOLDER):
#     os.makedirs(UPLOAD_FOLDER)

def clear_temp_folder(folder_path):
    """
    This function deletes all files in the given folder.
    """
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)  # Delete the file
        except Exception as e:
            print(f"Error deleting file {file_path}: {e}")


# Route to handle saving the audio file
@pub_speak.route('/save-audio', methods=['POST'])
def save_audio():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)  # Save the file locally

        return jsonify({'fileUrl': f'/temp/{filename}'})



def noise(data):
    # Placeholder function to add noise
    noise_factor = 0.005
    noise = np.random.randn(len(data))
    data = data + noise_factor * noise
    return data

def stretch(data):
    # Placeholder function to stretch audio
    return librosa.effects.time_stretch(data, rate=1.2)  # Example stretch factor

def pitch(data, sample_rate):
    # Placeholder function to shift pitch
    return librosa.effects.pitch_shift(data, sr=sample_rate, n_steps=4)  # Example pitch shift

def extract_features(data, sample_rate):
    result = np.array([])

    # Zero-Crossing Rate
    zcr = np.mean(librosa.feature.zero_crossing_rate(y=data).T, axis=0)
    result = np.hstack((result, zcr))

    # Chroma STFT
    stft = np.abs(librosa.stft(data))
    chroma_stft = np.mean(librosa.feature.chroma_stft(S=stft, sr=sample_rate).T, axis=0)
    result = np.hstack((result, chroma_stft))

    # MFCC
    mfcc = np.mean(librosa.feature.mfcc(y=data, sr=sample_rate).T, axis=0)
    result = np.hstack((result, mfcc))

    # Root Mean Square Value
    rms = np.mean(librosa.feature.rms(y=data).T, axis=0)
    result = np.hstack((result, rms))

    # Mel Spectrogram
    mel = np.mean(librosa.feature.melspectrogram(y=data, sr=sample_rate).T, axis=0)
    result = np.hstack((result, mel))

    return result

with open('scaler.pkl', 'rb') as scaler_file:
    scaler = pickle.load(scaler_file)

# Load model
with open('emotion_classifier_model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

def get_features(path):
    data, sample_rate = librosa.load(path, duration=2.5, offset=0.6)

    # Extract features without augmentation
    features = extract_features(data, sample_rate)

    # Extract features with noise
    noise_data = noise(data)
    features_with_noise = extract_features(noise_data, sample_rate)
    features = np.vstack((features, features_with_noise))

    # Extract features with stretching and pitching
    stretched_data = stretch(data)
    pitched_data = pitch(stretched_data, sample_rate)
    features_with_stretch_pitch = extract_features(pitched_data, sample_rate)
    features = np.vstack((features, features_with_stretch_pitch))

    return features


def get_prediction(audio_data):
    # Extract features from the audio data
    new_features = extract_features(audio_data)
    # Scale features
    new_features_scaled = scaler.transform(new_features)
    new_predictions = model.predict(new_features_scaled)
    return new_predictions



@pub_speak.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    try:
        file = request.files['file']
        if file:
            # Save the file temporarily in the public/temp folder
            filename = secure_filename(file.filename)
            temp_filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(temp_filepath)  # Save the file to the temp directory

            print(f"File saved at: {temp_filepath}")  # Debugging: print the saved file path

            # Check if the file exists before loading
            if os.path.exists(temp_filepath):
                try:
                    # Try to load with soundfile
                    audio_data, sample_rate = sf.read(temp_filepath)
                    print("Audio data loaded successfully with soundfile")
                except Exception as e:
                    print(f"Error loading audio file with soundfile: {e}")
                    try:
                        # Fallback to librosa if soundfile fails
                        audio_data, sample_rate = librosa.load(temp_filepath, sr=None)
                        print("Audio data loaded successfully with librosa")
                    except Exception as e:
                        print(f"Error loading audio file with librosa: {e}")
                        return jsonify({'error': 'Failed to load audio file'}), 500

                # Get prediction
                prediction = get_prediction(audio_data)  # Pass audio_data directly
                print("Prediction:", prediction)

                # Remove the temp file after loading
                os.remove(temp_filepath)

                return jsonify({'emotion': prediction.tolist()[0]}), 200
            else:
                print(f"File does not exist: {temp_filepath}")  # Debugging
                return jsonify({'error': 'File not found'}), 404

    except Exception as e:
        print(f"Error processing audio file: {e}")
        return jsonify({'error': 'Internal server error'}), 500


# if __name__ == '__main__':
#     app.run(debug=True)

# pip install soundfile audioread
