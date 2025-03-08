import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, X, BookOpen, PenLine, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Heading1, Heading2, Save, Trash2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import ContentEditable from 'react-contenteditable';
import { Toaster, toast } from 'react-hot-toast';
import clsx from 'clsx';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = ""; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(API_KEY);

const Journal = () => {
  const [entries, setEntries] = useState(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });
  
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const contentEditableRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const typingTimerRef = useRef(null);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  const pageAnimation = useSpring({
    from: { transform: 'perspective(1000px) rotateX(5deg)', opacity: 0 },
    to: { transform: 'perspective(1000px) rotateX(0deg)', opacity: 1 },
    config: { mass: 1, tension: 280, friction: 60 },
  });

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  }, [entries]);

  const generateSuggestions = async (content) => {
    if (!API_KEY || isGeneratingSuggestions || !content.trim()) return;

    try {
      setIsGeneratingSuggestions(true);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Based on this journal entry: "${content}", analyze the emotional tone and provide 3 thoughtful suggestions to help the writer express and understand their feelings better. Format the response as a JSON array of strings with each suggestion being concise and empathetic. Example format: ["Consider exploring...", "You might want to reflect on...", "Try expressing..."]`;

      const result = await model.generateContent(prompt);
      const suggestionsText = result.response.text();
      const suggestions = JSON.parse(suggestionsText.replace(/```json\n?|\n?```/g, ''));

      toast.custom((t) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={clsx(
            'bg-white rounded-xl shadow-xl p-4 max-w-md',
            'border border-blue-100',
            t.visible ? 'animate-enter' : 'animate-leave'
          )}
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-2">Writing Suggestions</h3>
              <ul className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      ), {
        duration: 8000,
        position: 'bottom-right',
      });
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const saveEntry = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const createNewEntry = () => {
    const newEntry = {
      id: Date.now().toString(),
      title: 'Untitled Entry',
      content: '',
      date: format(new Date(), 'PPP'),
      style: {
        align: 'left',
        format: [],
      },
    };
    setEntries([...entries, newEntry]);
    setSelectedEntry(newEntry);
  };

  const deleteEntry = (entryId) => {
    setEntries(entries.filter(entry => entry.id !== entryId));
    if (selectedEntry?.id === entryId) {
      setSelectedEntry(null);
    }
  };

  const handleContentChange = (content, field) => {
    if (selectedEntry) {
      const updatedEntry = { ...selectedEntry, [field]: content };
      setSelectedEntry(updatedEntry);
      setEntries(entries.map(e => e.id === updatedEntry.id ? updatedEntry : e));
      saveEntry();

      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }

      if (field === 'content') {
        typingTimerRef.current = setTimeout(() => {
          generateSuggestions(content);
        }, 10000);
      }
    }
  };

  const handleFormat = (format) => {
    if (selectedEntry) {
      const updatedEntry = {
        ...selectedEntry,
        style: {
          ...selectedEntry.style,
          format: selectedEntry.style?.format?.includes(format)
            ? selectedEntry.style.format.filter(f => f !== format)
            : [...(selectedEntry.style?.format || []), format],
        },
      };
      setSelectedEntry(updatedEntry);
      setEntries(entries.map(e => e.id === updatedEntry.id ? updatedEntry : e));
    }
  };

  const handleAlign = (align) => {
    if (selectedEntry) {
      const updatedEntry = {
        ...selectedEntry,
        style: {
          ...selectedEntry.style,
          align,
        },
      };
      setSelectedEntry(updatedEntry);
      setEntries(entries.map(e => e.id === updatedEntry.id ? updatedEntry : e));
    }
  };

  const filteredEntries = entries.filter(entry => 
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen flex overflow-hidden">
      <Toaster />
      {/* Enhanced Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-96 bg-white shadow-xl border-r border-gray-200 flex flex-col"
      >
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-500 to-indigo-600">
          <div className="flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-white" />
            <h2 className="text-2xl font-bold text-white">My Journal</h2>
          </div>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <motion.div layout className="p-4 space-y-3">
            <AnimatePresence>
              {filteredEntries.map(entry => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={clsx(
                    'p-4 rounded-xl cursor-pointer transition-all duration-200',
                    'border border-transparent hover:border-blue-100',
                    selectedEntry?.id === entry.id
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md'
                      : 'hover:bg-gray-50'
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div
                      className="flex-1"
                      onClick={() => setSelectedEntry(entry)}
                    >
                      <h3 className="font-medium text-gray-800 truncate">{entry.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{entry.date}</p>
                      {entry.content && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {entry.content}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={createNewEntry}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            <span>New Entry</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
        <AnimatePresence mode="wait">
          {selectedEntry ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Formatting Toolbar */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white shadow-sm border-b border-gray-200 p-2 flex items-center gap-2 sticky top-0 z-10"
              >
                <button
                  onClick={() => handleFormat('bold')}
                  className={clsx(
                    'p-2 rounded hover:bg-gray-100 transition-colors',
                    selectedEntry.style?.format?.includes('bold') && 'bg-blue-50 text-blue-600'
                  )}
                >
                  <Bold size={18} />
                </button>
                <button
                  onClick={() => handleFormat('italic')}
                  className={clsx(
                    'p-2 rounded hover:bg-gray-100 transition-colors',
                    selectedEntry.style?.format?.includes('italic') && 'bg-blue-50 text-blue-600'
                  )}
                >
                  <Italic size={18} />
                </button>
                <button
                  onClick={() => handleFormat('underline')}
                  className={clsx(
                    'p-2 rounded hover:bg-gray-100 transition-colors',
                    selectedEntry.style?.format?.includes('underline') && 'bg-blue-50 text-blue-600'
                  )}
                >
                  <Underline size={18} />
                </button>
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <button
                  onClick={() => handleAlign('left')}
                  className={clsx(
                    'p-2 rounded hover:bg-gray-100 transition-colors',
                    selectedEntry.style?.align === 'left' && 'bg-blue-50 text-blue-600'
                  )}
                >
                  <AlignLeft size={18} />
                </button>
                <button
                  onClick={() => handleAlign('center')}
                  className={clsx(
                    'p-2 rounded hover:bg-gray-100 transition-colors',
                    selectedEntry.style?.align === 'center' && 'bg-blue-50 text-blue-600'
                  )}
                >
                  <AlignCenter size={18} />
                </button>
                <button
                  onClick={() => handleAlign('right')}
                  className={clsx(
                    'p-2 rounded hover:bg-gray-100 transition-colors',
                    selectedEntry.style?.align === 'right' && 'bg-blue-50 text-blue-600'
                  )}
                >
                  <AlignRight size={18} />
                </button>
              </motion.div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-8">
                  <animated.div style={pageAnimation} className="bg-white rounded-2xl shadow-xl">
                    <div className="relative">
                      {/* Entry Header */}
                      <div className="p-8 border-b border-gray-100">
                        <ContentEditable
                          html={selectedEntry.title}
                          onChange={(e) => handleContentChange(e.target.value, 'title')}
                          className="text-3xl font-bold text-gray-800 outline-none w-full focus:ring-2 focus:ring-blue-100 rounded transition-all"
                          tagName="h1"
                        />
                        <p className="text-sm text-gray-500 mt-2">{selectedEntry.date}</p>
                      </div>

                      {/* Entry Content */}
                      <div
                        className="min-h-[calc(100vh-16rem)] w-full p-8"
                        style={{
                          backgroundImage: 'linear-gradient(0deg, #f3f4f6 1px, transparent 1px)',
                          backgroundSize: '100% 2rem',
                          lineHeight: '2rem',
                          backgroundAttachment: 'local',
                        }}
                      >
                        <ContentEditable
                          innerRef={contentEditableRef}
                          html={selectedEntry.content}
                          onChange={(e) => handleContentChange(e.target.value, 'content')}
                          className={clsx(
                            'min-h-full w-full outline-none text-gray-700 leading-8',
                            'focus:ring-0 focus:outline-none transition-all',
                            selectedEntry.style?.align === 'center' && 'text-center',
                            selectedEntry.style?.align === 'right' && 'text-right',
                            selectedEntry.style?.format?.includes('bold') && 'font-bold',
                            selectedEntry.style?.format?.includes('italic') && 'italic',
                            selectedEntry.style?.format?.includes('underline') && 'underline'
                          )}
                          tagName="div"
                        />
                      </div>

                      {/* Save Indicator */}
                      <AnimatePresence>
                        {isSaving && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="fixed bottom-6 right-6 bg-black/80 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
                          >
                            <Save size={16} className="animate-pulse" />
                            <span>Saving...</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </animated.div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center gap-6 p-8"
            >
              <PenLine size={64} className="text-gray-300" />
              <h2 className="text-2xl font-semibold text-gray-600">Select an entry or create a new one</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={createNewEntry}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Plus size={20} />
                <span>New Entry</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Journal;