import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const PomodoroTimer = ({ duration }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    if (timeLeft === 0) setIsRunning(false);
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center w-full p-6 rounded-lg bg-[#ffeae5e7] shadow-sm border border-[#EEB6B3]"
    >
      <h2 className="text-2xl font-medium text-[#20397F]">Focus Timer</h2>
      <p className="text-6xl font-bold my-6 text-[#20397F]">
        {formatTime(timeLeft)}
      </p>
      <button
        className="px-6 py-2 text-base font-medium text-white transition-all duration-200 bg-[#CD6D8B] rounded-md hover:bg-opacity-90 active:scale-95"
        onClick={() => setIsRunning(!isRunning)}
      >
        {isRunning ? "Pause" : "Start"}
      </button>
    </motion.div>
  );
};

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
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const captureAndSendFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
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
    <div className="flex flex-col items-center p-6 w-full bg-[#ffeae5e7] shadow-sm rounded-lg border border-[#EEB6B3]">
      <h2 className="text-xl font-medium mb-4 text-[#20397F]">
        Mood Detection
      </h2>
      <video
        ref={videoRef}
        autoPlay
        className="border rounded-md shadow-sm w-full max-w-md aspect-video object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />
      <div className="mt-4 py-2 px-4 rounded-md bg-[#EEB6B3] inline-block">
        <p className="font-medium text-[#20397F]">
          Current mood: <span className="font-bold">{emotion}</span>
        </p>
      </div>
    </div>
  );
};

const SpotifyPlayer = () => {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [error, setError] = useState("");

  const fetchSongs = async () => {
    setError("");
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/recommend?emotion=Happy"
      );
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setTracks(data);
        setCurrentTrackIndex(0);
      } else {
        setError("No songs found!");
      }
    } catch (error) {
      console.error("Error fetching songs:", error);
      setError("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  return (
    <div className="p-6 text-center w-full bg-[#ffeae5e7] shadow-sm rounded-lg border border-[#EEB6B3]">
      <h2 className="text-xl font-medium text-[#20397F] mb-4">
        Music Recommendations
      </h2>
      <button
        className="bg-[#CD6D8B] text-white p-2 rounded-md w-full shadow-sm hover:bg-opacity-90 transition-all"
        onClick={fetchSongs}
      >
        Refresh Recommendations
      </button>

      {error && <p className="text-[#20397F] mt-2">{error}</p>}

      <div className="mt-4 max-h-48 overflow-auto border border-[#EEB6B3] p-2 rounded-md bg-[#ffeae5e7] bg-opacity-70">
        {tracks.map((track, index) => (
          <div
            key={index}
            className={`cursor-pointer p-2 mb-1 rounded-md transition-colors ${
              index === currentTrackIndex
                ? "bg-[#CD6D8B] font-medium text-white"
                : "bg-[#EEB6B3] bg-opacity-50 text-[#20397F] hover:bg-opacity-70"
            }`}
            onClick={() => setCurrentTrackIndex(index)}
          >
            {track.recommended_song}
          </div>
        ))}
      </div>

      {tracks.length > 0 && (
        <>
          <iframe
            src={`https://open.spotify.com/embed/track/${tracks[currentTrackIndex].track_id}`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="encrypted-media"
            className="mt-4 rounded-md"
          ></iframe>
          <div className="flex justify-between mt-3">
            <button
              className="bg-[#20397F] text-white px-4 py-2 rounded-md shadow-sm hover:bg-opacity-90 transition-all"
              onClick={handlePrev}
            >
              Previous
            </button>
            <button
              className="bg-[#20397F] text-white px-4 py-2 rounded-md shadow-sm hover:bg-opacity-90 transition-all"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#fffaf8] to-white text-[#20397F]">
      <Navbar />
      <div className="container mx-auto px-4 py-6 flex-grow mt-[5rem]">
        <div className="max-w-4xl mx-auto mb-6">
          <PomodoroTimer duration={25} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <EmotionDetector />
          <SpotifyPlayer />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
