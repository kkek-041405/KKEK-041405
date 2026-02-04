'use client';

import { db } from '@/lib/firebase';
import {
  doc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';

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
