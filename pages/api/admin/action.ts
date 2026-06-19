// pages/api/admin/action.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '../../lib/auth';
import db from '../../lib/db';
import { supabaseServer } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const admin = requireAdmin(req, res);
  if (!admin) return; // requireAdmin already sent response

  const { action, payload } = req.body || {};
  if (!action) return res.status(400).json({ error: 'Missing action' });

  // Record admin action locally
  db.prepare('INSERT INTO admin_actions (admin_user, action, payload) VALUES (?, ?, ?)').run(admin.id, action, JSON.stringify(payload || {}));

  // Publish to Supabase realtime table (realtime_events) so connected clients receive it
  try {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      await supabaseServer.from('realtime_events').insert([{ type: action, payload: payload || {}, admin_user: admin.id }]);
    }
  } catch (e) {
    console.error('Supabase publish error', e);
    // continue — action still recorded locally
  }

  res.json({ ok: true });
}
