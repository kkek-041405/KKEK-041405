
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import type { SpotifyPlaylist, SpotifyPlaylistTrack } from '@/lib/spotify-types';

const PLAYLISTS_COLLECTION = 'spotify_data';
const PLAYLIST_DOC_ID = 'user_playlists';

interface StoredPlaylists {
  playlists: SpotifyPlaylist[];
  savedAt: Timestamp;
}

interface StoredTracks {
    tracks: SpotifyPlaylistTrack[];
    savedAt: Timestamp;
}

/**
 * Saves an array of Spotify playlists to Firestore.
 * @param playlists - The array of playlists to save.
 */
export const savePlaylistsToFirestore = async (playlists: SpotifyPlaylist[]): Promise<void> => {
  const playlistRef = doc(db, PLAYLISTS_COLLECTION, PLAYLIST_DOC_ID);
  const dataToStore: StoredPlaylists = {
    playlists,
    savedAt: Timestamp.now(),
  };
  await setDoc(playlistRef, dataToStore);
};

/**
 * Retrieves Spotify playlists from Firestore.
 * @returns The array of playlists or null if not found.
 */
export const getPlaylistsFromFirestore = async (): Promise<SpotifyPlaylist[] | null> => {
  const playlistRef = doc(db, PLAYLISTS_COLLECTION, PLAYLIST_DOC_ID);
  const docSnap = await getDoc(playlistRef);

  if (docSnap.exists()) {
    const data = docSnap.data() as StoredPlaylists;
    return data.playlists;
  }

  return null;
};

/**
 * Saves tracks for a specific playlist to Firestore.
 * @param playlistId - The ID of the playlist.
 * @param tracks - The array of tracks to save.
 */
export const saveTracksToFirestore = async (playlistId: string, tracks: SpotifyPlaylistTrack[]): Promise<void> => {
    const tracksRef = doc(db, PLAYLISTS_COLLECTION, `playlist_${playlistId}`);
    const dataToStore: StoredTracks = {
        tracks,
        savedAt: Timestamp.now(),
    };
    await setDoc(tracksRef, dataToStore);
};

/**
 * Retrieves tracks for a specific playlist from Firestore.
 * @param playlistId - The ID of the playlist.
 * @returns The array of tracks or null if not found.
 */
export const getTracksFromFirestore = async (playlistId: string): Promise<SpotifyPlaylistTrack[] | null> => {
    const tracksRef = doc(db, PLAYLISTS_COLLECTION, `playlist_${playlistId}`);
    const docSnap = await getDoc(tracksRef);
    if (docSnap.exists()) {
        const data = docSnap.data() as StoredTracks;
        return data.tracks;
    }
    return null;
}
