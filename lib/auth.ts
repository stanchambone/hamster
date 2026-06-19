// lib/auth.ts
import jwt from 'jsonwebtoken';
import db from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (e) {
    return null;
  }
}

export function getUserFromReq(req: any) {
  const cookie = req.headers?.cookie || '';
  const match = cookie.match(/token=([^;]+)/);
  if (!match) return null;
  const payload = verifyToken(match[1]);
  if (!payload?.sub) return null;
  const row = db.prepare('SELECT id, username, role FROM users WHERE id = ?').get(payload.sub);
  return row || null;
}

export function requireAdmin(req: any, res: any) {
  const user = getUserFromReq(req);
  if (!user) {
    res.status(401).json({ error: 'Not authenticated' });
    return null;
  }
  if (user.role !== 'admin') {
    res.status(403).json({ error: 'Admin only' });
    return null;
  }
  return user;
}
