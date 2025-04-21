import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Poker Tournament Manager</h2>
        <p className="mb-4">
          Welcome to the Poker Tournament Manager application. Manage Texas Hold'em tournaments 
          with up to 27 players, track buy-ins and payouts, and keep season-long statistics.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Link 
            href="/tournaments" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors"
          >
            Tournaments
          </Link>
          <Link 
            href="/players" 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors"
          >
            Players
          </Link>
          <Link 
            href="/season" 
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors"
          >
            Season Stats
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-bold mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Link 
              href="/tournaments/new" 
              className="block bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-3 px-4 rounded transition-colors"
            >
              Create New Tournament
            </Link>
            <Link 
              href="/players/new" 
              className="block bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-3 px-4 rounded transition-colors"
            >
              Add New Player
            </Link>
            <Link 
              href="/blinds/templates" 
              className="block bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold py-3 px-4 rounded transition-colors"
            >
              Manage Blind Structures
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-bold mb-3">Recent Tournaments</h3>
          <p className="text-gray-500 italic">No recent tournaments found.</p>
          <div className="mt-4">
            <Link 
              href="/tournaments" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Tournaments →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-bold mb-3">Season Leaderboard</h3>
        <p className="text-gray-500 italic">No season data available.</p>
        <div className="mt-4">
          <Link 
            href="/season" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Full Leaderboard →
          </Link>
        </div>
      </section>
    </div>
  );
}
