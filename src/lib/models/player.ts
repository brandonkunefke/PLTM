import { executeQuery, executeQuerySingle, executeNonQuery, executeTransaction } from '../db';

export interface Player {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  is_dealer: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TournamentPlayer {
  id: number;
  tournament_id: number;
  player_id: number;
  is_active: boolean;
  position: number | null;
  is_dealer: boolean;
  buyin_paid: boolean;
  rebuy_count: number;
  addon_count: number;
}

export async function getAllPlayers(): Promise<Player[]> {
  const result = await executeQuery(
    'SELECT * FROM players ORDER BY name'
  );
  return result?.results || [];
}

export async function getPlayerById(id: number): Promise<Player | null> {
  const result = await executeQuerySingle(
    'SELECT * FROM players WHERE id = ?',
    [id]
  );
  return result || null;
}

export async function createPlayer(player: Omit<Player, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const result = await executeNonQuery(
    `INSERT INTO players 
     (name, email, phone, is_dealer, notes) 
     VALUES (?, ?, ?, ?, ?)`,
    [
      player.name,
      player.email,
      player.phone,
      player.is_dealer ? 1 : 0,
      player.notes
    ]
  );
  return result?.meta?.last_row_id || 0;
}

export async function updatePlayer(id: number, player: Partial<Player>): Promise<boolean> {
  // Build dynamic update query based on provided fields
  const fields: string[] = [];
  const values: any[] = [];

  Object.entries(player).forEach(([key, value]) => {
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
    `UPDATE players SET ${fields.join(', ')} WHERE id = ?`,
    values
  );

  return result?.meta?.changes > 0;
}

export async function deletePlayer(id: number): Promise<boolean> {
  const result = await executeNonQuery(
    'DELETE FROM players WHERE id = ?',
    [id]
  );
  return result?.meta?.changes > 0;
}

export async function getPlayersByTournamentId(tournamentId: number): Promise<any[]> {
  const result = await executeQuery(
    `SELECT p.*, tp.is_active, tp.position, tp.is_dealer as tournament_dealer, 
            tp.buyin_paid, tp.rebuy_count, tp.addon_count
     FROM players p
     JOIN tournament_players tp ON p.id = tp.player_id
     WHERE tp.tournament_id = ?
     ORDER BY p.name`,
    [tournamentId]
  );
  return result?.results || [];
}

export async function getDealers(): Promise<Player[]> {
  const result = await executeQuery(
    'SELECT * FROM players WHERE is_dealer = 1 ORDER BY name'
  );
  return result?.results || [];
}

export async function addPlayerToTournament(
  tournamentId: number, 
  playerId: number, 
  isDealer: boolean,
  buyinPaid: boolean = false
): Promise<number> {
  const result = await executeNonQuery(
    `INSERT INTO tournament_players 
     (tournament_id, player_id, is_active, is_dealer, buyin_paid, rebuy_count, addon_count) 
     VALUES (?, ?, 1, ?, ?, 0, 0)`,
    [tournamentId, playerId, isDealer ? 1 : 0, buyinPaid ? 1 : 0]
  );
  return result?.meta?.last_row_id || 0;
}

export async function removePlayerFromTournament(
  tournamentId: number,
  playerId: number
): Promise<boolean> {
  const result = await executeNonQuery(
    `DELETE FROM tournament_players 
     WHERE tournament_id = ? AND player_id = ?`,
    [tournamentId, playerId]
  );
  return result?.meta?.changes > 0;
}

export async function eliminatePlayer(
  tournamentId: number,
  playerId: number,
  position: number
): Promise<boolean> {
  const result = await executeNonQuery(
    `UPDATE tournament_players 
     SET is_active = 0, position = ? 
     WHERE tournament_id = ? AND player_id = ?`,
    [position, tournamentId, playerId]
  );
  return result?.meta?.changes > 0;
}

export async function recordRebuy(
  tournamentId: number,
  playerId: number
): Promise<boolean> {
  const result = await executeNonQuery(
    `UPDATE tournament_players 
     SET rebuy_count = rebuy_count + 1 
     WHERE tournament_id = ? AND player_id = ?`,
    [tournamentId, playerId]
  );
  return result?.meta?.changes > 0;
}

export async function recordAddon(
  tournamentId: number,
  playerId: number
): Promise<boolean> {
  const result = await executeNonQuery(
    `UPDATE tournament_players 
     SET addon_count = addon_count + 1 
     WHERE tournament_id = ? AND player_id = ?`,
    [tournamentId, playerId]
  );
  return result?.meta?.changes > 0;
}

export async function markBuyinPaid(
  tournamentId: number,
  playerId: number
): Promise<boolean> {
  const result = await executeNonQuery(
    `UPDATE tournament_players 
     SET buyin_paid = 1 
     WHERE tournament_id = ? AND player_id = ?`,
    [tournamentId, playerId]
  );
  return result?.meta?.changes > 0;
}

export async function getActiveTournamentPlayers(tournamentId: number): Promise<any[]> {
  const result = await executeQuery(
    `SELECT p.*, tp.is_dealer as tournament_dealer
     FROM players p
     JOIN tournament_players tp ON p.id = tp.player_id
     WHERE tp.tournament_id = ? AND tp.is_active = 1
     ORDER BY p.name`,
    [tournamentId]
  );
  return result?.results || [];
}

export async function getEliminatedTournamentPlayers(tournamentId: number): Promise<any[]> {
  const result = await executeQuery(
    `SELECT p.*, tp.position, tp.is_dealer as tournament_dealer
     FROM players p
     JOIN tournament_players tp ON p.id = tp.player_id
     WHERE tp.tournament_id = ? AND tp.is_active = 0
     ORDER BY tp.position DESC`,
    [tournamentId]
  );
  return result?.results || [];
}

export async function getTournamentStandings(tournamentId: number): Promise<any[]> {
  const result = await executeQuery(
    `SELECT p.id, p.name, p.is_dealer, 
            tp.position, tp.is_active, tp.is_dealer as tournament_dealer,
            tp.rebuy_count, tp.addon_count
     FROM players p
     JOIN tournament_players tp ON p.id = tp.player_id
     WHERE tp.tournament_id = ?
     ORDER BY 
        CASE WHEN tp.is_active = 0 THEN 0 ELSE 1 END DESC,
        CASE WHEN tp.is_active = 0 THEN tp.position END ASC,
        p.name ASC`,
    [tournamentId]
  );
  return result?.results || [];
}

export async function calculateSeasonPoints(
  tournamentId: number,
  seasonName: string,
  participationPoints: number = 5,
  rebuyPenaltyPoints: number = -1
): Promise<boolean> {
  // Get all players from the tournament
  const players = await getPlayersByTournamentId(tournamentId);
  
  // Calculate points for each player
  const pointsCalculations = players.map(player => {
    // Base participation points
    let totalPoints = participationPoints;
    
    // Subtract points for rebuys
    totalPoints += player.rebuy_count * rebuyPenaltyPoints;
    
    // Add position points (if player was eliminated)
    let positionPoints = 0;
    if (player.position !== null) {
      // Simple position points calculation:
      // 1st place: 20 points
      // 2nd place: 15 points
      // 3rd place: 10 points
      // 4th-6th place: 5 points
      // 7th-9th place: 3 points
      if (player.position === 1) positionPoints = 20;
      else if (player.position === 2) positionPoints = 15;
      else if (player.position === 3) positionPoints = 10;
      else if (player.position >= 4 && player.position <= 6) positionPoints = 5;
      else if (player.position >= 7 && player.position <= 9) positionPoints = 3;
    }
    
    totalPoints += positionPoints;
    
    return {
      player_id: player.id,
      participation_points: participationPoints,
      position_points: positionPoints,
      rebuy_penalty_points: player.rebuy_count * rebuyPenaltyPoints,
      total_points: totalPoints
    };
  });
  
  // Insert or update season points for each player
  const pointsStatements = pointsCalculations.map(points => ({
    sql: `INSERT INTO season_points 
          (player_id, season_name, participation_points, position_points, rebuy_penalty_points, total_points)
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(player_id, season_name) 
          DO UPDATE SET
            participation_points = participation_points + ?,
            position_points = position_points + ?,
            rebuy_penalty_points = rebuy_penalty_points + ?,
            total_points = total_points + ?`,
    params: [
      points.player_id,
      seasonName,
      points.participation_points,
      points.position_points,
      points.rebuy_penalty_points,
      points.total_points,
      points.participation_points,
      points.position_points,
      points.rebuy_penalty_points,
      points.total_points
    ]
  }));
  
  await executeTransaction(pointsStatements);
  
  return true;
}

export async function getSeasonLeaderboard(seasonName: string): Promise<any[]> {
  const result = await executeQuery(
    `SELECT p.id, p.name, p.is_dealer,
            sp.participation_points, sp.position_points, 
            sp.rebuy_penalty_points, sp.total_points
     FROM season_points sp
     JOIN players p ON sp.player_id = p.id
     WHERE sp.season_name = ?
     ORDER BY sp.total_points DESC`,
    [seasonName]
  );
  return result?.results || [];
}
