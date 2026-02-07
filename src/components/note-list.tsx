"use client";

import type { Note } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import { SheetTrigger } from '@/components/ui/sheet';
import { Input } from './ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

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
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg tracking-tight">Library</h3>
              <SheetTrigger asChild>
                <Button size="icon" className="h-8 w-8 rounded-full shadow-sm">
                    <PlusCircle className="h-4 w-4" />
                </Button>
              </SheetTrigger>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search items..."
                className="w-full rounded-lg bg-secondary/50 border-transparent pl-8 focus:bg-background focus:border-primary/50 transition-all"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="pt-4">
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
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        {notes.length === 0 ? (
          <div className="p-4 flex-1 flex flex-col justify-center items-center text-center">
            <p className="text-muted-foreground">You haven't created any items yet. Click the '+' button to get started!</p>
          </div>
        ) : displayedNotesList.length === 0 ? (
          <div className="p-4 flex-1 flex flex-col justify-center items-center text-center">
            <p className="text-muted-foreground">No items match your search for "{searchQuery}" in {sortTypeConfig[sortType].label}.</p>
          </div>
        ) : (
          <div className="space-y-1"> 
            {displayedNotesList.map((note) => (
              <button
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border transition-all duration-200 group relative",
                  "hover:border-primary/30 hover:shadow-sm hover:bg-card",
                  note.id === selectedNoteId 
                    ? "bg-card border-primary/50 shadow-sm ring-1 ring-primary/20" 
                    : "bg-transparent border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className={cn("font-medium truncate pr-2", note.id === selectedNoteId ? "text-primary" : "text-foreground")}>
                    {note.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums opacity-70">
                    {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed opacity-90">
                  {note.type === 'keyInformation' ? '••••••••' : (note.content || "No additional text")}
                </p>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
