-- Add Point Winner and Championship Game bank functionality

-- Update tournaments table to include bank contributions
ALTER TABLE tournaments ADD COLUMN point_winner_contribution REAL DEFAULT 0;
ALTER TABLE tournaments ADD COLUMN championship_game_contribution REAL DEFAULT 0;
ALTER TABLE tournaments ADD COLUMN is_championship_game BOOLEAN DEFAULT 0;

-- Create season_banks table to track accumulated funds
CREATE TABLE IF NOT EXISTS season_banks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  season_id INTEGER NOT NULL,
  point_winner_bank REAL DEFAULT 0,
  championship_game_bank REAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE
);

-- Create seasons table if it doesn't exist
CREATE TABLE IF NOT EXISTS seasons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indices for performance
CREATE INDEX IF NOT EXISTS idx_tournaments_is_championship_game ON tournaments(is_championship_game);
CREATE INDEX IF NOT EXISTS idx_season_banks_season_id ON season_banks(season_id);
CREATE INDEX IF NOT EXISTS idx_seasons_is_active ON seasons(is_active);
