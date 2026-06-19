// pages/api/admin/action.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin, getUserFromReq } from '../../lib/auth';
import db from '../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const admin = requireAdmin(req, res);
  if (!admin) return; // requireAdmin already sent response

  const { action, payload } = req.body || {};
  if (!action) return res.status(400).json({ error: 'Missing action' });

  // Basic actions recording - these can be broadcasted by a realtime layer later
  db.prepare('INSERT INTO admin_actions (admin_user, action, payload) VALUES (?, ?, ?)').run(admin.id, action, JSON.stringify(payload || {}));

  res.json({ ok: true });
}
