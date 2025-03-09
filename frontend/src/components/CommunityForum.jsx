import { useState, useEffect } from "react";
import {
  HiPlus,
  HiPaperAirplane,
  HiChat,
  HiUserGroup,
  HiTranslate,
} from "react-icons/hi";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import Navbar from "./Navbar";

const API_KEY = "AIzaSyBcox681xg8Y7ty5v8uUtOT7nV_tE-g8K8"; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(API_KEY);

// Translations object for all the static text
const translations = {
  english: {
    communities: "Communities",
    joinOrCreate: "Join or create a community",
    newCommunity: "New Community",
    enterCommunityName: "Enter community name...",
    chatWithAI: "Chat with AI assistant",
    communityChatRoom: "Community chat room",
    messagePlaceholder: "Message", // Will be concatenated with community name
    aiChat: "AI Chat",
    generalDiscussion: "General Discussion",
    techTalk: "Tech Talk",
    errorProcessingMessage:
      "I'm sorry, I'm unable to process your message at the moment.",
    // Alert translations
    weCareAboutYou: "WE CARE ABOUT YOU",
    youreNotAlone:
      "You're not alone. We're connecting you with support resources.",
    redirectingIn: "Redirecting in 5 seconds...",
  },
  hindi: {
    communities: "समुदाय",
    joinOrCreate: "समुदाय में शामिल हों या बनाएं",
    newCommunity: "नया समुदाय",
    enterCommunityName: "समुदाय का नाम दर्ज करें...",
    chatWithAI: "AI सहायक से चैट करें",
    communityChatRoom: "समुदाय चैट रूम",
    messagePlaceholder: "संदेश", // Will be concatenated with community name
    aiChat: "AI चैट",
    generalDiscussion: "सामान्य चर्चा",
    techTalk: "तकनीकी बातचीत",
    errorProcessingMessage:
      "मुझे क्षमा करें, मैं इस समय आपके संदेश को संसाधित करने में असमर्थ हूं।",
    // Alert translations
    weCareAboutYou: "हम आपकी परवाह करते हैं",
    youreNotAlone:
      "आप अकेले नहीं हैं। हम आपको सहायता संसाधनों से जोड़ रहे हैं।",
    redirectingIn: "5 सेकंड में पुनर्निर्देशित किया जा रहा है...",
  },
  marathi: {
    communities: "समुदाय",
    joinOrCreate: "समुदायात सामील व्हा किंवा तयार करा",
    newCommunity: "नवीन समुदाय",
    enterCommunityName: "समुदायाचे नाव प्रविष्ट करा...",
    chatWithAI: "AI सहाय्यकासोबत चॅट करा",
    communityChatRoom: "समुदाय चॅट रूम",
    messagePlaceholder: "संदेश", // Will be concatenated with community name
    aiChat: "AI चॅट",
    generalDiscussion: "सामान्य चर्चा",
    techTalk: "तंत्रज्ञान चर्चा",
    errorProcessingMessage:
      "क्षमस्व, मी सध्या तुमचा संदेश प्रक्रिया करण्यास असमर्थ आहे.",
    // Alert translations
    weCareAboutYou: "आम्ही तुमची काळजी घेतो",
    youreNotAlone:
      "तुम्ही एकटे नाहीत. आम्ही तुम्हाला मदत संसाधनांशी जोडत आहोत.",
    redirectingIn: "5 सेकंदात पुनर्निर्देशित करत आहे...",
  },
};

// Email alert translations
const emailAlerts = {
  english: {
    subject: "YOUR CHILD IS VULNERABLE!",
    message: `YOUR CHILD JUST TYPED SOMETHING THAT WAS FLAGGED AS HARMFUL TO HIMSELF BY OUR SYSTEMS. PLEASE CHECK ON HIM/HER. 
NOTE: THIS MAY BE A FALSE ALARM DUE TO ACCURACY ISSUES, BUT WE DO REQUEST YOU TO PLEASE CHECK UP ON HIM/HER BECAUSE EVERY CHILD IS IMPORTANT TO US.`,
  },
  hindi: {
    subject: "आपका बच्चा संवेदनशील स्थिति में है!",
    message: `आपके बच्चे ने कुछ ऐसा टाइप किया है जिसे हमारी प्रणालियों द्वारा स्वयं को हानिकारक माना गया है। कृपया उसकी जांच करें।
नोट: यह सटीकता मुद्दों के कारण एक गलत अलार्म हो सकता है, लेकिन हम आपसे अनुरोध करते हैं कि कृपया उन पर नज़र रखें क्योंकि हर बच्चा हमारे लिए महत्वपूर्ण है।`,
  },
  marathi: {
    subject: "तुमचे मूल अतिसंवेदनशील आहे!",
    message: `तुमच्या मुलाने काहीतरी टाइप केले आहे जे आमच्या सिस्टमद्वारे स्वतःला हानिकारक म्हणून फ्लॅग केले गेले आहे. कृपया त्याची/तिची तपासणी करा.
टीप: हे अचूकतेच्या समस्यांमुळे खोटी सूचना असू शकते, परंतु आम्ही आपल्याला त्याची/तिची तपासणी करण्याची विनंती करतो कारण प्रत्येक मूल आमच्यासाठी महत्त्वाचे आहे.`,
  },
};

function CommunityChat() {
  const [language, setLanguage] = useState("english");
  const t = translations[language]; // Current translation object
  const e = emailAlerts[language]; // Current email alert translation

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
    const vulnerableKeywords = {
      english: [
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
      ],
      hindi: [
        /आत्महत्या/i,
        /खुद को मारना/i,
        /अपना जीवन समाप्त/i,
        /जीना नहीं चाहता/i,
        /मरना चाहता/i,
        /गंभीर अवसाद/i,
        /स्वयं को नुकसान/i,
        /खुद को काटना/i,
        /निराशा/i,
        /आगे नहीं बढ़ सकता/i,
        /जीने का कोई कारण नहीं/i,
        /किसी को परवाह नहीं/i,
        /मेरे बिना बेहतर/i,
        /हमेशा के लिए अलविदा/i,
        /अंतिम नोट/i,
        /सब कुछ खत्म करना/i,
      ],
      marathi: [
        /आत्महत्या/i,
        /स्वतःला मारणे/i,
        /माझे जीवन संपवणे/i,
        /जगू इच्छित नाही/i,
        /मरू इच्छितो/i,
        /गंभीर नैराश्य/i,
        /स्वतःला इजा/i,
        /स्वतःला कापणे/i,
        /निराश/i,
        /पुढे जाऊ शकत नाही/i,
        /जगण्याचे कारण नाही/i,
        /कोणालाही पर्वा नाही/i,
        /माझ्याशिवाय चांगले/i,
        /कायमचा निरोप/i,
        /अंतिम टिप्पणी/i,
        /सर्व संपवणे/i,
      ],
    };

    // Check for keywords in all languages (more comprehensive)
    return Object.values(vulnerableKeywords).some((keywordArray) =>
      keywordArray.some((regex) => regex.test(text))
    );
  };

  // Handler for alerting and redirecting
  const handleVulnerableContent = async () => {
    setShowAlert(true);

    try {
      // Send email alert in selected language
      const response = await axios.get(
        "https://python-server-1.vercel.app/send-email",
        {
          params: {
            receiver_email: "electronjash@gmail.com",
            subject: e.subject,
            message: e.message,
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
      const prompt = `You are an empathetic AI assistant. Respond to the following message in a helpful and friendly manner in ${language} language:\n"${userMessage}"`;
      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();

      // Check AI responses for mental health issues as well
      if (checkMentalHealthIssues(aiResponse)) {
        handleVulnerableContent();
      }

      return aiResponse;
    } catch (error) {
      console.error(
        "Error generating AI response:",
        error instanceof Error ? error.message : "Unknown error"
      );
      return t.errorProcessingMessage;
    }
  };

  // Initialize communities with translated names
  const initCommunities = () => [
    { id: "ai", name: t.aiChat, isAI: true },
    { id: "1", name: t.generalDiscussion, isAI: false },
    { id: "2", name: t.techTalk, isAI: false },
  ];

  const [communities, setCommunities] = useState(initCommunities());
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [newCommunityName, setNewCommunityName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Update communities when language changes
  useEffect(() => {
    const updatedCommunities = initCommunities();
    setCommunities(updatedCommunities);

    // Update selected community if it exists
    if (selectedCommunity) {
      const updatedSelected = updatedCommunities.find(
        (c) => c.id === selectedCommunity.id
      );
      if (updatedSelected) {
        setSelectedCommunity(updatedSelected);
      } else {
        setSelectedCommunity(updatedCommunities[0]);
      }
    } else {
      setSelectedCommunity(updatedCommunities[0]);
    }
  }, [language]);

  // Initialize selected community on first render
  useEffect(() => {
    if (!selectedCommunity && communities.length > 0) {
      setSelectedCommunity(communities[0]);
    }
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCommunity) return;

    // Check for vulnerable content before sending
    if (checkMentalHealthIssues(newMessage)) {
      handleVulnerableContent();
    }

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

  // Function to translate text using AI (for dynamic content)
  const translateText = async (text, targetLanguage) => {
    if (!text || targetLanguage === "english") return text;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Translate the following text to ${targetLanguage}:\n"${text}"`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Translation error:", error);
      return text; // Return original text if translation fails
    }
  };

  return (
    <>
      {/* Alert Popup */}
      {showAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white p-8 rounded-lg max-w-md mx-4 text-center shadow-xl">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              {t.weCareAboutYou}
            </h2>
            <p className="text-xl font-semibold">{t.youreNotAlone}</p>
            <p className="mt-4 text-gray-600">{t.redirectingIn}</p>
          </div>
        </div>
      )}

      {/* Navbar at the top */}
      <div className="fixed top-0 w-full z-10">
        <Navbar />
      </div>

      {/* Language Selector */}
      <div className="fixed top-16 right-4 z-10 bg-white p-2 rounded-md shadow-md border border-[#20397F]">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-2 py-1 border border-[#20397F] rounded-md focus:outline-none focus:border-[#CD6D8B]"
        >
          <option value="english">English</option>
          <option value="hindi">हिंदी (Hindi)</option>
          <option value="marathi">मराठी (Marathi)</option>
        </select>
        <HiTranslate className="inline-block ml-2 text-[#20397F]" />
      </div>

      {/* Main content starts below the navbar */}
      <div className="flex h-screen pt-16 bg-[#fffbfb]">
        {/* Sidebar */}
        <div className="w-72 border-r border-[#20397F] bg-[#fffbfb]">
          <div className="p-4 border-b border-[#20397F]">
            <h2 className="text-xl font-semibold mb-1 text-[#20397F]">
              {t.communities}
            </h2>
            <p className="text-sm text-[#20397F]">{t.joinOrCreate}</p>
          </div>

          <div className="p-4">
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-4 bg-[#CD6D8B] text-white rounded-md hover:bg-[#b55a75] transition-colors"
            >
              <HiPlus className="w-5 h-5" />
              <span>{t.newCommunity}</span>
            </button>

            {isCreating && (
              <div className="mb-4">
                <input
                  type="text"
                  value={newCommunityName}
                  onChange={(e) => setNewCommunityName(e.target.value)}
                  placeholder={t.enterCommunityName}
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
                    selectedCommunity?.id === community.id
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
        {selectedCommunity && (
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
                      ? t.chatWithAI
                      : t.communityChatRoom}
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
                    placeholder={`${t.messagePlaceholder} ${selectedCommunity.name}...`}
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
        )}
      </div>
    </>
  );
}

export default CommunityChat;
