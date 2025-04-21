import { executeQuery, executeQuerySingle, executeNonQuery } from '../db';

export interface Table {
  id: number;
  tournament_id: number;
  table_number: number;
  max_seats: number;
}

export interface TableAssignment {
  id: number;
  tournament_id: number;
  table_id: number;
  player_id: number;
  seat_number: number;
  is_current: boolean;
  created_at: string;
}

export async function getTablesByTournamentId(tournamentId: number): Promise<Table[]> {
  const result = await executeQuery(
    'SELECT * FROM tables WHERE tournament_id = ? ORDER BY table_number',
    [tournamentId]
  );
  return result?.results || [];
}

export async function createTable(table: Omit<Table, 'id'>): Promise<number> {
  const result = await executeNonQuery(
    `INSERT INTO tables 
     (tournament_id, table_number, max_seats) 
     VALUES (?, ?, ?)`,
    [
      table.tournament_id,
      table.table_number,
      table.max_seats
    ]
  );
  return result?.meta?.last_row_id || 0;
}

export async function deleteTable(id: number): Promise<boolean> {
  const result = await executeNonQuery(
    'DELETE FROM tables WHERE id = ?',
    [id]
  );
  return result?.meta?.changes > 0;
}

export async function getCurrentTableAssignments(tournamentId: number): Promise<any[]> {
  const result = await executeQuery(
    `SELECT ta.*, t.table_number, p.name as player_name, p.is_dealer, tp.is_dealer as tournament_dealer
     FROM table_assignments ta
     JOIN tables t ON ta.table_id = t.id
     JOIN players p ON ta.player_id = p.id
     JOIN tournament_players tp ON ta.tournament_id = tp.tournament_id AND ta.player_id = tp.player_id
     WHERE ta.tournament_id = ? AND ta.is_current = 1 AND tp.is_active = 1
     ORDER BY t.table_number, ta.seat_number`,
    [tournamentId]
  );
  return result?.results || [];
}

export async function getTableAssignmentsByTableId(tableId: number): Promise<any[]> {
  const result = await executeQuery(
    `SELECT ta.*, p.name as player_name, p.is_dealer, tp.is_dealer as tournament_dealer
     FROM table_assignments ta
     JOIN players p ON ta.player_id = p.id
     JOIN tournament_players tp ON ta.tournament_id = tp.tournament_id AND ta.player_id = tp.player_id
     WHERE ta.table_id = ? AND ta.is_current = 1 AND tp.is_active = 1
     ORDER BY ta.seat_number`,
    [tableId]
  );
  return result?.results || [];
}

export async function assignPlayerToTable(
  tournamentId: number,
  tableId: number,
  playerId: number,
  seatNumber: number
): Promise<number> {
  // First, mark any existing assignments for this player as not current
  await executeNonQuery(
    `UPDATE table_assignments 
     SET is_current = 0 
     WHERE tournament_id = ? AND player_id = ? AND is_current = 1`,
    [tournamentId, playerId]
  );
  
  // Then create the new assignment
  const result = await executeNonQuery(
    `INSERT INTO table_assignments 
     (tournament_id, table_id, player_id, seat_number, is_current) 
     VALUES (?, ?, ?, ?, 1)`,
    [tournamentId, tableId, playerId, seatNumber]
  );
  
  return result?.meta?.last_row_id || 0;
}

export async function removePlayerFromTable(
  tournamentId: number,
  playerId: number
): Promise<boolean> {
  const result = await executeNonQuery(
    `UPDATE table_assignments 
     SET is_current = 0 
     WHERE tournament_id = ? AND player_id = ? AND is_current = 1`,
    [tournamentId, playerId]
  );
  
  return result?.meta?.changes > 0;
}

export async function generateRandomTableAssignments(
  tournamentId: number,
  maxPlayersPerTable: number = 9
): Promise<boolean> {
  try {
    // Get all active players in the tournament
    const result = await executeQuery(
      `SELECT p.id, tp.is_dealer
       FROM players p
       JOIN tournament_players tp ON p.id = tp.player_id
       WHERE tp.tournament_id = ? AND tp.is_active = 1
       ORDER BY tp.is_dealer DESC, RANDOM()`,
      [tournamentId]
    );
    
    const players = result?.results || [];
    if (players.length === 0) return false;
    
    // Calculate how many tables we need
    const numTables = Math.ceil(players.length / maxPlayersPerTable);
    
    // Delete existing tables for this tournament
    await executeNonQuery(
      'DELETE FROM tables WHERE tournament_id = ?',
      [tournamentId]
    );
    
    // Create new tables
    const tableIds: number[] = [];
    for (let i = 1; i <= numTables; i++) {
      const tableResult = await createTable({
        tournament_id: tournamentId,
        table_number: i,
        max_seats: maxPlayersPerTable
      });
      tableIds.push(tableResult);
    }
    
    // Mark all existing assignments as not current
    await executeNonQuery(
      `UPDATE table_assignments 
       SET is_current = 0 
       WHERE tournament_id = ?`,
      [tournamentId]
    );
    
    // Separate dealers and regular players
    const dealers = players.filter(p => p.is_dealer);
    const regularPlayers = players.filter(p => !p.is_dealer);
    
    // Distribute dealers first, one per table if possible
    for (let i = 0; i < Math.min(dealers.length, numTables); i++) {
      await assignPlayerToTable(
        tournamentId,
        tableIds[i],
        dealers[i].id,
        1 // Seat 1 is typically the dealer position
      );
    }
    
    // Distribute remaining dealers if any
    for (let i = numTables; i < dealers.length; i++) {
      const tableIndex = i % numTables;
      const tableAssignments = await getTableAssignmentsByTableId(tableIds[tableIndex]);
      const nextSeat = tableAssignments.length + 1;
      
      await assignPlayerToTable(
        tournamentId,
        tableIds[tableIndex],
        dealers[i].id,
        nextSeat
      );
    }
    
    // Distribute regular players evenly across tables
    let tableIndex = 0;
    for (const player of regularPlayers) {
      const tableAssignments = await getTableAssignmentsByTableId(tableIds[tableIndex]);
      const nextSeat = tableAssignments.length + 1;
      
      if (nextSeat <= maxPlayersPerTable) {
        await assignPlayerToTable(
          tournamentId,
          tableIds[tableIndex],
          player.id,
          nextSeat
        );
      }
      
      // Move to next table
      tableIndex = (tableIndex + 1) % numTables;
    }
    
    return true;
  } catch (error) {
    console.error('Error generating table assignments:', error);
    return false;
  }
}

export async function rebalanceTables(tournamentId: number): Promise<boolean> {
  try {
    // Get all tables for this tournament
    const tables = await getTablesByTournamentId(tournamentId);
    if (tables.length <= 1) return false; // Nothing to rebalance
    
    // Get all active players
    const activePlayers = await executeQuery(
      `SELECT p.id, tp.is_dealer
       FROM players p
       JOIN tournament_players tp ON p.id = tp.player_id
       WHERE tp.tournament_id = ? AND tp.is_active = 1
       ORDER BY tp.is_dealer DESC, RANDOM()`,
      [tournamentId]
    );
    
    const players = activePlayers?.results || [];
    const totalPlayers = players.length;
    
    // If we have very few players, we might need to reduce the number of tables
    const maxPlayersPerTable = tables[0].max_seats;
    const optimalTableCount = Math.ceil(totalPlayers / maxPlayersPerTable);
    
    if (optimalTableCount < tables.length) {
      // We need to reduce the number of tables
      // Keep the first 'optimalTableCount' tables, remove the rest
      const tablesToKeep = tables.slice(0, optimalTableCount);
      const tablesToRemove = tables.slice(optimalTableCount);
      
      // Delete the tables we don't need
      for (const table of tablesToRemove) {
        await deleteTable(table.id);
      }
      
      // Now we'll reassign all players to the remaining tables
      return await generateRandomTableAssignments(tournamentId, maxPlayersPerTable);
    }
    
    // Calculate ideal players per table
    const idealPlayersPerTable = Math.floor(totalPlayers / tables.length);
    const extraPlayers = totalPlayers % tables.length;
    
    // Mark all existing assignments as not current
    await executeNonQuery(
      `UPDATE table_assignments 
       SET is_current = 0 
       WHERE tournament_id = ?`,
      [tournamentId]
    );
    
    // Separate dealers and regular players
    const dealers = players.filter(p => p.is_dealer);
    const regularPlayers = players.filter(p => !p.is_dealer);
    
    // Distribute dealers first, one per table if possible
    for (let i = 0; i < Math.min(dealers.length, tables.length); i++) {
      await assignPlayerToTable(
        tournamentId,
        tables[i].id,
        dealers[i].id,
        1 // Seat 1 is typically the dealer position
      );
    }
    
    // Distribute remaining dealers if any
    for (let i = tables.length; i < dealers.length; i++) {
      const tableIndex = i % tables.length;
      const tableAssignments = await getTableAssignmentsByTableId(tables[tableIndex].id);
      const nextSeat = tableAssignments.length + 1;
      
      await assignPlayerToTable(
        tournamentId,
        tables[tableIndex].id,
        dealers[i].id,
        nextSeat
      );
    }
    
    // Distribute regular players evenly across tables
    let playerIndex = 0;
    for (let i = 0; i < tables.length; i++) {
      const tableAssignments = await getTableAssignmentsByTableId(tables[i].id);
      const dealersAtTable = tableAssignments.length;
      
      // Calculate how many players this table should have
      let targetPlayerCount = idealPlayersPerTable;
      if (i < extraPlayers) targetPlayerCount++; // Distribute extra players
      
      // Adjust for dealers already at the table
      const regularPlayersNeeded = targetPlayerCount - dealersAtTable;
      
      // Add regular players to this table
      for (let j = 0; j < regularPlayersNeeded && playerIndex < regularPlayers.length; j++) {
        const nextSeat = tableAssignments.length + j + 1;
        
        await assignPlayerToTable(
          tournamentId,
          tables[i].id,
          regularPlayers[playerIndex].id,
          nextSeat
        );
        
        playerIndex++;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error rebalancing tables:', error);
    return false;
  }
}
