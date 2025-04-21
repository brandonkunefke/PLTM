'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/theme-context';

export default function TournamentReports({ tournamentId }) {
  const { theme } = useTheme();
  const [reportType, setReportType] = useState('summary');
  const [loading, setLoading] = useState(false);
  const [tournamentData, setTournamentData] = useState({
    id: 1,
    name: 'Friday Night Poker',
    date: '2025-04-19',
    totalPlayers: 27,
    activePlayers: 0,
    eliminatedPlayers: 27,
    buyInAmount: 50,
    dealerBuyInAmount: 25,
    pointWinnerContribution: 2,
    championshipGameContribution: 3,
    isChampionshipGame: false,
    totalBuyIns: 27,
    totalRebuys: 15,
    totalAddons: 8,
    totalCollected: 2650,
    prizePool: 2120,
    pointWinnerBank: 108,
    championshipGameBank: 162,
    seasonPointWinnerBank: 432,
    seasonChampionshipGameBank: 648,
    players: [
      { id: 1, name: 'Jenny', isDealer: true, position: 1, points: 25, buyIn: 25, rebuys: 1, addons: 0, winnings: 1060 },
      { id: 2, name: 'JohnnyChan', isDealer: false, position: 2, points: 18, buyIn: 50, rebuys: 0, addons: 1, winnings: 636 },
      { id: 3, name: 'HuckSeed', isDealer: false, position: 3, points: 15, buyIn: 50, rebuys: 1, addons: 0, winnings: 424 },
      { id: 4, name: 'Mark', isDealer: false, position: 4, points: 12, buyIn: 50, rebuys: 0, addons: 0, winnings: 0 },
      { id: 5, name: 'Helmuth', isDealer: false, position: 5, points: 10, buyIn: 50, rebuys: 1, addons: 1, winnings: 0 },
      { id: 6, name: 'AJS', isDealer: false, position: 6, points: 8, buyIn: 50, rebuys: 0, addons: 0, winnings: 0 },
      { id: 7, name: 'Joe K', isDealer: false, position: 7, points: 6, buyIn: 50, rebuys: 1, addons: 0, winnings: 0 },
      { id: 8, name: 'DevilFish', isDealer: true, position: 8, points: 4, buyIn: 25, rebuys: 2, addons: 1, winnings: 0 },
      { id: 9, name: 'Bridget P', isDealer: false, position: 9, points: 2, buyIn: 50, rebuys: 0, addons: 0, winnings: 0 },
      // Additional players would be listed here
    ],
    seasonStandings: [
      { id: 1, name: 'Jenny', totalPoints: 87, tournamentsPlayed: 4, bestFinish: 1 },
      { id: 3, name: 'HuckSeed', totalPoints: 76, tournamentsPlayed: 4, bestFinish: 1 },
      { id: 5, name: 'Helmuth', totalPoints: 72, tournamentsPlayed: 4, bestFinish: 2 },
      { id: 2, name: 'JohnnyChan', totalPoints: 65, tournamentsPlayed: 3, bestFinish: 2 },
      { id: 4, name: 'Mark', totalPoints: 58, tournamentsPlayed: 4, bestFinish: 3 },
      { id: 6, name: 'AJS', totalPoints: 45, tournamentsPlayed: 4, bestFinish: 4 },
      { id: 7, name: 'Joe K', totalPoints: 42, tournamentsPlayed: 3, bestFinish: 3 },
      { id: 8, name: 'DevilFish', totalPoints: 38, tournamentsPlayed: 4, bestFinish: 5 },
      { id: 9, name: 'Bridget P', totalPoints: 32, tournamentsPlayed: 3, bestFinish: 4 },
      // Additional season standings would be listed here
    ]
  });
  
  // Generate PDF report
  const generatePDF = () => {
    setLoading(true);
    // In a real implementation, this would generate a PDF
    setTimeout(() => {
      setLoading(false);
      alert('PDF report generated successfully!');
    }, 1500);
  };
  
  // Export to CSV
  const exportToCSV = () => {
    setLoading(true);
    // In a real implementation, this would export to CSV
    setTimeout(() => {
      setLoading(false);
      alert('CSV export completed successfully!');
    }, 1500);
  };
  
  // Email report
  const emailReport = () => {
    setLoading(true);
    // In a real implementation, this would email the report
    setTimeout(() => {
      setLoading(false);
      alert('Report emailed successfully!');
    }, 1500);
  };
  
  // Render tournament summary report
  const renderSummaryReport = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="font-semibold">Tournament Summary</h2>
          </div>
          
          <div className="p-4">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tournament Name</dt>
                <dd className="mt-1 text-lg">{tournamentData.name}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</dt>
                <dd className="mt-1 text-lg">{tournamentData.date}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Players</dt>
                <dd className="mt-1 text-lg">{tournamentData.totalPlayers}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tournament Type</dt>
                <dd className="mt-1 text-lg">
                  {tournamentData.isChampionshipGame ? 'Championship Game' : 'Regular Tournament'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="font-semibold">Financial Summary</h2>
          </div>
          
          <div className="p-4">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Buy-ins</dt>
                <dd className="mt-1 text-lg">{tournamentData.totalBuyIns}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Rebuys</dt>
                <dd className="mt-1 text-lg">{tournamentData.totalRebuys}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Add-ons</dt>
                <dd className="mt-1 text-lg">{tournamentData.totalAddons}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Prize Pool</dt>
                <dd className="mt-1 text-lg">${tournamentData.prizePool}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Point Winner Bank Contribution</dt>
                <dd className="mt-1 text-lg">${tournamentData.pointWinnerBank}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Championship Game Bank Contribution</dt>
                <dd className="mt-1 text-lg">${tournamentData.championshipGameBank}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Season Point Winner Bank Total</dt>
                <dd className="mt-1 text-lg">${tournamentData.seasonPointWinnerBank}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Season Championship Game Bank Total</dt>
                <dd className="mt-1 text-lg">${tournamentData.seasonChampionshipGameBank}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="font-semibold">Final Results</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Player</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Buy-in</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rebuys</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Add-ons</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Winnings</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {tournamentData.players
                  .sort((a, b) => a.position - b.position)
                  .map(player => (
                    <tr key={player.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{player.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {player.name}
                        {player.isDealer && <span className="ml-1 text-yellow-500">(Dealer)</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{player.points}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${player.buyIn}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{player.rebuys}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{player.addons}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {player.winnings > 0 ? `$${player.winnings}` : '-'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  // Render points report
  const renderPointsReport = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="font-semibold">Tournament Points Summary</h2>
          </div>
          
          <div className="p-4">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tournament Name</dt>
                <dd className="mt-1 text-lg">{tournamentData.name}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</dt>
                <dd className="mt-1 text-lg">{tournamentData.date}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Point Winner Bank Contribution</dt>
                <dd className="mt-1 text-lg">${tournamentData.pointWinnerBank}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Season Point Winner Bank Total</dt>
                <dd className="mt-1 text-lg">${tournamentData.seasonPointWinnerBank}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="font-semibold">Tournament Points Distribution</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Player</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Participation Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Position Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rebuy Penalty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Points</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {tournamentData.players
                  .sort((a, b) => a.position - b.position)
                  .map(player => {
                    // Calculate point breakdown (in a real implementation, this would come from the database)
                    const participationPoints = 5;
                    const positionPoints = Math.max(0, 30 - ((player.position - 1) * 3));
                    const rebuyPenalty = player.rebuys * 2;
                    
                    return (
                      <tr key={player.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{player.position}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {player.name}
                          {player.isDealer && <span className="ml-1 text-yellow-500">(Dealer)</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{participationPoints}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{positionPoints}</td>
                        <td className="px-6 py-4 whitespace-nowrap">-{rebuyPenalty}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{player.points}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="font-semibold">Season Standings</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Player</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tournaments Played</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Best Finish</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {tournamentData.seasonStandings
                  .sort((a, b) => b.totalPoints - a.totalPoints)
                  .map((player, index) => (
                    <tr key={player.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{player.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{player.totalPoints}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{player.tournamentsPlayed}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{player.bestFinish}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  // Render bank report
  const renderBankReport = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="font-semibold">Special Banks Summary</h2>
          </div>
          
          <div className="p-4">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tournament Name</dt>
                <dd className="mt-1 text-lg">{tournamentData.name}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</dt>
                <dd className="mt-1 text-lg">{tournamentData.date}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="font-semibold">Point Winner Bank</h2>
            </div>
            
            <div className="p-4">
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Contribution Per Buy-in</dt>
                  <dd className="mt-1 text-lg">${tournamentData.pointWinnerContribution}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Contributions This Tournament</dt>
                  <dd className="mt-1 text-lg">${tournamentData.pointWinnerBank}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Season Total</dt>
                  <dd className="mt-1 text-lg">${tournamentData.seasonPointWinnerBank}</dd>
                </div>
              </dl>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="font-semibold">Championship Game Bank</h2>
            </div>
            
            <div className="p-4">
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Contribution Per Buy-in</dt>
                  <dd className="mt-1 text-lg">${tournamentData.championshipGameContribution}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Contributions This Tournament</dt>
                  <dd className="mt-1 text-lg">${tournamentData.championshipGameBank}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Season Total</dt>
                  <dd className="mt-1 text-lg">${tournamentData.seasonChampionshipGameBank}</dd>
                </div>
                
                {tournamentData.isChampionshipGame && (
                  <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                      This was a Championship Game. The Championship Game bank total was added to this tournament's prize pool.
                    </p>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="font-semibold">Bank Contribution History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tournament</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Point Winner Bank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Championship Game Bank</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {/* Sample tournament history */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Season Opener</td>
                  <td className="px-6 py-4 whitespace-nowrap">2025-01-10</td>
                  <td className="px-6 py-4 whitespace-nowrap">$108</td>
                  <td className="px-6 py-4 whitespace-nowrap">$162</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Valentine's Day Special</td>
                  <td className="px-6 py-4 whitespace-nowrap">2025-02-14</td>
                  <td className="px-6 py-4 whitespace-nowrap">$108</td>
                  <td className="px-6 py-4 whitespace-nowrap">$162</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">St. Patrick's Tournament</td>
                  <td className="px-6 py-4 whitespace-nowrap">2025-03-17</td>
                  <td className="px-6 py-4 whitespace-nowrap">$108</td>
                  <td className="px-6 py-4 whitespace-nowrap">$162</td>
                </tr>
                <tr className="bg-blue-50 dark:bg-blue-900">
                  <td className="px-6 py-4 whitespace-nowrap">{tournamentData.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tournamentData.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${tournamentData.pointWinnerBank}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${tournamentData.championshipGameBank}</td>
                </tr>
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-medium" colSpan="2">Season Totals</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">${tournamentData.seasonPointWinnerBank}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">${tournamentData.seasonChampionshipGameBank}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link href={`/tournaments/${tournamentId}`} className="text-blue-600 hover:text-blue-800">
          ← Back to Tournament
        </Link>
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            onClick={generatePDF}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate PDF'}
          </button>
          <button
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            onClick={exportToCSV}
            disabled={loading}
          >
            {loading ? 'Exporting...' : 'Export CSV'}
          </button>
          <button
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
            onClick={emailReport}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Email Report'}
          </button>
        </div>
      </div>
      
      <h1 className="text-2xl font-bold">Tournament Reports</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700 flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-md ${
              reportType === 'summary'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setReportType('summary')}
          >
            Tournament Summary
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              reportType === 'points'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setReportType('points')}
          >
            Points Report
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              reportType === 'banks'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setReportType('banks')}
          >
            Special Banks Report
          </button>
        </div>
      </div>
      
      {reportType === 'summary' && renderSummaryReport()}
      {reportType === 'points' && renderPointsReport()}
      {reportType === 'banks' && renderBankReport()}
    </div>
  );
}
