
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { SpotifyPlaylist } from '@/lib/spotify-types';

const PLAYLISTS_COLLECTION = 'spotify_data';
const PLAYLIST_DOC_ID = 'user_playlists';

interface StoredPlaylists {
  playlists: SpotifyPlaylist[];
  savedAt: number;
}

/**
 * Saves an array of Spotify playlists to Firestore.
 * @param playlists - The array of playlists to save.
 */
export const savePlaylistsToFirestore = async (playlists: SpotifyPlaylist[]): Promise<void> => {
  const playlistRef = doc(db, PLAYLISTS_COLLECTION, PLAYLIST_DOC_ID);
  const dataToStore: StoredPlaylists = {
    playlists,
    savedAt: Date.now(),
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
