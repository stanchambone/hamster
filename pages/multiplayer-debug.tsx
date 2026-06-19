import React, { useState, useCallback } from 'react';
import MultiplayerClient from '../components/MultiplayerClient';

export default function MultiplayerDebugPage() {
  const [events, setEvents] = useState<any[]>([]);

  const onEvent = useCallback((ev: any) => {
    setEvents(prev => [ev, ...prev].slice(0, 200)); // keep latest 200
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2>Multiplayer / Realtime Debug</h2>
      <p>This page mounts the MultiplayerClient and shows incoming realtime events from Supabase.</p>

      <MultiplayerClient onEvent={onEvent} />

      <div style={{ marginTop: 16 }}>
        <h3>Recent events (newest first)</h3>
        <div style={{ maxHeight: '60vh', overflow: 'auto', border: '1px solid #eee', padding: 8, borderRadius: 6 }}>
          {events.length === 0 && <div style={{ color: '#666' }}>No events received yet. Make sure NEXT_PUBLIC_SUPABASE_ANON_KEY is set and the MultiplayerClient is mounted.</div>}
          {events.map((e, i) => (
            <div key={i} style={{ padding: 8, borderBottom: '1px solid #f2f2f2' }}>
              <div style={{ fontSize: 12, color: '#888' }}>{new Date(e.created_at).toLocaleString()}</div>
              <div><strong>Type:</strong> {e.type}</div>
              <div style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}><strong>Payload:</strong> {JSON.stringify(e.payload)}</div>
              <div style={{ fontSize: 12, color: '#666' }}><strong>Admin:</strong> {String(e.admin_user)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
