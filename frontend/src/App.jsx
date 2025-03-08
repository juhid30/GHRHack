import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./auth/login";
import Register from "./auth/register";
import RoadmapGenerator from "./components/AA/roadmapGenerator";
import Quiz from "./components/Quiz";
import CommunityForum from "./components/CommunityForum";
import Journal from "./components/Journal";
import Calendar from "./components/Calendar";
import Dashboard from "./components/Dashboard";
import CodingPlatform from "./components/CodingPlatform";
import VideoPlayer from "./components/VideoPlayer";
import ResumeViewer from "./components/ResumeViewer";
import Jobs from "./components/jobs";
// import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route index element={<Home />} /> */}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/yoga" element={<YogaRedirect />} />{" "} */}
        <Route path="/public-speaking" element={<VideoPlayer />} />
        {/* <Route path="/emotion" element={<EmotionDetector />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume" element={<ResumeViewer />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/community" element={<CommunityForum />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/coding" element={<CodingPlatform />} />
        <Route path="/roadmap" element={<RoadmapGenerator />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </>
  );
}

export default App;
