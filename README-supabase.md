# Supabase Multiplayer setup

This branch adds a Supabase-based realtime integration so admin actions (and other server-published events) can be broadcast to connected clients.

Setup steps

1) Create a Supabase project and add a table named `realtime_events` with at least the following columns:
   - id: bigint (auto-increment)
   - type: text
   - payload: jsonb
   - admin_user: bigint (nullable)
   - created_at: timestamptz (default now())

You can run this SQL in Supabase SQL editor:

CREATE TABLE realtime_events (
  id bigserial PRIMARY KEY,
  type text NOT NULL,
  payload jsonb DEFAULT '{}'::jsonb,
  admin_user bigint,
  created_at timestamptz DEFAULT now()
);

2) Set environment variables on your deployment/local env (do NOT commit these to git):
   - SUPABASE_URL=https://your-project.supabase.co
   - SUPABASE_SERVICE_ROLE_KEY=the_service_role_key (server-side only)
   - NEXT_PUBLIC_SUPABASE_ANON_KEY=the_anon_key (exposed to client)

3) Usage
   - The API route /api/admin/action will insert into the `realtime_events` table (server-side) when admins perform actions. Clients that mount the `MultiplayerClient` component will receive INSERT events in realtime and can react (eg. show hamster rain, disco mode, XP multipliers, etc.).

Security notes
- The service role key is powerful. Keep it only in server environment variables. Do not expose it to the client.
- Validate and rate-limit admin endpoints as needed. Inserts into `realtime_events` are logged in Supabase and visible in the DB.

