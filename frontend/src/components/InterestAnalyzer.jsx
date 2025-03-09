import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { Globe, Search, ExternalLink } from "lucide-react";
import Navbar from "./Navbar"; // Added Navbar import

function InterestAnalyzer() {
  const [urls, setUrls] = useState([]);
  const [topics, setTopics] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize Gemini (you'll need to set this)
  const genAI = new GoogleGenerativeAI(
    "AIzaSyDOky3a0Mpbe13I6Zo4t-RZ-pt4F8NbG5I"
  );

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5002/get-urls");
      // Create a new array with just the data we need
      const sanitizedUrls = response.data.map((item) => ({
        url: item.url,
        timestamp: { $date: item.timestamp.$date },
      }));
      setUrls(sanitizedUrls);
      await analyzeUrls(sanitizedUrls);
    } catch (error) {
      console.error(
        "Error fetching URLs:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  };

  const analyzeUrls = async (urlData) => {
    if (!urlData.length) return;

    const urlList = urlData.map((item) => item.url).join("\n");

    try {
      setLoading(true);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `These are the URLs which the user has interest in:\n${urlList}\n\nAnalyze the topics of these websites and give me an array of at most 15 topics in which the user has interest in. Return ONLY a JSON array of strings.`;

      const result = await model.generateContent(prompt);
      const topicsText = result.response.text();
      const parsedTopics = JSON.parse(
        topicsText.replace(/```json\n?|\n?```/g, "")
      );
      setTopics(parsedTopics);
    } catch (error) {
      console.error(
        "Error analyzing URLs:",
        error instanceof Error ? error.message : "Unknown error"
      );
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  const searchArticles = async (topic) => {
    setSelectedTopic(topic);
    try {
      const response = await axios.post("http://127.0.0.1:5000/search", {
        query: `${topic} news articles latest`,
      });
      console.log(response.data["organic_results"]);
      setArticles(response.data["organic_results"] || []);
    } catch (error) {
      console.error(
        "Error fetching articles:",
        error instanceof Error ? error.message : "Unknown error"
      );
      setArticles([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> {/* Added Navbar */}
      <div className="container mx-auto px-4 py-12 pt-20">
        {" "}
        {/* Increased top padding for sleek spacing */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Topics Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:w-1/3"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Globe className="w-6 h-6 text-blue-500" />
                Interest Topics
              </h2>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="grid gap-3">
                  {topics.map((topic, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => searchArticles(topic)}
                      className={`p-3 rounded-lg text-left transition-colors ${
                        selectedTopic === topic
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {topic}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Articles Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:w-2/3"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Search className="w-6 h-6 text-blue-500" />
                Related Articles
              </h2>

              <div className="grid gap-4">
                {articles.map((article, index) => (
                  <motion.a
                    key={index}
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {article.snippet}
                        </p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </motion.a>
                ))}

                {selectedTopic && articles.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No articles found for this topic
                  </div>
                )}

                {!selectedTopic && (
                  <div className="text-center py-8 text-gray-500">
                    Select a topic to see related articles
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default InterestAnalyzer;
