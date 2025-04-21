'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Create a context for theme management
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  tableColor: '#1e7e34',
  railColor: '#5d4037',
  fontSize: 'medium',
  clockAnimation: true,
  setTableColor: (color) => {},
  setRailColor: (color) => {},
  setFontSize: (size) => {},
  setClockAnimation: (enabled) => {},
  saveSettings: () => {},
  resetSettings: () => {},
});

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Initialize state with default values or from localStorage
  const [theme, setTheme] = useState('light');
  const [tableColor, setTableColor] = useState('#1e7e34');
  const [railColor, setRailColor] = useState('#5d4037');
  const [fontSize, setFontSize] = useState('medium');
  const [clockAnimation, setClockAnimation] = useState(true);
  
  // Load settings from localStorage on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem('pokerTournamentSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setTheme(settings.theme || 'light');
      setTableColor(settings.tableColor || '#1e7e34');
      setRailColor(settings.railColor || '#5d4037');
      setFontSize(settings.fontSize || 'medium');
      setClockAnimation(settings.clockAnimation !== undefined ? settings.clockAnimation : true);
    }
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    
    // Apply font size
    document.documentElement.style.fontSize = getFontSizeValue(fontSize);
  }, []);
  
  // Update document theme when theme state changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  // Update font size when fontSize state changes
  useEffect(() => {
    document.documentElement.style.fontSize = getFontSizeValue(fontSize);
  }, [fontSize]);
  
  // Helper function to get font size value
  const getFontSizeValue = (size) => {
    switch (size) {
      case 'small': return '14px';
      case 'medium': return '16px';
      case 'large': return '18px';
      case 'x-large': return '20px';
      default: return '16px';
    }
  };
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      return newTheme;
    });
  };
  
  // Save all settings to localStorage
  const saveSettings = () => {
    const settings = {
      theme,
      tableColor,
      railColor,
      fontSize,
      clockAnimation,
    };
    localStorage.setItem('pokerTournamentSettings', JSON.stringify(settings));
  };
  
  // Reset settings to defaults
  const resetSettings = () => {
    setTheme('light');
    setTableColor('#1e7e34');
    setRailColor('#5d4037');
    setFontSize('medium');
    setClockAnimation(true);
    
    localStorage.removeItem('pokerTournamentSettings');
  };
  
  return (
    <ThemeContext.Provider value={{
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
      resetSettings,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);
