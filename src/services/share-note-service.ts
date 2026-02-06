
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
  options: CreateShareLinkOptions,
  linkType: 'view' | 'fill' | 'download' = 'view'
): Promise<string> => {
  const token = generateToken(20);
  const linkRef = doc(db, SHARED_NOTE_LINKS_COLLECTION, token);

  const now = new Date();
  const expiresAt =
    options.expiresInHours > 0
      ? new Date(now.getTime() + options.expiresInHours * 60 * 60 * 1000)
      : new Date('9999-12-31T23:59:59Z');

  // Fillable & Download links are single-use
  const finalViewLimit = (linkType === 'fill' || linkType === 'download') ? 1 : options.viewLimit;

  await setDoc(linkRef, {
    noteId,
    createdAt: Timestamp.fromDate(now),
    expiresAt: Timestamp.fromDate(expiresAt),
    viewLimit: finalViewLimit,
    viewCount: 0,
    type: linkType,
  });
  
  let page = 'share';
  if (linkType === 'fill') page = 'fill';
  if (linkType === 'download') page = 'download';

  const shareUrl = `${window.location.origin}/${page}/note/${token}`;
  return shareUrl;
};
