import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./auth/login";
import Register from "./auth/register";
import RoadmapGenerator from "./components/AA/roadmapGenerator";
import Quiz from "./components/Quiz";
import CommunityForum from "./components/CommunityForum";
import Journal from "./components/Journal";
import Calendar from "./components/Calendar";
import EmotionDetector from "./components/Emotion/EmotionDetector";
import Dashboard from "./components/Dashboard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route path="/yoga" element={<YogaRedirect />} />{" "}
        {/* <Route path="/roadmap" element={<RoadmapGenerator />} /> */}
        <Route path="/emotion" element={<EmotionDetector />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/community" element={<CommunityForum />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </>
  );
}

export default App;
