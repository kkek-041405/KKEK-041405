
"use client";

import type { Note } from '@/lib/types';
import { NoteListItem } from './note-list-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ListChecks, ListFilter, FileText, Info } from 'lucide-react'; 
import { cn } from '@/lib/utils';


interface NoteListProps {
  notes: Note[]; 
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  sortType: 'all' | 'note' | 'keyInformation';
  onSortChange: (value: 'all' | 'note' | 'keyInformation') => void;
}

export function NoteList({ notes, selectedNoteId, onSelectNote, onDeleteNote, sortType, onSortChange }: NoteListProps) {
  const displayedNotes = notes.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const handleSortToggle = () => {
    if (sortType === 'all') {
      onSortChange('note');
    } else if (sortType === 'note') {
      onSortChange('keyInformation');
    } else {
      onSortChange('all');
    }
  };

  const getSortIcon = () => {
    switch (sortType) {
      case 'note':
        return <FileText className="h-4 w-4" />;
      case 'keyInformation':
        return <Info className="h-4 w-4" />;
      case 'all':
      default:
        return <ListFilter className="h-4 w-4" />;
    }
  };

  const getTooltipText = () => {
     switch (sortType) {
      case 'all':
        return "Showing all items. Click to filter Notes.";
      case 'note':
        return "Showing Notes. Click to filter Key Information.";
      case 'keyInformation':
        return "Showing Key Information. Click to show all items.";
      default:
        return "Filter items";
    }
  }


  if (notes.length === 0 && sortType === 'all') { // Only show empty state if no notes at all and filter is 'all'
    return (
      <div className="bg-card text-card-foreground shadow-lg rounded-lg border flex flex-col flex-1">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="flex items-center text-xl font-semibold text-foreground">
             <ListChecks className="mr-2 h-5 w-5 text-primary" />
            Your Items
          </h3>
        </div>
        <div className="p-6 pt-0 flex-1 flex flex-col justify-center items-center">
          <p className="text-center text-muted-foreground py-4">You haven't created any items yet. Click "Add New Item" to get started!</p>
        </div>
      </div>
    );
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
      {displayedNotes.length === 0 && sortType !== 'all' ? (
         <div className="p-6 pt-0 flex-1 flex flex-col justify-center items-center">
          <p className="text-center text-muted-foreground py-4">No items of type "{sortType === 'note' ? 'Note' : 'Key Information'}" found.</p>
        </div>
      ) : (
        <div className="p-4 pt-0 flex-1">
          <ScrollArea className="h-full pr-3">
            <div className="space-y-2 pt-4"> 
              {displayedNotes.map((note) => (
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


