import * as Location from 'expo-location';
import { GpsState } from '../core/types';

const toRad = (d: number) => (d * Math.PI) / 180;

export function distanceMeters(
  aLat: number,
  aLon: number,
  bLat: number,
  bLon: number,
) {
  const R = 6371000;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const sa =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(sa));
}

export async function requestGpsPermission() {
  const fg = await Location.requestForegroundPermissionsAsync();
  return fg.status === 'granted';
}

export async function getCurrentLocation() {
  return Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
}

export function mergeGps(
  prev: GpsState,
  next: Location.LocationObject,
): GpsState {
  const { latitude, longitude, accuracy, speed } = next.coords;
  const hasPrev = prev.latitude !== null && prev.longitude !== null;
  const extra =
    hasPrev && latitude != null && longitude != null
      ? distanceMeters(prev.latitude!, prev.longitude!, latitude, longitude)
      : 0;

  return {
    latitude,
    longitude,
    accuracy,
    speedMps: speed,
    distanceMeters: prev.distanceMeters + Math.max(0, extra),
    active: true,
  };
}
