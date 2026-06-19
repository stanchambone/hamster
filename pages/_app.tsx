// pages/_app.tsx
import React from 'react';
import type { AppProps } from 'next/app';
import MultiplayerClient from '../components/MultiplayerClient';
import { handleRealtimeEvent } from '../lib/realtimeHandlers';
import RealtimeEffects from '../components/RealtimeEffects';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <MultiplayerClient onEvent={handleRealtimeEvent} />
      <RealtimeEffects />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
