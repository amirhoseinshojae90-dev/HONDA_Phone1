import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Phone1Provider } from '../src/state/Phone1Provider';

export default function RootLayout() {
  return (
    <Phone1Provider>
      <StatusBar style="light" hidden />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#06080b' },
        }}
      />
    </Phone1Provider>
  );
}
