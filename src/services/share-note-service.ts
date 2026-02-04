
'use client';

import { db } from '@/lib/firebase';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import type { Note } from '@/lib/types';
import { getNoteFromFirestore } from './note-service';

const SHARED_NOTE_LINKS_COLLECTION = 'sharedNoteLinks';

function generateToken(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

interface CreateShareLinkOptions {
  expiresInHours: number;
  viewLimit: number;
}

export const createShareLink = async (
  noteId: string,
  options: CreateShareLinkOptions
): Promise<string> => {
  const token = generateToken(20);
  const linkRef = doc(db, SHARED_NOTE_LINKS_COLLECTION, token);

  const now = new Date();
  // If expiresInHours is 0, it's permanent. Set expiry to a far future date.
  const expiresAt =
    options.expiresInHours > 0
      ? new Date(now.getTime() + options.expiresInHours * 60 * 60 * 1000)
      : new Date('9999-12-31T23:59:59Z');

  await setDoc(linkRef, {
    noteId,
    createdAt: Timestamp.fromDate(now),
    expiresAt: Timestamp.fromDate(expiresAt),
    viewLimit: options.viewLimit,
    viewCount: 0,
  });

  const shareUrl = `${window.location.origin}/share/note/${token}`;
  return shareUrl;
};

export const getNoteFromShareToken = async (
  token: string
): Promise<Note | null> => {
  const linkRef = doc(db, SHARED_NOTE_LINKS_COLLECTION, token);
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
