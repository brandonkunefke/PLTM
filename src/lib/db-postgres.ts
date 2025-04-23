// Modified db.ts for Vercel Postgres integration

import { Pool } from 'pg';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Database utility functions
export const db = {
  // Execute a query with parameters
  async query(text, params = []) {
    try {
      const start = Date.now();
      const result = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: result.rowCount });
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },

  // Get a single row by ID
  async getById(table, id) {
    const result = await this.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
    return result.rows[0];
  },

  // Get all rows from a table
  async getAll(table) {
    const result = await this.query(`SELECT * FROM ${table}`);
    return result.rows;
  },

  // Insert a new row
  async insert(table, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const columns = keys.join(', ');
    
    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
    const result = await this.query(query, values);
    return result.rows[0];
  },

  // Update an existing row
  async update(table, id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    
    const query = `UPDATE ${table} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
    const result = await this.query(query, [...values, id]);
    return result.rows[0];
  },

  // Delete a row
  async delete(table, id) {
    const query = `DELETE FROM ${table} WHERE id = $1 RETURNING *`;
    const result = await this.query(query, [id]);
    return result.rows[0];
  },

  // Transaction support
  async transaction(callback) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
};

export default db;
