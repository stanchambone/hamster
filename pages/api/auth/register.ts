// pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import db from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const insertRole = db.transaction((uname: string, pass: string) => {
      const exists = db.prepare('SELECT id FROM users WHERE username = ?').get(uname);
      if (exists) throw new Error('USERNAME_TAKEN');
      const row = db.prepare('SELECT COUNT(*) as c FROM users').get();
      const userCount = row ? row.c : 0;
      const role = userCount === 0 ? 'admin' : 'user';
      const hash = bcrypt.hashSync(pass, 12);
      const info = db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run(uname, hash, role);
      return { id: info.lastInsertRowid, role };
    });

    const result = insertRole(username, password);
    res.status(201).json({ ok: true, id: result.id, role: result.role });
  } catch (err: any) {
    if (err.message === 'USERNAME_TAKEN') return res.status(409).json({ error: 'Username taken' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
