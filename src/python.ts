import { call } from "@decky/api";

export type PlayerSnapshot = {
  id: string;
  name: string;
  title?: string;
  artist?: string;
  album?: string;
  status: string;
  length: number;
  position: number;
  canNext: boolean;
  canPrevious: boolean;
  canPlay: boolean;
  canPause: boolean;
  canTogglePlayPause: boolean;
  isSelected: boolean;
  isCurrent: boolean;
  canShuffle?: boolean;
  canRepeat?: boolean;
  shuffleActive?: boolean;
  repeatMode?: string;
};

export type Snapshot = {
  selectedPlayer: string;
  currentPlayer: string;
  selected: PlayerSnapshot | null;
  players: PlayerSnapshot[];
};

export function getSnapshot(): Promise<Snapshot> {
  return call<[], Snapshot>("get_snapshot");
}

export function setMediaPlayer(player: string): Promise<string> {
  return call<[player: string], string>("set_media_player", player);
}

export function getCover(title: string, artist: string, album: string): Promise<string> {
  return call<[title: string, artist: string, album: string], string>(
    "get_cover",
    title,
    artist,
    album
  );
}

export function playPause(): Promise<string> {
  return call<[], string>("play_pause");
}

export function nextTrack(): Promise<string> {
  return call<[], string>("next");
}

export function previousTrack(): Promise<string> {
  return call<[], string>("previous");
}

export function openSpotify(): Promise<string> {
  return call<[], string>("open_spotify");
}

export function openTidal(): Promise<string> {
  return call<[], string>("open_tidal");
}

export function openAppleMusic(): Promise<string> {
  return call<[], string>("open_apple_music");
}

export function openDeezer(): Promise<string> {
  return call<[], string>("open_deezer");
}

export function openAmazonMusic(): Promise<string> {
  return call<[], string>("open_amazon_music");
}

export function openSoundCloud(): Promise<string> {
  return call<[], string>("open_soundcloud");
}

export function shuffle(): Promise<string> {
  return call<[], string>("shuffle");
}

export function repeat(): Promise<string> {
  return call<[], string>("repeat");
}
