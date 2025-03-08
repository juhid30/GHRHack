import { useState } from "react";
import { LANGUAGE_VERSIONS } from "./constants";

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = ({ language, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
      >
        {language}
      </button>

      {isOpen && (
        <ul className="absolute mt-2 bg-white border border-gray-300 rounded-md shadow-md w-48 z-10">
          {languages.map(([lang, version]) => (
            <li
              key={lang}
              className={`px-4 py-2 cursor-pointer ${
                lang === language
                  ? "bg-teal-200 text-teal-800"
                  : "hover:bg-teal-100"
              }`}
              onClick={() => {
                onSelect(lang);
                setIsOpen(false);
              }}
            >
              {lang} <span className="text-gray-600 text-sm">({version})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;
