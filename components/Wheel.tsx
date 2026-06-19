// components/Wheel.tsx
import React, { useState, useEffect } from 'react';

export default function Wheel({ onPrize }: { onPrize?: (prize: any) => void }) {
  const [spinning, setSpinning] = useState(false);
  async function spin() {
    if (spinning) return;
    setSpinning(true);
    // basic client-side mock of spin
    await new Promise(r => setTimeout(r, 2000));
    setSpinning(false);
    const prizes = ['hamster', '50_coins', '20_xp', '5_gems', '2_hamsters'];
    const p = prizes[Math.floor(Math.random() * prizes.length)];
    onPrize?.(p);
    alert('You won: ' + p);
  }
  return (
    <div style={{ position: 'absolute', left: 12, bottom: 16 }}>
      <button onClick={spin} disabled={spinning}>Spin Wheel (10 coins)</button>
    </div>
  );
}
