
import type { Note } from '@/lib/types';
import type { NoteFormValues, NoteFormSubmission } from '@/components/note-form';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  query,
  orderBy,
} from 'firebase/firestore';

const NOTES_COLLECTION = 'notes';

// Helper to convert Firestore Timestamp to ISO string for Note.createdAt
const formatNoteTimestamps = (noteData: any, id: string): Note => {
  const createdAt = noteData.createdAt instanceof Timestamp
    ? noteData.createdAt.toDate().toISOString()
    : new Date().toISOString(); // Fallback, should not happen if data is correct

  return {
    ...noteData,
    id,
    createdAt,
  } as Note;
};

export const addNoteToFirestore = async (
  noteData: NoteFormSubmission
): Promise<Note> => {
  console.log('[note-service] addNoteToFirestore payload', {
    title: noteData.title,
    type: noteData.type,
    hasDocumentMetadata: !!noteData.documentMetadata,
    contentPreview: typeof noteData.content === 'string' ? noteData.content.slice(0, 120) : undefined,
  });

  const docRef = await addDoc(collection(db, NOTES_COLLECTION), {
    ...noteData,
    createdAt: serverTimestamp(), // Use server timestamp
    summary: '', // Initialize summary
  });
  // Firestore typically returns the full document or enough info to reconstruct it.
  // For simplicity, we construct it here. A getDoc might be more robust.
  const newNote: Note = {
    id: docRef.id,
    title: noteData.title,
    content: noteData.content ?? '',
    type: noteData.type,
    createdAt: new Date().toISOString(), // Placeholder, ideally fetch the doc or use a consistent client-generated timestamp
    summary: '',
  };
  // Attach optional documentMetadata if present
  if ((noteData as NoteFormSubmission).documentMetadata) {
    (newNote as any).documentMetadata = (noteData as NoteFormSubmission).documentMetadata;
  }
   // To get the actual server timestamp, we'd need to fetch the document again
  // For now, we'll return a client-generated timestamp or a structure that page.tsx can update
  // Or, assume the page.tsx will re-fetch or optimistically update with client-side date
  return newNote; // This is a simplified return, real app might fetch the doc
};

export const getNotesFromFirestore = async (): Promise<Note[]> => {
  const notesQuery = query(collection(db, NOTES_COLLECTION), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(notesQuery);
  return querySnapshot.docs.map(doc => formatNoteTimestamps(doc.data(), doc.id));
};

export const updateNoteInFirestore = async (
  noteId: string,
  dataToUpdate: Partial<Omit<Note, 'id' | 'createdAt'>>
): Promise<void> => {
  const noteRef = doc(db, NOTES_COLLECTION, noteId);
  await updateDoc(noteRef, {
    ...dataToUpdate,
    // updatedAt: serverTimestamp(), // Optional: add an updatedAt field
  });
};

export const deleteNoteFromFirestore = async (noteId: string): Promise<void> => {
  const noteRef = doc(db, NOTES_COLLECTION, noteId);
  await deleteDoc(noteRef);
};
