'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/theme-context';

export default function TournamentClock({ tournamentId }) {
  const { theme } = useTheme();
  const [time, setTime] = useState(1200); // 20 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [blindLevels, setBlindLevels] = useState([
    { level: 1, smallBlind: 25, bigBlind: 50, ante: 0, duration: 20 },
    { level: 2, smallBlind: 50, bigBlind: 100, ante: 0, duration: 20 },
    { level: 3, smallBlind: 75, bigBlind: 150, ante: 0, duration: 20 },
    { level: 4, smallBlind: 100, bigBlind: 200, ante: 25, duration: 20 },
    { level: 5, smallBlind: 150, bigBlind: 300, ante: 25, duration: 20 },
    { level: 6, smallBlind: 200, bigBlind: 400, ante: 50, duration: 20 },
    { level: 7, smallBlind: 300, bigBlind: 600, ante: 75, duration: 20 },
    { level: 8, smallBlind: 400, bigBlind: 800, ante: 100, duration: 20 },
    { level: 9, smallBlind: 500, bigBlind: 1000, ante: 125, duration: 20 },
    { level: 10, smallBlind: 700, bigBlind: 1400, ante: 150, duration: 20 },
  ]);
  const [tournamentInfo, setTournamentInfo] = useState({
    name: 'Friday Night Poker',
    buyInAmount: 50,
    dealerBuyInAmount: 25,
    chipValue: 1000,
    rebuyAmount: 25,
    rebuyChips: 1000,
    maxRebuys: 'Unlimited',
    rebuyThroughLevel: 2,
    allowAddons: false,
    payouts: [
      { position: 1, amount: 520 },
      { position: 2, amount: 390 },
      { position: 3, amount: 260 },
      { position: 4, amount: 130 },
      { position: 5, amount: 0 },
    ]
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTime, setEditTime] = useState({ minutes: 20, seconds: 0 });
  
  // Format time as MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Get current blind level
  const getCurrentBlindLevel = () => {
    return blindLevels.find(level => level.level === currentLevel) || blindLevels[0];
  };
  
  // Timer effect
  useEffect(() => {
    let interval = null;
    
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (isRunning && time === 0) {
      // Time's up, move to next level
      handleNextLevel();
    } else {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, time]);
  
  // Handle start/pause
  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };
  
  // Handle reset
  const handleReset = () => {
    const currentLevelInfo = getCurrentBlindLevel();
    setTime(currentLevelInfo.duration * 60);
    setIsRunning(false);
  };
  
  // Handle next level
  const handleNextLevel = () => {
    if (currentLevel < blindLevels.length) {
      const nextLevel = currentLevel + 1;
      setCurrentLevel(nextLevel);
      const nextLevelInfo = blindLevels.find(level => level.level === nextLevel);
      setTime(nextLevelInfo.duration * 60);
      setIsRunning(false);
    }
  };
  
  // Handle previous level
  const handlePreviousLevel = () => {
    if (currentLevel > 1) {
      const prevLevel = currentLevel - 1;
      setCurrentLevel(prevLevel);
      const prevLevelInfo = blindLevels.find(level => level.level === prevLevel);
      setTime(prevLevelInfo.duration * 60);
      setIsRunning(false);
    }
  };
  
  // Handle edit time
  const handleEditTimeSubmit = () => {
    const newTimeInSeconds = (editTime.minutes * 60) + editTime.seconds;
    setTime(newTimeInSeconds);
    setShowEditModal(false);
  };
  
  // Handle fullscreen
  const handleFullscreen = () => {
    const element = document.documentElement;
    
    if (!isFullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    const currentLevelInfo = getCurrentBlindLevel();
    const totalSeconds = currentLevelInfo.duration * 60;
    return (time / totalSeconds) * 100;
  };
  
  // Current blind level
  const currentBlindLevel = getCurrentBlindLevel();
  
  return (
    <div className={`tournament-clock ${theme === 'dark' ? 'dark-mode' : ''}`}>
      {/* Top navigation */}
      <div className="flex justify-between items-center mb-4">
        <Link href={`/tournaments/${tournamentId}`} className="text-blue-600 hover:text-blue-800">
          ← Back to Tournament
        </Link>
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            onClick={handleFullscreen}
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
      </div>
      
      {/* Main clock display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-black text-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl text-yellow-400">Time Remaining</h2>
                <div className={`text-7xl font-bold ${time < 60 ? 'text-red-500 animate-pulse' : ''}`}>
                  {formatTime(time)}
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-xl text-yellow-400">Level {currentLevel}</h2>
                <div className="text-7xl font-bold">
                  {currentBlindLevel.smallBlind}/{currentBlindLevel.bigBlind}
                </div>
                {currentBlindLevel.ante > 0 && (
                  <div className="text-xl text-yellow-400">
                    Ante: {currentBlindLevel.ante}
                  </div>
                )}
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-700 rounded-full h-4 mb-6">
              <div
                className="bg-green-500 h-4 rounded-full"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
            
            {/* Clock controls */}
            <div className="flex justify-center space-x-4">
              <button
                className={`px-6 py-3 rounded-md text-lg font-semibold ${
                  isRunning
                    ? 'bg-yellow-500 hover:bg-yellow-600'
                    : 'bg-green-500 hover:bg-green-600'
                } text-white`}
                onClick={handleStartPause}
              >
                {isRunning ? 'Pause' : 'Start'}
              </button>
              <button
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-lg font-semibold"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-md text-lg font-semibold"
                onClick={() => setShowEditModal(true)}
              >
                Edit Time
              </button>
            </div>
            
            {/* Level navigation */}
            <div className="flex justify-center space-x-4 mt-4">
              <button
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-lg font-semibold"
                onClick={handlePreviousLevel}
                disabled={currentLevel === 1}
              >
                Previous Level
              </button>
              <button
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-lg font-semibold"
                onClick={handleNextLevel}
                disabled={currentLevel === blindLevels.length}
              >
                Next Level
              </button>
            </div>
          </div>
          
          {/* Chip values */}
          <div className="bg-black text-white p-6 rounded-lg shadow-lg mt-6">
            <h2 className="text-xl text-yellow-400 mb-4">Chips</h2>
            <div className="grid grid-cols-5 gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white border-4 border-gray-300 mb-2"></div>
                <span>25</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-red-500 border-4 border-gray-300 mb-2"></div>
                <span>50</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-500 border-4 border-gray-300 mb-2"></div>
                <span>100</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-800 border-4 border-gray-300 mb-2"></div>
                <span>500</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-500 border-4 border-gray-300 mb-2"></div>
                <span>1000</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          {/* Buy-in info */}
          <div className="bg-black text-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl text-yellow-400 mb-2">Buyin</h2>
            <div className="text-3xl font-bold mb-1">${tournamentInfo.buyInAmount}</div>
            <div className="text-xl mb-4">for ${tournamentInfo.chipValue} in Chips</div>
            
            <h2 className="text-xl text-yellow-400 mb-2">Rebuys</h2>
            <div className="text-3xl font-bold mb-1">${tournamentInfo.rebuyAmount} for ${tournamentInfo.rebuyChips} in Chips</div>
            <div className="text-xl mb-1">Number Allowed: {tournamentInfo.maxRebuys}</div>
            <div className="text-xl mb-4">Until Level: {tournamentInfo.rebuyThroughLevel}</div>
            
            <h2 className="text-xl text-yellow-400 mb-2">Add-on Chips</h2>
            <div className="text-xl mb-4">
              {tournamentInfo.allowAddons 
                ? `$${tournamentInfo.addonAmount} for ${tournamentInfo.addonChips} chips`
                : 'Chip Add-ons are not permitted.'}
            </div>
          </div>
          
          {/* Top pays */}
          <div className="bg-black text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl text-yellow-400 mb-4">Top Pays</h2>
            <div className="space-y-2">
              {tournamentInfo.payouts.map(payout => (
                <div key={payout.position} className="flex justify-between">
                  <span>{payout.position} {payout.position === 1 ? '1st' : payout.position === 2 ? '2nd' : payout.position === 3 ? '3rd' : `${payout.position}th`}</span>
                  <span>${payout.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Blind structure table */}
      <div className="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="font-semibold">Blind Structure</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Small Blind</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Big Blind</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ante</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Duration</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {blindLevels.map(level => (
                <tr 
                  key={level.level} 
                  className={level.level === currentLevel ? 'bg-blue-50 dark:bg-blue-900' : ''}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{level.level}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{level.smallBlind}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{level.bigBlind}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{level.ante}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{level.duration} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Edit time modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Time</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Minutes</label>
                <input
                  type="number"
                  value={editTime.minutes}
                  onChange={(e) => setEditTime({ ...editTime, minutes: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  min="0"
                  max="99"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">Seconds</label>
                <input
                  type="number"
                  value={editTime.seconds}
                  onChange={(e) => setEditTime({ ...editTime, seconds: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  min="0"
                  max="59"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                onClick={handleEditTimeSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
