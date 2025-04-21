'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/theme-context';

export default function TournamentStandings({ tournamentId }) {
  const { theme } = useTheme();
  const [players, setPlayers] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'eliminated'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tournamentInfo, setTournamentInfo] = useState({
    name: 'Friday Night Poker',
    date: '2025-04-19',
    totalPlayers: 27,
    activePlayers: 22,
    eliminatedPlayers: 5,
    prizePool: 1300
  });
  
  // Fetch players from the database
  useEffect(() => {
    // In a real implementation, this would fetch from the API
    // For demo purposes, we'll use mock data
    const mockPlayers = [
      { id: 1, name: 'Jenny', isDealer: true, status: 'active', rebuys: 0, addons: 0, points: 10, position: null },
      { id: 2, name: 'JohnnyChan', isDealer: false, status: 'active', rebuys: 1, addons: 0, points: 8, position: null },
      { id: 3, name: 'HuckSeed', isDealer: false, status: 'active', rebuys: 0, addons: 1, points: 12, position: null },
      { id: 4, name: 'Mark', isDealer: false, status: 'eliminated', rebuys: 2, addons: 1, points: 5, position: 5 },
      { id: 5, name: 'Helmuth', isDealer: false, status: 'active', rebuys: 0, addons: 0, points: 15, position: null },
      { id: 6, name: 'AJS', isDealer: false, status: 'active', rebuys: 1, addons: 0, points: 7, position: null },
      { id: 7, name: 'Joe K', isDealer: false, status: 'eliminated', rebuys: 1, addons: 1, points: 3, position: 6 },
      { id: 8, name: 'DevilFish', isDealer: true, status: 'active', rebuys: 0, addons: 0, points: 10, position: null },
      { id: 9, name: 'Bridget P', isDealer: false, status: 'active', rebuys: 0, addons: 0, points: 8, position: null },
      { id: 10, name: 'Brian', isDealer: false, status: 'eliminated', rebuys: 2, addons: 0, points: 2, position: 7 },
      { id: 11, name: 'Brad P', isDealer: false, status: 'active', rebuys: 1, addons: 1, points: 9, position: null },
      { id: 12, name: 'SeanT', isDealer: false, status: 'active', rebuys: 0, addons: 0, points: 11, position: null },
      { id: 13, name: 'Raymer', isDealer: false, status: 'active', rebuys: 0, addons: 0, points: 10, position: null },
      { id: 14, name: 'Jason', isDealer: true, status: 'active', rebuys: 0, addons: 0, points: 10, position: null },
      { id: 15, name: 'Leo', isDealer: false, status: 'active', rebuys: 1, addons: 0, points: 8, position: null },
      { id: 16, name: 'Matty', isDealer: false, status: 'active', rebuys: 0, addons: 0, points: 9, position: null },
      { id: 17, name: 'CharlieL', isDealer: false, status: 'eliminated', rebuys: 1, addons: 1, points: 4, position: 8 },
      { id: 18, name: 'JimLivers', isDealer: false, status: 'active', rebuys: 0, addons: 0, points: 10, position: null },
      { id: 19, name: 'Big Daddy', isDealer: false, status: 'active', rebuys: 2, addons: 1, points: 7, position: null },
      { id: 20, name: 'Brendan', isDealer: true, status: 'active', rebuys: 0, addons: 0, points: 10, position: null },
      { id: 21, name: 'Steve', isDealer: false, status: 'active', rebuys: 0, addons: 0, points: 8, position: null },
      { id: 22, name: 'MoneyMaker', isDealer: false, status: 'active', rebuys: 0, addons: 0, points: 12, position: null },
      { id: 23, name: 'TexasDolly', isDealer: false, status: 'eliminated', rebuys: 2, addons: 0, points: 1, position: 9 },
      { id: 24, name: 'Waxman', isDealer: false, status: 'active', rebuys: 1, addons: 1, points: 9, position: null },
      { id: 25, name: 'Cyndie', isDealer: false, status: 'active', rebuys: 0, addons: 0, points: 10, position: null },
      { id: 26, name: 'Spencer', isDealer: false, status: 'active', rebuys: 0, addons: 0, points: 8, position: null },
    ];
    
    setPlayers(mockPlayers);
    setLoading(false);
  }, [tournamentId]);
  
  // Filter players based on current filter
  const filteredPlayers = players.filter(player => {
    if (filter === 'all') return true;
    if (filter === 'active') return player.status === 'active';
    if (filter === 'eliminated') return player.status === 'eliminated';
    return true;
  });
  
  // Generate reports
  const handleGenerateReports = () => {
    // In a real implementation, this would generate reports
    alert('Reports would be generated in a real implementation');
  };
  
  if (loading) {
    return <div className="text-center py-10">Loading tournament standings...</div>;
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
        <Link href={`/tournaments/${tournamentId}`} className="text-blue-600 hover:text-blue-800">
          ← Back to Tournament
        </Link>
        <button
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
          onClick={handleGenerateReports}
        >
          Generate Reports
        </button>
      </div>
      
      <h1 className="text-2xl font-bold">Tournament Standings</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="font-semibold">Tournament Summary</h2>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Players</div>
              <div className="text-2xl font-bold">{tournamentInfo.totalPlayers}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Players</div>
              <div className="text-2xl font-bold text-green-600">{tournamentInfo.activePlayers}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Eliminated Players</div>
              <div className="text-2xl font-bold text-red-600">{tournamentInfo.eliminatedPlayers}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Prize Pool</div>
              <div className="text-2xl font-bold">${tournamentInfo.prizePool}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700 flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-md ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setFilter('all')}
          >
            All Players
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              filter === 'active'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setFilter('active')}
          >
            Active Players
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              filter === 'eliminated'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setFilter('eliminated')}
          >
            Eliminated Players
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Player</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rebuys</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Add-ons</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Position</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPlayers.map(player => (
                <tr key={player.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {player.name}
                    {player.isDealer && <span className="ml-1 text-yellow-500">(Dealer)</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      player.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {player.status.charAt(0).toUpperCase() + player.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{player.rebuys}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{player.addons}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{player.points}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {player.position ? `${player.position}${getPositionSuffix(player.position)}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Helper function to get position suffix (1st, 2nd, 3rd, etc.)
function getPositionSuffix(position) {
  if (position === 1) return 'st';
  if (position === 2) return 'nd';
  if (position === 3) return 'rd';
  return 'th';
}
