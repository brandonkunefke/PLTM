-- Update schema to make dealer designation event-specific

-- First, remove the is_dealer column from the players table
ALTER TABLE players DROP COLUMN is_dealer;

-- Create a new tournament_players junction table with dealer designation
CREATE TABLE IF NOT EXISTS tournament_players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tournament_id INTEGER NOT NULL,
  player_id INTEGER NOT NULL,
  is_dealer BOOLEAN NOT NULL DEFAULT 0,
  buy_in_amount REAL,
  rebuy_count INTEGER DEFAULT 0,
  addon_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  elimination_position INTEGER,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  UNIQUE(tournament_id, player_id)
);

-- Add indices for performance
CREATE INDEX idx_tournament_players_tournament_id ON tournament_players(tournament_id);
CREATE INDEX idx_tournament_players_player_id ON tournament_players(player_id);
CREATE INDEX idx_tournament_players_status ON tournament_players(status);

-- Update table_assignments to reference tournament_players instead of players
DROP TABLE IF EXISTS table_assignments;
CREATE TABLE table_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tournament_id INTEGER NOT NULL,
  table_id INTEGER NOT NULL,
  tournament_player_id INTEGER NOT NULL,
  seat_number INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE,
  FOREIGN KEY (tournament_player_id) REFERENCES tournament_players(id) ON DELETE CASCADE,
  UNIQUE(table_id, seat_number)
);

-- Add indices for table assignments
CREATE INDEX idx_table_assignments_tournament_id ON table_assignments(tournament_id);
CREATE INDEX idx_table_assignments_table_id ON table_assignments(table_id);
CREATE INDEX idx_table_assignments_tournament_player_id ON table_assignments(tournament_player_id);

-- Update tournaments table to include dealer buy-in amount
ALTER TABLE tournaments ADD COLUMN dealer_buy_in_amount REAL;
