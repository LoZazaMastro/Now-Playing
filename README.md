# Now Playing

A console-style music companion for **Decky Loader on Windows**.

Now Playing brings Spotify, YouTube Music, local files and active Windows media sessions directly into Steam Big Picture, with artwork, playback controls, source volume, fullscreen visuals and controller-first browsing.

## Features

### Quick Access Menu

- Displays the active track, artist, album, artwork and playback progress.
- Responsive layout designed for the available Quick Access Menu width.
- Animated artwork glow while music is playing.
- Automatic scrolling for long track, artist and album names.
- Service-specific accent colors.
- Active indicators for shuffle and repeat.
- Full keyboard and gamepad navigation.
- Source-aware QAM navigation: Spotify uses Home and Search on the first row with a full-width Library button below; Your Music keeps Home, Library, Search and Queue in a compact two-row grid.

### Playback controls

- Play and pause.
- Previous and next track.
- Shuffle.
- Repeat mode.
- Per-source volume without changing the main Windows output volume. External applications use direct Windows Core Audio, while Spotify, YouTube Music and Your Music apply volume directly to their integrated player.
- Source-aware Windows media-session matching for Spotify, TIDAL, Apple Music, Deezer, Amazon Music and SoundCloud, including packaged-app and browser/PWA identifiers.

### Supported music services

Now Playing includes shortcuts and visual accents for:

- **Your Music**, the built-in local library and player
- Spotify — personal library browsing and integrated Spotify Connect playback
- YouTube Music — Home, Search, Library and integrated playback
- TIDAL
- Apple Music
- Deezer
- Amazon Music
- SoundCloud

### Spotify

Spotify includes an optional advanced mode for users who want to browse their music directly inside Now Playing. It uses the user's own Spotify developer **Client ID** and Authorization Code with PKCE; no shared Client Secret or bundled developer account is used.

When enabled and connected, Spotify is integrated directly below the Now Playing controls, without opening a separate plugin page. Source behavior is configurable: by default the matching desktop app opens when its source is selected and the previous source app closes when switching, while independent toggles can disable either action. Duplicate launches are suppressed and source transitions are serialized. The browser remains available through the Web API, while playback controls use an active Spotify Connect device when one is available. It includes:

- A dedicated **Spotify Big Picture** experience designed for TV and controller use, with an original console-style Home, Search, Library, detail pages and a horizontal Now Playing control card.
- A focused Home view with recent saved playlists and **New releases picked for you**, plus a direct Play action beside each playlist in the QAM. Consumer-only Home shelves such as Made for You, Daily Mix and Daylist are intentionally omitted because Spotify does not expose them through a stable public Web API endpoint.
- Spotify catalog search for tracks, albums, artists and playlists, with up to 10 results per category and search with the Enter key.
- Library browsing for liked tracks, albums, playlists and artists, with albums and artists sorted alphabetically.
- Spotify Big Picture loads every saved album, playlist and followed artist, paging through the private library and caching each response for six hours. All available cards are rendered directly without a **See all** control. Tracks retain their existing 50-item request, while bounded non-track library requests elsewhere in the plugin are limited to 100 items.
- **Play** and **Shuffle** actions for saved tracks, with the loaded tracks passed to Spotify as a continuing playback queue.
- Album and playlist detail pages with extended track lists and direct artist navigation from album pages.
- Artist pages organized into popular tracks, followed by albums and singles, with a **See all** control for the complete album list. Each Big Picture artist page ends with a background settings action that searches online artwork, shows its resolution and downloads the selected image for persistent use.
- Playback through the private integrated **Playhub Now Playing** Spotify Connect device.
- Keyboard and gamepad navigation throughout the browser and Spotify Big Picture. B or Escape moves through the internal history first and exits only when there are no Spotify pages left to return to. Returning from an album or artist restores focus to the card that opened it.
- B and Escape also close the plugin settings view correctly.
- A controller-friendly Home, Search and Library navigation bar independent from Steam’s native tab container. Each page has exactly one vertical scrolling surface, and Spotify queue browsing is intentionally omitted because the public API cannot provide a consistently editable or shuffle-safe queue experience.
- When Spotify mode is connected, the current album cover in the player can be selected to open that album directly.

Spotify is presented as one source. Catalog requests use the local cache and SpotifyScraper where supported; private account and library requests still use the user's Spotify Web API authorization. Playback, metadata, progress and transport state come from the integrated Spotify Connect player whenever it is ready, so Spotify.exe is not required and MediaBridge cannot overwrite the active Spotify state.

#### Spotify setup

The plugin settings include a complete copy-friendly guide. The dashboard flow is:

1. Open [Spotify Developer Dashboard](https://developer.spotify.com/dashboard), select **Log in** in the top-right corner and sign in.
2. Select your profile in the top-right corner, choose **Dashboard**, then select **Create app**.
3. In **App name* (required)** use `Playhub Now Playing`.
4. In **App description* (required)** use `Personal Spotify Web API connection for the Now Playing Decky Loader plugin on Windows.`
5. **Website** can remain empty.
6. In **Redirect URIs* (required)** add `http://127.0.0.1:43821/callback` exactly as written.
7. Under **Which API/SDKs are you planning to use?**, select only **Web API**.
8. Enable **I understand and agree**, then select **Save**.
9. Open the app, copy its **Client ID**, paste it into Now Playing and connect Spotify. A Client Secret is not required.

Every value that must be copied appears immediately below its corresponding step inside the plugin settings.

Spotify Development Mode requires the app owner to have Spotify Premium. The integrated player advertises **Playhub Now Playing** as a private Spotify Connect device and does not require Spotify.exe to remain open.

The Client ID and Spotify authorization tokens are stored locally on the PC in the Decky plugin settings directory.

#### Spotify API call savings

Now Playing checks its local memory/disk cache first. For supported public catalog requests it then uses the bundled SpotifyScraper adapter; the official Spotify Web API is called only when that adapter cannot return a usable result.

SpotifyScraper currently handles these plugin requests:

- Catalog search for tracks, albums, artists and playlists.
- Track metadata.
- Album metadata and album track lists.
- Artist metadata plus album and single lists.
- Playlist metadata and public playlist item lists when Spotify exposes them.

The official Spotify Web API is still required for account authorization and profile data, Home and private library content, and followed or saved items. Integrated playback and its live status normally stay on the local bridge; Web API playback calls are a bounded compatibility fallback only when that bridge is unavailable. Exported diagnostics show `scraper_hit` and fallback counters so the active path can be verified without exposing credentials.


### YouTube Music

YouTube Music appears immediately after Spotify and provides the same Home, Search, Library and Settings structure in QAM and Big Picture. It uses the bundled MIT-licensed `ytmusicapi` library for browsing and the in-process `yt-dlp` Python library to resolve audio streams without launching an executable. Playback shares the persistent local audio engine used by Your Music, including progress, queue, previous/next, play/pause, shuffle, repeat, volume, top-bar metadata and fullscreen visuals. Low, medium and high audio-quality options are available in Settings, with a red service accent throughout the interface.

Public search and browsing work without authentication. To unlock private library sections, select **Connect YouTube Music**. In the temporary sign-in window shown above Steam, choose your Google account or sign in with the account used for YouTube Music, then leave the window open. Now Playing completes the connection, closes the dedicated window and removes its temporary profile automatically. Credentials remain in the local Decky plugin settings directory and are never included in diagnostics. Manual request-header entry is retained only as an advanced recovery option when automatic sign-in fails.

### Your Music

**Your Music** turns Now Playing into a real local music player instead of only controlling external applications. Select it from the Apps section, then add one or more music folders from Settings.

- Recursively scans every selected folder and subfolder.
- Reads title, artist, album artist, album, track number, disc number, date/year, genre, duration and embedded artwork.
- Supports common tagged formats including MP3, FLAC, M4A/MP4, AAC, OGG, Opus, WAV, WMA, AIFF, APE, WavPack and MKA.
- Groups the collection into Tracks, Albums and Artists in both the QAM and a dedicated **Your Music Big Picture** interface.
- Includes search, Play, album and artist detail pages, queue-aware playback, previous/next, play/pause, shuffle, repeat and 0–100% volume. The QAM and Big Picture player expose an expandable queue with up to the next 10 tracks, and selecting one jumps directly to it.
- Uses embedded artwork first and falls back to the existing online cover provider when an album has no local artwork. Artist profile and background images are cached locally; **fanart.tv is preferred** when a personal API key is configured and **TheAudioDB** is the only automatic fallback. Spotify Web API requests are never used to discover artist profiles or backgrounds. The manual artist-background picker combines fanart.tv and TheAudioDB results automatically, with no provider dropdown, proxies previews through the protected localhost asset server, and persists the selected background locally. fanart.tv searches resolve multiple MusicBrainz artist IDs to handle ambiguous names.
- Feeds the normal Now Playing player, top-level fullscreen visualizer and cover effects while local music is playing. The Steam top bar uses a dedicated speaker icon for this source.
- Local playback state is session-only: the plugin never restores an old track, queue or position after a reload. While Steam keeps the player alive, QAM and Big Picture read the same live singleton state. Selecting a new folder automatically rescans the library and starts image analysis. Image-cache creation and removal both report live progress, Settings shows automatic cache and manually selected background sizes separately in MB, and a dedicated action can remove every user-selected artist background.

Playback is hosted inside the Steam/Decky frontend through a persistent HTML audio engine, backed by a protected per-session localhost streaming server with seeking and complete HTTP Range support, including suffix ranges used by Chromium to read M4A/MP4 metadata stored at the end of a file. It does not require Spotify or another music application to remain open. MP3, AAC/M4A, FLAC, OGG, Opus, WAV, WMA, AIFF, APE, WavPack and MKA files are indexed; actual decoding support follows the codecs available to Steam CEF on Windows. The bundled TinyTag metadata reader is used locally, and music files and tags are never uploaded.

### Source app behavior

Two independent settings control external source applications:

- **Automatically open source apps** — enabled by default. The matching app opens only when the selected source actually changes and only if its process is not already running.
- **Close source apps when switching** — enabled by default. The previous external source is paused first, then its exact application processes are closed before the next source is launched. Browser processes are never terminated for PWA fallbacks.

Transitions are serialized and guarded against repeated requests, pending launches and stale session-selection retries. When the selected external application is already running, the QAM shows **Close {app}** instead of a redundant Open action. **Your Music**, **Spotify** and **YouTube Music** do not launch an external source app.

### Cover art sources

Choose how album artwork is retrieved:

- **Online | High resolution** — uses online artwork matching for higher-resolution covers. This is the default option.
- **Windows | Faster** — uses artwork supplied directly by the active Windows media session for faster and more precise matching.

Online artwork may occasionally differ from the exact release being played. Windows artwork is usually more accurate, but its resolution depends on the source application. When the personal Spotify Web API mode is enabled and connected, Spotify tracks use the artwork returned directly by Spotify instead of either fallback source.

### Spotify Big Picture

Select **Spotify Big Picture** above the Spotify Home, Search and Library controls to open a dedicated Spotify experience reinterpreted for Steam Big Picture. It includes:

- Steam-compatible **Home, Search and Library tabs** implemented directly by the plugin for deterministic controller focus and a single vertical scrolling surface per page.
- A full-screen artwork glow derived from the currently playing album. Artist pages use cached wide artwork from fanart.tv first and TheAudioDB second; Spotify Web API artwork is never promoted into artist-background discovery. Manually selected artist backgrounds override automatic artwork.
- Large horizontal shelves and Steam-native cards that keep their size when focused instead of expanding outside their layout.
- A full-screen Home player with selectable artwork, large track information, progress and Steam-native playback controls including shuffle and repeat state indicators.
- Album, playlist and artist pages with internal history, direct playback and links from albums to their artists. Returning to a shelf or library grid restores focus to the exact card that was opened.
- Album release years and cleaner album track lists without repeating the same artwork beside every song.
- Immediate suppression of Steam Big Picture’s top bar and footer.
- B/Escape navigation that returns through Spotify pages before closing the fullscreen experience.
- A dedicated Spotify artist background cache can be created or cleared from Settings. It is intentionally limited to followed artists, reports live progress and automatic/manual disk sizes separately, and only accepts suitable high-resolution wide artwork, avoiding an unbounded cache of the full Spotify catalog. A separate action removes all manually selected Spotify artist backgrounds.

### Fullscreen mode

Immerse yourself in a dedicated fullscreen music experience, seamlessly integrated into Steam Big Picture.

- Large album artwork and track information.
- Compact playback controls.
- Current time display.
- Weather information when the compatible [Weather plugin](https://github.com/LoZazaMastro/Weather) is available.
- Immediate hiding of the Steam Big Picture top bar and footer.

#### Available fullscreen experiences

**Glow**

A soft, luminous field gently radiates from the album artwork, giving every track a warm and immersive presence.

**Ocean**

Fluid waves of light move across the screen with a calm, continuous rhythm, creating a more cinematic listening atmosphere.

**Cover Blur**

The album artwork expands into a rich, softly blurred backdrop, surrounding the interface with the colors and mood of the music.

**Energy Saver**

A minimal, distraction-free view designed for long listening sessions, with reduced motion and a darker visual footprint.

**Flower and Circle**

Two lightweight Canvas 2D particle experiences adapted from audible-visuals. They sample their colors from the current cover and react to the real integrated-player audio level through Web Audio for Your Music and YouTube Music, and through the existing Spotify playback bridge for Spotify. They run in the existing frontend animation loop and require no additional process or executable.

### Steam top bar integration

Show the current track next to the Steam clock while music is playing.

- Displays the selected service icon and track title.
- Automatically hides when playback is paused or stopped.
- Can be positioned after the Weather indicator when the Weather plugin is installed.
- Includes an option to move the clock and Now Playing information to the left side of the top bar.
- Uses a speaker icon for Your Music and service-specific icons for Spotify, YouTube Music and external applications.

## Languages

Now Playing ships with complete, centrally validated interface translations for:

- English
- Italian
- Spanish
- French
- German
- Brazilian Portuguese
- Russian
- Japanese
- Korean
- Simplified Chinese

Every bundled language contains the same set of interface strings, setup instructions, empty states and runtime messages. The build fails when a key is missing, a translation is empty, an array has the wrong number of entries or a placeholder such as `{time}` is lost. Steam-style language identifiers such as `italian`, `brazilian`, `koreana` and `schinese` are recognized in addition to normal browser locale codes. Unsupported locales fall back consistently to English rather than mixing translated and untranslated sections.

## Requirements

- Windows 10 or Windows 11.
- Decky Loader for Windows.
- A compatible music application exposing a Windows media session.
- Spotify Premium and a personal Spotify developer Client ID for Spotify browsing and playback.

Some applications may expose only part of their controls. Shuffle, repeat, seeking and artwork availability can vary between services and app versions.

## Troubleshooting

### The plugin does not detect the current track

- Confirm that playback is active in a compatible Windows media application.
- Check whether the application exposes media controls to the Windows volume and media overlay.
- Restart the music application and reopen Now Playing.
- Fully restart Steam if the plugin was just installed or updated.

For external services, start a track once and confirm that Windows media controls can see it. Now Playing 2.2.0 actively selects the session that matches the chosen source, including TIDAL, Apple Music, Deezer, Amazon Music and SoundCloud. Spotify and YouTube Music use their integrated players and do not depend on a Windows media session exposed by their desktop applications.

### Artwork is incorrect

Select **Windows | Faster** in the plugin settings to use artwork supplied directly by the active media session.

### Artwork quality is low

Select **Online | High resolution**. Final quality still depends on whether a matching online release can be found.

### A playback control is missing or unavailable

The active application may not expose that command through Windows SMTC. Now Playing can only use controls made available by the media session.

### Per-app volume is unavailable

Start playback first so Windows creates an audio session for the selected music application. Now Playing remembers a separate volume for every source and controls Windows Core Audio directly, without a separate volume helper executable. Spotify uses the same saved value in QAM, Big Picture and the integrated Spotify player; Your Music applies it directly to the live HTML audio engine. Delayed responses are revision-checked so an older command cannot overwrite the latest value.

### The player becomes slow or stops updating

Open the plugin settings and use **Restart plugin services**. This is a full recovery action: it shuts down the registered helper, removes stale or duplicate instances, clears shared session/process state and starts MediaBridge on a newly allocated loopback port. It then verifies helper health, probes Windows media sessions and reselects the active session when available. Recovery runs independently from normal polling, so it cannot remain queued behind a stuck bridge. Cover and volume helpers remain on-demand and are relaunched automatically when needed. Now Playing also monitors MediaBridge failures and memory use and can schedule an automatic recovery.

### Export a diagnostic log

Use **Export diagnostic log** in either QAM Settings or Big Picture Settings. Now Playing writes a timestamped text file to the Windows Downloads folder containing the active source, registered MediaBridge endpoint/port/PID, helper lifecycle and request latency, detected applications and processes, sanitized cached/live media-session snapshots, recovery steps, volume and top-bar events, Spotify cooldown state, local-player state, and detailed artwork/network attempts. Runtime logs rotate automatically and the export includes up to 5,000 structured events. Access tokens, refresh tokens, secrets and API keys are redacted automatically.

fanart.tv picker thumbnails use the lightweight `/preview/` asset, while applying a selection still downloads the full-resolution image whenever the CDN makes it available. Every thumbnail is validated and cached locally before it is exposed through the plugin's protected localhost image server. The plugin never launches `curl.exe` or a terminal window for artwork. A translated link beside the fanart.tv API-key field opens the key page in the foreground browser.

The shared fanart.tv API configuration is presented in its own settings card immediately after Spotify, making clear that the provider is used by both Spotify and the local music library. Its compact API-page button is translated in every supported language.

After Spotify authentication succeeds, the registration guide and Client ID controls collapse automatically behind a translated **Show details** button. Expanding it changes the action to **Hide details** and also exposes Disconnect; leaving Settings resets the panel to its compact state. Audio quality, music cache and library options remain visible at all times.

Spotify playback helper ownership includes both the installed `bin` directory and the plugin's hash-versioned temporary runtime directory. Before a new Connect player is published, stale plugin-owned playback helpers are terminated so only one **Playhub Now Playing** device remains advertised.

### Spotify does not connect

- Confirm that the Client ID is copied from the same Spotify developer app where the redirect URL was added.
- Confirm that **Web API** was selected when Spotify asked which API or SDK the app uses.
- Confirm that the redirect URL is exactly `http://127.0.0.1:43821/callback`.
- Do not use `localhost` in the Spotify app settings.
- Check that another application is not using TCP port `43821`.
- Disconnect and reconnect Spotify after changing the Client ID or requested permissions. Reconnect once after upgrading from an earlier 2.0.0 test build so Spotify can grant the `streaming` permission required by playback on this PC.


### Spotify API is temporarily paused

Spotify may temporarily return a rate-limit response when too many Web API requests are made in a short period. Now Playing respects Spotify’s requested cooldown, shows a discreet countdown below **Spotify Big Picture**, and uses cached data whenever possible. Integrated playback, local Windows playback detection, transport controls and volume remain available during the cooldown. Catalog actions that require an unavailable API response are blocked and show the remaining cooldown without opening Spotify.exe.

Do not repeatedly reconnect the account or recreate the Spotify developer app: that does not shorten a cooldown already issued by Spotify. Wait for the displayed countdown to finish.

### Spotify cannot start playback

- Confirm that the Spotify account has Premium.
- Confirm that Spotify is connected in Now Playing Settings and that the requested `streaming` permission was granted.
- Use **Restart plugin services** to recreate the private **Playhub Now Playing** device if it no longer appears in Spotify Connect.
- Some public playlist track lists are restricted by Spotify Development Mode; the playlist can still be started as a context even when its individual tracks are not shown.

## Development

```bash
npm install
npm run build
npm run verify
```

`npm run verify` checks translation completeness and placeholders, TypeScript including unused symbols, Python syntax, portable backend smoke tests and the generated JavaScript bundle.

## Package for Decky on Windows

```powershell
npm run package:win
```

The installable package includes the compiled frontend, Python backend, three required Windows helpers and vendored Python dependencies. YouTube Music stream resolution runs in-process; direct Windows Core Audio volume control does not require a separate helper executable.

## License

Released under the [MIT License](LICENSE).

## Credits

Created and maintained by **LoZazaMastro**.

Now Playing uses Decky Loader, React, `@decky/ui`, `@decky/api`, Windows media/audio APIs, TinyTag, the Spotify Web API, librespot, ytmusicapi, yt-dlp and websocket-client. The Flower and Circle fullscreen modes are adapted from audible-visuals. Full third-party attribution is retained in `NOTICE` and `licenses/`.


### Fanart network compatibility

Fanart downloads use only in-process networking. On Windows the plugin first tries WinHTTP, then an explicit IPv4 HTTP/1.1 connection with normal TLS verification, and finally the standard Python transport. No curl, PowerShell or visible terminal is launched. Picker thumbnails are inserted into the UI only after successful preloading, so failed CDN requests show a clean placeholder rather than a broken-image icon.

### Spotify playback on this PC

Spotify appears as one source. With Spotify Premium and the `streaming` permission, the bundled playback helper registers a private Spotify Connect device named **Playhub Now Playing** and supplies playback, metadata, artwork and transport state directly to the plugin. The former Windows-session-only entry is retained only as an internal settings migration alias and is not shown in the interface.

### Spotify progress and volume synchronization

Spotify uses one saved player-volume value across QAM and Big Picture. It is applied directly to the integrated playback session without changing the Windows device volume. Progress is interpolated locally between bridge samples and shared between QAM and Big Picture. Cover glow remains attached to the current artwork while metadata and high-resolution artwork resolve.

### Background search limits

Manual artist-background searches run on a dedicated worker, return partial provider results within a 15-second backend deadline and have a 16-second UI deadline. The picker loads at most two previews concurrently and aborts each preview request after 12 seconds, so a slow Fanart.tv or TheAudioDB response cannot leave the Settings page loading indefinitely. Failed previews stay as clean placeholders.
