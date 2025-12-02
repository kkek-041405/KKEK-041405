
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { Commands, Command } from '@/lib/types';

const COMMANDS_COLLECTION = 'commands';
const METADATA_DOC_ID = 'metadata';

/**
 * Retrieves all command definitions from the 'metadata' document in the 'commands' collection.
 * @returns An array of commands with their IDs.
 */
export const getCommandsFromFirestore = async (): Promise<Command[]> => {
  try {
    const commandsRef = doc(db, COMMANDS_COLLECTION, METADATA_DOC_ID);
    const docSnap = await getDoc(commandsRef);

    if (docSnap.exists()) {
      const commandsData = docSnap.data() as Commands;
      // Transform the record into an array of Command objects
      return Object.entries(commandsData).map(([id, commandData]) => ({
        id,
        ...commandData,
      }));
    } else {
      console.warn(`Commands document not found at: ${COMMANDS_COLLECTION}/${METADATA_DOC_ID}`);
      return [];
    }
  } catch (error) {
    console.error("Error fetching commands from Firestore:", error);
    return [];
  }
};
