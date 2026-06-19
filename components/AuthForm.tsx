// components/AuthForm.tsx
import React, { useState } from 'react';

export default function AuthForm({ onSuccess }: { onSuccess?: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    const j = await res.json();
    if (!res.ok) {
      setError(j.error || 'Error');
      return;
    }
    onSuccess?.();
  }

  return (
    <div style={{ padding: 12, width: 320, background: 'rgba(255,255,255,0.95)', borderRadius: 8 }}>
      <h3>{mode === 'login' ? 'Login' : 'Register'}</h3>
      <form onSubmit={submit}>
        <div><input value={username} onChange={e => setUsername(e.target.value)} placeholder="username" /></div>
        <div style={{ marginTop: 8 }}><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" /></div>
        <div style={{ marginTop: 8 }}><button type="submit">{mode === 'login' ? 'Login' : 'Register'}</button></div>
      </form>
      <div style={{ marginTop: 8 }}>
        <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>Switch to {mode === 'login' ? 'register' : 'login'}</button>
      </div>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}
