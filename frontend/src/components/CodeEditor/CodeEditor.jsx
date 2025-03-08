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
    <div className="w-full p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => handleModeClick("DSA")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          DSA Mode
        </button>
        <button
          onClick={() => handleModeClick("Debug")}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Debug Mode
        </button>
        <LanguageSelector language={language} onSelect={onSelect} />
      </div>
      <div className="flex gap-4">
        <div className="w-1/2">
          <Editor
            options={{ minimap: { enabled: false } }}
            height="70vh"
            theme="vs-light" // changed theme from vs-dark to vs-light
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
          {isDebugMode && showNextButton && (
            <button
              onClick={handleNextClick}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Next
            </button>
          )}
          {isDSAMode && ( // added Next button for DSAMode
            <button
              onClick={handleDSANext}
              className="mt-4 ml-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
