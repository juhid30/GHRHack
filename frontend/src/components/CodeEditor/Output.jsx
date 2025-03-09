import { useState } from "react";
import { executeCode } from "./api";
import { ref, update } from "firebase/database";
import { db, realtimeDb } from "../../firebase";
import { dsaQuestions } from "./dsaQuestions";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

const Output = ({
  editorRef,
  language,
  isDSAMode,
  isDebugMode,
  dsaQuestion,
}) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = dsaQuestions[currentQuestionIndex];
  const [coins, setCoins] = useState(0); // Add state for tracking coins

  const updateCoins = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const userId = user.uid; // Get user ID
      const coinsRef = doc(db, "coins", userId); // Document reference for user's coins
      const coinsDoc = await getDoc(coinsRef); // Check if document exists

      if (coinsDoc.exists()) {
        // If document exists, update the coins
        setCoins(coinsDoc.data().coins + 10); // Add 10 coins (example increment)
        await setDoc(
          coinsRef,
          { coins: coinsDoc.data().coins + 10 },
          { merge: true }
        ); // Update document
      } else {
        // If document doesn't exist, create a new one with initial coins
        await setDoc(coinsRef, { userId, coins: 10 }); // Set initial coin value
        setCoins(10); // Set initial coins
      }
    }
  };

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      if (
        isDSAMode &&
        result.output.trim() === currentQuestion.expectedOutput
      ) {
        await updateCoins();
        toast.success("Success! You have earned 10 coins 💰.");
        setCurrentQuestionIndex((prev) =>
          Math.min(prev + 1, dsaQuestions.length - 1)
        );
      }
      if (isDebugMode && !result.output.includes("Error")) {
        await update(ref(realtimeDb, "debug_runs/-O7DvYO6LaeU_3BZyzVm"), {
          code: sourceCode,
          language,
          success: true,
        });
        toast.success("Code ran successfully in Debug Mode!");
      }
    } catch (error) {
      toast.error("An error occurred: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const improveWithAI = () => {
    // This function will be implemented to connect with AI improvement
    toast.success("AI improvement requested!");
  };

  return (
    <div className="w-full">
      {isDSAMode && dsaQuestion && (
        <div className="p-6 mb-4 bg-[#fff2ef80] border-2 border-[#d85981] rounded-[1.2rem]">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-md mr-3 bg-[#d85981] text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <path d="M12 17h.01"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#0e162b]">Challenge</h2>
          </div>
          
          <p className="mb-4 text-[#0e162b]">{dsaQuestion.question}</p>
          
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-[#d85981]"
              >
                <path d="m22 2-7 20-4-9-9-4Z"></path>
                <path d="M22 2 11 13"></path>
              </svg>
              <h3 className="text-lg font-semibold text-[#0e162b]">Sample Input</h3>
            </div>
            <pre className="bg-white border border-[#EEB6B3] p-3 rounded-md">{dsaQuestion.sampleInput}</pre>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-[#d85981]"
              >
                <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"></path>
                <path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"></path>
              </svg>
              <h3 className="text-lg font-semibold text-[#0e162b]">Expected Output</h3>
            </div>
            <pre className="bg-white border border-[#EEB6B3] p-3 rounded-md">{dsaQuestion.expectedOutput}</pre>
          </div>
        </div>
      )}

      <div className="flex space-x-3 mb-4">
        <button
          className={`px-5 py-3 bg-[#d85981] text-white rounded-md hover:bg-[#c04e73] transition-all duration-300 flex items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={runCode}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Run Code
            </>
          )}
        </button>

        <button
          className="px-5 py-3 bg-[#EEB6B3] text-white rounded-md hover:bg-[#d85981] transition-all duration-300 flex items-center"
          onClick={improveWithAI}
          disabled={isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.29 7 12 12 20.71 7"></polyline>
            <line x1="12" y1="22" x2="12" y2="12"></line>
          </svg>
          Improve With AI
        </button>
      </div>

      <div className="border-2 border-[#d85981] bg-[#fff2ef80] rounded-[1.2rem] overflow-hidden">
        <div className="p-3 bg-white border-b border-[#EEB6B3] flex items-center">
          <div className="p-2 rounded-md mr-3 bg-[#d85981] text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#0e162b]">Output</h3>
        </div>
        <div className="h-[40vh] p-4 bg-white overflow-auto">
          {output ? (
            output.map((line, i) => (
              <p key={i} className="font-mono">{line}</p>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto mb-4 text-[#EEB6B3]"
                >
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
                <p>Click "Run Code" to see the output here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Output;