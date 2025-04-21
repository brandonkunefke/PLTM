// Test player management operations
import { 
  getAllPlayers, 
  getPlayerById, 
  createPlayer, 
  updatePlayer, 
  deletePlayer,
  getDealers
} from '../lib/models/player';

describe('Player Management', () => {
  let testPlayerId;
  
  // Create a test player before all tests
  beforeAll(async () => {
    testPlayerId = await createPlayer({
      name: 'Test Player',
      email: 'test@example.com',
      phone: '555-1234',
      is_dealer: true,
      notes: 'Test player for unit tests'
    });
    expect(testPlayerId).toBeGreaterThan(0);
  });
  
  // Clean up after all tests
  afterAll(async () => {
    if (testPlayerId) {
      await deletePlayer(testPlayerId);
    }
  });
  
  test('Can get all players', async () => {
    const players = await getAllPlayers();
    expect(players).not.toBeNull();
    expect(Array.isArray(players)).toBe(true);
    expect(players.length).toBeGreaterThan(0);
  });
  
  test('Can get player by ID', async () => {
    const player = await getPlayerById(testPlayerId);
    expect(player).not.toBeNull();
    expect(player.id).toBe(testPlayerId);
    expect(player.name).toBe('Test Player');
    expect(player.email).toBe('test@example.com');
    expect(player.is_dealer).toBe(true);
  });
  
  test('Can update player', async () => {
    const success = await updatePlayer(testPlayerId, {
      name: 'Updated Test Player',
      email: 'updated@example.com'
    });
    expect(success).toBe(true);
    
    const updatedPlayer = await getPlayerById(testPlayerId);
    expect(updatedPlayer.name).toBe('Updated Test Player');
    expect(updatedPlayer.email).toBe('updated@example.com');
    // Fields not included in the update should remain unchanged
    expect(updatedPlayer.is_dealer).toBe(true);
    expect(updatedPlayer.phone).toBe('555-1234');
  });
  
  test('Can get dealers', async () => {
    const dealers = await getDealers();
    expect(dealers).not.toBeNull();
    expect(Array.isArray(dealers)).toBe(true);
    
    // Our test player should be in the dealers list
    const testDealer = dealers.find(d => d.id === testPlayerId);
    expect(testDealer).not.toBeUndefined();
    expect(testDealer.name).toBe('Updated Test Player');
  });
  
  test('Can delete player', async () => {
    // Create a temporary player to delete
    const tempPlayerId = await createPlayer({
      name: 'Temporary Player',
      is_dealer: false
    });
    expect(tempPlayerId).toBeGreaterThan(0);
    
    // Delete the player
    const success = await deletePlayer(tempPlayerId);
    expect(success).toBe(true);
    
    // Verify the player is gone
    const deletedPlayer = await getPlayerById(tempPlayerId);
    expect(deletedPlayer).toBeNull();
  });
});
