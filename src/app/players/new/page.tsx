'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPlayerForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isDealer, setIsDealer] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email: email || null,
          phone: phone || null,
          is_dealer: isDealer,
          notes: notes || null
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create player');
      }
      
      // Redirect to player list on success
      router.push('/players');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/players" className="text-blue-600 hover:text-blue-800 mr-2">
          ← Back to Players
        </Link>
        <h1 className="text-2xl font-bold">Add New Player</h1>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Player Information</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input 
              type="text" 
              id="name" 
              className="form-input" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="form-input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                className="form-input" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="isDealer" 
                className="mr-2" 
                checked={isDealer} 
                onChange={(e) => setIsDealer(e.target.checked)} 
                disabled={loading}
              />
              <label htmlFor="isDealer" className="form-label m-0">This player is a dealer</label>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Dealers may have a reduced buy-in amount and will be assigned to tables first.
            </p>
          </div>
          
          <div className="form-group">
            <label htmlFor="notes" className="form-label">Notes</label>
            <textarea 
              id="notes" 
              className="form-input" 
              rows={3} 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              disabled={loading}
            />
          </div>
          
          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors"
              disabled={loading}
            >
              {loading ? 'Adding Player...' : 'Add Player'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
