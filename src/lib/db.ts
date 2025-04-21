import { D1Database } from '@cloudflare/workers-types';

// Get Cloudflare D1 database context
export function getCloudflareContext() {
  // @ts-ignore
  return process.env.CLOUDFLARE_CONTEXT || {};
}

// Get D1 database instance
export function getDatabase(): D1Database | null {
  const context = getCloudflareContext();
  return context.DB || null;
}

// Execute a SQL query with parameters
export async function executeQuery(
  sql: string,
  params: any[] = []
): Promise<any> {
  const db = getDatabase();
  if (!db) {
    console.error('Database not available');
    return null;
  }

  try {
    const result = await db.prepare(sql).bind(...params).all();
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Execute a SQL query and return a single row
export async function executeQuerySingle(
  sql: string,
  params: any[] = []
): Promise<any> {
  const db = getDatabase();
  if (!db) {
    console.error('Database not available');
    return null;
  }

  try {
    const result = await db.prepare(sql).bind(...params).first();
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Execute a SQL query that doesn't return data (INSERT, UPDATE, DELETE)
export async function executeNonQuery(
  sql: string,
  params: any[] = []
): Promise<any> {
  const db = getDatabase();
  if (!db) {
    console.error('Database not available');
    return null;
  }

  try {
    const result = await db.prepare(sql).bind(...params).run();
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Execute multiple SQL statements in a transaction
export async function executeTransaction(
  statements: { sql: string; params: any[] }[]
): Promise<any> {
  const db = getDatabase();
  if (!db) {
    console.error('Database not available');
    return null;
  }

  try {
    const transaction = db.batch(
      statements.map(({ sql, params }) => 
        db.prepare(sql).bind(...params)
      )
    );
    return await transaction.run();
  } catch (error) {
    console.error('Database transaction error:', error);
    throw error;
  }
}
