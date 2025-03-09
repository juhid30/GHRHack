import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Speedometer from "react-d3-speedometer";
import introduction from "../assets/about.mp4";
import persuasive from "../assets/Strengths&Weaknesses.mp4";
import storytelling from "../assets/5Years.mp4";
import { 
  FiPlay, 
  FiSkipForward, 
  FiVideo, 
  FiUser, 
  FiBarChart2,
  FiMic,
  FiChevronRight,
  FiCpu
} from "react-icons/fi";

const VideoPlayer = () => {
  const videos = [introduction, persuasive, storytelling];
  const videoTitles = ["Give a 1-minute introduction", "Deliver a persuasive argument", "Tell a compelling story"];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [confidenceLevel, setConfidenceLevel] = useState(0);
  const [paceLevel, setPaceLevel] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const videoRef = useRef(null);
  const webcamRef = useRef(null);

  useEffect(() => {
    const updateMetrics = () => {
      // Simulate confidence level between 2.8 and 4.3
      const randomConfidence = Math.random() * 1.5 + 2.8;
      setConfidenceLevel(randomConfidence);
      
      // Simulate speaking pace between 1.5 and 4.5
      const randomPace = Math.random() * 3 + 1.5;
      setPaceLevel(randomPace);
    };

    const interval = setInterval(updateMetrics, 5000);
    updateMetrics();

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
    const file = new File([audioBlob], "speech_recording.wav", { type: "audio/wav" });
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
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 pt-[6rem]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0e162b] mb-4">
            Public Speaking Coach
          </h1>
          <p className="text-xl text-[#0e162b] max-w-3xl mx-auto">
            Master the art of public speaking with AI-powered feedback and real-time performance analysis
          </p>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="bg-white border-2 border-[#d85981] p-8 md:p-12 rounded-[1.8rem] shadow-2xl max-w-md w-full mx-4">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 rounded-full bg-[#d85981] text-white">
                  <FiMic className="w-8 h-8" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0e162b] text-center mb-4">
                Ready to Improve Your Speaking Skills?
              </h2>
              <p className="text-center text-[#0e162b] mb-8">
                Practice different types of speeches and receive real-time feedback on your delivery, confidence, and pace
              </p>
              <button
                className="w-full px-6 py-4 bg-[#d85981] text-white font-semibold rounded-md hover:bg-[#EEB6B3] transition-all duration-300 flex items-center justify-center"
                onClick={handleStart}
              >
                Start Practicing <FiPlay className="ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Video Interface */}
        {isPlaying && (
          <div className="space-y-8">
            {/* Current Prompt Banner */}
            <div className="bg-[#fff2ef80] border-2 border-[#d85981] rounded-[1.2rem] p-6 mb-8">
              <div className="flex items-center">
                <div className="p-3 rounded-md mr-3 bg-[#d85981] text-white">
                  <FiCpu className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-[#d85981] font-medium">Current Speaking Prompt:</p>
                  <h2 className="text-2xl font-bold text-[#0e162b]">{videoTitles[currentVideoIndex]}</h2>
                </div>
              </div>
            </div>

            {/* Video Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Coach Example Video */}
              <div className="bg-[#fff2ef80] border-2 border-[#d85981] rounded-[1.8rem] overflow-hidden shadow-lg">
                <div className="p-4 border-b border-[#EEB6B3] bg-white flex items-center">
                  <div className="p-2 rounded-md mr-3 bg-[#d85981] text-white">
                    <FiVideo className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0e162b]">Speech Example</h3>
                </div>
                <div className="p-4">
                  <video
                    key={currentVideoIndex}
                    ref={videoRef}
                    src={videos[currentVideoIndex]}
                    className="w-full aspect-video object-contain rounded-lg"
                    autoPlay
                  />
                </div>
              </div>

              {/* Webcam Feed */}
              <div className="bg-[#fff2ef80] border-2 border-[#d85981] rounded-[1.8rem] overflow-hidden shadow-lg">
                <div className="p-4 border-b border-[#EEB6B3] bg-white flex items-center">
                  <div className="p-2 rounded-md mr-3 bg-[#d85981] text-white">
                    <FiUser className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0e162b]">Your Performance</h3>
                </div>
                <div className="p-4">
                  <video
                    ref={webcamRef}
                    className="w-full aspect-video object-contain rounded-lg bg-[#0e162b]/5"
                    autoPlay
                    playsInline
                  />
                </div>
              </div>
            </div>

            {/* Metrics Section */}
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              {/* Performance Metrics */}
              <div className="bg-[#fff2ef80] border-2 border-[#d85981] rounded-[1.8rem] p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-md mr-3 bg-[#d85981] text-white">
                    <FiBarChart2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0e162b]">Performance Analysis</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Confidence Meter */}
                  <div className="flex flex-col items-center">
                    <p className="text-[#0e162b] font-medium mb-2">Confidence</p>
                    <Speedometer
                      minValue={0}
                      maxValue={5}
                      value={confidenceLevel}
                      needleColor="#d85981"
                      segments={5}
                      segmentColors={[
                        "#ff4b4b",
                        "#ff914d",
                        "#ffcc00",
                        "#99cc00",
                        "#52c41a",
                      ]}
                      needleTransitionDuration={400}
                      needleTransition="easeElastic"
                      textColor="#0e162b"
                      height={140}
                      width={200}
                    />
                    <p className="text-center text-[#0e162b] mt-2">
                      <span className="font-bold">{confidenceLevel.toFixed(1)}/5</span>
                    </p>
                  </div>
                  
                  {/* Pace Meter */}
                  <div className="flex flex-col items-center">
                    <p className="text-[#0e162b] font-medium mb-2">Speaking Pace</p>
                    <Speedometer
                      minValue={0}
                      maxValue={5}
                      value={paceLevel}
                      needleColor="#d85981"
                      segments={5}
                      segmentColors={[
                        "#ff4b4b", // too slow
                        "#ffcc00", // slow
                        "#52c41a", // perfect
                        "#ffcc00", // fast
                        "#ff4b4b", // too fast
                      ]}
                      needleTransitionDuration={400}
                      needleTransition="easeElastic"
                      textColor="#0e162b"
                      height={140}
                      width={200}
                    />
                    <p className="text-center text-[#0e162b] mt-2">
                      <span className="font-bold">{paceLevel.toFixed(1)}/5</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Tips and Next Button */}
              <div className="bg-[#fff2ef80] border-2 border-[#d85981] rounded-[1.8rem] p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#0e162b] mb-4">Public Speaking Tips</h3>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <FiChevronRight className="w-5 h-5 text-[#d85981] mr-2 flex-shrink-0 mt-1" />
                      <p className="text-[#0e162b]">Use purposeful hand gestures to emphasize key points</p>
                    </li>
                    <li className="flex items-start">
                      <FiChevronRight className="w-5 h-5 text-[#d85981] mr-2 flex-shrink-0 mt-1" />
                      <p className="text-[#0e162b]">Vary your tone and pace to maintain audience interest</p>
                    </li>
                    <li className="flex items-start">
                      <FiChevronRight className="w-5 h-5 text-[#d85981] mr-2 flex-shrink-0 mt-1" />
                      <p className="text-[#0e162b]">Incorporate strategic pauses for emphasis</p>
                    </li>
                    <li className="flex items-start">
                      <FiChevronRight className="w-5 h-5 text-[#d85981] mr-2 flex-shrink-0 mt-1" />
                      <p className="text-[#0e162b]">Make eye contact with different sections of your audience</p>
                    </li>
                  </ul>
                </div>
                <button
                  className="inline-flex items-center justify-center px-6 py-4 bg-[#d85981] text-white font-medium rounded-md hover:bg-[#EEB6B3] transition-colors self-start w-full"
                  onClick={handleNext}
                >
                  Next Speaking Prompt <FiSkipForward className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Information Section - Only visible when modal is open */}
        {isModalOpen && (
          <div className="mt-16">
            <div className="bg-[#fff2ef80] border-2 border-[#d85981] rounded-[1.8rem] p-8 mb-16">
              <h2 className="text-3xl font-bold text-[#0e162b] mb-8 text-center">How It Works</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#d85981] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#0e162b] mb-2">Practice Speaking</h3>
                  <p className="text-[#0e162b]">Respond to a variety of speaking prompts designed to build different skills.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#d85981] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#0e162b] mb-2">Get Real-time Analysis</h3>
                  <p className="text-[#0e162b]">Our AI analyzes your confidence, pace, and delivery patterns.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#d85981] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#0e162b] mb-2">Become a Better Speaker</h3>
                  <p className="text-[#0e162b]">Practice regularly to build confidence and master public speaking skills.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;