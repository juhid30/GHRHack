import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { motion } from "framer-motion";

const genAI = new GoogleGenerativeAI("AIzaSyBcox681xg8Y7ty5v8uUtOT7nV_tE-g8K8");

export default function Jobs() {
  const [user, setUser] = useState(null);
  const [jobbs, setJobs] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setJobs(JSON.parse(localStorage.getItem("jobs")));
    }
  }, []);

  const getJobs = async (res) => {
    try {
      const response = await axios.post("http://localhost:5000/get-jobs", res);
      let jobs = response.data.jobs;

      jobs = jobs.replace(/```json\n?|\n?```/g, "");

      // Ensure jobs are parsed as JSON
      const parsedJobs = JSON.parse(jobs);
      setJobs(parsedJobs);
      localStorage.setItem("jobs", JSON.stringify(parsedJobs));

      console.log("Jobs received:", parsedJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const generateRelatedFields = async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);

    const prompt = `Based on the following information, generate related job titles (only 5):
    Skills: ${user.knows}
    Aspiring Role: ${user.wantsToBe}
    I want JSON data only as output.
    `;

    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Remove Markdown JSON formatting (if present)
      const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, "");
      const response = JSON.parse(cleanedResponse);

      console.log("Generated Job Titles:", response);

      // Fetch jobs from the backend using generated job titles
      await getJobs(response);
    } catch (error) {
      console.error("Error generating job titles:", error);
    }
  };

  useEffect(() => {
    generateRelatedFields();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {user ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md"
        >
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
            Welcome, {user.name}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-300">📧 {user.email}</p>
          <p className="text-gray-600 dark:text-gray-300">
            🛠️ Skills: {user.knows}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            🎯 Aspiring Role: {user.wantsToBe}
          </p>

          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={generateRelatedFields}
          >
            Refresh Job Listings 🔄
          </button>
        </motion.div>
      ) : (
        <p className="text-center text-gray-500">Loading user data...</p>
      )}

      <h3 className="text-xl font-semibold mt-8 text-gray-800 dark:text-white">
        🎯 Job Recommendations
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {jobbs.length > 0 ? (
          jobbs.map((job, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md"
            >
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {job.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {job.description}
              </p>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">
            No jobs found matching your skills and aspiring role. 😔
          </p>
        )}
      </div>
    </div>
  );
}
