import React, { useState } from "react";
import {
  ArrowLeft,
  Home,
  X,
  ArrowRight,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Navbar from "./Navbar"; // Added Navbar import
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { to } from "@react-spring/web";
import toast from "react-hot-toast";

const Quiz = () => {
  const [quizState, setQuizState] = useState("start");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizData, setQuizData] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // New state for form inputs
  const [documentName, setDocumentName] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [coins, setCoins] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  const updateCoins = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const userId = user.uid; // Get user ID
      const coinsRef = doc(db, "coins", userId); // Document reference for user's coins
      const coinsDoc = await getDoc(coinsRef); // Check if document exists

      if (coinsDoc.exists()) {
        // If document exists, update the coins
        setCoins(coinsDoc.data().coins + 2); // Add 10 coins (example increment)
        await setDoc(
          coinsRef,
          { coins: coinsDoc.data().coins + 2 },
          { merge: true }
        ); // Update document
      } else {
        // If document doesn't exist, create a new one with initial coins
        await setDoc(coinsRef, { userId, coins: 2 }); // Set initial coin value
        setCoins(2); // Set initial coins
      }
    }
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const startQuiz = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!selectedImage) {
      setError("Please select an image first");
      setIsLoading(false);
      return;
    }

    try {
      const base64Image = await toBase64(selectedImage);
      const API_KEY = "AIzaSyDOky3a0Mpbe13I6Zo4t-RZ-pt4F8NbG5I"; // Replace with your actual API key
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt =
        'Given in the image are my notes for which i have an exam tomorrow. Please create a quiz based on the notes provided. I need the quiz in JSON Format strictly. The format of the JSON is : {"question": "What is the capital of India?", "options": ["New Delhi", "Mumbai", "Kolkata", "Chennai"], "answer": "New Delhi"}';

      const image = {
        inlineData: {
          data: base64Image,
          mimeType: selectedImage.type,
        },
      };

      const result = await model.generateContent([prompt, image]);
      const questionsStringJSON = result.response.text();
      const questions = JSON.parse(
        questionsStringJSON.replace("```json", "").replace("```", "")
      );

      setQuizData(Array.isArray(questions) ? questions : [questions]);
      setUserAnswers(
        new Array(Array.isArray(questions) ? questions.length : 1).fill(null)
      );
      setQuizState("quiz");
    } catch (error) {
      console.error("Error generating quiz:", error);
      setError("Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = async (selectedOption) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = selectedOption;
    setUserAnswers(newUserAnswers);
    setShowExplanation(selectedOption !== quizData[currentQuestion].answer);

    if (selectedOption === quizData[currentQuestion].answer) {
      await updateCoins();
      toast.success("You recived 2 Coins for the Question");
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const calculateScore = () => {
    return userAnswers.reduce((score, answer, index) => {
      return score + (answer === quizData[index].answer ? 1 : 0);
    }, 0);
  };

  const handleComplete = () => {
    setQuizState("complete");
    const score = calculateScore();
    const percentage = (score / quizData.length) * 100;

    if (percentage >= 70) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }
        confetti({
          particleCount: 3,
          angle: randomInRange(60, 120),
          spread: randomInRange(50, 70),
          origin: { y: 0.6 },
        });
      }, 50);
    }
  };

  const ExitConfirmDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h3 className="text-xl font-semibold text-[#7D5BA6]">Exit Quiz?</h3>
        <p className="text-gray-600 mb-6">
          Your progress will be lost. Are you sure?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setShowExitConfirm(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setShowExitConfirm(false);
              setQuizState("start");
              setCurrentQuestion(0);
              setUserAnswers([]);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Exit Quiz
          </button>
        </div>
      </div>
    </div>
  );

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Renders a single question in the quiz with options and a button to proceed.
   * Also shows the explanation for the question if the user has selected an option.
   * @returns {JSX.Element} The rendered question component
   */
  /******  821f545a-dedf-459c-8fd0-b13ccbb7f1c8  *******/
  const renderQuestion = () => (
    <div className="space-y-6 my-auto flex flex-col justify-center items-center min-h-screen">
      <div className="flex justify-between items-center w-full">
        <span className="text-sm font-medium text-gray-500">
          Question {currentQuestion + 1} of {quizData.length}
        </span>
        <button
          onClick={() => setShowExitConfirm(true)}
          className="text-gray-500 hover:text-red-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <h3 className="text-2xl font-semibold text-[#7D5BA6]">
        {quizData[currentQuestion].question}
      </h3>

      <div className="space-y-3 w-full">
        {quizData[currentQuestion].options.map((option, index) => {
          const isSelected = userAnswers[currentQuestion] === option;
          const isCorrect = option === quizData[currentQuestion].answer;
          const isDisabled = userAnswers[currentQuestion] !== null;

          return (
            <button
              key={index}
              onClick={() => !isDisabled && handleAnswerSelect(option)}
              disabled={isDisabled}
              className={`w-full p-4 text-left rounded-xl transition-all duration-300 flex items-center justify-between
                ${
                  isDisabled
                    ? isSelected
                      ? isCorrect
                        ? "bg-[#55D6BE] border-[#55D6BE] text-white"
                        : "bg-[#FC6471] border-[#FC6471] text-white"
                      : "bg-gray-50 text-gray-400"
                    : "bg-white border-gray-200 hover:bg-[#55D6BE] hover:text-white"
                } border`}
            >
              <span>{option}</span>
              {isDisabled &&
                isSelected &&
                (isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : (
                  <XCircle className="w-5 h-5 text-white" />
                ))}
            </button>
          );
        })}
      </div>

      {showExplanation && quizData[currentQuestion].explanation && (
        <div className="mt-4 p-4 bg-[#7D5BA6] rounded-xl border border-[#7D5BA6] text-white">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-white mt-0.5" />
            <div>
              <h4 className="font-semibold text-white">Explanation</h4>
              <p className="text-white">
                {quizData[currentQuestion].explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4 w-full">
        <button
          onClick={() =>
            currentQuestion > 0 && setCurrentQuestion((prev) => prev - 1)
          }
          disabled={currentQuestion === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg
            ${
              currentQuestion === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-[#7D5BA6] hover:text-[#FC6471]"
            }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {currentQuestion === quizData.length - 1 ? (
          <button
            onClick={handleComplete}
            disabled={userAnswers[currentQuestion] === null}
            className="px-6 py-2 bg-[#7D5BA6] text-white rounded-lg hover:bg-[#FC6471] disabled:bg-gray-300"
          >
            Complete Quiz
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion((prev) => prev + 1)}
            disabled={userAnswers[currentQuestion] === null}
            className="flex items-center gap-2 px-6 py-2 bg-[#7D5BA6] text-white rounded-lg hover:bg-[#FC6471] disabled:bg-gray-300"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  const renderComplete = () => {
    const score = calculateScore();
    const percentage = (score / quizData.length) * 100;

    return (
      <div className="space-y-8 my-auto flex flex-col justify-center p-3 border items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#7D5BA6] mb-4">
            Quiz Complete!
          </h2>
          <p className="text-xl text-gray-600">
            Your score: {score} out of {quizData.length} (
            {percentage.toFixed(1)}%)
          </p>
        </div>

        <div className="space-y-6">
          {quizData.map((question, index) => (
            <div key={index} className="border rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">
                  Question {index + 1}
                </span>
                {userAnswers[index] === question.answer ? (
                  <CheckCircle className="w-5 h-5 text-[#55D6BE]" />
                ) : (
                  <XCircle className="w-5 h-5 text-[#FC6471]" />
                )}
              </div>

              <h3 className="text-lg font-semibold">{question.question}</h3>

              <div className="space-y-2">
                {question.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`p-3 rounded-xl ${
                      option === question.answer
                        ? "bg-[#55D6BE] border-[#55D6BE] text-white"
                        : option === userAnswers[index]
                        ? "bg-[#FC6471] border-[#FC6471] text-white"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>

              {question.explanation && (
                <div className="bg-[#7D5BA6] p-4 rounded-xl text-white">
                  <h4 className="font-semibold mb-1">Explanation</h4>
                  <p>{question.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setQuizState("start");
              setCurrentQuestion(0);
              setUserAnswers([]);
              setSelectedImage(null);
              setDocumentName("");
              setSubject("");
              setYear("");
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-[#7D5BA6] rounded-xl hover:bg-[#FC6471] text-[#7D5BA6]"
          >
            <Home className="w-5 h-5" />
            Return Home
          </button>
          <button
            onClick={() => {
              setCurrentQuestion(0);
              setQuizState("quiz");
            }}
            className="flex items-center gap-2 px-6 py-3 bg-[#7D5BA6] text-white rounded-xl hover:bg-[#FC6471]"
          >
            <RefreshCw className="w-5 h-5" />
            Review Answers
          </button>
        </div>
      </div>
    );
  };

  const renderStart = () => (
    <div className="space-y-8 my-auto py-4 rounded-lg flex flex-col  justify-center p-3 h-fit items-center">
      <h2 className="text-3xl font-bold text-[#7D5BA6] text-center">
        Quiz Generator
      </h2>
      <form onSubmit={startQuiz} className="space-y-6 w-full max-w-md">
        <div className="space-y-4">
          <input
            type="text"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            placeholder="Document Name"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#55D6BE] transition-all duration-300"
          />
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#55D6BE] transition-all duration-300"
          />
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#55D6BE] transition-all duration-300"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="image-upload"
            className="block text-sm font-medium text-[#7D5BA6]"
          >
            Upload Notes
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#55D6BE] transition-all duration-300"
          />
        </div>

        {error && <p className="text-sm text-[#FC6471]">{error}</p>}

        <div className="flex justify-center gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-3 bg-[#7D5BA6] text-white rounded-xl hover:bg-[#FC6471] ${
              isLoading ? "opacity-50" : ""
            }`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Start Quiz"
            )}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <>
      <Navbar /> {/* Navbar added */}
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#F9F7F9] pt-16">
        {showExitConfirm && <ExitConfirmDialog />}
        {quizState === "start" && renderStart()}
        {quizState === "quiz" && renderQuestion()}
        {quizState === "complete" && renderComplete()}
      </div>
    </>
  );
};

export default Quiz;
