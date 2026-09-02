<div align="center">

# Now Playing

### Tutta la tua musica. Proprio dove giochi.

Spotify, YouTube Music, file locali e sessioni multimediali Windows dentro Steam Big Picture, con controlli da gamepad e visualizzatori a schermo intero.

[![Release](https://img.shields.io/github/v/release/LoZazaMastro/Now-Playing?style=for-the-badge&label=Release&labelColor=111111&color=ffffff)](https://github.com/LoZazaMastro/Now-Playing/releases/latest)
[![Licenza MIT](https://img.shields.io/badge/Licenza-MIT-ffffff?style=for-the-badge&labelColor=111111)](LICENSE)

</div>

## La musica non interrompe più il gioco

Now Playing unisce un pannello QAM immediato e un'applicazione musicale full-screen. Dal menu rapido controlli il brano senza abbandonare la partita; dalla pagina completa esplori librerie, album, playlist e artisti con un'interfaccia adatta al televisore.

Ogni sorgente mantiene volume e stato separati. Quando cambi servizio, il plugin avvia il nuovo lettore e chiude quello precedente, evitando sovrapposizioni e processi inutili.

## Sorgenti supportate

- **La tua musica:** scansione ricorsiva di cartelle locali con MP3, FLAC, M4A, AAC, OGG e WAV, tag, copertine, ricerca e coda live.
- **Spotify:** libreria, playlist, album, riproduzione integrata, cache audio locale fino a 5 GB e indicatore dell'uso API.
- **YouTube Music:** Home, Cerca e Libreria, accesso tramite finestra temporanea, riproduzione e prefetch del brano successivo.
- **Sessioni multimediali Windows:** metadati e controlli di trasporto per TIDAL, Apple Music, Deezer, Amazon Music, SoundCloud e altri player compatibili.

## Visualizzatori e ascolto full-screen

Il lettore a schermo intero offre campi di particelle 3D, sfere, onde, anelli, nodi, coni, fiore, cerchio, sfocatura della cover e bagliore. La risposta viene bilanciata fra Spotify, file locali e YouTube Music, così l'energia visiva resta coerente cambiando sorgente.

Comandi principali:

- **LB / RB:** cambia effetto;
- **X:** cambia disposizione delle informazioni;
- **Y:** cambia dimensione della cover;
- **LT / RT:** brano precedente o successivo;
- **R3:** riproduci o metti in pausa;
- **D-pad su / giù:** ruota gli effetti 3D.

Con il plugin Weather installato, il visualizzatore può mostrare anche le previsioni.

## Upmix surround

I brani stereo di Spotify, La tua musica e YouTube Music possono essere distribuiti su impianti 5.1 o 7.1. Ogni canale ha un volume dedicato, regolabile dal controller con anteprima immediata. Su un dispositivo stereo il sistema esegue automaticamente il downmix.

## Novità della versione 2.5.0

- Spotify apre l'uscita audio soltanto quando la riproduzione parte e la riapre automaticamente dopo una pausa o un cambio di dispositivo.
- Un brano Spotify viene indicato come avviato soltanto quando l'audio decodificato raggiunge un'uscita attiva.
- Home Spotify viene preparata come un unico payload memorizzabile, mentre le chiamate indipendenti procedono in parallelo.
- Le librerie grandi mostrano subito la prima pagina e completano il caricamento in background.
- Home, Cerca e Libreria di YouTube Music usano cache persistenti; le sezioni indipendenti vengono richieste in parallelo.
- **Riproduci tutto**, riproduzione casuale e navigazione progressiva continuano a usare l'intera libreria, non soltanto gli elementi già visibili.

## Configurazione

### Spotify

1. crea un'app nel [Spotify Developer Dashboard](https://developer.spotify.com/dashboard);
2. usa `Playhub Now Playing` come nome e aggiungi esattamente `http://127.0.0.1:43821/callback` ai Redirect URI;
3. seleziona soltanto **Web API**;
4. copia il Client ID nelle impostazioni di Now Playing e scegli **Connetti Spotify**.

### YouTube Music

Scegli **Connetti YouTube Music**. Il plugin apre una finestra temporanea per l'accesso e acquisisce la sessione al termine, senza configurazione Google Cloud.

### La tua musica

Aggiungi una o più cartelle nelle impostazioni e avvia **Scansiona libreria**. L'indicizzazione di brani, tag e copertine continua in background.

## Installazione

Installa e aggiorna Now Playing dal Plugin Store di [Playhub](https://github.com/LoZazaMastro/Playhub), oppure scarica lo ZIP dall'[ultima release](https://github.com/LoZazaMastro/Now-Playing/releases/latest) e scegli **Decky → Impostazioni → Sviluppatore → Installa plugin da ZIP**.

## Risoluzione dei problemi

- VPN e filtri di rete possono rallentare la risoluzione dei flussi YouTube Music.
- Il primo brano di un nuovo contesto YouTube Music può richiedere qualche secondo; i successivi vengono preparati in anticipo.
- L'upmix è udibile come multicanale soltanto se Windows e il dispositivo espongono realmente 5.1 o 7.1.
- **Riavvia i servizi del plugin** resta disponibile come strumento diagnostico, ma il normale avvio Spotify e i cambi di uscita non dovrebbero richiederlo.

## Sviluppo

```powershell
pnpm install
pnpm run build
python -m py_compile main.py ytmusic_service.py
.\package-win.ps1
```

## Licenza

Now Playing è distribuito con licenza [MIT](LICENSE). Componenti e strumenti di terze parti sono documentati in [NOTICE](NOTICE) e nella cartella `licenses`.

<div align="center">

Creato e mantenuto da **[LoZazaMastro](https://github.com/LoZazaMastro)**.

</div>
