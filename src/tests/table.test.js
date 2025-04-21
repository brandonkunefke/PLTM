// Test table assignment operations
import { 
  getTablesByTournamentId,
  createTable,
  getCurrentTableAssignments,
  assignPlayerToTable,
  removePlayerFromTable,
  generateRandomTableAssignments,
  rebalanceTables
} from '../lib/models/table';

import {
  createTournament,
  deleteTournament
} from '../lib/models/tournament';

import {
  createPlayer,
  deletePlayer,
  addPlayerToTournament
} from '../lib/models/player';

describe('Table Management', () => {
  let testTournamentId;
  let testPlayerIds = [];
  let testTableIds = [];
  
  // Create test data before all tests
  beforeAll(async () => {
    // Create a test tournament
    testTournamentId = await createTournament({
      name: 'Table Test Tournament',
      date: new Date().toISOString().split('T')[0],
      status: 'setup',
      buy_in_amount: 50,
      dealer_buy_in_amount: 25,
      rebuy_amount: 50,
      addon_amount: 50,
      current_blind_level: 1,
      clock_time_remaining: 1200
    });
    expect(testTournamentId).toBeGreaterThan(0);
    
    // Create test players (3 dealers, 6 regular players)
    for (let i = 1; i <= 9; i++) {
      const isDealer = i <= 3;
      const playerId = await createPlayer({
        name: `Table Test Player ${i}`,
        is_dealer: isDealer
      });
      expect(playerId).toBeGreaterThan(0);
      testPlayerIds.push(playerId);
      
      // Add player to tournament
      await addPlayerToTournament(testTournamentId, playerId, isDealer);
    }
    
    // Create test tables
    for (let i = 1; i <= 3; i++) {
      const tableId = await createTable({
        tournament_id: testTournamentId,
        table_number: i,
        max_seats: 9
      });
      expect(tableId).toBeGreaterThan(0);
      testTableIds.push(tableId);
    }
  });
  
  // Clean up after all tests
  afterAll(async () => {
    // Delete test players
    for (const playerId of testPlayerIds) {
      await deletePlayer(playerId);
    }
    
    // Delete test tournament (should cascade delete tables and assignments)
    if (testTournamentId) {
      await deleteTournament(testTournamentId);
    }
  });
  
  test('Can get tables by tournament ID', async () => {
    const tables = await getTablesByTournamentId(testTournamentId);
    expect(tables).not.toBeNull();
    expect(Array.isArray(tables)).toBe(true);
    expect(tables.length).toBe(3);
    
    // Check table properties
    const firstTable = tables[0];
    expect(firstTable.tournament_id).toBe(testTournamentId);
    expect(firstTable.table_number).toBe(1);
    expect(firstTable.max_seats).toBe(9);
  });
  
  test('Can assign player to table', async () => {
    const tableId = testTableIds[0];
    const playerId = testPlayerIds[0];
    
    const assignmentId = await assignPlayerToTable(
      testTournamentId,
      tableId,
      playerId,
      1 // Seat 1
    );
    expect(assignmentId).toBeGreaterThan(0);
    
    // Verify assignment
    const assignments = await getCurrentTableAssignments(testTournamentId);
    expect(assignments).not.toBeNull();
    expect(Array.isArray(assignments)).toBe(true);
    expect(assignments.length).toBe(1);
    
    const assignment = assignments[0];
    expect(assignment.tournament_id).toBe(testTournamentId);
    expect(assignment.table_id).toBe(tableId);
    expect(assignment.player_id).toBe(playerId);
    expect(assignment.seat_number).toBe(1);
    expect(assignment.is_current).toBe(1);
  });
  
  test('Can remove player from table', async () => {
    const playerId = testPlayerIds[0];
    
    const success = await removePlayerFromTable(testTournamentId, playerId);
    expect(success).toBe(true);
    
    // Verify player is removed
    const assignments = await getCurrentTableAssignments(testTournamentId);
    expect(assignments).not.toBeNull();
    expect(Array.isArray(assignments)).toBe(true);
    expect(assignments.length).toBe(0);
  });
  
  test('Can generate random table assignments', async () => {
    const success = await generateRandomTableAssignments(testTournamentId);
    expect(success).toBe(true);
    
    // Verify assignments
    const assignments = await getCurrentTableAssignments(testTournamentId);
    expect(assignments).not.toBeNull();
    expect(Array.isArray(assignments)).toBe(true);
    expect(assignments.length).toBe(9); // All 9 players should be assigned
    
    // Check dealer distribution
    const tableAssignments = {};
    for (const assignment of assignments) {
      if (!tableAssignments[assignment.table_id]) {
        tableAssignments[assignment.table_id] = [];
      }
      tableAssignments[assignment.table_id].push(assignment);
    }
    
    // Each table should have at least one dealer if possible
    for (const tableId of testTableIds) {
      const tablePlayers = tableAssignments[tableId] || [];
      const dealersAtTable = tablePlayers.filter(a => a.tournament_dealer).length;
      
      // With 3 dealers and 3 tables, each table should have 1 dealer
      expect(dealersAtTable).toBe(1);
    }
  });
  
  test('Can rebalance tables', async () => {
    // First, remove some players to create imbalance
    await removePlayerFromTable(testTournamentId, testPlayerIds[1]);
    await removePlayerFromTable(testTournamentId, testPlayerIds[2]);
    
    // Rebalance tables
    const success = await rebalanceTables(testTournamentId);
    expect(success).toBe(true);
    
    // Verify balanced assignments
    const assignments = await getCurrentTableAssignments(testTournamentId);
    expect(assignments).not.toBeNull();
    expect(Array.isArray(assignments)).toBe(true);
    
    // Count players per table
    const playerCountByTable = {};
    for (const assignment of assignments) {
      if (!playerCountByTable[assignment.table_id]) {
        playerCountByTable[assignment.table_id] = 0;
      }
      playerCountByTable[assignment.table_id]++;
    }
    
    // Check that tables are balanced (difference of at most 1 player)
    const playerCounts = Object.values(playerCountByTable);
    const minPlayers = Math.min(...playerCounts);
    const maxPlayers = Math.max(...playerCounts);
    expect(maxPlayers - minPlayers).toBeLessThanOrEqual(1);
  });
});
