import { useState } from "react";
import { executeCode } from "./api";
import { ref, update } from "firebase/database";
import { realtimeDb } from "../../firebase";
import { dsaQuestions } from "./dsaQuestions";

const Output = ({ editorRef, language, isDSAMode, isDebugMode }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = dsaQuestions[currentQuestionIndex];

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
        alert("Success! Your code produced the correct output.");
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
    <div className="w-full">
      <button
        className="px-4 py-2 bg-teal-600 text-white rounded-md mb-4 hover:bg-teal-700"
        onClick={runCode}
        disabled={isLoading}
      >
        {isLoading ? "Running..." : "Run Code"}
      </button>

      {isDSAMode && (
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <h3 className="text-lg font-bold">Question:</h3>
          <p>{currentQuestion.question}</p>
        </div>
      )}

      <div className="h-[50vh] p-2 rounded-md border bg-white">
        {output
          ? output.map((line, i) => <p key={i}>{line}</p>)
          : 'Click "Run Code" to see the output here'}
      </div>
    </div>
  );
};

export default Output;
