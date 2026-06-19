// lib/realtimeHandlers.ts
import { supabaseClient } from './supabase';

// Simple client-side runtime state for XP multiplier
let currentMultiplier = 1;
let multiplierTimeout: any = null;

export function handleRealtimeEvent(ev: any) {
  try {
    const type = ev.type;
    const payload = ev.payload || {};
    console.log('Handling realtime event', type, payload);
    switch (type) {
      case 'hamster_rain': {
        const count = payload.count || 30;
        // dispatch a DOM event for game UI to handle (spawn visuals)
        window.dispatchEvent(new CustomEvent('hamster_rain', { detail: { count } }));
        showNotification(`Hamster rain: ${count} hamsters`);
        break;
      }
      case 'disco_mode': {
        const duration = payload.duration || 10000;
        window.dispatchEvent(new CustomEvent('disco_mode', { detail: { duration } }));
        showNotification('Disco mode activated');
        break;
      }
      case 'xp_mult': {
        const mult = Number(payload.mult) || 1;
        const duration = payload.duration || 60000; // ms
        applyXpMultiplier(mult, duration);
        showNotification(`XP x${mult} for ${Math.round(duration/1000)}s`);
        break;
      }
      case 'spawn_hamsters': {
        const count = payload.count || 10;
        window.dispatchEvent(new CustomEvent('spawn_hamsters', { detail: { count } }));
        showNotification(`Spawn ${count} hamsters`);
        break;
      }
      default: {
        console.log('Unknown realtime event type', type);
        showNotification(`Event: ${type}`);
        break;
      }
    }
  } catch (e) {
    console.error('Error handling realtime event', e);
  }
}

function showNotification(msg: string) {
  window.dispatchEvent(new CustomEvent('realtime_notification', { detail: { msg } }));
}

function applyXpMultiplier(mult: number, duration: number) {
  currentMultiplier = mult;
  window['__XP_MULTIPLIER__'] = { mult, expiresAt: Date.now() + duration };
  if (multiplierTimeout) clearTimeout(multiplierTimeout);
  multiplierTimeout = setTimeout(() => {
    currentMultiplier = 1;
    window['__XP_MULTIPLIER__'] = { mult: 1, expiresAt: 0 };
    showNotification('XP multiplier expired');
  }, duration);
}

export function getCurrentXpMultiplier() {
  const s = window['__XP_MULTIPLIER__'];
  if (!s) return 1;
  if (s.expiresAt && Date.now() < s.expiresAt) return s.mult;
  return 1;
}
