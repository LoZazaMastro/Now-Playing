# Now Playing

A console-style Windows music companion for Decky Loader.

<video src="https://github.com/user-attachments/assets/5aed4899-09d0-45ac-a1f0-4a05dc18068e" width="1920" height="1080" controls></video>
<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/e90a33c8-feb0-4a97-995f-0ce0b9f3fc81" />
<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/7d0baa4a-1181-44ba-9a6a-7e214068c669" />


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
