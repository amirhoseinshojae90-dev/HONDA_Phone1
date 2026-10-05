# PROJECT STATE - HONDA Phone 1 v3.0.0

## Architecture
Samsung A045F = Phone 1 / dashboard / GPS / motion / local gateway.
ESP8266 = local hardware controller.
Phone 2 + Backend = later stages.

## Fixed ESP8266 pinout
- D0 / GPIO16 = LDR digital input
- D1 / GPIO5 = siren relay
- D2 / GPIO4 = FC-51 IR
- D5 / GPIO14 = charger relay
- D6 / GPIO12 = small-light relay
- D7 / GPIO13 = ignition input
- D8 / GPIO15 = STOP indicator only
- A0 = 10K NTC
- RX/TX = programming only, not used by the app contract

## Phone 1 restrictions
Local control: charger only.
Other hardware values are displayed read-only.

## Camera
Phone 1 has front/rear camera switching, photo capture and video recording.
Remote camera control will be implemented later through authenticated signaling. No unauthenticated remote camera activation.

## Current local API contract
GET `/api/v1/state`
POST `/api/v1/charger` with `{ "on": boolean }`

## Safety
STOP is an indicator, never an engine cutoff.
