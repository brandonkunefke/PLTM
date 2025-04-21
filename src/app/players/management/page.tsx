'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PlayerManagement() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDealers, setFilterDealers] = useState(false);

  useEffect(() => {
    // Fetch players from API
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/players');
        if (!response.ok) {
          throw new Error('Failed to fetch players');
        }
        const data = await response.json();
        setPlayers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (player.email && player.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterDealers ? player.is_dealer : true;
    return matchesSearch && matchesFilter;
  });

  const handleDeletePlayer = async (id) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        const response = await fetch(`/api/players/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete player');
        }
        
        // Remove player from state
        setPlayers(players.filter(player => player.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading players...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Player Management</h1>
        <Link 
          href="/players/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Add New Player
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Player Database</h2>
          <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search players..."
                className="form-input w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="filterDealers"
                className="mr-2"
                checked={filterDealers}
                onChange={(e) => setFilterDealers(e.target.checked)}
              />
              <label htmlFor="filterDealers">Show dealers only</label>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="player-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Dealer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map(player => (
                  <tr key={player.id}>
                    <td className="font-medium text-gray-900">{player.name}</td>
                    <td>{player.email || '-'}</td>
                    <td>{player.phone || '-'}</td>
                    <td>{player.is_dealer ? 'Yes' : 'No'}</td>
                    <td>
                      <div className="flex space-x-2">
                        <Link 
                          href={`/players/${player.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </Link>
                        <Link 
                          href={`/players/${player.id}/edit`}
                          className="text-green-600 hover:text-green-800"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeletePlayer(player.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500 italic">
                    {searchTerm || filterDealers ? 'No players match your search criteria.' : 'No players found. Add a new player to get started.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
