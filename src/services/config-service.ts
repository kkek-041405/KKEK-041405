
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const CONFIG_COLLECTION = 'config';
const NOTES_CONFIG_DOC_ID = 'notes';

/**
 * Retrieves the access code from a specific document in Firestore.
 * @returns The access code string or null if not found.
 */
export const getAccessCodeFromFirestore = async (): Promise<string | null> => {
  try {
    const configRef = doc(db, CONFIG_COLLECTION, NOTES_CONFIG_DOC_ID);
    const docSnap = await getDoc(configRef);

    if (docSnap.exists() && docSnap.data().accessCode) {
      return docSnap.data().accessCode as string;
    } else {
      console.warn(`Access code document not found at: ${CONFIG_COLLECTION}/${NOTES_CONFIG_DOC_ID}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching access code from Firestore:", error);
    return null;
  }
};
