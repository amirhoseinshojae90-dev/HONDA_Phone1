import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import { GpsState, EspState, PhoneMotion } from '../core/types';
import { mergeGps, requestGpsPermission } from '../services/gps';
import { fetchEspState, setEspCharger } from '../services/esp';

type Phone1ContextValue = {
  gps: GpsState;
  esp: EspState;
  motion: PhoneMotion;
  espIp: string;
  internetOk: boolean;
  setEspIp: (value: string) => void;
  toggleCharger: (on: boolean) => Promise<boolean>;
  resetDistance: () => void;
  refreshEsp: (ipOverride?: string) => Promise<void>;
};

const initialGps: GpsState = {
  latitude: null,
  longitude: null,
  accuracy: null,
  speedMps: null,
  distanceMeters: 0,
  active: false,
};

const initialMotion: PhoneMotion = {
  x: 0,
  y: 0,
  z: 0,
  magnitude: 0,
  moving: false,
};

const initialEsp: EspState = {
  ok: false,
  motorOn: false,
  ignition: false,
  ldrNight: false,
  fc51: false,
  charger: false,
  temperatureC: null,
  stopIndicator: false,
  ip: '192.168.1.50',
  lastSeen: null,
  error: 'ESP هنوز متصل نشده است',
};

const Phone1Context = createContext<Phone1ContextValue | null>(null);

export function Phone1Provider({ children }: PropsWithChildren) {
  const [gps, setGps] = useState(initialGps);
  const [espIp, setEspIpState] = useState('192.168.1.50');
  const [esp, setEsp] = useState(initialEsp);
  const [motion, setMotion] = useState(initialMotion);
  const [internetOk, setInternetOk] = useState(true);
  const gpsSub = useRef<Location.LocationSubscription | null>(null);
  const accelSub = useRef<{ remove: () => void } | null>(null);

  const setEspIp = (value: string) => {
    const v = value.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    setEspIpState(v || '192.168.1.50');
  };

  const refreshEsp = async (ipOverride?: string) => {
    const targetIp = ipOverride ?? espIp;
    try {
      const next = await fetchEspState(targetIp);
      setEsp(next);
    } catch (e) {
      setInternetOk(true);
      setEsp(prev => ({
        ...prev,
        ok: false,
        ip: targetIp,
        lastSeen: prev.lastSeen,
        error: e instanceof Error ? e.message : 'خطای ارتباط با ESP',
      }));
    }
  };

  const toggleCharger = async (on: boolean) => {
    try {
      await setEspCharger(espIp, on);
      setEsp(prev => ({ ...prev, charger: on, ok: true, error: null, lastSeen: new Date().toISOString() }));
      return true;
    } catch {
      setEsp(prev => ({ ...prev, error: 'ارسال فرمان شارژر ناموفق بود' }));
      return false;
    }
  };

  const resetDistance = () => {
    setGps(prev => ({ ...prev, distanceMeters: 0 }));
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const allowed = await requestGpsPermission();
      if (!allowed || cancelled) return;

      gpsSub.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1500,
          distanceInterval: 3,
        },
        loc => setGps(prev => mergeGps(prev, loc)),
      );
    })();

    Accelerometer.setUpdateInterval(300);
    accelSub.current = Accelerometer.addListener(({ x, y, z }) => {
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      setMotion({
        x, y, z, magnitude,
        moving: Math.abs(magnitude - 1) > 0.08,
      });
    });

    const timer = setInterval(() => {
      refreshEsp();
    }, 3000);

    refreshEsp();

    return () => {
      cancelled = true;
      gpsSub.current?.remove();
      accelSub.current?.remove();
      clearInterval(timer);
    };
  }, [espIp]);

  const value = useMemo(
    () => ({
      gps,
      esp,
      motion,
      espIp,
      internetOk,
      setEspIp,
      toggleCharger,
      resetDistance,
      refreshEsp,
    }),
    [gps, esp, motion, espIp, internetOk],
  );

  return <Phone1Context.Provider value={value}>{children}</Phone1Context.Provider>;
}

export function usePhone1() {
  const value = useContext(Phone1Context);
  if (!value) {
    throw new Error('usePhone1 must be used inside Phone1Provider');
  }
  return value;
}
