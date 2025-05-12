
"use client";

import type { Note } from '@/lib/types';
import type { NoteFormValues } from '@/components/note-form';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NoteForm } from '@/components/note-form';
import { NoteList } from '@/components/note-list';
import { NoteView } from '@/components/note-view';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { summarizeNote, type SummarizeNoteInput } from '@/ai/flows/summarize-note';
import { Notebook, FileText, Loader2 } from 'lucide-react';
import { AppBar } from '@/components/app-bar';
import { 
  addNoteToFirestore, 
  getNotesFromFirestore, 
  updateNoteInFirestore, 
  deleteNoteFromFirestore 
} from '@/services/note-service';

export default function NotesContentPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const [sortType, setSortType] = useState<'note' | 'keyInformation'>('note');

  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [initialFormValues, setInitialFormValues] = useState<NoteFormValues | null>(null);

  useEffect(() => {
    // Check authentication status
    if (typeof window !== 'undefined') {
      const authStatus = sessionStorage.getItem('notesAuthenticated');
      if (authStatus !== 'true') {
        router.replace('/notes'); // Redirect to auth page if not authenticated
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) return; // Don't fetch notes if not authenticated

    const fetchNotes = async () => {
      setIsLoadingNotes(true);
      try {
        const firestoreNotes = await getNotesFromFirestore();
        setNotes(firestoreNotes);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
        toast({
          title: "Error Fetching Notes",
          description: "Could not load your items from the cloud. Please try again later.",
          variant: "destructive",
        });
      }
      setIsLoadingNotes(false);
    };
    fetchNotes();
  }, [toast, isAuthenticated]);

  if (!isAuthenticated) {
    // Show a loading state or a minimal message while redirecting
    return (
       <div className="flex flex-col min-h-screen">
        <AppBar
          isFormOpen={false}
          onOpenChange={() => {}}
          noteFormProps={{ onSave: () => {}, isLoading: false, onFormSubmit: () => {} }}
        />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">Verifying access...</p>
        </main>
         <Toaster />
      </div>
    );
  }


  const handleSaveNote = async (data: NoteFormValues) => {
    setIsSavingNote(true);
    try {
      if (editingNote) {
        // Update existing note
        await updateNoteInFirestore(editingNote.id, data);
        setNotes((prevNotes) =>
          prevNotes.map((n) =>
            n.id === editingNote.id ? { ...n, ...data, createdAt: n.createdAt } : n // Keep original createdAt
          ).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        );
        toast({
          title: `${data.type === 'note' ? 'Note' : 'Key Information'} Updated!`,
          description: `Your item "${data.title}" has been successfully updated.`,
        });
      } else {
        // Add new note
        const addedNoteWithClientTimestamp = await addNoteToFirestore(data);
        setNotes((prevNotes) => 
          [addedNoteWithClientTimestamp, ...prevNotes].sort((a,b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
        toast({
          title: `${addedNoteWithClientTimestamp.type === 'note' ? 'Note' : 'Key Information'} Saved!`,
          description: `Your item "${addedNoteWithClientTimestamp.title}" has been successfully saved to the cloud.`,
        });
      }
      setIsFormOpen(false);
      setEditingNote(null);
      setInitialFormValues(null);
    } catch (error) {
      console.error("Failed to save note:", error);
      toast({
        title: `Error ${editingNote ? 'Updating' : 'Saving'} Item`,
        description: `Could not ${editingNote ? 'update' : 'save'} your item. Please try again.`,
        variant: "destructive",
      });
    }
    setIsSavingNote(false);
  };

  const handleRequestEdit = (noteToEdit: Note) => {
    setEditingNote(noteToEdit);
    setInitialFormValues({
      title: noteToEdit.title,
      content: noteToEdit.content,
      type: noteToEdit.type,
    });
    setIsFormOpen(true);
  };
  
  const handleDialogValidOpenChange = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setEditingNote(null);
      setInitialFormValues(null);
    }
  }


  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
  };

  const handleDeleteNote = async (id: string) => {
    const itemToDelete = notes.find(note => note.id === id);
    if (!itemToDelete) return;

    try {
      await deleteNoteFromFirestore(id);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      if (selectedNoteId === id) {
        setSelectedNoteId(null);
      }
      toast({
        title: `${itemToDelete.type === 'note' ? 'Note' : 'Key Information'} Deleted`,
        description: `The item "${itemToDelete.title}" has been removed from the cloud.`,
        variant: "destructive"
      });
    } catch (error) {
      console.error("Failed to delete note:", error);
      toast({
        title: "Error Deleting Item",
        description: "Could not delete your item from the cloud. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSummarizeNote = async (noteId: string, noteContent: string) => {
    setIsLoadingSummary(true);
    try {
      const input: SummarizeNoteInput = { note: noteContent };
      const result = await summarizeNote(input);
      if (result && result.summary) {
        await updateNoteInFirestore(noteId, { summary: result.summary });
        setNotes((prevNotes) =>
          prevNotes.map((n) =>
            n.id === noteId ? { ...n, summary: result.summary } : n
          )
        );
        toast({
          title: "Summary Generated!",
          description: "AI summary has been added to your note and saved to the cloud.",
        });
      } else {
        throw new Error("Summary was empty.");
      }
    } catch (error) {
      console.error("Failed to summarize note:", error);
      toast({
        title: "Error Summarizing",
        description: "Could not generate summary. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoadingSummary(false);
  };

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  const noteFormProps = {
    onSave: handleSaveNote,
    isLoading: isSavingNote,
    onFormSubmit: () => {
      setIsFormOpen(false);
      setEditingNote(null);
      setInitialFormValues(null);
    },
    defaultValues: initialFormValues,
    isEditing: !!editingNote,
  };

  const filteredNotes = notes.filter(note => {
    return note.type === sortType;
  });

  if (isLoadingNotes) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppBar
          isFormOpen={isFormOpen}
          onOpenChange={handleDialogValidOpenChange}
          noteFormProps={noteFormProps}
        />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">Loading your items...</p>
        </main>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppBar
        isFormOpen={isFormOpen}
        onOpenChange={handleDialogValidOpenChange}
        noteFormProps={noteFormProps}
      />
      
      <main className="flex-1 flex flex-col md:flex-row gap-6 p-4 sm:p-6 md:p-8 overflow-hidden">
        <section
          aria-labelledby="items-list-heading"
          className="md:w-1/3 flex flex-col"
        >
          <h2 id="items-list-heading" className="sr-only">Your Items</h2>
          <NoteList
            notes={notes}
            filteredNotes={filteredNotes}
            selectedNoteId={selectedNoteId}
            onSelectNote={handleSelectNote}
            onDeleteNote={handleDeleteNote}
            sortType={sortType}
            onSortChange={setSortType}
          />
        </section>

        {selectedNote ? (
          <section
            aria-labelledby="view-item-heading"
            className="md:w-2/3 flex flex-col"
          >
            <h2 id="view-item-heading" className="sr-only">Selected Item: {selectedNote.title}</h2>
            <NoteView
              note={selectedNote}
              onSummarize={handleSummarizeNote}
              isLoadingSummary={isLoadingSummary}
              onEditRequest={handleRequestEdit}
            />
          </section>
        ) : (
          !isLoadingNotes && notes.length > 0 && (
            <div className="md:w-2/3 flex flex-col items-center justify-center bg-card text-card-foreground rounded-lg shadow-lg border p-8 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground">No Item Selected</h3>
              <p className="text-muted-foreground">Select an item from the list to view its details.</p>
            </div>
          )
        )}
         { !selectedNote && !isLoadingNotes && notes.length === 0 && (
            <div className="md:w-2/3 flex flex-col items-center justify-center bg-card text-card-foreground rounded-lg shadow-lg border p-8 text-center">
              <Notebook className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground">No Items Yet</h3>
              <p className="text-muted-foreground">Click "Add New Item" to create your first note or key information.</p>
            </div>
          )
        }
      </main>
      
      <Toaster />
    </div>
  );
}
