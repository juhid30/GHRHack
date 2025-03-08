import React, { useEffect, useRef, useState } from "react";

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
    <div className="text-center p-4 border-b w-full">
      <h2 className="text-xl font-bold">Pomodoro Timer</h2>
      <p className="text-2xl my-2">{formatTime(timeLeft)}</p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setIsRunning(!isRunning)}
      >
        {isRunning ? "Pause" : "Start"}
      </button>
    </div>
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
    <div className="flex flex-col items-center p-4 w-full">
      <video ref={videoRef} autoPlay className="border rounded-lg shadow-lg" />
      <canvas ref={canvasRef} className="hidden" />
      <h2 className="text-xl font-semibold mt-4 text-red-500">{emotion}</h2>
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
        setTracks(data); // Store all songs
        setCurrentTrackIndex(0); // Start with the first track
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
    <div className="p-4 text-center w-1/3">
      <h2 className="text-xl font-bold">Spotify Player</h2>
      <button
        className="bg-green-500 text-white p-2 rounded w-full"
        onClick={fetchSongs}
      >
        Get All Songs
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <ul className="mt-4 max-h-40 overflow-auto border p-2 rounded">
        {tracks.map((track, index) => (
          <li
            key={index}
            className={`cursor-pointer p-2 border-b ${
              index === currentTrackIndex ? "bg-green-200 font-bold" : ""
            }`}
            onClick={() => setCurrentTrackIndex(index)}
          >
            {track.recommended_song}
          </li>
        ))}
      </ul>

      {tracks.length > 0 && (
        <>
          <iframe
            src={`https://open.spotify.com/embed/track/${tracks[currentTrackIndex].track_id}`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="encrypted-media"
            className="mt-4"
          ></iframe>
          <div className="flex justify-between mt-2">
            <button
              className="bg-gray-500 text-white p-2 rounded"
              onClick={handlePrev}
            >
              Previous
            </button>
            <button
              className="bg-gray-500 text-white p-2 rounded"
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
    <div className="flex flex-col items-center h-screen w-full">
      <PomodoroTimer duration={25} />
      <div className="flex flex-grow w-full p-4">
        <EmotionDetector />
        <SpotifyPlayer />
      </div>
    </div>
  );
};

export default Dashboard;
