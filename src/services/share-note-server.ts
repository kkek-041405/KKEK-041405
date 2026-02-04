
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import type { Note } from '@/lib/types';
import { getNoteFromFirestore, NOTES_COLLECTION } from './note-service';

export const getNoteFromShareToken = async (
  token: string
): Promise<Note | null> => {
  const linkRef = doc(db, 'sharedNoteLinks', token);
  const linkSnap = await getDoc(linkRef);

  if (!linkSnap.exists()) {
    console.warn('Share link not found');
    return null;
  }

  const linkData = linkSnap.data();

  // 1. Check if link is expired
  const isExpired = new Date() > (linkData.expiresAt as Timestamp).toDate();
  if (isExpired) {
    console.warn('Share link has expired, deleting.');
    await deleteDoc(linkRef);
    return null;
  }

  // 2. Check if view limit has been reached
  const viewLimitReached =
    linkData.viewLimit > 0 && linkData.viewCount >= linkData.viewLimit;
  if (viewLimitReached) {
    console.warn('Share link view limit reached, deleting.');
    await deleteDoc(linkRef);
    return null;
  }

  // 3. The link is valid. Increment view count.
  await updateDoc(linkRef, {
    viewCount: increment(1),
  });

  // 4. Fetch the associated note
  const note = await getNoteFromFirestore(linkData.noteId);
  if (!note) {
      console.warn(`Note with id ${linkData.noteId} not found, but share link exists. Deleting link.`);
      await deleteDoc(linkRef);
      return null;
  }

  // 5. Check if the link should be deleted AFTER this use.
  if (linkData.viewLimit > 0 && (linkData.viewCount + 1) >= linkData.viewLimit) {
      await deleteDoc(linkRef);
  }

  return note;
};
