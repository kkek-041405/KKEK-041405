
"use client";

import type { Note } from '@/lib/types';
import { NoteListItem } from './note-list-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ListChecks, FileText, Info } from 'lucide-react'; 

interface NoteListProps {
  notes: Note[]; // All notes for checking global empty state
  filteredNotes: Note[]; // Notes filtered by sortType for display
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  sortType: 'note' | 'keyInformation';
  onSortChange: (value: 'note' | 'keyInformation') => void;
}

export function NoteList({ notes, filteredNotes, selectedNoteId, onSelectNote, onDeleteNote, sortType, onSortChange }: NoteListProps) {
  const displayedNotesList = filteredNotes.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const handleSortToggle = () => {
    if (sortType === 'note') {
      onSortChange('keyInformation');
    } else { // sortType === 'keyInformation'
      onSortChange('note');
    }
  };

  const getSortIcon = () => {
    switch (sortType) {
      case 'note':
        return <FileText className="h-4 w-4" />;
      case 'keyInformation':
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getTooltipText = () => {
     switch (sortType) {
      case 'note':
        return "Showing Notes. Click to filter Key Information.";
      case 'keyInformation':
      default:
        return "Showing Key Information. Click to filter Notes.";
    }
  }
  
  return (
    <div className="bg-card text-card-foreground shadow-lg rounded-lg border flex flex-col flex-1">
      <div className="p-4 border-b flex items-center justify-between gap-2">
        <h3 className="flex items-center text-xl font-semibold text-foreground">
           <ListChecks className="mr-2 h-5 w-5 text-primary shrink-0" />
           <span className="truncate">Your Items</span>
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSortToggle}
          className="h-9 w-9 shadow-sm border"
          title={getTooltipText()}
          aria-label={getTooltipText()}
        >
          {getSortIcon()}
        </Button>
      </div>
      
      {notes.length === 0 ? (
        <div className="p-6 pt-0 flex-1 flex flex-col justify-center items-center">
          <p className="text-center text-muted-foreground py-4">You haven't created any items yet. Click "Add New Item" to get started!</p>
        </div>
      ) : displayedNotesList.length === 0 ? (
         <div className="p-6 pt-0 flex-1 flex flex-col justify-center items-center">
          <p className="text-center text-muted-foreground py-4">No items of type "{sortType === 'note' ? 'Note' : 'Key Information'}" found.</p>
        </div>
      ) : (
        <div className="p-4 pt-0 flex-1">
          <ScrollArea className="h-full pr-3">
            <div className="space-y-2 pt-4"> 
              {displayedNotesList.map((note) => (
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
      )}
    </div>
  );
}
