import React, { useState } from "react";
import Layout from "./Layout";

function CommunityForum() {
  const [forums, setForums] = useState([
    {
      name: "Sustainable Living Discussions",
      id: 1,
      createdAt: "Dec 12, 2023 - 09:00 WIB",
      createdBy: "John Doe",
    },
    {
      name: "Environmental Awareness Campaigns",
      id: 2,
      createdAt: "Dec 13, 2023 - 10:00 WIB",
      createdBy: "Jane Smith",
    },
  ]);
  const [showPopup, setShowPopup] = useState(false);
  const [newForumName, setNewForumName] = useState("");
  const [selectedForumId, setSelectedForumId] = useState(1);
  const [comments, setComments] = useState({
    1: [
      {
        id: 1,
        user: "Juhi Deore",
        messages: ["How can we promote sustainable living in our community?"],
        profileImage: "https://example.com/profile1.jpg",
      },
    ],
    2: [],
  });
  const [newMessage, setNewMessage] = useState("");

  const handleCreateClick = () => {
    setShowPopup(true);
  };

  const handleDoneClick = () => {
    if (newForumName.trim()) {
      const newId = forums.length + 1;
      setForums([
        ...forums,
        {
          name: newForumName,
          id: newId,
          createdAt: new Date().toLocaleString(),
          createdBy: "Current User",
        },
      ]);
      setComments({ ...comments, [newId]: [] });
      setNewForumName("");
    }
    setShowPopup(false);
  };

  const handleCancelClick = () => {
    setShowPopup(false);
    setNewForumName("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleDoneClick();
    }
  };

  const handleForumClick = (id) => {
    setSelectedForumId(id);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const currentComments = comments[selectedForumId];
      const newComment = {
        id: currentComments.length + 1,
        user: "Current User",
        messages: [newMessage],
        profileImage: "https://example.com/profile.jpg",
      };
      setComments({
        ...comments,
        [selectedForumId]: [...currentComments, newComment],
      });
      setNewMessage("");
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const selectedForum = forums.find((f) => f.id === selectedForumId);

  return (
    <Layout>
      <div className="flex h-[90vh] w-full bg-green-50 p-4">
        {/* Sidebar */}
        <aside className="w-64 h-full bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-bold text-[#7C4775]">Forum Categories</h2>
          <div className="mt-4 space-y-2">
            {forums.map((forum) => (
              <div
                key={forum.id}
                onClick={() => handleForumClick(forum.id)}
                className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#A27A9C] ${
                  selectedForumId === forum.id
                    ? "bg-[#f1caeb] text-white"
                    : "bg-white"
                }`}
              >
                <h3 className="font-semibold text-[#7C4775]">{forum.name}</h3>
                <p className="text-sm text-gray-600">
                  Created by: {forum.createdBy}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={handleCreateClick}
            className="mt-4 w-full bg-[#7C4775] text-white py-2 rounded-lg hover:bg-[#A27A9C] transition"
          >
            Create New Forum
          </button>
        </aside>

        {/* Main Content */}
        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full bg-white shadow-md rounded-lg p-4 ml-4">
          {/* Forum Header */}
          <header className="mb-4">
            <h1 className="text-2xl text-[#7C4775] font-bold">
              {selectedForum.name}
            </h1>
            <p className="text-gray-600">
              Created by: {selectedForum.createdBy}
            </p>
            <div className="text-sm text-gray-500">
              <span>{selectedForum.createdAt}</span>
            </div>
          </header>

          {/* Comments Section */}
          <div className="flex-1 overflow-y-auto mb-4">
            {comments[selectedForumId].map((comment) => (
              <div
                key={comment.id}
                className="p-2 pb-4 border-b border-gray-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnlkoa53zZB468uxslQjXZtrnqUZpa04vaVg&s`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-semibold text-[#7C4775]">
                      {comment.user}
                    </span>
                    {comment.messages.map((message, index) => (
                      <p key={index} className="mt-1 text-black">
                        {message}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Input */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleInputKeyDown}
              className="flex-1 p-2 border rounded text-black"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-[#7C4775] text-white rounded hover:bg-[#A27A9C] transition"
            >
              Send
            </button>
          </div>
        </main>

        {/* Popup for New Forum */}
        {showPopup && (
          <div className="fixed inset-0 bg-purple-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-lavender-100 p-6 rounded shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4 text-purple-700">
                Create New Forum
              </h2>
              <input
                type="text"
                placeholder="Forum Name"
                value={newForumName}
                onChange={(e) => setNewForumName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full p-2 border rounded mb-4 text-black"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCancelClick}
                  className="px-4 py-2 bg-purple-300 rounded hover:bg-purple-400 text-black"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDoneClick}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default CommunityForum;
