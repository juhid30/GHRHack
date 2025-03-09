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
        alert("Code ran successfully in Debug Mode and updated Firebase.");
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-[60%] overflow-auto">
      {isDSAMode && dsaQuestion && (
        <div className="p-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Question</h2>
          <p className="mb-4">{dsaQuestion.question}</p>
          <h3 className="text-lg font-semibold">Sample Input</h3>
          <pre className="bg-gray-200 p-2 mb-4">{dsaQuestion.sampleInput}</pre>
          <h3 className="text-lg font-semibold">Expected Output</h3>
          <pre className="bg-gray-200 p-2">{dsaQuestion.expectedOutput}</pre>
        </div>
      )}

      <button
        className="px-4 py-2 bg-teal-600 text-white rounded-md mb-4 hover:bg-teal-700"
        onClick={runCode}
        disabled={isLoading}
      >
        {isLoading ? "Running..." : "Run Code"}
      </button>

      <button
        className="px-4 py-2 bg-teal-600 text-white rounded-md mb-4 hover:bg-teal-700 ml-5"
        // onClick={}
        disabled={isLoading}
      >
        {isLoading ? "Running..." : "Improve With AI"}
      </button>

      <div className="h-[50vh] p-2 rounded-md border bg-white">
        {output
          ? output.map((line, i) => <p key={i}>{line}</p>)
          : 'Click "Run Code" to see the output here'}
      </div>
    </div>
  );
};

export default Output;
