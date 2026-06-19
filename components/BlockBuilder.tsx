// components/BlockBuilder.tsx
import React from 'react';

export default function BlockBuilder() {
  return (
    <div style={{ position: 'absolute', left: 12, top: 80, width: 220, background: 'rgba(255,255,255,0.95)', padding: 8, borderRadius: 8 }}>
      <h4>Build Mode</h4>
      <div>Block types: Wall, Floor, Platform, Wheel, Water, House, Tunnel, Ladder, Bedding, Toy</div>
      <div style={{ marginTop: 8 }}>(Drag & click in 3D view to place - placeholder UI)</div>
    </div>
  );
}
