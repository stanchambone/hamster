// README-admin.md
Admin & Auth setup

- Branch: feature/admin-first
- Env variables (locally):
  - JWT_SECRET (required) - a random string
  - ADMIN_SECRET (optional) - the admin unlock code (set to 20138 if you like, but keep it in env, not in git)
  - DB_PATH (optional) - path to sqlite file (default: data/dev.db)

Seed admin via env (optional):
  ADMIN_SEED_USER=stanchambone ADMIN_SEED_PASS='yourpassword' node scripts/seedAdmin.ts

Run the app (dev):
  - npm install (add dependencies: better-sqlite3, bcrypt, jsonwebtoken)
  - npm run dev

Notes:
- First registered user becomes admin (transaction-safe for SQLite usage here).
- Admin actions are recorded in admin_actions table; later a realtime system should broadcast them.
