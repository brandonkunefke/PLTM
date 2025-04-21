import { executeQuery, executeQuerySingle, executeNonQuery, executeTransaction } from '../db';

export interface Tournament {
  id: number;
  name: string;
  date: string;
  status: 'setup' | 'running' | 'paused' | 'completed';
  buy_in_amount: number;
  dealer_buy_in_amount: number;
  rebuy_amount: number;
  addon_amount: number;
  current_blind_level: number;
  clock_time_remaining: number;
  created_at: string;
  updated_at: string;
}

export interface BlindStructure {
  id: number;
  name: string;
  description: string;
  is_template: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlindLevel {
  id: number;
  structure_id: number;
  level_number: number;
  small_blind: number;
  big_blind: number;
  ante: number;
  duration: number;
}

export async function getAllTournaments(): Promise<Tournament[]> {
  const result = await executeQuery(
    'SELECT * FROM tournaments ORDER BY date DESC'
  );
  return result?.results || [];
}

export async function getTournamentById(id: number): Promise<Tournament | null> {
  const result = await executeQuerySingle(
    'SELECT * FROM tournaments WHERE id = ?',
    [id]
  );
  return result || null;
}

export async function createTournament(tournament: Omit<Tournament, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const result = await executeNonQuery(
    `INSERT INTO tournaments 
     (name, date, status, buy_in_amount, dealer_buy_in_amount, rebuy_amount, addon_amount, current_blind_level, clock_time_remaining) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      tournament.name,
      tournament.date,
      tournament.status,
      tournament.buy_in_amount,
      tournament.dealer_buy_in_amount,
      tournament.rebuy_amount,
      tournament.addon_amount,
      tournament.current_blind_level,
      tournament.clock_time_remaining
    ]
  );
  return result?.meta?.last_row_id || 0;
}

export async function updateTournament(id: number, tournament: Partial<Tournament>): Promise<boolean> {
  // Build dynamic update query based on provided fields
  const fields: string[] = [];
  const values: any[] = [];

  Object.entries(tournament).forEach(([key, value]) => {
    if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (fields.length === 0) return false;

  // Add updated_at timestamp
  fields.push('updated_at = CURRENT_TIMESTAMP');
  
  // Add id to values array
  values.push(id);

  const result = await executeNonQuery(
    `UPDATE tournaments SET ${fields.join(', ')} WHERE id = ?`,
    values
  );

  return result?.meta?.changes > 0;
}

export async function deleteTournament(id: number): Promise<boolean> {
  const result = await executeNonQuery(
    'DELETE FROM tournaments WHERE id = ?',
    [id]
  );
  return result?.meta?.changes > 0;
}

export async function getAllBlindStructures(): Promise<BlindStructure[]> {
  const result = await executeQuery(
    'SELECT * FROM blind_structures ORDER BY name'
  );
  return result?.results || [];
}

export async function getBlindStructureById(id: number): Promise<BlindStructure | null> {
  const result = await executeQuerySingle(
    'SELECT * FROM blind_structures WHERE id = ?',
    [id]
  );
  return result || null;
}

export async function getBlindLevelsByStructureId(structureId: number): Promise<BlindLevel[]> {
  const result = await executeQuery(
    'SELECT * FROM blind_levels WHERE structure_id = ? ORDER BY level_number',
    [structureId]
  );
  return result?.results || [];
}

export async function createBlindStructure(structure: Omit<BlindStructure, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const result = await executeNonQuery(
    `INSERT INTO blind_structures 
     (name, description, is_template) 
     VALUES (?, ?, ?)`,
    [
      structure.name,
      structure.description,
      structure.is_template
    ]
  );
  return result?.meta?.last_row_id || 0;
}

export async function createBlindLevel(level: Omit<BlindLevel, 'id'>): Promise<number> {
  const result = await executeNonQuery(
    `INSERT INTO blind_levels 
     (structure_id, level_number, small_blind, big_blind, ante, duration) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      level.structure_id,
      level.level_number,
      level.small_blind,
      level.big_blind,
      level.ante,
      level.duration
    ]
  );
  return result?.meta?.last_row_id || 0;
}

export async function copyBlindStructure(sourceId: number, newName: string, description: string): Promise<number> {
  // Get source structure
  const sourceStructure = await getBlindStructureById(sourceId);
  if (!sourceStructure) return 0;

  // Get source levels
  const sourceLevels = await getBlindLevelsByStructureId(sourceId);
  
  // Create new structure
  const newStructureId = await createBlindStructure({
    name: newName,
    description: description,
    is_template: false
  });
  
  // Copy all levels to new structure
  const levelInserts = sourceLevels.map(level => ({
    sql: `INSERT INTO blind_levels 
          (structure_id, level_number, small_blind, big_blind, ante, duration) 
          VALUES (?, ?, ?, ?, ?, ?)`,
    params: [
      newStructureId,
      level.level_number,
      level.small_blind,
      level.big_blind,
      level.ante,
      level.duration
    ]
  }));
  
  await executeTransaction(levelInserts);
  
  return newStructureId;
}

export async function updateTournamentStatus(id: number, status: Tournament['status'], clockTimeRemaining?: number): Promise<boolean> {
  const updates: Partial<Tournament> = { status };
  
  if (clockTimeRemaining !== undefined) {
    updates.clock_time_remaining = clockTimeRemaining;
  }
  
  return await updateTournament(id, updates);
}

export async function updateTournamentBlindLevel(id: number, level: number, clockTimeRemaining: number): Promise<boolean> {
  return await updateTournament(id, {
    current_blind_level: level,
    clock_time_remaining: clockTimeRemaining
  });
}

export async function getTournamentWithCurrentBlindLevel(id: number): Promise<any | null> {
  const tournament = await getTournamentById(id);
  if (!tournament) return null;
  
  // Get the blind structure associated with this tournament
  // For now, we'll use a hardcoded structure ID of 1 (Standard Tournament)
  // In a real implementation, we would store the structure_id in the tournaments table
  const structureId = 1;
  
  // Get the current blind level
  const blindLevels = await getBlindLevelsByStructureId(structureId);
  const currentLevel = blindLevels.find(level => level.level_number === tournament.current_blind_level);
  
  return {
    ...tournament,
    currentLevel
  };
}
