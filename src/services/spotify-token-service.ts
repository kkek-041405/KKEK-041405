
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

const TOKENS_COLLECTION = 'config';
const TOKEN_DOC_ID = 'spotify_tokens';

export interface SpotifyTokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

/**
 * Saves Spotify token data to Firestore.
 * @param tokenData - The token data to save.
 */
export const saveTokensToFirestore = async (tokenData: SpotifyTokenData): Promise<void> => {
  const tokenRef = doc(db, TOKENS_COLLECTION, TOKEN_DOC_ID);
  await setDoc(tokenRef, tokenData);
};

/**
 * Retrieves Spotify token data from Firestore.
 * @returns The token data or null if it doesn't exist.
 */
export const getTokensFromFirestore = async (): Promise<SpotifyTokenData | null> => {
  const tokenRef = doc(db, TOKENS_COLLECTION, TOKEN_DOC_ID);
  const docSnap = await getDoc(tokenRef);
  if (docSnap.exists()) {
    return docSnap.data() as SpotifyTokenData;
  }
  return null;
};

/**
 * Deletes Spotify token data from Firestore.
 */
export const deleteTokensFromFirestore = async (): Promise<void> => {
  const tokenRef = doc(db, TOKENS_COLLECTION, TOKEN_DOC_ID);
  await deleteDoc(tokenRef);
};
