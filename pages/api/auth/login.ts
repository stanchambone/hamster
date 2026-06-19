// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import db from '../../lib/db';
import { signToken } from '../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const row = db.prepare('SELECT id, password_hash, role FROM users WHERE username = ?').get(username);
    if (!row) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken({ sub: row.id, role: row.role });
    // Set HttpOnly cookie
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}`);
    res.json({ ok: true, role: row.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
