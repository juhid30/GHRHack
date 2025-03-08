import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Home, 
  X, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Upload,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GoogleGenerativeAI } from '@google/generative-ai';

const Quiz = () => {
  const [quizState, setQuizState] = useState('start');
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
  const [selectedImage, setSelectedImage] = useState(null);

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
      const API_KEY = "AIzaSyBcox681xg8Y7ty5v8uUtOT7nV_tE-g8K8"; // Replace with your actual API key
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = "Given in the image are my notes for which i have an exam tomorrow. Please create a quiz based on the notes provided. I need the quiz in JSON Format strictly. The format of the JSON is : {\"question\": \"What is the capital of India?\", \"options\": [\"New Delhi\", \"Mumbai\", \"Kolkata\", \"Chennai\"], \"answer\": \"New Delhi\"}";

      const image = {
        inlineData: {
          data: base64Image,
          mimeType: selectedImage.type,
        },
      };

      const result = await model.generateContent([prompt, image]);
      const questionsStringJSON = result.response.text();
      const questions = JSON.parse(questionsStringJSON.replace("```json", "").replace("```", ""));
      
      setQuizData(Array.isArray(questions) ? questions : [questions]);
      setUserAnswers(new Array(Array.isArray(questions) ? questions.length : 1).fill(null));
      setQuizState('quiz');
    } catch (error) {
      console.error("Error generating quiz:", error);
      setError("Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (selectedOption) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = selectedOption;
    setUserAnswers(newUserAnswers);
    setShowExplanation(selectedOption !== quizData[currentQuestion].answer);

    if (selectedOption === quizData[currentQuestion].answer) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const calculateScore = () => {
    return userAnswers.reduce((score, answer, index) => {
      return score + (answer === quizData[index].answer ? 1 : 0);
    }, 0);
  };

  const handleComplete = () => {
    setQuizState('complete');
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
          origin: { y: 0.6 }
        });
      }, 50);
    }
  };

  const ExitConfirmDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h3 className="text-xl font-bold mb-4">Exit Quiz?</h3>
        <p className="text-gray-600 mb-6">Your progress will be lost. Are you sure?</p>
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
              setQuizState('start');
              setCurrentQuestion(0);
              setUserAnswers([]);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Exit Quiz
          </button>
        </div>
      </div>
    </div>
  );

  const renderQuestion = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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

      <h3 className="text-xl font-bold text-gray-900">
        {quizData[currentQuestion].question}
      </h3>

      <div className="space-y-3">
        {quizData[currentQuestion].options.map((option, index) => {
          const isSelected = userAnswers[currentQuestion] === option;
          const isCorrect = option === quizData[currentQuestion].answer;
          const isDisabled = userAnswers[currentQuestion] !== null;

          return (
            <button
              key={index}
              onClick={() => !isDisabled && handleAnswerSelect(option)}
              disabled={isDisabled}
              className={`w-full p-4 text-left rounded-lg transition-all duration-300 flex items-center justify-between
                ${isDisabled
                  ? isSelected
                    ? isCorrect
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'bg-red-50 border-red-500 text-red-700'
                    : 'bg-gray-50 text-gray-400'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
                } border`}
            >
              <span>{option}</span>
              {isDisabled && isSelected && (
                isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )
              )}
            </button>
          );
        })}
      </div>

      {showExplanation && quizData[currentQuestion].explanation && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">Explanation</h4>
              <p className="text-blue-800">{quizData[currentQuestion].explanation}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button
          onClick={() => currentQuestion > 0 && setCurrentQuestion(prev => prev - 1)}
          disabled={currentQuestion === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded
            ${currentQuestion === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-800'
            }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        
        {currentQuestion === quizData.length - 1 ? (
          <button
            onClick={handleComplete}
            disabled={userAnswers[currentQuestion] === null}
            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-300"
          >
            Complete Quiz
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            disabled={userAnswers[currentQuestion] === null}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-300"
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
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Complete!</h2>
          <p className="text-xl text-gray-600">
            Your score: {score} out of {quizData.length} ({percentage.toFixed(1)}%)
          </p>
        </div>

        <div className="space-y-6">
          {quizData.map((question, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                {userAnswers[index] === question.answer ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              
              <h3 className="text-lg font-semibold">{question.question}</h3>
              
              <div className="space-y-2">
                {question.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`p-3 rounded ${
                      option === question.answer
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : option === userAnswers[index]
                        ? 'bg-red-50 border-red-500 text-red-700'
                        : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>

              {question.explanation && (
                <div className="bg-blue-50 p-4 rounded">
                  <h4 className="font-semibold text-blue-900 mb-1">Explanation</h4>
                  <p className="text-blue-800">{question.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setQuizState('start');
              setCurrentQuestion(0);
              setUserAnswers([]);
              setSelectedImage(null);
              setDocumentName("");
              setSubject("");
              setYear("");
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Home className="w-5 h-5" />
            Return Home
          </button>
          <button
            onClick={() => {
              setCurrentQuestion(0);
              setQuizState('quiz');
            }}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <RefreshCw className="w-5 h-5" />
            Review Answers
          </button>
        </div>
      </div>
    );
  };

  const renderStart = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center">Quiz Generator</h2>
      <form onSubmit={startQuiz} className="space-y-6">
        <div className="space-y-4">
          <input
            type="text"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            placeholder="Document Name"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <span className="text-sm text-gray-500">
              {selectedImage ? selectedImage.name : "Click to upload your notes"}
            </span>
          </label>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading || !selectedImage}
          className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2
            ${isLoading || !selectedImage
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Quiz...
            </>
          ) : (
            <>
              Generate Quiz
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {quizState === 'start' && renderStart()}
          {quizState === 'quiz' && renderQuestion()}
          {quizState === 'complete' && renderComplete()}
          {showExitConfirm && <ExitConfirmDialog />}
        </div>
      </div>
    </div>
  );
};

export default Quiz;