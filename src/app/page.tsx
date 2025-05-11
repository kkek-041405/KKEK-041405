"use client";

import type { Note } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useState, useEffect } from 'react';
import { NoteForm } from '@/components/note-form';
import { NoteList } from '@/components/note-list';
import { NoteView } from '@/components/note-view';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { summarizeNote, type SummarizeNoteInput } from '@/ai/flows/summarize-note';
import { Notebook } from 'lucide-react';

export default function HomePage() {
  const [notes, setNotes] = useLocalStorage<Note[]>('notenest-notes', []);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For general loading, e.g. saving note
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const { toast } = useToast();

  // Effect to ensure notes are loaded on initial client render
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSaveNote = (data: { title: string; content: string }) => {
    setIsLoading(true);
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: data.title,
      content: data.content,
      createdAt: new Date().toISOString(),
    };
    setNotes((prevNotes) => [...prevNotes, newNote]);
    toast({
      title: "Note Saved!",
      description: `"${newNote.title}" has been successfully saved.`,
    });
    setIsLoading(false);
  };

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
    toast({
      title: "Note Deleted",
      description: "The note has been removed.",
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
    // Render a loading state or null during SSR/SSG and first client render pass
    // This avoids hydration mismatches with localStorage
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Notebook className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-3xl min-h-screen flex flex-col">
      <header className="my-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <Notebook className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-bold text-primary">NoteNest</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Your personal space for thoughts and ideas, enhanced by AI.
        </p>
      </header>

      <main className="flex-grow">
        <section aria-labelledby="create-note-heading" className="mb-10">
          <h2 id="create-note-heading" className="sr-only">Create a new note</h2>
          <NoteForm onSave={handleSaveNote} isLoading={isLoading} />
        </section>
        
        <Separator className="my-10" />

        <section aria-labelledby="notes-list-heading" className="mb-10">
           <h2 id="notes-list-heading" className="sr-only">Your Notes</h2>
          <NoteList
            notes={notes}
            selectedNoteId={selectedNoteId}
            onSelectNote={handleSelectNote}
            onDeleteNote={handleDeleteNote}
          />
        </section>

        {selectedNote && (
          <section aria-labelledby="view-note-heading" className="mb-10">
            <h2 id="view-note-heading" className="sr-only">Selected Note: {selectedNote.title}</h2>
            <NoteView
              note={selectedNote}
              onSummarize={handleSummarizeNote}
              isLoadingSummary={isLoadingSummary}
            />
          </section>
        )}
      </main>
      
      <footer className="text-center py-6 text-sm text-muted-foreground border-t mt-auto">
        <p>&copy; {new Date().getFullYear()} NoteNest. All rights reserved.</p>
      </footer>
      <Toaster />
    </div>
  );
}
