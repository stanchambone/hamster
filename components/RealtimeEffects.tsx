// components/RealtimeEffects.tsx
import React, { useEffect, useState } from 'react';

export default function RealtimeEffects() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [hamsterSprites, setHamsterSprites] = useState<any[]>([]);
  const [discoActive, setDiscoActive] = useState(false);

  useEffect(() => {
    function onNotify(e: any) {
      const msg = e.detail?.msg || 'Event';
      setNotifications(n => [{ msg, id: Date.now() }, ...n].slice(0, 6));
    }
    function onHamsterRain(e: any) {
      const count = e.detail?.count || 20;
      // create simple flying hamster icons
      for (let i=0;i<count;i++) {
        spawnHamsterSprite();
      }
    }
    function onSpawn(e: any) {
      const count = e.detail?.count || 10;
      for (let i=0;i<count;i++) spawnHamsterSprite();
    }
    function onDisco(e: any) {
      const duration = e.detail?.duration || 10000;
      setDiscoActive(true);
      setTimeout(() => setDiscoActive(false), duration);
    }

    window.addEventListener('realtime_notification', onNotify as EventListener);
    window.addEventListener('hamster_rain', onHamsterRain as EventListener);
    window.addEventListener('spawn_hamsters', onSpawn as EventListener);
    window.addEventListener('disco_mode', onDisco as EventListener);

    return () => {
      window.removeEventListener('realtime_notification', onNotify as EventListener);
      window.removeEventListener('hamster_rain', onHamsterRain as EventListener);
      window.removeEventListener('spawn_hamsters', onSpawn as EventListener);
      window.removeEventListener('disco_mode', onDisco as EventListener);
    };
  }, []);

  function spawnHamsterSprite() {
    const id = Math.random().toString(36).slice(2);
    const left = Math.random() * 80 + 10; // percent
    const top = Math.random() * 60 + 10;
    const size = Math.random() * 40 + 24;
    const sprite = { id, left, top, size };
    setHamsterSprites(s => [sprite, ...s].slice(0, 200));
    // remove after animation
    setTimeout(() => {
      setHamsterSprites(s => s.filter(x => x.id !== id));
    }, 6000);
  }

  return (
    <div>
      {/* Disco overlay */}
      {discoActive && <div style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, pointerEvents: 'none', mixBlendMode: 'screen', animation: 'discoPulse 1s linear infinite' }} />}

      {/* Hamster sprites */}
      {hamsterSprites.map(s => (
        <div key={s.id} style={{ position: 'fixed', left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, transform: 'translate(-50%,-50%)', pointerEvents: 'none', transition: 'transform 1s ease-out, opacity 1s', opacity: 0.95 }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #fff 0%, #f4a261 40%, #b5651d 100%)', boxShadow: '0 6px 10px rgba(0,0,0,0.2)' }} />
        </div>
      ))}

      {/* Notifications */}
      <div style={{ position: 'fixed', right: 16, top: 80, width: 320, zIndex: 9999 }}>
        {notifications.map(n => (
          <div key={n.id} style={{ background: '#111', color: '#fff', padding: '8px 12px', marginTop: 8, borderRadius: 6, opacity: 0.95 }}>{n.msg}</div>
        ))}
      </div>

      <style>{`
        @keyframes discoPulse { 
          0% { background: rgba(255,0,128,0.06); }
          25% { background: rgba(0,200,255,0.06); }
          50% { background: rgba(50,255,50,0.06); }
          75% { background: rgba(255,255,50,0.06); }
          100% { background: rgba(255,0,128,0.06); }
        }
      `}</style>
    </div>
  );
}
