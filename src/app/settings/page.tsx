'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/theme-context';

export default function Settings() {
  const {
    theme,
    toggleTheme,
    tableColor,
    railColor,
    fontSize,
    clockAnimation,
    setTableColor,
    setRailColor,
    setFontSize,
    setClockAnimation,
    saveSettings,
    resetSettings
  } = useTheme();
  
  const [isSaved, setIsSaved] = useState(false);
  
  // Clear saved message after 3 seconds
  useEffect(() => {
    if (isSaved) {
      const timer = setTimeout(() => {
        setIsSaved(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isSaved]);
  
  // Handle save button click
  const handleSave = () => {
    saveSettings();
    setIsSaved(true);
  };
  
  // Font size options
  const fontSizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'x-large', label: 'Extra Large' }
  ];
  
  // Table color presets
  const tableColorPresets = [
    { value: '#1e7e34', label: 'Green (Default)' },
    { value: '#0e4c92', label: 'Blue' },
    { value: '#800020', label: 'Burgundy' },
    { value: '#2c3e50', label: 'Navy' },
    { value: '#4b0082', label: 'Indigo' }
  ];
  
  // Rail color presets
  const railColorPresets = [
    { value: '#5d4037', label: 'Brown (Default)' },
    { value: '#212121', label: 'Black' },
    { value: '#1a237e', label: 'Navy' },
    { value: '#880e4f', label: 'Maroon' },
    { value: '#4a148c', label: 'Purple' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mr-2">
          ← Back to Home
        </Link>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      {isSaved && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Settings saved successfully!
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Theme Settings</h2>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Theme Toggle */}
          <div className="flex justify-between items-center">
            <label htmlFor="theme-toggle" className="font-medium">
              Dark Mode
            </label>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
              <input
                id="theme-toggle"
                type="checkbox"
                className="absolute w-6 h-6 opacity-0"
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
              <label
                htmlFor="theme-toggle"
                className={`block h-6 overflow-hidden rounded-full cursor-pointer ${
                  theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0 left-0 inline-block w-6 h-6 transform transition-transform duration-200 ease-in-out bg-white rounded-full shadow ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                  }`}
                ></span>
              </label>
            </div>
          </div>
          
          {/* Font Size */}
          <div className="space-y-2">
            <label htmlFor="font-size" className="block font-medium">
              Font Size
            </label>
            <select
              id="font-size"
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
            >
              {fontSizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Clock Animation Toggle */}
          <div className="flex justify-between items-center">
            <label htmlFor="clock-animation" className="font-medium">
              Clock Animations
            </label>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
              <input
                id="clock-animation"
                type="checkbox"
                className="absolute w-6 h-6 opacity-0"
                checked={clockAnimation}
                onChange={(e) => setClockAnimation(e.target.checked)}
              />
              <label
                htmlFor="clock-animation"
                className={`block h-6 overflow-hidden rounded-full cursor-pointer ${
                  clockAnimation ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0 left-0 inline-block w-6 h-6 transform transition-transform duration-200 ease-in-out bg-white rounded-full shadow ${
                    clockAnimation ? 'translate-x-6' : 'translate-x-0'
                  }`}
                ></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Table Visualization</h2>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Table Color */}
          <div className="space-y-2">
            <label htmlFor="table-color" className="block font-medium">
              Table Felt Color
            </label>
            <div className="flex space-x-2">
              <input
                type="color"
                id="table-color"
                className="h-10 w-10 rounded border border-gray-300"
                value={tableColor}
                onChange={(e) => setTableColor(e.target.value)}
              />
              <select
                className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                value={tableColor}
                onChange={(e) => setTableColor(e.target.value)}
              >
                {tableColorPresets.map((preset) => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Rail Color */}
          <div className="space-y-2">
            <label htmlFor="rail-color" className="block font-medium">
              Table Rail Color
            </label>
            <div className="flex space-x-2">
              <input
                type="color"
                id="rail-color"
                className="h-10 w-10 rounded border border-gray-300"
                value={railColor}
                onChange={(e) => setRailColor(e.target.value)}
              />
              <select
                className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                value={railColor}
                onChange={(e) => setRailColor(e.target.value)}
              >
                {railColorPresets.map((preset) => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Table Preview */}
          <div className="mt-4">
            <h3 className="font-medium mb-2">Preview</h3>
            <div className="relative h-40 w-full flex justify-center">
              <div 
                className="absolute w-[200px] h-[120px] rounded-[50%] border-[8px]"
                style={{
                  backgroundColor: tableColor,
                  borderColor: railColor,
                  backgroundImage: `radial-gradient(circle, ${tableColor}, ${adjustColor(tableColor, -20)})`,
                  boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          onClick={resetSettings}
        >
          Reset to Defaults
        </button>
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          onClick={handleSave}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

// Helper function to darken/lighten a color
function adjustColor(color, amount) {
  return '#' + color.replace(/^#/, '').replace(/../g, color => 
    ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
  );
}
