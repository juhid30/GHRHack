import { useRef, useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { ref, onValue, update } from "firebase/database";
import { realtimeDb } from "../../firebase";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS, WRONG_CODE_SNIPPETS } from "./constants";
import Output from "./Output";
import { dsaQuestions } from "./dsaQuestions"; // added import

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isDSAMode, setIsDSAMode] = useState(false);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [currentDebugIndex, setCurrentDebugIndex] = useState(0);
  const [currentDSAIndex, setCurrentDSAIndex] = useState(0); // added state
  const [showNextButton, setShowNextButton] = useState(false);

  const debugRunRefPath = "debug_runs/-O7DvYO6LaeU_3BZyzVm";

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    if (isDSAMode) {
      setValue(""); // clear editor in DSAMode
    } else if (isDebugMode) {
      setValue(WRONG_CODE_SNIPPETS[language][currentDebugIndex]);
    } else {
      setValue("");
    }
  };

  const handleModeClick = (mode) => {
    if (mode === "DSA") {
      setIsDSAMode(true);
      setIsDebugMode(false);
      setCurrentDSAIndex(0); // initialize index
      setValue(""); // clear editor on DSAMode
    } else if (mode === "Debug") {
      setIsDebugMode(true);
      setIsDSAMode(false);
      setValue(WRONG_CODE_SNIPPETS[language][currentDebugIndex]);
      setShowNextButton(false);
      checkFirebaseSuccess();
    }
  };

  const checkFirebaseSuccess = () => {
    const successRef = ref(realtimeDb, debugRunRefPath);
    onValue(successRef, (snapshot) => {
      const data = snapshot.val();
      setShowNextButton(!!data?.success);
    });
  };

  const handleNextClick = () => {
    update(ref(realtimeDb, debugRunRefPath), { success: false });
    const nextIndex =
      (currentDebugIndex + 1) % WRONG_CODE_SNIPPETS[language].length;
    setCurrentDebugIndex(nextIndex);
    setValue(WRONG_CODE_SNIPPETS[language][nextIndex]);
    setShowNextButton(false);
  };

  const handleDSANext = () => {
    const nextIndex = (currentDSAIndex + 1) % dsaQuestions.length;
    setCurrentDSAIndex(nextIndex);
    // do not update editor value in DSAMode
  };

  useEffect(() => {
    if (isDebugMode) checkFirebaseSuccess();
  }, [isDebugMode]);

  return (
    <div className="w-full p-4 bg-white">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => handleModeClick("DSA")}
          className={`px-4 py-2 text-white rounded-md transition-all duration-300 ${
            isDSAMode
              ? "bg-[#d85981] hover:bg-[#c04e73]"
              : "bg-[#EEB6B3] hover:bg-[#d85981]"
          }`}
        >
          DSA Mode
        </button>
        <button
          onClick={() => handleModeClick("Debug")}
          className={`px-4 py-2 text-white rounded-md transition-all duration-300 ${
            isDebugMode
              ? "bg-[#d85981] hover:bg-[#c04e73]"
              : "bg-[#EEB6B3] hover:bg-[#d85981]"
          }`}
        >
          Debug Mode
        </button>
        <LanguageSelector language={language} onSelect={onSelect} />
      </div>
      <div className="flex gap-4">
        <div className="w-1/2 border-2 border-[#d85981] rounded-[1.2rem] overflow-hidden">
          <div className="p-3 bg-[#fff2ef80] border-b border-[#EEB6B3] flex items-center">
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
                <path d="M8 3L4 7l4 4" />
                <path d="M16 3l4 4-4 4" />
                <path d="M9 21l6-18" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#0e162b]">Code Editor</h3>
          </div>
          <Editor
            options={{ 
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 16 }
            }}
            height="70vh"
            theme="vs-light"
            language={language}
            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value)}
          />
        </div>
        <div className="w-1/2">
          <Output
            editorRef={editorRef}
            language={language}
            isDSAMode={isDSAMode}
            isDebugMode={isDebugMode}
            dsaQuestion={isDSAMode ? dsaQuestions[currentDSAIndex] : null} // pass current DSA question
          />
          <div className="flex space-x-4 mt-4">
            {isDebugMode && showNextButton && (
              <button
                onClick={handleNextClick}
                className="px-6 py-3 bg-[#d85981] text-white rounded-md hover:bg-[#c04e73] transition-all duration-300 flex items-center"
              >
                <span>Next Challenge</span>
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
                  className="ml-2"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            )}
            {isDSAMode && (
              <button
                onClick={handleDSANext}
                className="px-6 py-3 bg-[#d85981] text-white rounded-md hover:bg-[#c04e73] transition-all duration-300 flex items-center"
              >
                <span>Next Problem</span>
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
                  className="ml-2"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;