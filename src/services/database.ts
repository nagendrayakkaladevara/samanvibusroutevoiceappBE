import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { User } from '../types';
import { logger } from '../utils/logger';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function getUsers(): Promise<User[]> {
  const { rows } = await pool.query('SELECT username, password FROM users');
  return rows.map((row: any) => ({ username: row.username, password: row.password }));
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const { rows } = await pool.query('SELECT username, password FROM users WHERE username = $1', [username]);
  if (rows.length === 0) return null;
  const row: any = rows[0];
  return { username: row.username, password: row.password };
}

export async function createUser(username: string, password: string): Promise<void> {
  const hashed = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashed]);
}

export async function deleteUser(username: string): Promise<void> {
  await pool.query('DELETE FROM users WHERE username = $1', [username]);
}

export async function authenticateUser(username: string, password: string): Promise<boolean> {
  const user = await getUserByUsername(username);
  if (!user) return false;
  return bcrypt.compare(password, user.password);
}

export async function initDB(): Promise<void> {
  const query = 'CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, password TEXT NOT NULL)';
  await pool.query(query);
  logger.info('Database initialized');
}
