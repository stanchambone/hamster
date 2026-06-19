// scripts/seedAdmin.ts
import bcrypt from 'bcrypt';
import db from '../lib/db';

async function main() {
  const user = process.env.ADMIN_SEED_USER;
  const pass = process.env.ADMIN_SEED_PASS;
  if (!user || !pass) {
    console.error('Set ADMIN_SEED_USER and ADMIN_SEED_PASS');
    process.exit(1);
  }
  const hash = await bcrypt.hash(pass, 12);
  const exists = db.prepare('SELECT id FROM users WHERE username = ?').get(user);
  if (exists) {
    db.prepare('UPDATE users SET password_hash = ?, role = ? WHERE username = ?').run(hash, 'admin', user);
    console.log('Updated admin user');
  } else {
    db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run(user, hash, 'admin');
    console.log('Created admin user');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
