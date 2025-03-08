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
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (webcamRef.current) {
        webcamRef.current.srcObject = videoStream;
      }

      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
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
        await saveRecordingLocally(audioBlob);
        setAudioChunks([]);
      };
    }

    setCurrentVideoIndex((prevIndex) =>
      prevIndex === videos.length - 1 ? 0 : prevIndex + 1
    );
    handleStart();
  };

  const saveRecordingLocally = async (audioBlob) => {
    const file = new File([audioBlob], "recording.wav", { type: "audio/wav" });
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/save-audio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error("Error saving recording:", error);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Header */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6">
        HR Simulator 🚀
      </h2>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-purple-500/30">
              <h2 className="text-2xl md:text-3xl font-bold text-purple text-center mb-6">
                Ready to start your interview?
              </h2>
              <button
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-500 border-4 font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
                onClick={handleStart}
              >
                Start Interview 🎤
              </button>
            </div>
          </div>
        )}

        {/* Video Interface */}
        {isPlaying && (
          <div className="space-y-2">
            {/* Video Grid */}
            <div className="grid md:grid-cols-2  gap-6">
              {/* AI Interview Video */}
              <div className="rounded-xl overflow-hidden shadow-2xl ">
                <div className="p-2 bg-mint/30">
                  <h3 className="text-lg  font-semibold text-purple-400">
                    AI Interviewer
                  </h3>
                </div>
                <video
                  key={currentVideoIndex}
                  src={videos[currentVideoIndex]}
                  className="w-full aspect-video object-contain"
                  autoPlay
                />
              </div>

              {/* Webcam Feed */}
              <div className=" rounded-xl overflow-hidden shadow-2xl border">
                <div className="p-2 border-b bg-mint/30">
                  <h3 className="text-lg font-semibold">Your Camera</h3>
                </div>
                <video
                  ref={webcamRef}
                  className="w-full aspect-video object-contain bg"
                  autoPlay
                  playsInline
                />
              </div>
            </div>
            <div className="w-[100%] flex items-center justify-center">
              {/* Controls Section */}
              <div className="grid md:grid-cols-2 w-[50%] gap-6 justify-center items-center">
                {/* Speedometer */}
                <div className="bg-mint/20 rounded-xl p-6 shadow-2xl border border-cyan-500/30">
                  <Speedometer
                    minValue={0}
                    maxValue={5}
                    value={confidenceLevel}
                    needleColor="cyan"
                    segments={5}
                    segmentColors={[
                      "#ff4b4b",
                      "#ff914d",
                      "#ffcc00",
                      "#52c41a",
                      "#00ff00",
                    ]}
                    needleTransitionDuration={400}
                    needleTransition="easeElastic"
                    textColor="white"
                    height={140}
                    width={260}
                  />
                  <p className="text-center text-cyan-400 text-sm mt-4 font-medium">
                    Confidence Level 📊
                  </p>
                </div>

                {/* Next Button */}
                <button
                  className="h-16 px-8 font-semibold rounded-xl hover:scale-105 bg-mint/10 transition-all duration-300 shadow-lg"
                  onClick={handleNext}
                >
                  Next Question 🎬
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
