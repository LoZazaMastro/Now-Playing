<div align="center">

# Now Playing

### All your music. Right where you play.

Spotify, YouTube Music, local files, and Windows media sessions inside Steam Big Picture, with gamepad controls and full-screen visualizers.

[![Release](https://img.shields.io/github/v/release/LoZazaMastro/Now-Playing?style=for-the-badge&label=Release&labelColor=111111&color=ffffff)](https://github.com/LoZazaMastro/Now-Playing/releases/latest)
[![Licenza MIT](https://img.shields.io/badge/Licenza-MIT-ffffff?style=for-the-badge&labelColor=111111)](LICENSE)

</div>

## Music no longer interrupts your game

Now Playing combines an instant QAM panel with a full-screen music application. Control your tracks from the quick access menu without leaving your game, or browse libraries, albums, playlists, and artists from the full page via a TV-friendly interface.

Each source maintains its own separate volume and status. When you switch services, the plugin starts the new player and closes the previous one, preventing overlapping audio and unnecessary processes.

## Supported sources

- **Your Music:** recursive scanning of local folders containing MP3, FLAC, M4A, AAC, OGG, and WAV files, complete with tags, cover art, search, and a live queue.
- **Spotify:** library, playlists, albums, integrated playback, local audio cache up to 5 GB, and an API usage indicator.
- **YouTube Music:** Home, Search, and Library, login via temporary window, playback, and next-track prefetching.
- **Windows Media Sessions:** metadata and transport controls for TIDAL, Apple Music, Deezer, Amazon Music, SoundCloud, and other compatible players.

## Visualizers and full-screen listening

The full-screen player features 3D particle fields, spheres, waves, rings, knots, cones, flowers, circles, cover blur, and glow effects. The responsiveness is balanced across Spotify, local files, and YouTube Music, ensuring visual energy remains consistent when switching sources.

Main controls:

- **LB / RB:** change effect;
- **X:** change information layout;
- **Y:** change cover art size;
- **LT / RT:** previous or next track;
- **R3:** play or pause;
- **D-pad up / down:** rotate 3D effects.

If the Weather plugin is installed, the visualizer can also display the forecast.

## Surround upmix

Stereo tracks from Spotify, Your Music, and YouTube Music can be distributed to 5.1 or 7.1 audio systems. Each channel features dedicated volume controls adjustable from the controller with immediate preview. On a stereo device, the system automatically downmixes the audio.

## What's new in version 2.5.0

- Spotify opens the audio output only when playback starts and automatically reopens it after a pause or device change.
- A Spotify track is only marked as started once the decoded audio reaches an active output.
- Spotify Home is prepared as a single cacheable payload, while independent calls run in parallel.
- Large libraries display the first page instantly and complete loading in the background.
- YouTube Music Home, Search, and Library utilize persistent caches; independent sections are requested in parallel.
- **Play all**, shuffle, and progressive browsing continue to use the entire library, not just the currently visible elements.

## Configuration

### Spotify

1. create an app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard);
2. use `Playhub Now Playing` as the name and add exactly `http://127.0.0.1:43821/callback` to the Redirect URIs;
3. select only **Web API**;
4. copy the Client ID into the Now Playing settings and choose **Connect Spotify**.

### YouTube Music

Choose **Connect YouTube Music**. The plugin opens a temporary window for login and captures the session upon completion, requiring no Google Cloud configuration.

### Your Music

Add one or more folders in the settings and start **Scan library**. The indexing of tracks, tags, and covers will continue in the background.

## Installation

Install and update Now Playing from the [Playhub](https://github.com/LoZazaMastro/Playhub) Plugin Store, or download the ZIP from the [latest release](https://github.com/LoZazaMastro/Now-Playing/releases/latest) and choose **Decky → Settings → Developer → Install plugin from ZIP**.

## Troubleshooting

- VPNs and network filters may slow down the resolution of YouTube Music streams.
- The first track of a new YouTube Music context may take a few seconds; subsequent tracks are prepared in advance.
- Upmixing is only audible as multi-channel if Windows and the playback device natively expose 5.1 or 7.1 channels.
- **Restart plugin services** remains available as a diagnostic tool, but normal Spotify initialization and output device changes should not require it.

## Development

```powershell
pnpm install
pnpm run build
python -m py_compile main.py ytmusic_service.py
.\package-win.ps1
```

## License

Now Playing is distributed under the [MIT](LICENSE) license. Third-party components and tools are documented in [NOTICE](NOTICE) and inside the `licenses` folder.

<div align="center">

Created and maintained by **[LoZazaMastro](https://github.com/LoZazaMastro)**.

</div>
