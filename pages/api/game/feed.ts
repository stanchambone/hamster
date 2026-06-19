// pages/api/game/feed.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';
import { getUserFromReq } from '../../lib/auth';

// Simple server-side cooldown: one feed action per hamster per 2 seconds per user
const COOLDOWN_MS = 2000;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  const { hamsterId } = req.body || {};
  if (!hamsterId) return res.status(400).json({ error: 'Missing hamsterId' });

  // Get last feed
  const row = db.prepare('SELECT created_at FROM feed_actions WHERE user_id = ? AND hamster_id = ? ORDER BY created_at DESC LIMIT 1').get(user.id, hamsterId);
  if (row) {
    const last = new Date(row.created_at).getTime();
    if (Date.now() - last < COOLDOWN_MS) return res.status(429).json({ error: 'Feeding too fast' });
  }

  db.prepare('INSERT INTO feed_actions (user_id, hamster_id) VALUES (?, ?)').run(user.id, hamsterId);
  // Here you'd apply server-side hamster stat changes; for now return ok
  res.json({ ok: true });
}
