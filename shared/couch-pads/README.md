# Couch Pads: phones as controllers

Shared by every game in this repo. With it, a player without a controller opens
**couch-coop-games.vercel.app/pad** on their phone (or scans the QR code on the join screen), types the
4-letter room code, and gets an on-screen gamepad: a drag stick on the left, A / B / X / Y and Pause on the right.

- Each phone shows up in `navigator.getGamepads()` as a standard gamepad called `Phone 1`, `Phone 2`, …
  (after any real controllers), so the games' existing controller code handles it. Phones, real controllers
  and the two keyboard halves can be mixed freely on the join screen.
- Phones talk to the game over a WebRTC data channel (direct, usually same Wi-Fi). Setting up the link
  goes through the free public PeerJS server (`0.peerjs.com`), so there's nothing to host and no keys.
  If a direct link can't be made, inputs travel over that server's socket instead (a little more lag)
  while the phone keeps retrying the direct link.
- If the game reloads, phones reconnect by themselves (the room code survives a reload). A phone that
  goes quiet for 3 seconds reads as a disconnected controller, so the games' "controller disconnected"
  handling applies.
- Rumble from the game vibrates the phone (Android; iPhones don't allow web vibration).
- Phone controllers need an internet connection on both the game and the phone. Offline, the panel says so
  and everything else works as before. With two real controllers connected and no phones, the panel hides.

## Files

| File | What |
|---|---|
| `couch-pads.js` | Loaded by each game. Host side (room code, QR panel, virtual gamepads) and the shared protocol. Includes a vendored copy of qrcode-generator (MIT). |
| `pad/index.html` | The phone page, published at `/pad/` by `scripts/build-site.mjs` (with `couch-pads.js` next to it). |
| `test/e2e.cjs` | Headless end-to-end check against a local PeerJS server. |

## How a game uses it

Wick & Shade loads it with `<script src="couch-pads.js">` (its build copies the file next to `game/index.html`);
Bolt & Nut imports it in `src/main.js` so esbuild bundles it. Then, once:

```js
CouchPads.init({
  game: 'Bolt & Nut', accent: '#ffb547',
  labels: { a: 'Jump', b: 'Power', x: 'Power', y: 'Narrator', start: 'Pause' }, // shown on the phone
  keys: ['WASD move · Space jump …', 'Arrows move · / jump …'],              // keyboard guide in the panel
  screen: () => mode === 'join' ? 'join' : mode === 'title' ? 'hint' : null, // 'join' = full panel, 'hint' = small reminder
  hintAt: 'bottom-left',                                                     // or 'bottom-right'
});
```

## Testing

```
cd shared/couch-pads && npm install && node test/e2e.cjs
```

It starts a local PeerJS server and file server, opens Bolt & Nut and Wick & Shade (build Bolt first), connects
two phones (one direct, one forced through the relay), joins, moves, presses the narrator and pause buttons,
reloads the game and checks the phone comes back. Any page can be pointed at a local signaling server with
`?signal=ws://127.0.0.1:9000/peerjs`; `?padrelay=1` forces the relay path.


## Signaling backup (2026-11-26)
The public PeerJS server alone proved unreliable (phones showed "Can't reach the connection service"). Both sides now also connect to public MQTT brokers over secure websockets (`wss://broker.emqx.io:8084/mqtt`, `wss://broker.hivemq.com:8884/mqtt`), send every signaling message on every channel that is up, and drop duplicates by message id. Override with `?mqtt=url1,url2` or `window.COUCH_PADS_MQTT`; `?nopeerjs=1` turns PeerJS off. Tests: `MODE=peerjs|mqtt|both node test/e2e.cjs` (local servers, no internet needed).
