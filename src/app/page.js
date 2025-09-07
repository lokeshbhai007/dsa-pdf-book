// src/app/page.js - WITH SCROLL-TO-HIDE HEADER
'use client';

import { useState, useEffect, useMemo } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import NotesView from '@/components/NotesView';
import AddQuestionForm from '@/components/AddQuestionForm';

export default function Home() {
  const [theme, setTheme] = useState('light');
  const [allNotes, setAllNotes] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSubTopic, setSelectedSubTopic] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Header scroll state
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.className = savedTheme;
  }, []);

  // Save theme to localStorage and apply to document
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Scroll handler for header visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 10; // Minimum scroll distance to trigger hide/show
      
      if (Math.abs(currentScrollY - lastScrollY) < scrollThreshold) {
        return;
      }

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold - hide header
        setIsHeaderVisible(false);
      } else {
        // Scrolling up or at top - show header
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/notes');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAllNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Failed to load notes. Please try again.');
      setAllNotes([]);
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtered notes
  const filteredNotes = useMemo(() => {
    if (!selectedTopic && !selectedSubTopic) {
      return allNotes;
    }

    let filtered = allNotes;
    
    if (selectedTopic) {
      filtered = filtered.filter(note => note.topic === selectedTopic);
    }
    
    if (selectedSubTopic) {
      filtered = filtered.map(note => ({
        ...note,
        subTopics: note.subTopics.filter(st => st.name === selectedSubTopic)
      })).filter(note => note.subTopics.length > 0);
    }
    
    return filtered;
  }, [allNotes, selectedTopic, selectedSubTopic]);

  // Get all unique topics
  const getAllTopics = useMemo(() => {
    return [...new Set(allNotes.map(note => note.topic))].sort();
  }, [allNotes]);

  // Get all unique subtopics (filtered by selected topic if any)
  const getAllSubTopics = useMemo(() => {
    const allSubTopics = [];
    allNotes.forEach(note => {
      if (!selectedTopic || note.topic === selectedTopic) {
        note.subTopics.forEach(st => {
          if (!allSubTopics.includes(st.name)) {
            allSubTopics.push(st.name);
          }
        });
      }
    });
    return allSubTopics.sort();
  }, [allNotes, selectedTopic]);

  const addQuestion = async (questionData) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });
      
      if (response.ok) {
        await fetchNotes(); // Refresh the data
      } else {
        throw new Error('Failed to add question');
      }
    } catch (error) {
      console.error('Error adding question:', error);
      setError('Failed to add question. Please try again.');
    }
  };

  const exportToPDF = () => {
    window.print();
  };

  // Calculate stats
  const totalTopics = getAllTopics.length;
  const totalSubTopics = allNotes.reduce((total, note) => total + note.subTopics.length, 0);
  const totalQuestions = allNotes.reduce((total, note) => 
    total + note.subTopics.reduce((subTotal, st) => subTotal + st.questions.length, 0), 0
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header with scroll-to-hide functionality */}
      <header className={`no-print fixed top-0 left-0 right-0 z-10 border-b border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md transition-transform duration-300 ease-in-out ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 gap-4">
            {/* Title and Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400 hidden lg:flex">
                PDF Notes
              </h1>
              
              {/* Stats Summary */}
              {!loading && totalQuestions > 0 && (
                <div className="md:flex items-center gap-4 text-sm hidden">
                  <span className="text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded">
                    📊 <strong>{totalQuestions}</strong> Questions
                  </span>
                </div>
              )}
            </div>

            {/* Controls - Filters, Export, Theme */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Filter Dropdowns */}
              {!loading && allNotes.length > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 sm:hidden">
                    Filters:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Topic Filter */}
                    <select
                      value={selectedTopic}
                      onChange={(e) => {
                        setSelectedTopic(e.target.value);
                        setSelectedSubTopic(''); // Reset subtopic when topic changes
                      }}
                      className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent min-w-[120px]"
                    >
                      <option value="">All Topics</option>
                      {getAllTopics.map(topic => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>

                    {/* SubTopic Filter */}
                    <select
                      value={selectedSubTopic}
                      onChange={(e) => setSelectedSubTopic(e.target.value)}
                      className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent min-w-[140px]"
                    >
                      <option value="">All Sub-topics</option>
                      {getAllSubTopics.map(subTopic => (
                        <option key={subTopic} value={subTopic}>{subTopic}</option>
                      ))}
                    </select>

                    {/* Clear Filters */}
                    {(selectedTopic || selectedSubTopic) && (
                      <button
                        onClick={() => {
                          setSelectedTopic('');
                          setSelectedSubTopic('');
                        }}
                        className="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={exportToPDF}
                  disabled={filteredNotes.length === 0}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                  Export PDF
                </button>
                <ThemeToggle theme={theme} setTheme={setTheme} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to account for fixed header */}
      <div className="h-20 lg:h-24"></div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <span>⚠️</span>
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="no-print lg:col-span-1">
            <AddQuestionForm onAddQuestion={addQuestion} />
          </div>

          {/* Notes Section */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading notes...</p>
              </div>
            ) : (
              <NotesView 
                notes={filteredNotes} 
                theme={theme}
                selectedTopic={selectedTopic}
                selectedSubTopic={selectedSubTopic}
              />
            )}
          </div>
        </div>
      </div>

      {/* Scroll to top button (optional enhancement) */}
      {!isHeaderVisible && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="no-print fixed bottom-6 right-6 z-20 p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}