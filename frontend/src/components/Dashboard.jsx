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
    }, 1000);

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
  const [songName, setSongName] = useState("");
  const [trackId, setTrackId] = useState(null);
  const [error, setError] = useState("");

  const fetchSong = async () => {
    setError("");
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/search_song?song=${encodeURIComponent(songName)}`
      );
      const data = await response.json();
      if (data.track_id) {
        setTrackId(data.track_id);
      } else {
        setError("Song not found!");
      }
    } catch (error) {
      console.error("Error fetching song:", error);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="p-4 text-center w-1/3">
      <h2 className="text-xl font-bold">Spotify Player</h2>
      <input
        type="text"
        className="border p-2 m-2 rounded w-full"
        placeholder="Enter song name"
        value={songName}
        onChange={(e) => setSongName(e.target.value)}
      />
      <button
        className="bg-green-500 text-white p-2 rounded w-full"
        onClick={fetchSong}
      >
        Play Song
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {trackId && (
        <iframe
          src={`https://open.spotify.com/embed/track/${trackId}`}
          width="100%"
          height="80"
          frameBorder="0"
          allow="encrypted-media"
          className="mt-4"
        ></iframe>
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
