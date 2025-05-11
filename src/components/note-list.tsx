"use client";

import type { Note } from '@/lib/types';
import { NoteListItem } from './note-list-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListChecks } from 'lucide-react'; // Changed icon to be more generic


interface NoteListProps {
  notes: Note[]; // notes prop now represents general items
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export function NoteList({ notes, selectedNoteId, onSelectNote, onDeleteNote }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
             <ListChecks className="mr-2 h-5 w-5 text-primary" />
            Your Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">You haven't created any notes or key information yet. Use the form above to get started!</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
           <ListChecks className="mr-2 h-5 w-5 text-primary" />
           Your Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-3">
          <div className="space-y-2">
            {notes.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((note) => (
              <NoteListItem
                key={note.id}
                note={note}
                isSelected={note.id === selectedNoteId}
                onSelect={() => onSelectNote(note.id)}
                onDelete={() => onDeleteNote(note.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
