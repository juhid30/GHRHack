import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";


const PDFQuiz = () => {
  const [documentName, setDocumentName] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [year, setYear] = useState("");
  const [responseText, setResponseText] = useState(""); // For API response
  const [teacherId, setTeacherId] = useState("example"); // Assuming you have a teacherId state

  // Handle file input
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Function to convert file to base64
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Extract base64
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      console.error("No file selected.");
      return;
    }

    try {
      // Convert file to base64 for AI analysis
      const base64Image = await toBase64(file);
      const API_KEY = "AIzaSyBcox681xg8Y7ty5v8uUtOT7nV_tE-g8K8"; // Replace with your actual API key
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt =
        "Given in the image are my notes for which i have an exam tomorrow. Please create a quiz based on the notes provided. I need the quiz in JSON Format strictly. The format of the JSON is : {\"question\": \"What is the capital of India?\", \"options\": [\"New Delhi\", \"Mumbai\", \"Kolkata\", \"Chennai\"], \"answer\": \"New Delhi\"}";

      const image = {
        inlineData: {
          data: base64Image,
          mimeType: file.type,
        },
      };

      // Get AI response
      const result = await model.generateContent([prompt, image]);
      const questionsStringJSON = result.response.text();
      const questions = questionsStringJSON.replace("```json", "").replace("```", "");

    //   const questions = JSON.parse(questionsStringJSON);

      console.log(questions);
      setResponseText(questionsStringJSON);
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Document Name"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <input
          type="text"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={handleFileChange}
        />
        <button type="submit">Submit</button>
      </form>
      <div>{responseText}</div>
    </div>
  );
};

export default PDFQuiz;
