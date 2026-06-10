# Now Playing

A console-style Windows music companion for Decky Loader.

## Features

- Shows the active Windows media session in the Quick Access Menu.
- Displays track title, artist, album art and progress.
- Supports media controls: play/pause, previous, next, shuffle and repeat when exposed by the active player.
- Can launch common music apps: Spotify, TIDAL, Apple Music, Deezer, Amazon Music and SoundCloud.
- Includes a fullscreen Now Playing route / visualizer UI.
- Uses the bundled Windows helper `bin/MediaBridge.exe` to talk to Windows media sessions.

## Recovered project notes

This project was rebuilt from the recovered plugin package. The TypeScript sources in `src/` were recovered from `dist/index.js.map`. The already-built Decky frontend is preserved in `dist/index.js`.

## Development

```bash
npm install
npm run build
```

## Package for Decky on Windows

```powershell
npm run package:win
```

The installable package should contain `plugin.json`, `main.py`, `dist/index.js` and `bin/MediaBridge.exe` at the root of the zip.
