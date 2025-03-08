import { useState } from 'react'
import { HiPlus, HiPaperAirplane, HiChat, HiUserGroup } from 'react-icons/hi'
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "AIzaSyBcox681xg8Y7ty5v8uUtOT7nV_tE-g8K8"; // Replace with your actual API key
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
      const suggestions = JSON.parse(suggestionsText.replace(/```json\n?|\n?```/g, ''));
    } catch (error) {
      console.error(
        'Error generating suggestions:',
        error instanceof Error ? error.message : 'Unknown error'
      );
    } 
  };

  const checkMentalHealthIssues = (text) => {
    const keywords = [/suicide/i, /depression/i, /anxiety/i, /self[- ]?harm/i, /mental health/i, /hopeless/i, /kill myself/i];
    return keywords.some((regex) => regex.test(text));
  };

  const generateChatResponse = async (userMessage) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are an empathetic AI assistant. Respond to the following message in a helpful and friendly manner:\n"${userMessage}"`;
      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();
      if (checkMentalHealthIssues(aiResponse)) {
        window.alert("It appears the conversation touches on sensitive mental health topics. Please consider seeking professional help if needed.");
      }
      return aiResponse;
    } catch (error) {
      console.error('Error generating AI response:', error instanceof Error ? error.message : 'Unknown error');
      return "I'm sorry, I'm unable to process your message at the moment.";
    }
  };

  const [communities, setCommunities] = useState([
    { id: 'ai', name: 'AI Chat', isAI: true },
    { id: '1', name: 'General Discussion', isAI: false },
    { id: '2', name: 'Tech Talk', isAI: false },
  ])
  const [selectedCommunity, setSelectedCommunity] = useState(communities[0])
  const [messages, setMessages] = useState({})
  const [newMessage, setNewMessage] = useState('')
  const [newCommunityName, setNewCommunityName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const communityId = selectedCommunity.id;
    const userMsg = { 
      text: newMessage, 
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const newMessages = {
      ...messages,
      [communityId]: [
        ...(messages[communityId] || []),
        userMsg
      ]
    };
    setMessages(newMessages);
    const currentUserMessage = newMessage;
    setNewMessage('');

    if (selectedCommunity.isAI) {
      const aiText = await generateChatResponse(currentUserMessage);
      setMessages(prev => ({
        ...prev,
        [communityId]: [
          ...(prev[communityId] || []),
          { 
            text: aiText, 
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      }));
    }
  }

  const createCommunity = () => {
    if (!newCommunityName.trim()) return
    const newCommunity = {
      id: Date.now().toString(),
      name: newCommunityName,
      isAI: false
    }
    setCommunities([...communities, newCommunity])
    setNewCommunityName('')
    setIsCreating(false)
  }

  return (
    <div className="flex h-screen bg-[#f8f9fa]">
      {/* Sidebar */}
      <div className="w-72 border-r border-[#e9ecef] bg-white">
        <div className="p-4 border-b border-[#e9ecef]">
          <h2 className="text-xl font-semibold mb-1">Communities</h2>
          <p className="text-sm text-[#6c757d]">Join or create a community</p>
        </div>
        
        <div className="p-4">
          <button
            onClick={() => setIsCreating(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-4 bg-[#228be6] text-white rounded-md hover:bg-[#1c7ed6] transition-colors"
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
                className="w-full px-3 py-2 rounded-md border border-[#e9ecef] bg-white focus:outline-none focus:border-[#228be6]"
                onKeyDown={(e) => e.key === 'Enter' && createCommunity()}
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
                    ? 'bg-[#228be6] text-white'
                    : 'hover:bg-[#f1f3f5]'
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
        <div className="px-6 py-4 border-b border-[#e9ecef] bg-white">
          <div className="flex items-center gap-3">
            {selectedCommunity.isAI ? (
              <HiChat className="w-6 h-6 text-[#228be6]" />
            ) : (
              <HiUserGroup className="w-6 h-6 text-[#228be6]" />
            )}
            <div>
              <h1 className="text-xl font-semibold">{selectedCommunity.name}</h1>
              <p className="text-sm text-[#6c757d]">
                {selectedCommunity.isAI ? 'Chat with AI assistant' : 'Community chat room'}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-6 space-y-4 bg-[#f8f9fa]">
          {(messages[selectedCommunity.id] || []).map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className="flex flex-col gap-1">
                <div
                  className={`px-4 py-2.5 rounded-lg max-w-[420px] ${
                    message.sender === 'user'
                      ? 'bg-[#228be6] text-white'
                      : 'bg-white border border-[#e9ecef]'
                  }`}
                >
                  {message.text}
                </div>
                <span className="text-xs text-[#6c757d] px-1">
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-6 border-t border-[#e9ecef] bg-white">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${selectedCommunity.name}...`}
                className="flex-1 px-4 py-2.5 rounded-md border border-[#e9ecef] bg-white focus:outline-none focus:border-[#228be6]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#228be6] text-white rounded-md hover:bg-[#1c7ed6] transition-colors"
              >
                <HiPaperAirplane className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CommunityChat