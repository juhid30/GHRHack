import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, X, BookOpen, PenLine, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Heading1, Heading2, Save, Trash2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import ContentEditable from 'react-contenteditable';
import { Toaster, toast } from 'react-hot-toast';
import clsx from 'clsx';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "YOUR_API_KEY"; // Replace with your actual API key
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
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
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
            'bg-white rounded-lg shadow-lg p-4 max-w-md border border-neutral-200',
            t.visible ? 'animate-enter' : 'animate-leave'
          )}
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-neutral-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-medium text-neutral-800 mb-2">Writing Suggestions</h3>
              <ul className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-neutral-600">
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
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
    <div className="h-screen flex">
      <Toaster />
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-80 bg-white border-r border-neutral-200 flex flex-col"
      >
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-neutral-600" />
            <h2 className="text-xl font-medium text-neutral-800">Journal</h2>
          </div>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-neutral-50 text-neutral-700 placeholder-neutral-400 border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-400 transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <motion.div layout className="p-3 space-y-2">
            <AnimatePresence>
              {filteredEntries.map(entry => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={clsx(
                    'p-3 rounded-lg cursor-pointer transition-all',
                    selectedEntry?.id === entry.id
                      ? 'bg-neutral-100'
                      : 'hover:bg-neutral-50'
                  )}
                >
                  <div className="flex justify-between items-start group">
                    <div
                      className="flex-1"
                      onClick={() => setSelectedEntry(entry)}
                    >
                      <h3 className="font-medium text-neutral-800 truncate">{entry.title}</h3>
                      <p className="text-xs text-neutral-400 mt-1">{entry.date}</p>
                      {entry.content && (
                        <p className="text-sm text-neutral-600 mt-2 line-clamp-2">
                          {entry.content}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="p-3 border-t border-neutral-200">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={createNewEntry}
            className="w-full py-2 bg-neutral-900 text-white rounded-md shadow-sm hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            <span className="text-sm">New Entry</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen bg-neutral-50">
        <AnimatePresence mode="wait">
          {selectedEntry ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              {/* Toolbar */}
              <div className="bg-white border-b border-neutral-200 p-2 flex items-center gap-1">
                <button
                  onClick={() => handleFormat('bold')}
                  className={clsx(
                    'p-2 rounded hover:bg-neutral-100 transition-colors',
                    selectedEntry.style?.format?.includes('bold') && 'bg-neutral-200'
                  )}
                >
                  <Bold size={16} />
                </button>
                <button
                  onClick={() => handleFormat('italic')}
                  className={clsx(
                    'p-2 rounded hover:bg-neutral-100 transition-colors',
                    selectedEntry.style?.format?.includes('italic') && 'bg-neutral-200'
                  )}
                >
                  <Italic size={16} />
                </button>
                <button
                  onClick={() => handleFormat('underline')}
                  className={clsx(
                    'p-2 rounded hover:bg-neutral-100 transition-colors',
                    selectedEntry.style?.format?.includes('underline') && 'bg-neutral-200'
                  )}
                >
                  <Underline size={16} />
                </button>
                <div className="w-px h-4 bg-neutral-200 mx-1" />
                <button
                  onClick={() => handleAlign('left')}
                  className={clsx(
                    'p-2 rounded hover:bg-neutral-100 transition-colors',
                    selectedEntry.style?.align === 'left' && 'bg-neutral-200'
                  )}
                >
                  <AlignLeft size={16} />
                </button>
                <button
                  onClick={() => handleAlign('center')}
                  className={clsx(
                    'p-2 rounded hover:bg-neutral-100 transition-colors',
                    selectedEntry.style?.align === 'center' && 'bg-neutral-200'
                  )}
                >
                  <AlignCenter size={16} />
                </button>
                <button
                  onClick={() => handleAlign('right')}
                  className={clsx(
                    'p-2 rounded hover:bg-neutral-100 transition-colors',
                    selectedEntry.style?.align === 'right' && 'bg-neutral-200'
                  )}
                >
                  <AlignRight size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto p-8">
                  <animated.div style={pageAnimation} className="bg-white rounded-lg shadow-sm border border-neutral-200">
                    <div className="p-6 border-b border-neutral-200">
                      <ContentEditable
                        html={selectedEntry.title}
                        onChange={(e) => handleContentChange(e.target.value, 'title')}
                        className="text-2xl font-medium text-neutral-800 outline-none w-full focus:ring-1 focus:ring-neutral-300 rounded"
                        tagName="h1"
                      />
                      <p className="text-xs text-neutral-400 mt-2">{selectedEntry.date}</p>
                    </div>
                    <div
                      className="min-h-[calc(100vh-16rem)] w-full p-6"
                      style={{
                        backgroundImage: 'linear-gradient(0deg, #f5f5f5 1px, transparent 1px)',
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
                          'min-h-full w-full outline-none text-neutral-700 leading-8 text-base',
                          selectedEntry.style?.align === 'center' && 'text-center',
                          selectedEntry.style?.align === 'right' && 'text-right',
                          selectedEntry.style?.format?.includes('bold') && 'font-bold',
                          selectedEntry.style?.format?.includes('italic') && 'italic',
                          selectedEntry.style?.format?.includes('underline') && 'underline'
                        )}
                        tagName="div"
                      />
                    </div>
                  </animated.div>
                </div>
              </div>

              {/* Save Indicator */}
              <AnimatePresence>
                {isSaving && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-4 right-4 bg-neutral-900 text-white px-3 py-2 rounded-md text-sm shadow-lg flex items-center gap-2"
                  >
                    <Save size={14} className="animate-pulse" />
                    <span>Saving...</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center gap-4"
            >
              <PenLine size={48} className="text-neutral-300" />
              <p className="text-neutral-600">Select an entry or create a new one</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={createNewEntry}
                className="px-4 py-2 bg-neutral-900 text-white rounded-md shadow-sm hover:bg-neutral-800 transition-colors flex items-center gap-2 text-sm"
              >
                <Plus size={18} />
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