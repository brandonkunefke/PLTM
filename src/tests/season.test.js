// Test season points tracking operations
import { 
  calculateSeasonPoints,
  getSeasonLeaderboard
} from '../lib/models/player';

import {
  createTournament,
  deleteTournament
} from '../lib/models/tournament';

import {
  createPlayer,
  deletePlayer,
  addPlayerToTournament,
  eliminatePlayer
} from '../lib/models/player';

describe('Season Points Tracking', () => {
  let testTournamentId;
  let testPlayerIds = [];
  const seasonName = 'Test Season 2025';
  
  // Create test data before all tests
  beforeAll(async () => {
    // Create a test tournament
    testTournamentId = await createTournament({
      name: 'Season Points Test Tournament',
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      buy_in_amount: 50,
      dealer_buy_in_amount: 25,
      rebuy_amount: 50,
      addon_amount: 50,
      current_blind_level: 10,
      clock_time_remaining: 0
    });
    expect(testTournamentId).toBeGreaterThan(0);
    
    // Create test players
    for (let i = 1; i <= 9; i++) {
      const isDealer = i <= 3;
      const playerId = await createPlayer({
        name: `Season Test Player ${i}`,
        is_dealer: isDealer
      });
      expect(playerId).toBeGreaterThan(0);
      testPlayerIds.push(playerId);
      
      // Add player to tournament
      await addPlayerToTournament(testTournamentId, playerId, isDealer);
      
      // Add rebuys for some players
      if (i % 3 === 0) {
        // Record 2 rebuys for every third player
        await executeNonQuery(
          `UPDATE tournament_players 
           SET rebuy_count = 2 
           WHERE tournament_id = ? AND player_id = ?`,
          [testTournamentId, playerId]
        );
      } else if (i % 2 === 0) {
        // Record 1 rebuy for every second player
        await executeNonQuery(
          `UPDATE tournament_players 
           SET rebuy_count = 1 
           WHERE tournament_id = ? AND player_id = ?`,
          [testTournamentId, playerId]
        );
      }
      
      // Eliminate players in reverse order (player 9 is 1st place, player 1 is 9th place)
      if (i < 9) { // Leave player 9 as the winner (not eliminated)
        await eliminatePlayer(testTournamentId, playerId, 10 - i);
      }
    }
  });
  
  // Clean up after all tests
  afterAll(async () => {
    // Delete test players
    for (const playerId of testPlayerIds) {
      await deletePlayer(playerId);
    }
    
    // Delete test tournament
    if (testTournamentId) {
      await deleteTournament(testTournamentId);
    }
    
    // Clean up season points
    await executeNonQuery(
      'DELETE FROM season_points WHERE season_name = ?',
      [seasonName]
    );
  });
  
  test('Can calculate season points', async () => {
    const success = await calculateSeasonPoints(
      testTournamentId,
      seasonName,
      5, // participation points
      -1 // rebuy penalty points
    );
    expect(success).toBe(true);
    
    // Verify points calculation
    const leaderboard = await getSeasonLeaderboard(seasonName);
    expect(leaderboard).not.toBeNull();
    expect(Array.isArray(leaderboard)).toBe(true);
    expect(leaderboard.length).toBe(9);
    
    // Check specific players
    // Player 9 (1st place) should have the most points
    const winner = leaderboard.find(p => p.name === 'Season Test Player 9');
    expect(winner).not.toBeUndefined();
    expect(winner.position_points).toBe(20); // 1st place points
    expect(winner.total_points).toBe(25); // 5 participation + 20 position
    
    // Player 8 (2nd place) with 1 rebuy
    const secondPlace = leaderboard.find(p => p.name === 'Season Test Player 8');
    expect(secondPlace).not.toBeUndefined();
    expect(secondPlace.position_points).toBe(15); // 2nd place points
    expect(secondPlace.rebuy_penalty_points).toBe(-1); // 1 rebuy
    expect(secondPlace.total_points).toBe(19); // 5 participation + 15 position - 1 rebuy
    
    // Player 3 (7th place) with 2 rebuys
    const seventhPlace = leaderboard.find(p => p.name === 'Season Test Player 3');
    expect(seventhPlace).not.toBeUndefined();
    expect(seventhPlace.position_points).toBe(3); // 7th place points
    expect(seventhPlace.rebuy_penalty_points).toBe(-2); // 2 rebuys
    expect(seventhPlace.total_points).toBe(6); // 5 participation + 3 position - 2 rebuys
  });
  
  test('Can get season leaderboard', async () => {
    const leaderboard = await getSeasonLeaderboard(seasonName);
    expect(leaderboard).not.toBeNull();
    expect(Array.isArray(leaderboard)).toBe(true);
    expect(leaderboard.length).toBe(9);
    
    // Leaderboard should be sorted by total points (descending)
    for (let i = 0; i < leaderboard.length - 1; i++) {
      expect(leaderboard[i].total_points).toBeGreaterThanOrEqual(leaderboard[i+1].total_points);
    }
  });
});
