// components/AdminPanel.tsx
import React, { useState } from 'react';

export default function AdminPanel({ onAction }: { onAction?: (action: string, payload?: any) => void }) {
  const [secret, setSecret] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [mult, setMult] = useState(2);

  function tryUnlock() {
    // client-side hint only; real check is server-side
    if (!secret) return;
    if (secret === (process.env.NEXT_PUBLIC_ADMIN_SECRET || '')) {
      setUnlocked(true);
    } else {
      alert('Wrong code (client-side). Server-side check will still be enforced.');
    }
  }

  async function doAction(action: string, payload?: any) {
    const res = await fetch('/api/admin/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, payload }) });
    if (!res.ok) {
      const j = await res.json();
      alert('Admin action failed: ' + (j?.error || 'unknown'));
      return;
    }
    onAction?.(action, payload);
    alert('Action queued: ' + action);
  }

  return (
    <div style={{ position: 'fixed', right: 16, bottom: 16, width: 300, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: 12, borderRadius: 8 }}>
      <h4>Admin Panel</h4>
      {!unlocked ? (
        <div>
          <input placeholder="Enter admin code" value={secret} onChange={e => setSecret(e.target.value)} />
          <button onClick={tryUnlock}>Unlock</button>
        </div>
      ) : (
        <div>
          <div>
            <label>XP Multiplier: </label>
            <input type="number" value={mult} min={1} max={100} onChange={e => setMult(Number(e.target.value))} />
            <button onClick={() => doAction('xp_mult', { mult })}>Apply</button>
          </div>
          <div style={{ marginTop: 8 }}>
            <button onClick={() => doAction('hamster_rain')}>Hamster Rain</button>
            <button onClick={() => doAction('disco_mode')}>Disco Mode</button>
            <button onClick={() => doAction('spawn_hamsters', { count: 50 })}>Spawn 50 Hamsters</button>
          </div>
        </div>
      )}
    </div>
  );
}
