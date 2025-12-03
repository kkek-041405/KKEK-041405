
import { rtdb } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import type { Commands, Command } from '@/lib/types';

const COMMANDS_PATH = 'commands/metadata';

/**
 * Retrieves all command definitions from the Realtime Database.
 * @returns An array of commands with their IDs.
 */
export const getCommandsFromFirestore = async (): Promise<Command[]> => {
  try {
    const commandsRef = ref(rtdb, COMMANDS_PATH);
    const snapshot = await get(commandsRef);

    if (snapshot.exists()) {
      const commandsData = snapshot.val() as Commands;
      // Transform the record into an array of Command objects
      return Object.entries(commandsData).map(([id, commandData]) => ({
        id,
        ...commandData,
        // RTDB may store array-like objects, ensure parameters is an array
        parameters: commandData.parameters ? Object.values(commandData.parameters) : [],
      }));
    } else {
      console.warn(`Commands data not found at: ${COMMANDS_PATH}`);
      return [];
    }
  } catch (error) {
    console.error("Error fetching commands from Realtime Database:", error);
    return [];
  }
};
