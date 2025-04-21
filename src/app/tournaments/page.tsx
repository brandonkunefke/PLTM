import Link from 'next/link';

export default function Tournaments() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tournaments</h1>
        <Link 
          href="/tournaments/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Create New Tournament
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Tournament List</h2>
        </div>
        
        <div className="p-6">
          <p className="text-gray-500 italic">No tournaments found. Create a new tournament to get started.</p>
        </div>
      </div>
    </div>
  );
}
