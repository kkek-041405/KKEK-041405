"use client";

import type { Note } from '@/lib/types';
import { NoteListItem } from './note-list-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ListChecks, PlusCircle, Search } from 'lucide-react';
import {
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Input } from './ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';


interface NoteListProps {
  notes: Note[]; // All notes for checking global empty state
  filteredNotes: Note[]; // Notes filtered by sortType for display
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  sortType: 'all' | 'note' | 'keyInformation' | 'document';
  onSortChange: (value: 'all' | 'note' | 'keyInformation' | 'document') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function NoteList({ 
  notes, 
  filteredNotes, 
  selectedNoteId, 
  onSelectNote, 
  sortType, 
  onSortChange,
  searchQuery,
  onSearchChange,
}: NoteListProps) {
  const displayedNotesList = filteredNotes.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const sortTypeConfig = {
      all: { label: 'All Items' },
      note: { label: 'Notes' },
      keyInformation: { label: 'Key Info' },
      document: { label: 'Docs' },
  };

  return (
    <TooltipProvider>
    <div className="bg-card text-card-foreground flex flex-col flex-1 h-full">
      <div className="p-4 border-b flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
            <ListChecks className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-xl font-semibold text-foreground truncate">
                Your Items
            </h3>
        </div>
        <DialogTrigger asChild>
          <Tooltip>
              <TooltipTrigger asChild>
                  <Button 
                    variant="ghost"
                    size="icon"
                    aria-label="Add New Item"
                    className="h-9 w-9"
                  >
                    <PlusCircle className="h-5 w-5" />
                  </Button>
              </TooltipTrigger>
              <TooltipContent>
                  <p>Add New Item</p>
              </TooltipContent>
          </Tooltip>
        </DialogTrigger>
      </div>
      
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search items..."
            className="w-full rounded-lg bg-background pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
       <div className="p-3 border-b">
         <ToggleGroup
            type="single"
            size="sm"
            value={sortType}
            onValueChange={(value: 'all' | 'note' | 'keyInformation' | 'document') => {
                if (value) onSortChange(value);
            }}
            className="w-full justify-start"
        >
            <ToggleGroupItem value="all" aria-label="Filter by All" className="flex-1">All</ToggleGroupItem>
            <ToggleGroupItem value="note" aria-label="Filter by Notes" className="flex-1">Notes</ToggleGroupItem>
            <ToggleGroupItem value="keyInformation" aria-label="Filter by Key Info" className="flex-1">Key Info</ToggleGroupItem>
            <ToggleGroupItem value="document" aria-label="Filter by Documents" className="flex-1">Docs</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {notes.length === 0 ? (
        <div className="p-4 flex-1 flex flex-col justify-center items-center text-center">
          <p className="text-muted-foreground">You haven't created any items yet. Click "Add New Item" to get started!</p>
        </div>
      ) : displayedNotesList.length === 0 ? (
         <div className="p-4 flex-1 flex flex-col justify-center items-center text-center">
          <p className="text-muted-foreground">No items match your search for "{searchQuery}" in {sortTypeConfig[sortType].label}.</p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-3"> 
            {displayedNotesList.map((note) => (
              <NoteListItem
                key={note.id}
                note={note}
                isSelected={note.id === selectedNoteId}
                onSelect={() => onSelectNote(note.id)}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
    </TooltipProvider>
  );
}
