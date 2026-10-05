export type GpsState = {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  speedMps: number | null;
  distanceMeters: number;
  active: boolean;
};

export type EspState = {
  ok: boolean;
  motorOn: boolean;
  ignition: boolean;
  ldrNight: boolean;
  fc51: boolean;
  charger: boolean;
  temperatureC: number | null;
  stopIndicator: boolean;
  ip: string;
  lastSeen: string | null;
  error: string | null;
};

export type PhoneMotion = {
  x: number;
  y: number;
  z: number;
  magnitude: number;
  moving: boolean;
};
