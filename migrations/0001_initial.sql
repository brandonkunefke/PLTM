-- Migration number: 0001 	 2025-04-19T04:25:45.000Z
-- Poker Tournament Manager Database Schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS tournaments;
DROP TABLE IF EXISTS blind_structures;
DROP TABLE IF EXISTS blind_levels;
DROP TABLE IF EXISTS tournament_players;
DROP TABLE IF EXISTS tables;
DROP TABLE IF EXISTS table_assignments;
DROP TABLE IF EXISTS tournament_results;
DROP TABLE IF EXISTS season_points;
DROP TABLE IF EXISTS financial_transactions;
DROP TABLE IF EXISTS payout_structures;

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  is_dealer BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  date DATETIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'setup', -- setup, running, paused, completed
  buy_in_amount REAL NOT NULL DEFAULT 0,
  dealer_buy_in_amount REAL NOT NULL DEFAULT 0,
  rebuy_amount REAL NOT NULL DEFAULT 0,
  addon_amount REAL NOT NULL DEFAULT 0,
  current_blind_level INTEGER DEFAULT 0,
  clock_time_remaining INTEGER DEFAULT 0, -- in seconds
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Blind structure templates
CREATE TABLE IF NOT EXISTS blind_structures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  is_template BOOLEAN DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Blind levels for each structure
CREATE TABLE IF NOT EXISTS blind_levels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  structure_id INTEGER NOT NULL,
  level_number INTEGER NOT NULL,
  small_blind INTEGER NOT NULL,
  big_blind INTEGER NOT NULL,
  ante INTEGER DEFAULT 0,
  duration INTEGER NOT NULL, -- in minutes
  FOREIGN KEY (structure_id) REFERENCES blind_structures(id) ON DELETE CASCADE
);

-- Tournament players junction table
CREATE TABLE IF NOT EXISTS tournament_players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tournament_id INTEGER NOT NULL,
  player_id INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  position INTEGER, -- final position when eliminated
  is_dealer BOOLEAN DEFAULT FALSE,
  buyin_paid BOOLEAN DEFAULT FALSE,
  rebuy_count INTEGER DEFAULT 0,
  addon_count INTEGER DEFAULT 0,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Tables in a tournament
CREATE TABLE IF NOT EXISTS tables (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tournament_id INTEGER NOT NULL,
  table_number INTEGER NOT NULL,
  max_seats INTEGER NOT NULL DEFAULT 9,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE
);

-- Table assignments
CREATE TABLE IF NOT EXISTS table_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tournament_id INTEGER NOT NULL,
  table_id INTEGER NOT NULL,
  player_id INTEGER NOT NULL,
  seat_number INTEGER NOT NULL,
  is_current BOOLEAN DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Tournament results
CREATE TABLE IF NOT EXISTS tournament_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tournament_id INTEGER NOT NULL,
  player_id INTEGER NOT NULL,
  position INTEGER NOT NULL,
  payout_amount REAL DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Season points tracking
CREATE TABLE IF NOT EXISTS season_points (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  season_name TEXT NOT NULL,
  participation_points INTEGER DEFAULT 0,
  position_points INTEGER DEFAULT 0,
  rebuy_penalty_points INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Financial transactions
CREATE TABLE IF NOT EXISTS financial_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tournament_id INTEGER NOT NULL,
  player_id INTEGER NOT NULL,
  transaction_type TEXT NOT NULL, -- buy-in, rebuy, addon, payout
  amount REAL NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Payout structures
CREATE TABLE IF NOT EXISTS payout_structures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  min_players INTEGER NOT NULL,
  max_players INTEGER NOT NULL,
  position INTEGER NOT NULL,
  percentage REAL NOT NULL, -- percentage of prize pool
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_players_name ON players(name);
CREATE INDEX idx_tournaments_date ON tournaments(date);
CREATE INDEX idx_tournament_players_tournament ON tournament_players(tournament_id);
CREATE INDEX idx_tournament_players_player ON tournament_players(player_id);
CREATE INDEX idx_table_assignments_tournament ON table_assignments(tournament_id);
CREATE INDEX idx_table_assignments_current ON table_assignments(is_current);
CREATE INDEX idx_season_points_player ON season_points(player_id);
CREATE INDEX idx_season_points_season ON season_points(season_name);

-- Insert sample data for blind structure templates
INSERT INTO blind_structures (name, description, is_template) VALUES 
  ('Standard Tournament', 'Standard blind structure with 20-minute levels', TRUE),
  ('Turbo Tournament', 'Faster blind structure with 10-minute levels', TRUE),
  ('Deep Stack Tournament', 'Slower blind progression with 30-minute levels', TRUE);

-- Insert sample blind levels for Standard Tournament
INSERT INTO blind_levels (structure_id, level_number, small_blind, big_blind, ante, duration) VALUES
  (1, 1, 25, 50, 0, 20),
  (1, 2, 50, 100, 0, 20),
  (1, 3, 75, 150, 0, 20),
  (1, 4, 100, 200, 25, 20),
  (1, 5, 150, 300, 25, 20),
  (1, 6, 200, 400, 50, 20),
  (1, 7, 300, 600, 75, 20),
  (1, 8, 400, 800, 100, 20),
  (1, 9, 500, 1000, 100, 20),
  (1, 10, 700, 1400, 200, 20),
  (1, 11, 1000, 2000, 300, 20),
  (1, 12, 1500, 3000, 400, 20),
  (1, 13, 2000, 4000, 500, 20),
  (1, 14, 3000, 6000, 1000, 20),
  (1, 15, 4000, 8000, 1000, 20),
  (1, 16, 5000, 10000, 1000, 20);

-- Insert sample blind levels for Turbo Tournament
INSERT INTO blind_levels (structure_id, level_number, small_blind, big_blind, ante, duration) VALUES
  (2, 1, 25, 50, 0, 10),
  (2, 2, 50, 100, 0, 10),
  (2, 3, 100, 200, 25, 10),
  (2, 4, 150, 300, 25, 10),
  (2, 5, 200, 400, 50, 10),
  (2, 6, 300, 600, 75, 10),
  (2, 7, 400, 800, 100, 10),
  (2, 8, 600, 1200, 200, 10),
  (2, 9, 800, 1600, 200, 10),
  (2, 10, 1000, 2000, 300, 10),
  (2, 11, 1500, 3000, 400, 10),
  (2, 12, 2000, 4000, 500, 10),
  (2, 13, 3000, 6000, 1000, 10),
  (2, 14, 4000, 8000, 1000, 10),
  (2, 15, 6000, 12000, 2000, 10),
  (2, 16, 8000, 16000, 2000, 10);

-- Insert sample payout structures
INSERT INTO payout_structures (name, min_players, max_players, position, percentage) VALUES
  ('Small Tournament', 6, 9, 1, 70),
  ('Small Tournament', 6, 9, 2, 30),
  
  ('Medium Tournament', 10, 18, 1, 50),
  ('Medium Tournament', 10, 18, 2, 30),
  ('Medium Tournament', 10, 18, 3, 20),
  
  ('Large Tournament', 19, 27, 1, 40),
  ('Large Tournament', 19, 27, 2, 25),
  ('Large Tournament', 19, 27, 3, 15),
  ('Large Tournament', 19, 27, 4, 10),
  ('Large Tournament', 19, 27, 5, 6),
  ('Large Tournament', 19, 27, 6, 4);
