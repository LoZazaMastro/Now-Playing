# Now Playing

**All your music. Right where you play.**

Now Playing is a full-screen, controller-first music companion for Decky Loader on Windows. It brings your favorite streaming services, local files, and desktop media players directly into Steam Big Picture and the Quick Access Menu with custom artwork, instant track transitions, surround sound upmixing, and audio-reactive fullscreen visualizers.

## Part of the Playhub Ecosystem

Now Playing and other incredible plugins are designed to work seamlessly as part of **Playhub**, a project created to consolize your Windows gaming experience with features like Steam-first startup, easy Decky plugins installation, game imports, and Big Picture polish. To discover and download the Playhub app and access all the Playhub Plugins, visit the [Playhub Repository on Github](https://github.com/LoZazaMastro/Playhub).

## Two Ways to Listen

Now Playing adapts seamlessly to what you're doing, gaming or relax, offering two dedicated control modes:

### Quick Access Menu (QAM)
**Instant control without leaving your game.**
Open the Quick Access Menu to check the active track, artist, and album at a glance. Enjoy responsive layouts, glowing animated backgrounds that captures the colors of your playing track, and navigation grids tailored to your active audio source to quick find your favourite music.

### Big Picture Mode
**An immersive, TV-optimized browser.**
Dive into a dedicated, full-screen music experience designed for gamepads. Explore artist discographies, browse playlists, search for new music, and get lost without ever reaching for a keyboard or mouse.

## Supported Music Services

Now Playing connects directly with the platforms you already use, providing dedicated controls, custom styling, and smart playback tracking for every source:

*   **Your Music:** A powerful local library player that recursively scans your folders for tagged audio files including MP3, FLAC, M4A, AAC, OGG, and WAV. It includes automated artist background matching via fanart.tv and TheAudioDB, instant library search, and an expandable 10-track live queue. It shares the same persistent player, queue, and fullscreen experience as online sources.
*   **Spotify:** Enjoy a faster and more reliable connection using your personal Developer Client ID. Metadata for cover art, song title, and artist now appears instantly when you shuffle or start a playlist or album without waiting for the bridge to report the track. Play-all and shuffle now cover your entire saved-tracks library, showing all tracks in Big Picture and listing up to 100 in QAM while still playing through everything. Selecting a saved track always starts the exact song you chose. The Spotify settings card features a live API-usage meter reading internal counters without generating extra API calls. The local audio cache target is raised to 5 GB with a built-in usage indicator once the bundled bridge binary is rebuilt on Windows.
*   **YouTube Music:** Browse Home, Search, and Library, plus your albums, playlists, and artists directly in QAM and Big Picture. It features simple cookie sign-in: log in once via a temporary browser window and the plugin captures your session automatically with zero Google Cloud setup. Enjoy a dedicated "New releases" shelf on Home for albums and singles. Streams resolve rapidly through optimized client paths (`android_vr`, `ios`, and `android`) that do not require a PO token, starting playback instantly even without YouTube Premium. Next-track prefetch runs on a dedicated background worker, keeping skipping and shuffling responsive without slowing down your active track. It also includes an independent artist-background cache in settings to create or clear cached images, remove chosen backgrounds, and monitor asset sizes.
*   **Active Windows Media:** Smart media-session matching with full transport controls, live track metadata, and artwork for **TIDAL**, **Apple Music**, **Deezer**, **Amazon Music**, and **SoundCloud**.

## Key Features & Highlights

### Surround Upmix
An expandable "Upmix surround" card in Settings allows you to upmix stereo tracks to 5.1 or 7.1 layouts. You can adjust per-speaker volume from 0 to 100 across every channel: 6 channels for 5.1 and 8 channels for 7.1, including Front Left, Front Right, Center, LFE, Surround Left, Surround Right, Back Left, and Back Right. Speakers are selected using left and right on your controller, displaying a live highlight frame as volume changes apply in real time. This feature works seamlessly with Your Music and YouTube Music on real 5.1 or 7.1 HDMI and USB audio outputs, while standard stereo speakers automatically downmix the audio.

### Audio-Reactive Fullscreen Visualizers
Turn your TV or monitor into a dynamic visual experience. Choose from multiple audio-reactive modes including 3D Particle Fields, Spheres, Waves, Rings, Knots, Cones, Flower, Circle, Cover Blur, and Glow. Visualizer intensity is dynamically balanced across Spotify, local music, and YouTube Music using adaptive gain so every source reacts with the same energy. You can also adjust 3D particle resolution directly in settings. Take complete control with dedicated gamepad shortcuts:
*   **LB / RB:** Cycle through visualizer effects.
*   **X:** Cycle information layout.
*   **Y:** Toggle album cover size.
*   **LT / RT:** Skip to previous or next track.
*   **R3:** Play or pause audio.
*   **D-pad Up / Down:** Rotate 3D particle effects.

Do you want to see the forecast in your Now Playing fullscreen visualizer? **[Be sure to download the Playhub app](https://github.com/LoZazaMastro/Playhub)** and install Weather from the Playhub Plugin Store.

### Per-Source Volume Control & Smart Switching
Adjust your music volume independently without changing your main Windows master volume or your game audio. Now Playing remembers custom volume levels for every single service. When you change your music source, the plugin automatically launches the new player and cleanly closes the previous one to save system resources and prevent audio overlap.

## Setup Guide

### Your Music (Local Files)
1. Open Now Playing Settings and select **Your Music**.
2. Add one or more music folders from your PC and select **Scan library**.
3. The plugin will automatically index your tracks, tags, and album artwork in the background.
4. Done! Enjoy your music!

### Spotify
Follow the guide provided in the plugin step by step.
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and log in.
2. Click **Create app** and use these exact details:
   *   **App name:** `Playhub Now Playing`
   *   **App description:** `Personal Spotify Web API connection for the Now Playing Decky Loader plugin on Windows.`
   *   **Redirect URIs:** Add exactly `http://127.0.0.1:43821/callback`
3. Under **Which API/SDKs are you planning to use?**, check only **Web API**.
4. Save the app, copy your **Client ID**, and paste it into Now Playing settings.
5. Select **Save Client ID** and then **Connect Spotify**.
6. Done! Enjoy your music!

### YouTube Music
1. In Now Playing Settings, select **Connect YouTube Music**.
2. A secure, temporary browser window will appear. Log into your Google account once.
3. Close the window when finished. The plugin will capture your session cookie automatically.
4. Done! Enjoy your music!

## Troubleshooting & Known Tips

*   **YouTube Music or Spotify feels sluggish?** A VPN can trigger YouTube bot checks and slow down track resolution. Try disabling your VPN if loading feels slow.
*   **First track loading delay:** The first track of a new YouTube Music context may take 1 to 3 seconds to resolve, but all subsequent tracks in the queue are prefetched instantly.
*   **Album cover shortcuts:** Clicking the YouTube Music cover only opens the album page when the playing track carries an explicit album ID, that's a YouTube Music limit.
*   **Surround sound output:** Upmix surround is only audible on multi-channel HDMI or USB hardware; standard stereo speakers will automatically downmix the signal.
*   **You cannot hear the current Spotify track / The current track isn't showing?** Click **Restart plugin services** in **Settings** to reset background helpers, clear shared memory, and reconnect audio bridges immediately, then select again the music you want to play.

## Installation

Download, install and update Now Playing and other plugins from the Playhub Plugin Store in the Playhub app! **[You can download the Playhub app here](https://github.com/LoZazaMastro/Playhub)**

Or download the latest release zip file from this repo and install it directly through Decky Loader by enabling Developer Mode and selecting **Install from zip**.

## License & Credits

Created and maintained by **LoZazaMastro**.
Released under the [MIT License](LICENSE).
