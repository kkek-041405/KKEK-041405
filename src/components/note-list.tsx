
"use client";

import type { Note } from '@/lib/types';
import { NoteListItem } from './note-list-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListChecks } from 'lucide-react'; 


interface NoteListProps {
  notes: Note[]; 
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export function NoteList({ notes, selectedNoteId, onSelectNote, onDeleteNote }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="bg-card text-card-foreground shadow-lg rounded-lg border flex flex-col flex-1">
        <div className="p-6 border-b">
          <h3 className="flex items-center text-xl font-semibold text-foreground">
             <ListChecks className="mr-2 h-5 w-5 text-primary" />
            Your Items
          </h3>
        </div>
        <div className="p-6 pt-0 flex-1 flex flex-col justify-center items-center">
          <p className="text-center text-muted-foreground py-4">You haven't created any notes or key information yet. Click "Add New Item" to get started!</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-card text-card-foreground shadow-lg rounded-lg border flex flex-col flex-1">
      <div className="p-6 border-b">
        <h3 className="flex items-center text-xl font-semibold text-foreground">
           <ListChecks className="mr-2 h-5 w-5 text-primary" />
           Your Items
        </h3>
      </div>
      <div className="p-6 pt-0 flex-1">
        <ScrollArea className="h-full pr-3">
          <div className="space-y-2 pt-6"> {/* Added pt-6 to create space from header */}
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
      </div>
    </div>
  );
}

