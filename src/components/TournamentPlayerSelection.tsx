'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/theme-context';

export default function TournamentPlayerSelection({ tournamentId, onComplete }) {
  const { theme } = useTheme();
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch all players from the database
  useEffect(() => {
    // In a real implementation, this would fetch from the API
    // For demo purposes, we'll use mock data
    const mockPlayers = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Alice Brown', email: 'alice@example.com' },
      { id: 3, name: 'Mike Wilson', email: 'mike@example.com' },
      { id: 4, name: 'Sarah Lee', email: 'sarah@example.com' },
      { id: 5, name: 'Bob Johnson', email: 'bob@example.com' },
      { id: 6, name: 'Emma Davis', email: 'emma@example.com' },
      { id: 7, name: 'Chris Martin', email: 'chris@example.com' },
      { id: 8, name: 'Lisa Chen', email: 'lisa@example.com' },
      { id: 9, name: 'David Kim', email: 'david@example.com' },
      { id: 10, name: 'Jane Smith', email: 'jane@example.com' },
      { id: 11, name: 'Robert White', email: 'robert@example.com' },
      { id: 12, name: 'Patricia Moore', email: 'patricia@example.com' },
      { id: 13, name: 'Michael Miller', email: 'michael@example.com' },
      { id: 14, name: 'Jennifer Garcia', email: 'jennifer@example.com' },
      { id: 15, name: 'Daniel Martinez', email: 'daniel@example.com' },
    ];
    
    setPlayers(mockPlayers);
    setLoading(false);
  }, []);
  
  // Filter players based on search term
  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle player selection
  const togglePlayerSelection = (playerId) => {
    setSelectedPlayers(prev => {
      const playerIndex = prev.findIndex(p => p.playerId === playerId);
      
      if (playerIndex >= 0) {
        // Player already selected, remove them
        return prev.filter(p => p.playerId !== playerId);
      } else {
        // Player not selected, add them
        return [...prev, { playerId, isDealer: false }];
      }
    });
  };
  
  // Handle dealer designation
  const toggleDealerDesignation = (playerId) => {
    setSelectedPlayers(prev => {
      return prev.map(p => {
        if (p.playerId === playerId) {
          return { ...p, isDealer: !p.isDealer };
        }
        return p;
      });
    });
  };
  
  // Check if a player is selected
  const isPlayerSelected = (playerId) => {
    return selectedPlayers.some(p => p.playerId === playerId);
  };
  
  // Check if a player is designated as a dealer
  const isPlayerDealer = (playerId) => {
    const player = selectedPlayers.find(p => p.playerId === playerId);
    return player ? player.isDealer : false;
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // In a real implementation, this would send data to the API
    console.log('Selected players:', selectedPlayers);
    
    if (onComplete) {
      onComplete(selectedPlayers);
    }
  };
  
  if (loading) {
    return <div className="text-center py-10">Loading players...</div>;
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Select Players for Tournament</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search players..."
            className="px-4 py-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link href="/players/new" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
            New Player
          </Link>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-medium">Check players who will participate in this tournament:</h3>
          <p className="text-sm text-gray-500 mt-1">
            Select players and designate which ones are dealers for this tournament.
            Dealers will receive the dealer buy-in rate for this event only.
          </p>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlayers.map(player => (
              <div key={player.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  id={`player-${player.id}`}
                  checked={isPlayerSelected(player.id)}
                  onChange={() => togglePlayerSelection(player.id)}
                  className="h-5 w-5 text-blue-600"
                />
                <label htmlFor={`player-${player.id}`} className="flex-grow cursor-pointer">
                  {player.name}
                </label>
                
                {isPlayerSelected(player.id) && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`dealer-${player.id}`}
                      checked={isPlayerDealer(player.id)}
                      onChange={() => toggleDealerDesignation(player.id)}
                      className="h-5 w-5 text-yellow-600"
                    />
                    <label htmlFor={`dealer-${player.id}`} className="text-sm text-gray-600 cursor-pointer">
                      Dealer
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
          <div>
            <span className="font-medium">{selectedPlayers.length}</span> players selected, 
            <span className="font-medium ml-1">{selectedPlayers.filter(p => p.isDealer).length}</span> dealers
          </div>
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
              onClick={() => setSelectedPlayers([])}
            >
              Clear All
            </button>
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              onClick={handleSubmit}
              disabled={selectedPlayers.length === 0}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
