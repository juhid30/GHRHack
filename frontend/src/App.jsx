import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./auth/login";
import Register from "./auth/register";
import RoadmapGenerator from "./AA/roadmapGenerator";
import EmotionDetector from "./components/Emotion/EmotionDetector";
import SpotifyPlayer from "./components/SpotifyPlayer";
import Dashboard from "./components/Dashboard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/roadmap" element={<RoadmapGenerator />} />
        <Route path="/emotion" element={<EmotionDetector />} />
        <Route path="/song" element={<SpotifyPlayer />} />
      </Routes>
    </>
  );
}

export default App;
