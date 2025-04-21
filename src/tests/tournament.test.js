// Test tournament management operations
import { 
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
  getAllBlindStructures,
  getBlindLevelsByStructureId,
  updateTournamentStatus,
  updateTournamentBlindLevel
} from '../lib/models/tournament';

describe('Tournament Management', () => {
  let testTournamentId;
  
  // Create a test tournament before all tests
  beforeAll(async () => {
    testTournamentId = await createTournament({
      name: 'Test Tournament',
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
  });
  
  // Clean up after all tests
  afterAll(async () => {
    if (testTournamentId) {
      await deleteTournament(testTournamentId);
    }
  });
  
  test('Can get all tournaments', async () => {
    const tournaments = await getAllTournaments();
    expect(tournaments).not.toBeNull();
    expect(Array.isArray(tournaments)).toBe(true);
    expect(tournaments.length).toBeGreaterThan(0);
  });
  
  test('Can get tournament by ID', async () => {
    const tournament = await getTournamentById(testTournamentId);
    expect(tournament).not.toBeNull();
    expect(tournament.id).toBe(testTournamentId);
    expect(tournament.name).toBe('Test Tournament');
    expect(tournament.status).toBe('setup');
    expect(tournament.buy_in_amount).toBe(50);
    expect(tournament.dealer_buy_in_amount).toBe(25);
  });
  
  test('Can update tournament', async () => {
    const success = await updateTournament(testTournamentId, {
      name: 'Updated Test Tournament',
      buy_in_amount: 75
    });
    expect(success).toBe(true);
    
    const updatedTournament = await getTournamentById(testTournamentId);
    expect(updatedTournament.name).toBe('Updated Test Tournament');
    expect(updatedTournament.buy_in_amount).toBe(75);
    // Fields not included in the update should remain unchanged
    expect(updatedTournament.dealer_buy_in_amount).toBe(25);
    expect(updatedTournament.status).toBe('setup');
  });
  
  test('Can get blind structures', async () => {
    const structures = await getAllBlindStructures();
    expect(structures).not.toBeNull();
    expect(Array.isArray(structures)).toBe(true);
    expect(structures.length).toBeGreaterThan(0);
  });
  
  test('Can get blind levels for a structure', async () => {
    // Get the first structure
    const structures = await getAllBlindStructures();
    const firstStructure = structures[0];
    
    const levels = await getBlindLevelsByStructureId(firstStructure.id);
    expect(levels).not.toBeNull();
    expect(Array.isArray(levels)).toBe(true);
    expect(levels.length).toBeGreaterThan(0);
    
    // Check level properties
    const firstLevel = levels[0];
    expect(firstLevel.structure_id).toBe(firstStructure.id);
    expect(firstLevel.level_number).toBeGreaterThan(0);
    expect(firstLevel.small_blind).toBeGreaterThan(0);
    expect(firstLevel.big_blind).toBeGreaterThan(0);
    expect(firstLevel.duration).toBeGreaterThan(0);
  });
  
  test('Can update tournament status', async () => {
    const success = await updateTournamentStatus(testTournamentId, 'running', 1200);
    expect(success).toBe(true);
    
    const updatedTournament = await getTournamentById(testTournamentId);
    expect(updatedTournament.status).toBe('running');
    expect(updatedTournament.clock_time_remaining).toBe(1200);
  });
  
  test('Can update tournament blind level', async () => {
    const success = await updateTournamentBlindLevel(testTournamentId, 2, 1200);
    expect(success).toBe(true);
    
    const updatedTournament = await getTournamentById(testTournamentId);
    expect(updatedTournament.current_blind_level).toBe(2);
    expect(updatedTournament.clock_time_remaining).toBe(1200);
  });
});
