// Test database connection and operations
import { getDatabase, executeQuery, executeQuerySingle, executeNonQuery } from '../lib/db';

describe('Database Connection', () => {
  test('Database connection is established', async () => {
    const db = getDatabase();
    expect(db).not.toBeNull();
  });

  test('Can execute a simple query', async () => {
    const result = await executeQuery('SELECT 1 as test');
    expect(result).not.toBeNull();
    expect(result.results).toHaveLength(1);
    expect(result.results[0].test).toBe(1);
  });

  test('Can execute a query with parameters', async () => {
    const name = 'Test Player';
    const result = await executeNonQuery(
      'INSERT INTO players (name, is_dealer) VALUES (?, ?)',
      [name, false]
    );
    expect(result).not.toBeNull();
    expect(result.meta.last_row_id).toBeGreaterThan(0);

    const player = await executeQuerySingle(
      'SELECT * FROM players WHERE name = ?',
      [name]
    );
    expect(player).not.toBeNull();
    expect(player.name).toBe(name);

    // Clean up
    await executeNonQuery(
      'DELETE FROM players WHERE name = ?',
      [name]
    );
  });
});
