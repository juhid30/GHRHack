import cv2
from deepface import DeepFace

# Initialize webcam
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    cap = cv2.VideoCapture(1)
if not cap.isOpened():
    raise IOError("Cannot Open Webcam")

# Load face detector
faceCascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to capture frame")
        break  # Exit if frame not captured

    # Analyze emotion with enforce_detection=False
    try:
        predictions = DeepFace.analyze(frame, actions=["emotion"], enforce_detection=False)
    except Exception as e:
        print(f"DeepFace error: {e}")
        predictions = []  # Default to empty list if error occurs

    # Convert frame to grayscale for face detection
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = faceCascade.detectMultiScale(gray, 1.1, 4)

    # Draw rectangles around detected faces
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

    # Get dominant emotion safely
    font = cv2.FONT_HERSHEY_SIMPLEX
    if isinstance(predictions, list) and len(predictions) > 0 and "dominant_emotion" in predictions[0]:
        dominant_emotion = predictions[0]["dominant_emotion"]
    else:
        dominant_emotion = "No Face Detected"

    # Display emotion on frame
    cv2.putText(frame, dominant_emotion, (50, 50), font, 1, (0, 0, 255), 2, cv2.LINE_4)

    # Show video
    cv2.imshow("Original Video", frame)

    # Press 'q' to exit the loop
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()
