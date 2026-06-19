// lib/db.ts
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'dev.db');
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = new Database(DB_PATH);

// Initialize tables if they don't exist
db.prepare(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS admin_actions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_user INTEGER,
  action TEXT,
  payload TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS feed_actions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  hamster_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS hamsters (
  id TEXT PRIMARY KEY,
  owner_id INTEGER,
  name TEXT,
  xp INTEGER DEFAULT 0,
  size REAL DEFAULT 1,
  hunger INTEGER DEFAULT 100,
  happiness INTEGER DEFAULT 100,
  energy INTEGER DEFAULT 100,
  health INTEGER DEFAULT 100
)`).run();

export default db;
