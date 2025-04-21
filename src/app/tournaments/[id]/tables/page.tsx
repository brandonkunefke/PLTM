'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/theme-context';

export default function TableAssignments({ tournamentId }) {
  const { theme } = useTheme();
  const [tables, setTables] = useState([]);
  const [showEliminatedPlayers, setShowEliminatedPlayers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tableColors, setTableColors] = useState({
    feltColor: localStorage.getItem('feltColor') || '#0a7e07',
    railColor: localStorage.getItem('railColor') || '#6e4a1f'
  });
  
  // Fetch table assignments from the database
  useEffect(() => {
    // In a real implementation, this would fetch from the API
    // For demo purposes, we'll use mock data
    const mockTables = [
      {
        id: 1,
        name: 'Table 1',
        seats: [
          { seatNumber: 1, player: { id: 1, name: 'Jenny', isDealer: true }, status: 'active' },
          { seatNumber: 2, player: { id: 2, name: 'JohnnyChan', isDealer: false }, status: 'active' },
          { seatNumber: 3, player: { id: 3, name: 'HuckSeed', isDealer: false }, status: 'active' },
          { seatNumber: 4, player: { id: 4, name: 'Mark', isDealer: false }, status: 'active' },
          { seatNumber: 5, player: { id: 5, name: 'Helmuth', isDealer: false }, status: 'active' },
          { seatNumber: 6, player: { id: 6, name: 'AJS', isDealer: false }, status: 'active' },
          { seatNumber: 7, player: { id: 7, name: 'Joe K', isDealer: false }, status: 'active' },
          { seatNumber: 8, player: null, status: 'open' }
        ]
      },
      {
        id: 2,
        name: 'Table 2',
        seats: [
          { seatNumber: 1, player: { id: 8, name: 'DevilFish', isDealer: true }, status: 'active' },
          { seatNumber: 2, player: { id: 9, name: 'Bridget P', isDealer: false }, status: 'active' },
          { seatNumber: 3, player: { id: 10, name: 'Brian', isDealer: false }, status: 'active' },
          { seatNumber: 4, player: { id: 11, name: 'Brad P', isDealer: false }, status: 'active' },
          { seatNumber: 5, player: { id: 12, name: 'SeanT', isDealer: false }, status: 'active' },
          { seatNumber: 6, player: { id: 13, name: 'Raymer', isDealer: false }, status: 'active' },
          { seatNumber: 7, player: null, status: 'open' },
          { seatNumber: 8, player: null, status: 'open' }
        ]
      },
      {
        id: 3,
        name: 'Table 3',
        seats: [
          { seatNumber: 1, player: { id: 14, name: 'Jason', isDealer: true }, status: 'active' },
          { seatNumber: 2, player: { id: 15, name: 'Leo', isDealer: false }, status: 'active' },
          { seatNumber: 3, player: { id: 16, name: 'Matty', isDealer: false }, status: 'active' },
          { seatNumber: 4, player: { id: 17, name: 'CharlieL', isDealer: false }, status: 'active' },
          { seatNumber: 5, player: { id: 18, name: 'JimLivers', isDealer: false }, status: 'active' },
          { seatNumber: 6, player: { id: 19, name: 'Big Daddy', isDealer: false }, status: 'active' },
          { seatNumber: 7, player: null, status: 'open' },
          { seatNumber: 8, player: null, status: 'open' }
        ]
      },
      {
        id: 4,
        name: 'Table 4',
        seats: [
          { seatNumber: 1, player: { id: 20, name: 'Brendan', isDealer: true }, status: 'active' },
          { seatNumber: 2, player: { id: 21, name: 'Steve', isDealer: false }, status: 'active' },
          { seatNumber: 3, player: { id: 22, name: 'MoneyMaker', isDealer: false }, status: 'active' },
          { seatNumber: 4, player: { id: 23, name: 'TexasDolly', isDealer: false }, status: 'active' },
          { seatNumber: 5, player: { id: 24, name: 'Waxman', isDealer: false }, status: 'active' },
          { seatNumber: 6, player: { id: 25, name: 'Cyndie', isDealer: false }, status: 'active' },
          { seatNumber: 7, player: { id: 26, name: 'Spencer', isDealer: false }, status: 'active' },
          { seatNumber: 8, player: null, status: 'open' }
        ]
      }
    ];
    
    setTables(mockTables);
    setLoading(false);
  }, [tournamentId]);
  
  // Handle rebalance tables
  const handleRebalanceTables = () => {
    // In a real implementation, this would call the API to rebalance tables
    alert('Tables would be rebalanced in a real implementation');
  };
  
  // Filter seats based on showEliminatedPlayers setting
  const filterSeats = (seats) => {
    if (showEliminatedPlayers) {
      return seats;
    } else {
      return seats.filter(seat => seat.status !== 'eliminated');
    }
  };
  
  // Calculate seat positions around an oval table
  const calculateSeatPosition = (seatNumber, totalSeats) => {
    // For an 8-seat table, position seats evenly around an oval
    // Seat 1 (dealer) is at the bottom center
    const angle = ((seatNumber - 1) / totalSeats) * 2 * Math.PI - (Math.PI / 2);
    
    // Oval parameters
    const a = 100; // horizontal radius
    const b = 60;  // vertical radius
    
    // Calculate position
    const x = a * Math.cos(angle);
    const y = b * Math.sin(angle);
    
    // Center in the table and convert to percentage
    return {
      left: `${50 + x}%`,
      top: `${50 + y}%`
    };
  };
  
  if (loading) {
    return <div className="text-center py-10">Loading table assignments...</div>;
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
        <div className="flex space-x-4">
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            onClick={handleRebalanceTables}
          >
            Rebalance Tables
          </button>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showEliminatedPlayers"
              checked={showEliminatedPlayers}
              onChange={() => setShowEliminatedPlayers(!showEliminatedPlayers)}
              className="mr-2"
            />
            <label htmlFor="showEliminatedPlayers">Show eliminated players</label>
          </div>
        </div>
      </div>
      
      <h1 className="text-2xl font-bold">Table Assignments</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tables.map(table => (
          <div key={table.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="font-semibold">{table.name}</h2>
            </div>
            
            <div className="p-4">
              {/* Visual table representation */}
              <div 
                className="relative w-full h-64 mb-6 rounded-full"
                style={{
                  borderRadius: '50% / 30%',
                  backgroundColor: tableColors.feltColor,
                  border: `12px solid ${tableColors.railColor}`,
                  position: 'relative'
                }}
              >
                {table.seats.map(seat => {
                  if (!seat.player) return null;
                  
                  const position = calculateSeatPosition(seat.seatNumber, 8);
                  
                  return (
                    <div
                      key={seat.seatNumber}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: position.left,
                        top: position.top
                      }}
                    >
                      <div 
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          seat.status === 'active' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {seat.seatNumber}
                      </div>
                      <div className="text-center mt-1 text-sm font-medium">
                        {seat.player.name}
                        {seat.player.isDealer && <span className="text-yellow-500"> (D)</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Tabular representation */}
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Seat</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Player</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filterSeats(table.seats).map(seat => (
                    <tr key={seat.seatNumber}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {seat.seatNumber}{seat.player?.isDealer && '(D)'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {seat.player ? seat.player.name : '(Open)'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          seat.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : seat.status === 'eliminated'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {seat.status.charAt(0).toUpperCase() + seat.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
