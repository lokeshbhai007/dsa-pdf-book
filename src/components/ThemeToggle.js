// src/components/ThemeToggle.js - FIXED VERSION
import { useState, useEffect, useRef } from 'react';

export default function ThemeToggle({ theme, setTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const themes = [
    { id: 'light', name: 'Light Professional', icon: '☀️' },
    { id: 'dark', name: 'Dark Professional', icon: '🌙' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-sm">
          {themes.find(t => t.id === theme)?.icon}
        </span>
        <span className="text-sm font-medium hidden sm:block">
          {themes.find(t => t.id === theme)?.name}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
          {themes.map((themeOption) => (
            <button
              key={themeOption.id}
              onClick={() => {
                setTheme(themeOption.id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                theme === themeOption.id 
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                  : 'text-gray-900 dark:text-gray-100'
              }`}
            >
              <span className="mr-2">{themeOption.icon}</span>
              {themeOption.name}
              {theme === themeOption.id && (
                <span className="ml-auto">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
