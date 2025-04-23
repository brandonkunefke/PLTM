-- PostgreSQL migration script for Vercel deployment

-- Drop tables if they exist
DROP TABLE IF EXISTS tournament_players;
DROP TABLE IF EXISTS table_assignments;
DROP TABLE IF EXISTS tournament_results;
DROP TABLE IF EXISTS tournament_tables;
DROP TABLE IF EXISTS blind_levels;
DROP TABLE IF EXISTS blind_structures;
DROP TABLE IF EXISTS payout_structures;
DROP TABLE IF EXISTS payout_templates;
DROP TABLE IF EXISTS season_points;
DROP TABLE IF EXISTS season_banks;
DROP TABLE IF EXISTS tournaments;
DROP TABLE IF EXISTS players;

-- Create players table
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tournaments table
CREATE TABLE tournaments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'setup',
    max_players INTEGER DEFAULT 27,
    players_per_table INTEGER DEFAULT 9,
    buy_in_amount DECIMAL(10, 2) NOT NULL,
    dealer_buy_in_amount DECIMAL(10, 2) NOT NULL,
    rebuy_amount DECIMAL(10, 2),
    addon_amount DECIMAL(10, 2),
    house_fee DECIMAL(10, 2) DEFAULT 0,
    point_winner_contribution DECIMAL(10, 2) DEFAULT 0,
    championship_game_contribution DECIMAL(10, 2) DEFAULT 0,
    is_championship_game BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create blind structures table
CREATE TABLE blind_structures (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_template BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create blind levels table
CREATE TABLE blind_levels (
    id SERIAL PRIMARY KEY,
    structure_id INTEGER REFERENCES blind_structures(id) ON DELETE CASCADE,
    level_number INTEGER NOT NULL,
    small_blind INTEGER NOT NULL,
    big_blind INTEGER NOT NULL,
    ante INTEGER DEFAULT 0,
    duration_minutes INTEGER DEFAULT 20,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tournament tables
CREATE TABLE tournament_tables (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
    table_number INTEGER NOT NULL,
    max_seats INTEGER DEFAULT 9,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tournament_id, table_number)
);

-- Create table assignments
CREATE TABLE table_assignments (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
    table_id INTEGER REFERENCES tournament_tables(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    seat_number INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(table_id, seat_number, tournament_id)
);

-- Create tournament players junction table
CREATE TABLE tournament_players (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    is_dealer BOOLEAN DEFAULT FALSE,
    buy_in_paid BOOLEAN DEFAULT FALSE,
    rebuys INTEGER DEFAULT 0,
    addons INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tournament_id, player_id)
);

-- Create tournament results table
CREATE TABLE tournament_results (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    position INTEGER,
    points INTEGER DEFAULT 0,
    winnings DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tournament_id, player_id)
);

-- Create payout templates table
CREATE TABLE payout_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    min_players INTEGER NOT NULL,
    max_players INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payout structures table
CREATE TABLE payout_structures (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES payout_templates(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    percentage DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create season points table
CREATE TABLE season_points (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    season_year INTEGER NOT NULL,
    total_points INTEGER DEFAULT 0,
    tournaments_played INTEGER DEFAULT 0,
    best_finish INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, season_year)
);

-- Create season banks table
CREATE TABLE season_banks (
    id SERIAL PRIMARY KEY,
    season_year INTEGER NOT NULL,
    point_winner_bank DECIMAL(10, 2) DEFAULT 0,
    championship_game_bank DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(season_year)
);

-- Insert sample blind structure templates
INSERT INTO blind_structures (name, description, is_template) VALUES
('Standard Structure', 'Regular 20-minute blind levels', TRUE),
('Turbo Structure', 'Faster 15-minute blind levels', TRUE),
('Deep Stack Structure', 'Slower 30-minute blind levels', TRUE);

-- Insert sample blind levels for Standard Structure
INSERT INTO blind_levels (structure_id, level_number, small_blind, big_blind, ante, duration_minutes) VALUES
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
(1, 15, 5000, 10000, 1000, 20);

-- Insert sample blind levels for Turbo Structure
INSERT INTO blind_levels (structure_id, level_number, small_blind, big_blind, ante, duration_minutes) VALUES
(2, 1, 25, 50, 0, 15),
(2, 2, 50, 100, 0, 15),
(2, 3, 100, 200, 25, 15),
(2, 4, 150, 300, 25, 15),
(2, 5, 200, 400, 50, 15),
(2, 6, 300, 600, 75, 15),
(2, 7, 400, 800, 100, 15),
(2, 8, 600, 1200, 200, 15),
(2, 9, 800, 1600, 200, 15),
(2, 10, 1000, 2000, 300, 15),
(2, 11, 1500, 3000, 400, 15),
(2, 12, 2000, 4000, 500, 15),
(2, 13, 3000, 6000, 1000, 15),
(2, 14, 4000, 8000, 1000, 15),
(2, 15, 5000, 10000, 2000, 15);

-- Insert sample blind levels for Deep Stack Structure
INSERT INTO blind_levels (structure_id, level_number, small_blind, big_blind, ante, duration_minutes) VALUES
(3, 1, 25, 50, 0, 30),
(3, 2, 50, 100, 0, 30),
(3, 3, 75, 150, 0, 30),
(3, 4, 100, 200, 0, 30),
(3, 5, 150, 300, 25, 30),
(3, 6, 200, 400, 50, 30),
(3, 7, 250, 500, 50, 30),
(3, 8, 300, 600, 75, 30),
(3, 9, 400, 800, 100, 30),
(3, 10, 500, 1000, 100, 30),
(3, 11, 700, 1400, 200, 30),
(3, 12, 1000, 2000, 300, 30),
(3, 13, 1500, 3000, 400, 30),
(3, 14, 2000, 4000, 500, 30),
(3, 15, 3000, 6000, 1000, 30);

-- Insert sample payout templates
INSERT INTO payout_templates (name, description, min_players, max_players) VALUES
('9 Players', 'Standard payout for 9 players', 7, 9),
('18 Players', 'Standard payout for 18 players', 10, 18),
('27 Players', 'Standard payout for 27 players', 19, 27);

-- Insert sample payout structures for 9 Players
INSERT INTO payout_structures (template_id, position, percentage) VALUES
(1, 1, 50.0),
(1, 2, 30.0),
(1, 3, 20.0);

-- Insert sample payout structures for 18 Players
INSERT INTO payout_structures (template_id, position, percentage) VALUES
(2, 1, 45.0),
(2, 2, 25.0),
(2, 3, 15.0),
(2, 4, 10.0),
(2, 5, 5.0);

-- Insert sample payout structures for 27 Players
INSERT INTO payout_structures (template_id, position, percentage) VALUES
(3, 1, 40.0),
(3, 2, 25.0),
(3, 3, 15.0),
(3, 4, 10.0),
(3, 5, 5.0),
(3, 6, 3.0),
(3, 7, 2.0);

-- Initialize season banks for current year
INSERT INTO season_banks (season_year, point_winner_bank, championship_game_bank) VALUES
(2025, 0, 0);

-- Insert sample players
INSERT INTO players (name, email, phone, notes) VALUES
('John Smith', 'john@example.com', '555-1234', 'Regular player'),
('Jane Doe', 'jane@example.com', '555-5678', 'Prefers seat 1'),
('Mike Johnson', 'mike@example.com', '555-9012', 'Experienced dealer'),
('Sarah Williams', 'sarah@example.com', '555-3456', 'New player'),
('David Brown', 'david@example.com', '555-7890', 'Tournament director backup'),
('Lisa Davis', 'lisa@example.com', '555-2345', 'Prefers evening games'),
('Robert Wilson', 'robert@example.com', '555-6789', 'Experienced player'),
('Emily Taylor', 'emily@example.com', '555-0123', 'Regular dealer'),
('Michael Anderson', 'michael@example.com', '555-4567', 'Prefers seat 9');
