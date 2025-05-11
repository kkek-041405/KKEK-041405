
"use client";

import type { Note } from '@/lib/types';
import type { NoteFormValues } from '@/components/note-form';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useState, useEffect } from 'react';
import { NoteForm } from '@/components/note-form';
import { NoteList } from '@/components/note-list';
import { NoteView } from '@/components/note-view';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { summarizeNote, type SummarizeNoteInput } from '@/ai/flows/summarize-note';
import { Notebook, FileText } from 'lucide-react';
import { AppBar } from '@/components/app-bar';


export default function HomePage() {
  const [notes, setNotes] = useLocalStorage<Note[]>('notenest-items', []);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const [sortType, setSortType] = useState<'all' | 'note' | 'keyInformation'>('all');

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSaveNote = (data: NoteFormValues) => {
    setIsLoading(true);
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: data.title,
      content: data.type === 'note' ? (data as Extract<NoteFormValues, {type: 'note'}>).content : "",
      type: data.type,
      createdAt: new Date().toISOString(),
    };
    setNotes((prevNotes) => [...prevNotes, newNote]);
    toast({
      title: `${newNote.type === 'note' ? 'Note' : 'Key Information'} Saved!`,
      description: `Your item "${newNote.title}" has been successfully saved.`,
    });
    setIsLoading(false);
    setIsFormOpen(false); 
  };

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
  };

  const handleDeleteNote = (id: string) => {
    const itemToDelete = notes.find(note => note.id === id);
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
    toast({
      title: `${itemToDelete?.type === 'note' ? 'Note' : 'Key Information'} Deleted`,
      description: `The item "${itemToDelete?.title}" has been removed.`,
      variant: "destructive"
    });
  };

  const handleSummarizeNote = async (noteId: string, noteContent: string) => {
    setIsLoadingSummary(true);
    try {
      const input: SummarizeNoteInput = { note: noteContent };
      const result = await summarizeNote(input);
      if (result && result.summary) {
        setNotes((prevNotes) =>
          prevNotes.map((n) =>
            n.id === noteId ? { ...n, summary: result.summary } : n
          )
        );
        toast({
          title: "Summary Generated!",
          description: "AI summary has been added to your note.",
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

  if (!isClient) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Notebook className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  const noteFormProps = {
    onSave: handleSaveNote,
    isLoading: isLoading,
    onFormSubmit: () => setIsFormOpen(false),
  };

  const filteredNotes = notes.filter(note => {
    if (sortType === 'all') return true;
    return note.type === sortType;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <AppBar 
        isFormOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        noteFormProps={noteFormProps}
      />
      
      <main className="flex-1 flex flex-col md:flex-row gap-6 p-4 sm:p-6 md:p-8">
        <section 
          aria-labelledby="items-list-heading" 
          className="md:w-1/3 flex flex-col"
        >
          <h2 id="items-list-heading" className="sr-only">Your Items</h2>
          <NoteList
            notes={filteredNotes}
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
            />
          </section>
        ) : (
          <div className="md:w-2/3 flex flex-col items-center justify-center bg-card text-card-foreground rounded-lg shadow-lg border p-8 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground">No Item Selected</h3>
            <p className="text-muted-foreground">Select an item from the list to view its details, or add a new one.</p>
          </div>
        )}
      </main>
      
      <footer className="text-center py-4 text-sm text-muted-foreground border-t">
        <p>&copy; {new Date().getFullYear()} NoteNest. All rights reserved.</p>
      </footer>
      <Toaster />
    </div>
  );
}
