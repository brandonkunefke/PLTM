'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NewTournament() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [buyInAmount, setBuyInAmount] = useState(50);
  const [dealerBuyInAmount, setDealerBuyInAmount] = useState(25);
  const [rebuyAmount, setRebuyAmount] = useState(50);
  const [addonAmount, setAddonAmount] = useState(50);
  const [blindStructure, setBlindStructure] = useState(1); // Default to first structure
  
  // Format today's date as YYYY-MM-DD for the date input default
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setDate(formattedDate);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // This will be implemented in the tournament management features step
    console.log('Creating tournament:', { name, date, buyInAmount, dealerBuyInAmount, rebuyAmount, addonAmount, blindStructure });
    // Redirect to tournament setup page (to be implemented)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/tournaments" className="text-blue-600 hover:text-blue-800 mr-2">
          ← Back to Tournaments
        </Link>
        <h1 className="text-2xl font-bold">Create New Tournament</h1>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Tournament Details</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Tournament Name</label>
            <input 
              type="text" 
              id="name" 
              className="form-input" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="date" className="form-label">Date</label>
            <input 
              type="date" 
              id="date" 
              className="form-input" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="buyInAmount" className="form-label">Buy-in Amount ($)</label>
              <input 
                type="number" 
                id="buyInAmount" 
                className="form-input" 
                value={buyInAmount} 
                onChange={(e) => setBuyInAmount(Number(e.target.value))} 
                min="0" 
                step="5" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dealerBuyInAmount" className="form-label">Dealer Buy-in Amount ($)</label>
              <input 
                type="number" 
                id="dealerBuyInAmount" 
                className="form-input" 
                value={dealerBuyInAmount} 
                onChange={(e) => setDealerBuyInAmount(Number(e.target.value))} 
                min="0" 
                step="5" 
                required 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="rebuyAmount" className="form-label">Rebuy Amount ($)</label>
              <input 
                type="number" 
                id="rebuyAmount" 
                className="form-input" 
                value={rebuyAmount} 
                onChange={(e) => setRebuyAmount(Number(e.target.value))} 
                min="0" 
                step="5" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="addonAmount" className="form-label">Add-on Amount ($)</label>
              <input 
                type="number" 
                id="addonAmount" 
                className="form-input" 
                value={addonAmount} 
                onChange={(e) => setAddonAmount(Number(e.target.value))} 
                min="0" 
                step="5" 
                required 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="blindStructure" className="form-label">Blind Structure</label>
            <select 
              id="blindStructure" 
              className="form-select" 
              value={blindStructure} 
              onChange={(e) => setBlindStructure(Number(e.target.value))} 
              required
            >
              <option value="1">Standard Tournament (20-minute levels)</option>
              <option value="2">Turbo Tournament (10-minute levels)</option>
              <option value="3">Deep Stack Tournament (30-minute levels)</option>
            </select>
          </div>
          
          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors"
            >
              Create Tournament
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
