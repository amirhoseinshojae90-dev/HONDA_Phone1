import { EspState } from '../core/types';

const normalizeBase = (ip: string) => {
  const clean = ip.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
  return `http://${clean}`;
};

export async function fetchEspState(ip: string): Promise<EspState> {
  const base = normalizeBase(ip);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(`${base}/api/v1/state`, {
      method: 'GET',
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    return {
      ok: true,
      motorOn: Boolean(data.motorOn ?? data.ignition),
      ignition: Boolean(data.ignition),
      ldrNight: Boolean(data.ldrNight ?? data.night),
      fc51: Boolean(data.fc51 ?? data.objectPresent),
      charger: Boolean(data.charger),
      temperatureC:
        typeof data.temperatureC === 'number'
          ? data.temperatureC
          : typeof data.temperature === 'number'
            ? data.temperature
            : null,
      stopIndicator: Boolean(data.stopIndicator),
      ip,
      lastSeen: new Date().toISOString(),
      error: null,
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function setEspCharger(ip: string, on: boolean) {
  const base = normalizeBase(ip);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(`${base}/api/v1/charger`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ on }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return true;
  } finally {
    clearTimeout(timer);
  }
}
