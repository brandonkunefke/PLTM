'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/theme-context';

export default function TournamentWizard() {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [tournamentData, setTournamentData] = useState({
    name: '',
    date: '',
    maxPlayersPerTable: 8,
    buyInAmount: 50,
    dealerBuyInAmount: 25,
    houseFee: 5,
    pointWinnerContribution: 2,
    championshipGameContribution: 3,
    chipValue: 1000,
    allowRebuys: true,
    rebuyAmount: 50,
    rebuyChips: 1000,
    maxRebuys: 1,
    rebuyThroughLevel: 3,
    allowAddons: true,
    addonAmount: 50,
    addonChips: 1000,
    maxAddons: 1,
    addonStartLevel: 4,
    addonEndLevel: 6,
    isChampionshipGame: false,
    selectedPlayers: [],
    blindLevels: [
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
    ],
    payoutStructure: []
  });
  
  // Define the steps in the wizard
  const steps = [
    { id: 1, name: 'Basics', description: 'Tournament name, date, and table size' },
    { id: 2, name: 'Buying In', description: 'Buy-in amount, dealer rates, and chip values' },
    { id: 3, name: 'Players', description: 'Select players and designate dealers' },
    { id: 4, name: 'Blind Levels', description: 'Set blind levels and durations' },
    { id: 5, name: 'Payouts', description: 'Configure payout structure' },
    { id: 6, name: 'Review', description: 'Review and start tournament' }
  ];
  
  // Calculate prize pool amount
  const calculatePrizePool = (buyIn, houseFee, pointWinner, championship) => {
    return buyIn - houseFee - pointWinner - championship;
  };
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTournamentData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle number input changes
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setTournamentData(prev => ({
      ...prev,
      [name]: parseInt(value, 10) || 0
    }));
  };
  
  // Handle player selection from the player selection component
  const handlePlayerSelection = (selectedPlayers) => {
    setTournamentData(prev => ({
      ...prev,
      selectedPlayers
    }));
    goToNextStep();
  };
  
  // Navigate to the next step
  const goToNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Navigate to the previous step
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // In a real implementation, this would send data to the API
    console.log('Tournament data:', tournamentData);
    
    // Navigate to the tournament page
    // In a real implementation, this would redirect to the new tournament
    alert('Tournament created successfully!');
  };
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Tournament Basics</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block font-medium mb-1">Tournament Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={tournamentData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Friday Night Poker"
                />
              </div>
              
              <div>
                <label htmlFor="date" className="block font-medium mb-1">Tournament Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={tournamentData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="maxPlayersPerTable" className="block font-medium mb-1">
                  Maximum Players Per Table
                </label>
                <input
                  type="number"
                  id="maxPlayersPerTable"
                  name="maxPlayersPerTable"
                  value={tournamentData.maxPlayersPerTable}
                  onChange={handleNumberChange}
                  min="2"
                  max="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="isChampionshipGame"
                  name="isChampionshipGame"
                  checked={tournamentData.isChampionshipGame}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-600"
                />
                <label htmlFor="isChampionshipGame" className="ml-2">
                  This is a Championship Game
                </label>
              </div>
              
              {tournamentData.isChampionshipGame && (
                <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 p-4 rounded">
                  <p className="font-medium">Championship Game</p>
                  <p className="text-sm mt-1">
                    The Championship Game bank total will be added to this tournament's prize pool.
                    The Championship Game bank will be reset to zero after this tournament.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Buy-in Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="buyInAmount" className="block font-medium mb-1">Buy-in Amount</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">$</span>
                  <input
                    type="number"
                    id="buyInAmount"
                    name="buyInAmount"
                    value={tournamentData.buyInAmount}
                    onChange={handleNumberChange}
                    min="0"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-r-md"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="dealerBuyInAmount" className="block font-medium mb-1">Dealer Buy-in Amount</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">$</span>
                  <input
                    type="number"
                    id="dealerBuyInAmount"
                    name="dealerBuyInAmount"
                    value={tournamentData.dealerBuyInAmount}
                    onChange={handleNumberChange}
                    min="0"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-r-md"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="chipValue" className="block font-medium mb-1">Starting Chip Value</label>
                <input
                  type="number"
                  id="chipValue"
                  name="chipValue"
                  value={tournamentData.chipValue}
                  onChange={handleNumberChange}
                  min="0"
                  step="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Buy-in Allocation</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="houseFee" className="block font-medium mb-1">House Fee</label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">$</span>
                    <input
                      type="number"
                      id="houseFee"
                      name="houseFee"
                      value={tournamentData.houseFee}
                      onChange={handleNumberChange}
                      min="0"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-r-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="pointWinnerContribution" className="block font-medium mb-1">Point Winner Bank Contribution</label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">$</span>
                    <input
                      type="number"
                      id="pointWinnerContribution"
                      name="pointWinnerContribution"
                      value={tournamentData.pointWinnerContribution}
                      onChange={handleNumberChange}
                      min="0"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-r-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="championshipGameContribution" className="block font-medium mb-1">Championship Game Bank Contribution</label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">$</span>
                    <input
                      type="number"
                      id="championshipGameContribution"
                      name="championshipGameContribution"
                      value={tournamentData.championshipGameContribution}
                      onChange={handleNumberChange}
                      min="0"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-r-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block font-medium mb-1">Tournament Prize Pool Contribution</label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">$</span>
                    <input
                      type="number"
                      value={calculatePrizePool(
                        tournamentData.buyInAmount,
                        tournamentData.houseFee,
                        tournamentData.pointWinnerContribution,
                        tournamentData.championshipGameContribution
                      )}
                      readOnly
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-r-md"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Buy-in Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Buy-in:</span>
                    <span className="font-medium">${tournamentData.buyInAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>House Fee:</span>
                    <span className="font-medium">${tournamentData.houseFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Point Winner Bank:</span>
                    <span className="font-medium">${tournamentData.pointWinnerContribution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Championship Game Bank:</span>
                    <span className="font-medium">${tournamentData.championshipGameContribution}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-200">
                    <span>Tournament Prize Pool:</span>
                    <span className="font-medium">${calculatePrizePool(
                      tournamentData.buyInAmount,
                      tournamentData.houseFee,
                      tournamentData.pointWinnerContribution,
                      tournamentData.championshipGameContribution
                    )}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Rebuy Options</h3>
              
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="allowRebuys"
                  name="allowRebuys"
                  checked={tournamentData.allowRebuys}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-600"
                />
                <label htmlFor="allowRebuys" className="ml-2">Allow Rebuys</label>
              </div>
              
              {tournamentData.allowRebuys && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
                  <div>
                    <label htmlFor="rebuyAmount" className="block font-medium mb-1">Rebuy Amount</label>
                    <div className="flex items-center">
                      <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">$</span>
                      <input
                        type="number"
                        id="rebuyAmount"
                        name="rebuyAmount"
                        value={tournamentData.rebuyAmount}
                        onChange={handleNumberChange}
                        min="0"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-r-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="rebuyChips" className="block font-medium mb-1">Rebuy Chips</label>
                    <input
                      type="number"
                      id="rebuyChips"
                      name="rebuyChips"
                      value={tournamentData.rebuyChips}
                      onChange={handleNumberChange}
                      min="0"
                      step="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="maxRebuys" className="block font-medium mb-1">Maximum Rebuys</label>
                    <select
                      id="maxRebuys"
                      name="maxRebuys"
                      value={tournamentData.maxRebuys}
                      onChange={handleNumberChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="999">Unlimited</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="rebuyThroughLevel" className="block font-medium mb-1">Rebuy Through Level</label>
                    <select
                      id="rebuyThroughLevel"
                      name="rebuyThroughLevel"
                      value={tournamentData.rebuyThroughLevel}
                      onChange={handleNumberChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                      {tournamentData.blindLevels.map(level => (
                        <option key={level.level} value={level.level}>
                          Level {level.level} ({level.smallBlind}/{level.bigBlind})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Add-on Options</h3>
              
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="allowAddons"
                  name="allowAddons"
                  checked={tournamentData.allowAddons}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-600"
                />
                <label htmlFor="allowAddons" className="ml-2">Allow Add-ons</label>
              </div>
              
              {tournamentData.allowAddons && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
                  <div>
                    <label htmlFor="addonAmount" className="block font-medium mb-1">Add-on Amount</label>
                    <div className="flex items-center">
                      <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">$</span>
                      <input
                        type="number"
                        id="addonAmount"
                        name="addonAmount"
                        value={tournamentData.addonAmount}
                        onChange={handleNumberChange}
                        min="0"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-r-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="addonChips" className="block font-medium mb-1">Add-on Chips</label>
                    <input
                      type="number"
                      id="addonChips"
                      name="addonChips"
                      value={tournamentData.addonChips}
                      onChange={handleNumberChange}
                      min="0"
                      step="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="maxAddons" className="block font-medium mb-1">Maximum Add-ons</label>
                    <select
                      id="maxAddons"
                      name="maxAddons"
                      value={tournamentData.maxAddons}
                      onChange={handleNumberChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="999">Unlimited</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="addonStartLevel" className="block font-medium mb-1">From Level</label>
                      <select
                        id="addonStartLevel"
                        name="addonStartLevel"
                        value={tournamentData.addonStartLevel}
                        onChange={handleNumberChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      >
                        {tournamentData.blindLevels.map(level => (
                          <option key={level.level} value={level.level}>
                            Level {level.level}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="addonEndLevel" className="block font-medium mb-1">To Level</label>
                      <select
                        id="addonEndLevel"
                        name="addonEndLevel"
                        value={tournamentData.addonEndLevel}
                        onChange={handleNumberChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      >
                        {tournamentData.blindLevels.map(level => (
                          <option key={level.level} value={level.level}>
                            Level {level.level}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      case 3:
        // Use the TournamentPlayerSelection component
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Select Players</h2>
            <p className="text-gray-600">
              Select players who will participate in this tournament and designate which ones are dealers.
              Dealers will receive the reduced buy-in amount of ${tournamentData.dealerBuyInAmount} instead of ${tournamentData.buyInAmount}.
            </p>
            
            {/* This would use the TournamentPlayerSelection component */}
            <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 p-4 rounded">
              Player selection component would be rendered here, allowing you to select players and designate which ones are dealers for this specific tournament.
            </div>
            
            {/* Mock player selection for demo */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-medium">Check players who will participate in this tournament:</h3>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: 1, name: 'John Doe' },
                    { id: 2, name: 'Alice Brown' },
                    { id: 3, name: 'Mike Wilson' },
                    { id: 4, name: 'Sarah Lee' },
                    { id: 5, name: 'Bob Johnson' },
                    { id: 6, name: 'Emma Davis' }
                  ].map(player => (
                    <div key={player.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                      <input
                        type="checkbox"
                        id={`player-${player.id}`}
                        className="h-5 w-5 text-blue-600"
                      />
                      <label htmlFor={`player-${player.id}`} className="flex-grow cursor-pointer">
                        {player.name}
                      </label>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`dealer-${player.id}`}
                          className="h-5 w-5 text-yellow-600"
                        />
                        <label htmlFor={`dealer-${player.id}`} className="text-sm text-gray-600 cursor-pointer">
                          Dealer
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Blind Levels</h2>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium">Configure blind levels and durations</h3>
                <button className="px-3 py-1 bg-green-600 text-white rounded-md text-sm">
                  Add Level
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Small Blind</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Big Blind</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ante</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration (min)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tournamentData.blindLevels.map((level, index) => (
                      <tr key={level.level}>
                        <td className="px-6 py-4 whitespace-nowrap">{level.level}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{level.smallBlind}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{level.bigBlind}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{level.ante}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{level.duration}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                          {index > 0 && (
                            <button className="text-red-600 hover:text-red-800">Delete</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
              <h3 className="font-medium mb-4">Blind Structure Templates</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-3 border rounded-md hover:bg-blue-50 hover:border-blue-300">
                  Standard Structure
                </button>
                <button className="p-3 border rounded-md hover:bg-blue-50 hover:border-blue-300">
                  Turbo Structure
                </button>
                <button className="p-3 border rounded-md hover:bg-blue-50 hover:border-blue-300">
                  Deep Stack Structure
                </button>
              </div>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Payout Structure</h2>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-medium">Configure payout percentages</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Specify how the prize pool will be distributed among the top finishers.
                </p>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <label className="block font-medium mb-2">Number of Paid Positions</label>
                  <select className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md">
                    <option value="3">Top 3</option>
                    <option value="5">Top 5</option>
                    <option value="7">Top 7</option>
                    <option value="9">Top 9</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">1st Place</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                            defaultValue="50"
                          />%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">$500</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">2nd Place</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                            defaultValue="30"
                          />%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">$300</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">3rd Place</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                            defaultValue="20"
                          />%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">$200</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
              <h3 className="font-medium mb-4">Payout Templates</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-3 border rounded-md hover:bg-blue-50 hover:border-blue-300">
                  Standard (50/30/20)
                </button>
                <button className="p-3 border rounded-md hover:bg-blue-50 hover:border-blue-300">
                  Top Heavy (60/30/10)
                </button>
                <button className="p-3 border rounded-md hover:bg-blue-50 hover:border-blue-300">
                  Flat (40/30/20/10)
                </button>
              </div>
            </div>
          </div>
        );
        
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Review Tournament Settings</h2>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-medium">Tournament Summary</h3>
              </div>
              
              <div className="p-4">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tournament Name</dt>
                    <dd className="mt-1 text-lg">{tournamentData.name || 'Unnamed Tournament'}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date</dt>
                    <dd className="mt-1 text-lg">{tournamentData.date || 'Not specified'}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Buy-in Amount</dt>
                    <dd className="mt-1 text-lg">${tournamentData.buyInAmount}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Dealer Buy-in Amount</dt>
                    <dd className="mt-1 text-lg">${tournamentData.dealerBuyInAmount}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Starting Chips</dt>
                    <dd className="mt-1 text-lg">{tournamentData.chipValue}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Players Per Table</dt>
                    <dd className="mt-1 text-lg">{tournamentData.maxPlayersPerTable}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Point Winner Bank Contribution</dt>
                    <dd className="mt-1 text-lg">${tournamentData.pointWinnerContribution} per buy-in</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Championship Game Bank Contribution</dt>
                    <dd className="mt-1 text-lg">${tournamentData.championshipGameContribution} per buy-in</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tournament Type</dt>
                    <dd className="mt-1 text-lg">
                      {tournamentData.isChampionshipGame 
                        ? 'Championship Game (Championship Game bank will be added to prize pool)'
                        : 'Regular Tournament'}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Rebuys</dt>
                    <dd className="mt-1 text-lg">
                      {tournamentData.allowRebuys 
                        ? `$${tournamentData.rebuyAmount} for ${tournamentData.rebuyChips} chips, max ${tournamentData.maxRebuys === 999 ? 'unlimited' : tournamentData.maxRebuys}`
                        : 'Not allowed'}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Add-ons</dt>
                    <dd className="mt-1 text-lg">
                      {tournamentData.allowAddons 
                        ? `$${tournamentData.addonAmount} for ${tournamentData.addonChips} chips, max ${tournamentData.maxAddons === 999 ? 'unlimited' : tournamentData.maxAddons}`
                        : 'Not allowed'}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Selected Players</dt>
                    <dd className="mt-1 text-lg">
                      {tournamentData.selectedPlayers.length || 0} players, {tournamentData.selectedPlayers.filter(p => p.isDealer).length || 0} dealers
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Blind Levels</dt>
                    <dd className="mt-1 text-lg">{tournamentData.blindLevels.length} levels</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-2">Ready to Start</h3>
              <p className="text-green-700">
                Your tournament is ready to begin. Click "Create Tournament" to finalize and start the tournament.
              </p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tournament Setup Wizard</h1>
        <Link href="/tournaments" className="text-blue-600 hover:text-blue-800">
          Cancel
        </Link>
      </div>
      
      {/* Step indicator */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-medium">Tournament Setup Progress</h2>
        </div>
        
        <div className="p-4">
          <ol className="flex items-center w-full">
            {steps.map((step, index) => (
              <li key={step.id} className={`flex items-center ${index < steps.length - 1 ? 'w-full' : ''}`}>
                <span className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                  currentStep > step.id 
                    ? 'bg-blue-600 text-white'
                    : currentStep === step.id
                      ? 'bg-blue-100 text-blue-800 border border-blue-600'
                      : 'bg-gray-100 text-gray-500'
                }`}>
                  {currentStep > step.id ? '✓' : step.id}
                </span>
                <span className="ml-2 text-sm font-medium hidden md:inline">
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
      
      {/* Step content */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        {renderStep()}
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
          onClick={goToPreviousStep}
          disabled={currentStep === 1}
        >
          Previous
        </button>
        
        {currentStep < steps.length ? (
          <button
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            onClick={goToNextStep}
          >
            Next
          </button>
        ) : (
          <button
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            onClick={handleSubmit}
          >
            Create Tournament
          </button>
        )}
      </div>
    </div>
  );
}
