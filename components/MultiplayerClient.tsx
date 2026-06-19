// components/MultiplayerClient.tsx
import React, { useEffect } from 'react';
import { supabaseClient } from '../lib/supabase';

export default function MultiplayerClient({ onEvent }: { onEvent?: (e: any) => void }) {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase anon key not configured. Multiplayer disabled.');
      return;
    }

    const channel = supabaseClient
      .from('realtime_events')
      .on('INSERT', payload => {
        const ev = payload.new;
        console.log('Realtime event received', ev);
        onEvent?.(ev);
      })
      .subscribe();

    return () => {
      try {
        supabaseClient.removeSubscription(channel);
      } catch (e) {
        // ignore
      }
    };
  }, [onEvent]);

  return null; // invisible component
}
