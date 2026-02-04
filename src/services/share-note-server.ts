
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import type { Note, SharedNoteLink } from '@/lib/types';
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

  const linkData = linkSnap.data() as SharedNoteLink;

  // 1. Check if link is expired
  // The user wanted permanent links until submitted. The creation logic sets a far-future date.
  // This check remains as a safeguard.
  const isExpired = new Date() > (linkData.expiresAt as unknown as Timestamp).toDate();
  if (isExpired) {
    console.warn('Share link has expired, deleting.');
    await deleteDoc(linkRef);
    return null;
  }

  // 2. Check if the link has already been used its maximum number of times.
  // This is important for single-use links, as viewCount will be >= 1 after a successful submission.
  const isUsedUp =
    linkData.viewLimit > 0 && linkData.viewCount >= linkData.viewLimit;
  if (isUsedUp) {
    console.warn('Share link has already been used its limit, deleting.');
    await deleteDoc(linkRef);
    return null;
  }
  
  // 3. The link is valid. Fetch the associated note.
  const note = await getNoteFromFirestore(linkData.noteId);
  if (!note) {
      console.warn(`Note with id ${linkData.noteId} not found, but share link exists. Deleting link.`);
      await deleteDoc(linkRef);
      return null;
  }

  // IMPORTANT: We no longer increment the view count or delete the link here.
  // Invalidation now happens explicitly after form submission by calling the consume-token API.
  return note;
};
