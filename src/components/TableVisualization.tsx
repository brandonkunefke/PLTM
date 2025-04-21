'use client';

import { useEffect } from 'react';
import { useTheme } from '@/lib/theme-context';

export default function TableVisualization({ table, players }) {
  const { tableColor, railColor } = useTheme();
  
  // Calculate position along the oval perimeter
  const getPosition = (seatNum, totalSeats) => {
    // Oval dimensions
    const a = 150; // horizontal radius
    const b = 90;  // vertical radius
    
    // Calculate angle based on seat number
    // Seat 1 (dealer) is at the bottom center
    let angle;
    if (seatNum === 1) {
      angle = Math.PI / 2; // Bottom center
    } else {
      // Distribute other seats around the top of the oval
      // Map seat numbers 2-9 to angles from -π/2 to 3π/2
      const seatAngle = ((seatNum - 2) / (totalSeats - 1)) * 2 * Math.PI;
      angle = seatAngle - Math.PI / 2;
    }
    
    // Parametric equations for an oval
    const x = a * Math.cos(angle);
    const y = b * Math.sin(angle);
    
    // Center in the container and adjust for seat size
    return {
      left: `calc(50% + ${x}px - 20px)`,
      top: `calc(50% + ${y}px - 20px)`
    };
  };

  // Set CSS variables for table colors
  useEffect(() => {
    document.documentElement.style.setProperty('--table-felt-color', tableColor);
    document.documentElement.style.setProperty('--table-rail-color', railColor);
  }, [tableColor, railColor]);

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-2">Table {table.table_number}</h3>
      
      <div className="relative h-64 w-full">
        {/* Improved oval table with felt texture using theme variables */}
        <div className="absolute inset-0 mx-auto w-[300px] h-[180px] rounded-[50%] border-[12px] poker-table"></div>
        
        {/* Seat positions */}
        {Array.from({ length: 9 }, (_, i) => i + 1).map(seatNum => {
          const player = players.find(p => p.seat_number === seatNum);
          const isDealer = player && player.is_dealer;
          const position = getPosition(seatNum, 9);
          
          return (
            <div 
              key={seatNum}
              className={`table-seat ${player ? 'occupied' : 'empty'} ${isDealer ? 'dealer' : ''}`}
              style={{
                left: position.left,
                top: position.top,
                zIndex: 10
              }}
            >
              {seatNum}
            </div>
          );
        })}
      </div>
      
      {/* Player list */}
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {players.map(player => (
              <tr key={player.player_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {player.seat_number}{player.is_dealer ? '(D)' : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {player.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    player.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {player.status === 'active' ? 'Active' : 'Eliminated'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
