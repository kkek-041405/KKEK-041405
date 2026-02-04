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
import { getNoteFromFirestore } from './note-service';

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
  let shouldDelete = false;

  const isExpired = new Date() > (linkData.expiresAt as Timestamp).toDate();
  if (isExpired) {
    console.warn('Share link has expired');
    shouldDelete = true;
  }

  // Only check view limit if it's greater than 0
  const viewLimitReached =
    linkData.viewLimit > 0 && linkData.viewCount >= linkData.viewLimit;
  if (viewLimitReached) {
    console.warn('Share link view limit reached');
    shouldDelete = true;
  }

  if (shouldDelete) {
      await deleteDoc(linkRef);
      return null;
  }

  // Increment view count regardless
  await updateDoc(linkRef, {
    viewCount: increment(1),
  });

  const note = await getNoteFromFirestore(linkData.noteId);
  
  // Check if the link should be deleted AFTER this view
  if (linkData.viewLimit > 0 && (linkData.viewCount + 1) >= linkData.viewLimit) {
      setTimeout(() => {
        deleteDoc(linkRef).catch(e => console.error("Failed to delete share link post-view:", e));
      }, 5000);
  }

  return note;
};
