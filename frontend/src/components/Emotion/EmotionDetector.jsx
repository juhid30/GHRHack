import React, { useEffect, useRef, useState } from "react";

const EmotionDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [emotion, setEmotion] = useState("Detecting...");

  useEffect(() => {
    async function startVideo() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    }

    startVideo();

    const interval = setInterval(() => {
      captureAndSendFrame();
    }, 1000); // Send frame every second

    return () => clearInterval(interval);
  }, []);

  const captureAndSendFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions equal to video
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob, "frame.jpg");

      try {
        const response = await fetch("http://127.0.0.1:5000/detect_emotion", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setEmotion(data.emotion || "No Face Detected");
      } catch (error) {
        console.error("Error sending frame:", error);
      }
    }, "image/jpeg");
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Live Emotion Detection</h1>
      <video ref={videoRef} autoPlay className="border rounded-lg shadow-lg" />
      <canvas ref={canvasRef} className="hidden" />
      <h2 className="text-xl font-semibold mt-4 text-red-500">{emotion}</h2>
    </div>
  );
};

export default EmotionDetector;
