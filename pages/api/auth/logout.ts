// pages/api/auth/logout.ts
import type { NextApiRequest, NextApiResponse } from 'next';
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', `token=deleted; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
  res.json({ ok: true });
}
