import { useState, useEffect } from "react";
import { HiPlus, HiPaperAirplane, HiChat, HiUserGroup } from "react-icons/hi";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import Navbar from "./Navbar";

const API_KEY = "AIzaSyDOky3a0Mpbe13I6Zo4t-RZ-pt4F8NbG5I"; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(API_KEY);

function CommunityChat() {
  const generateSuggestions = async (content) => {
    if (!API_KEY || isGeneratingSuggestions || !content.trim()) return;

    try {
      setIsGeneratingSuggestions(true);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Based on this journal entry: "${content}", analyze the emotional tone and provide 3 thoughtful suggestions to help the writer express and understand their feelings better. Format the response as a JSON array of strings with each suggestion being concise and empathetic. Example format: ["Consider exploring...", "You might want to reflect on...", "Try expressing..."]`;

      const result = await model.generateContent(prompt);
      const suggestionsText = result.response.text();
      const suggestions = JSON.parse(suggestionsText);
    } catch (error) {
      console.error(
        "Error generating suggestions:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  };

  // Enhanced check for mental health issues
  const checkMentalHealthIssues = (text) => {
    const vulnerableKeywords = [
      /suicide/i,
      /kill myself/i,
      /end my life/i,
      /don'?t want to live/i,
      /want to die/i,
      /severe depression/i,
      /self[- ]?harm/i,
      /cutting myself/i,
      /hopeless/i,
      /can'?t go on/i,
      /no reason to live/i,
      /no one cares/i,
      /better off without me/i,
      /goodbye forever/i,
      /final note/i,
      /ending it all/i,
    ];

    return vulnerableKeywords.some((regex) => regex.test(text));
  };

  // Handler for alerting and redirecting
  const handleVulnerableContent = async () => {
    setShowAlert(true);

    try {
      // Send email alert
      const response = await axios.get(
        `https://python-server-1.vercel.app/send-email`,
        {
          params: {
            receiver_email: "electronjash@gmail.com",
            subject: `YOUR CHILD IS VULNERABLE!`,
            message: `YOUR CHILD JUST TYPED SOMETHING THAT WAS FLAGGED AS HARMFUL TO HIMSELF BY OUR SYSTEMS. PLEASE CHECK ON HIM/HER. 
NOTE: THIS MAY BE A FALSE ALARM DUE TO ACCURACY ISSUES, BUT WE DO REQUEST YOU TO PLEASE CHECK UP ON HIM/HER BECAUSE EVERY CHILD IS IMPORTANT TO US.`,
          },
        }
      );

      if (response.status !== 200) {
        console.error("Failed to send email alert");
      }
    } catch (error) {
      console.error("Error sending email alert:", error);
    }

    // Set timer for redirect
    setTimeout(() => {
      window.location.href = "https://telemanas.mohfw.gov.in/home";
    }, 5000);
  };

  const generateChatResponse = async (userMessage) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are an empathetic AI assistant. Respond to the following message in a helpful and friendly manner:\n"${userMessage}"`;
      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();
      return aiResponse;
    } catch (error) {
      console.error(
        "Error generating AI response:",
        error instanceof Error ? error.message : "Unknown error"
      );
      return "I'm sorry, I'm unable to process your message at the moment.";
    }
  };

  const [communities, setCommunities] = useState([
    { id: "ai", name: "AI Chat", isAI: true },
    { id: "1", name: "General Discussion", isAI: false },
    { id: "2", name: "Tech Talk", isAI: false },
  ]);
  const [selectedCommunity, setSelectedCommunity] = useState(communities[0]);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [newCommunityName, setNewCommunityName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const communityId = selectedCommunity.id;
    const userMsg = {
      text: newMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const newMessages = {
      ...messages,
      [communityId]: [...(messages[communityId] || []), userMsg],
    };
    setMessages(newMessages);
    const currentUserMessage = newMessage;
    setNewMessage("");

    if (selectedCommunity.isAI) {
      const aiText = await generateChatResponse(currentUserMessage);
      setMessages((prev) => ({
        ...prev,
        [communityId]: [
          ...(prev[communityId] || []),
          {
            text: aiText,
            sender: "ai",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ],
      }));
    }
  };

  const createCommunity = () => {
    if (!newCommunityName.trim()) return;
    const newCommunity = {
      id: Date.now().toString(),
      name: newCommunityName,
      isAI: false,
    };
    setCommunities([...communities, newCommunity]);
    setNewCommunityName("");
    setIsCreating(false);
  };

  return (
    <>
      {/* Alert Popup */}
      {showAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white p-8 rounded-lg max-w-md mx-4 text-center shadow-xl">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              WE CARE ABOUT YOU
            </h2>
            <p className="text-xl font-semibold">
              You're not alone. We're connecting you with support resources.
            </p>
            <p className="mt-4 text-gray-600">Redirecting in 5 seconds...</p>
          </div>
        </div>
      )}

      {/* Navbar at the top */}
      <div className="fixed top-0 w-full z-10">
        <Navbar />
      </div>

      {/* Main content starts below the navbar */}
      <div className="flex h-screen pt-16 bg-[#fffbfb]">
        {/* Sidebar */}
        <div className="w-72 border-r border-[#20397F] bg-[#fffbfb]">
          <div className="p-4 border-b border-[#20397F]">
            <h2 className="text-xl font-semibold mb-1 text-[#20397F]">
              Communities
            </h2>
            <p className="text-sm text-[#20397F]">Join or create a community</p>
          </div>

          <div className="p-4">
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-4 bg-[#CD6D8B] text-white rounded-md hover:bg-[#b55a75] transition-colors"
            >
              <HiPlus className="w-5 h-5" />
              <span>New Community</span>
            </button>

            {isCreating && (
              <div className="mb-4">
                <input
                  type="text"
                  value={newCommunityName}
                  onChange={(e) => setNewCommunityName(e.target.value)}
                  placeholder="Enter community name..."
                  className="w-full px-3 py-2 rounded-md border border-[#20397F] bg-white focus:outline-none focus:border-[#CD6D8B]"
                  onKeyDown={(e) => e.key === "Enter" && createCommunity()}
                />
              </div>
            )}

            <div className="space-y-0.5">
              {communities.map((community) => (
                <button
                  key={community.id}
                  onClick={() => setSelectedCommunity(community)}
                  className={`w-full text-left px-3 py-2.5 rounded-md flex items-center gap-3 transition-colors ${
                    selectedCommunity.id === community.id
                      ? "bg-[#CD6D8B] text-white"
                      : "hover:bg-[#20397F] hover:text-white text-[#20397F]"
                  }`}
                >
                  {community.isAI ? (
                    <HiChat className="w-5 h-5 shrink-0" />
                  ) : (
                    <HiUserGroup className="w-5 h-5 shrink-0" />
                  )}
                  <span className="truncate">{community.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="px-6 py-4 border-b border-[#20397F] bg-[#fffbfb]">
            <div className="flex items-center gap-3">
              {selectedCommunity.isAI ? (
                <HiChat className="w-6 h-6 text-[#20397F]" />
              ) : (
                <HiUserGroup className="w-6 h-6 text-[#20397F]" />
              )}
              <div>
                <h1 className="text-xl font-semibold text-[#20397F]">
                  {selectedCommunity.name}
                </h1>
                <p className="text-sm text-[#20397F]">
                  {selectedCommunity.isAI
                    ? "Chat with AI assistant"
                    : "Community chat room"}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-6 space-y-4 bg-[#fffbfb]">
            {(messages[selectedCommunity.id] || []).map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <div
                    className={`px-4 py-2.5 rounded-lg max-w-[420px] ${
                      message.sender === "user"
                        ? "bg-[#20397F] text-white"
                        : "bg-white border border-[#20397F]"
                    }`}
                  >
                    <span
                      className={
                        message.sender === "user"
                          ? "text-white"
                          : "text-[#20397F]"
                      }
                    >
                      {message.text}
                    </span>
                  </div>
                  <span className="text-xs text-[#20397F] px-1">
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-6 border-t border-[#20397F] bg-[#fffbfb]">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message ${selectedCommunity.name}...`}
                  className="flex-1 px-4 py-2.5 rounded-md border border-[#20397F] bg-white focus:outline-none focus:border-[#CD6D8B] text-[#20397F]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#CD6D8B] text-white rounded-md hover:bg-[#b55a75] transition-colors"
                >
                  <HiPaperAirplane className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommunityChat;
