
export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyArtist {
  name: string;
  id: string;
  href: string;
  type: "artist";
}

export interface SpotifyAlbum {
  name: string;
  id: string;
  images: SpotifyImage[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  uri: string;
}

export interface SpotifyDevice {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

export interface SpotifyPlayerState {
  device: SpotifyDevice;
  shuffle_state: boolean;
  repeat_state: "off" | "track" | "context";
  timestamp: number;
  is_playing: boolean;
  progress_ms: number | null;
  item: SpotifyTrack | null;
}
