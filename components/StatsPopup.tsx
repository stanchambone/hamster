// components/StatsPopup.tsx
import React from 'react';

export default function StatsPopup({ hamster, onClose }: { hamster: any, onClose?: () => void }) {
  if (!hamster) return null;
  return (
    <div style={{ position: 'absolute', right: 20, top: 80, width: 260, background: '#fff', padding: 12, borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.15)' }}>
      <h4>{hamster.name || 'Hamster'}</h4>
      <div>Level: {hamster.level || 1}</div>
      <div>XP: {hamster.xp || 0}</div>
      <div>Hunger: {hamster.hunger}</div>
      <div>Energy: {hamster.energy}</div>
      <div>Happiness: {hamster.happiness}</div>
      <div>Size: {hamster.size}</div>
      <div style={{ marginTop: 8 }}><button onClick={onClose}>Close</button></div>
    </div>
  );
}
