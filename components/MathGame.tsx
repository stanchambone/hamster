// components/MathGame.tsx
import React, { useState } from 'react';

export default function MathGame() {
  const [q, setQ] = useState('');
  const [ans, setAns] = useState('');
  const [result, setResult] = useState<string | null>(null);

  function genPlus() {
    const a = Math.floor(Math.random() * 101);
    const b = Math.floor(Math.random() * 101);
    setQ(`${a} + ${b}`);
  }

  function check() {
    try {
      // naive eval for prototype only
      const ok = eval(q) == Number(ans);
      setResult(ok ? 'Correct' : 'Wrong');
    } catch (e) {
      setResult('Error');
    }
  }

  return (
    <div style={{ position: 'absolute', left: 260, top: 80, width: 260, background: '#fff', padding: 8, borderRadius: 8 }}>
      <h4>Math Game</h4>
      <div><button onClick={genPlus}>New + upto 100</button></div>
      <div style={{ marginTop: 8 }}>{q}</div>
      <div><input value={ans} onChange={e => setAns(e.target.value)} placeholder="answer" /></div>
      <div><button onClick={check}>Check</button></div>
      {result && <div>{result}</div>}
    </div>
  );
}
