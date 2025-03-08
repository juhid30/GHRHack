import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Speedometer from "react-d3-speedometer";
import about from "../assets/About.mp4";
import years from "../assets/5Years.mp4";
import strengths from "../assets/Strengths&Weaknesses.mp4";

const VideoPlayer = () => {
  const videos = [about, years, strengths];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [confidenceLevel, setConfidenceLevel] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const videoRef = useRef(null);
  const webcamRef = useRef(null);

  useEffect(() => {
    const oscillateConfidenceLevel = () => {
      const randomValue = Math.random() * 1.5 + 2.8;
      setConfidenceLevel(randomValue);
    };

    const interval = setInterval(oscillateConfidenceLevel, 5000);
    oscillateConfidenceLevel();

    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    setIsModalOpen(false);
    setIsPlaying(true);
    startWebcam();
  };

  const startWebcam = async () => {
    try {
      // Get only the video stream, no audio
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false, // Disable audio
      });

      if (webcamRef.current) {
        webcamRef.current.srcObject = videoStream;
      }

      // Now get a separate stream for audio only
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true, // Only audio
      });

      const recorder = new MediaRecorder(audioStream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data]);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const handleNext = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        await sendRecording(audioBlob);
        await saveRecordingLocally(audioBlob);
        setAudioChunks([]);
      };
    }

    setCurrentVideoIndex((prevIndex) =>
      prevIndex === videos.length - 1 ? 0 : prevIndex + 1
    );
    handleStart();
  };

  const sendRecording = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");
  };

  const saveRecordingLocally = async (audioBlob) => {
    const file = new File([audioBlob], "recording.wav", { type: "audio/wav" });
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/save-audio",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setFileUrl(response.data.fileUrl);
    } catch (error) {
      console.error("Error saving recording:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-gradient-to-r from-purple-400 to-purple-600 p-4">
      <h2 className="text-4xl font-extrabold text-white mb-8">HR Simulator</h2>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold text-center">
              Ready to start the video?
            </h2>
            <button
              className="mt-6 w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-500 transition duration-300"
              onClick={handleStart}
            >
              Start
            </button>
          </div>
        </div>
      )}

      {isPlaying && (
        <div className="flex w-full max-w-6xl p-2 rounded-lg shadow-xl space-x-4">
          <div className="flex-1">
            <video
              key={currentVideoIndex}
              src={videos[currentVideoIndex]}
              className="rounded-lg w-full h-80"
              autoPlay
            />
          </div>
          <div className="flex-1">
            <video
              ref={webcamRef}
              className="rounded-lg w-full h-80"
              autoPlay
              playsInline
            />
          </div>
        </div>
      )}

      <div className="mt-6">
        <Speedometer
          minValue={0}
          maxValue={5}
          value={confidenceLevel}
          needleColor="black"
          segments={5}
          segmentColors={["red", "orange", "yellow", "lightgreen", "green"]}
          needleTransitionDuration={400}
          needleTransition="easeElastic"
          textColor="transparent"
          height={100}
          width={220}
        />
      </div>

      <button
        className="mt-6 w-full max-w-xs px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-500 transition duration-300"
        onClick={handleNext}
      >
        Next
      </button>

      {/* Prediction and saved audio file sections can be uncommented if needed */}
    </div>
  );
};

export default VideoPlayer;
