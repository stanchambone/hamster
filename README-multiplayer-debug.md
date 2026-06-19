Multiplayer Debug Page

Visit /multiplayer-debug to view realtime events sent to the `realtime_events` table in Supabase.

How to use:
1) Ensure you have set NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment and deployed/restarted the app.
2) Open this page (https://your-site.example.com/multiplayer-debug).
3) Trigger an admin action (eg. via AdminPanel -> Hamster Rain). The action will be inserted into Supabase's `realtime_events` table and broadcast to clients.
4) This page will display incoming INSERT events in realtime.

Notes:
- This page is intentionally separate from the main game UI so you can safely validate events without modifying the running game.
- If you want the MultiplayerClient mounted in the main app automatically, I can add it to pages/_app.tsx or your main layout. Say the word and I'll add it.
