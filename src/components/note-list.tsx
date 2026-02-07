
"use client";

import type { Note } from '@/lib/types';
import type { NoteFormValues, NoteFormSubmission } from '@/components/note-form';
import { NoteListItem } from './note-list-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ListChecks, FileText, Info, PlusCircle, FileArchive } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { NoteForm } from '@/components/note-form';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from './ui/tooltip';


interface NoteListProps {
  notes: Note[]; // All notes for checking global empty state
  filteredNotes: Note[]; // Notes filtered by sortType for display
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  sortType: 'note' | 'keyInformation' | 'document';
  onSortChange: (value: 'note' | 'keyInformation' | 'document') => void;
  isFormOpen: boolean;
  onFormOpenChange: (open: boolean) => void;
  noteFormProps: {
    onSave: (data: NoteFormSubmission) => Promise<void> | void;
    isLoading: boolean;
    onGetLink?: (data: NoteFormSubmission) => Promise<void> | void;
    isGettingLink?: boolean;
    onFormSubmit: () => void;
    defaultValues?: NoteFormValues | null;
    isEditing?: boolean;
  };
}

export function NoteList({ 
  notes, 
  filteredNotes, 
  selectedNoteId, 
  onSelectNote, 
  onDeleteNote, 
  sortType, 
  onSortChange,
  isFormOpen,
  onFormOpenChange,
  noteFormProps,
}: NoteListProps) {
  const displayedNotesList = filteredNotes.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const sortTypeConfig = {
      note: { label: 'Notes', icon: FileText, next: 'keyInformation' as const },
      keyInformation: { label: 'Key Info', icon: Info, next: 'document' as const },
      document: { label: 'Docs', icon: FileArchive, next: 'note' as const },
  }
  
  const CurrentSortIcon = sortTypeConfig[sortType].icon;

  const handleCycleFilter = () => {
    onSortChange(sortTypeConfig[sortType].next);
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
        <div className="flex items-center gap-1">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleCycleFilter}
                      aria-label={`Filter by ${sortTypeConfig[sortTypeConfig[sortType].next].label}`}
                      className="h-9 w-9"
                    >
                      <CurrentSortIcon className="h-5 w-5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Filter by {sortTypeConfig[sortTypeConfig[sortType].next].label}</p>
                </TooltipContent>
            </Tooltip>
             <Dialog open={isFormOpen} onOpenChange={onFormOpenChange}>
              <DialogTrigger asChild>
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                          variant="ghost"
                          size="icon"
                          onClick={() => onFormOpenChange(true)}
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
              <DialogContent className="sm:max-w-[425px] md:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>{noteFormProps.isEditing ? 'Edit Item' : 'Create New Item'}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] -mr-6 pr-6">
                  <NoteForm
                    onSave={noteFormProps.onSave}
                    isLoading={noteFormProps.isLoading}
                    onGetLink={noteFormProps.onGetLink}
                    isGettingLink={noteFormProps.isGettingLink}
                    onFormSubmit={noteFormProps.onFormSubmit}
                    defaultValues={noteFormProps.defaultValues}
                    isEditing={noteFormProps.isEditing}
                  />
                </ScrollArea>
              </DialogContent>
            </Dialog>

        </div>
      </div>
      
      {notes.length === 0 ? (
        <div className="p-4 flex-1 flex flex-col justify-center items-center text-center">
          <p className="text-muted-foreground">You haven't created any items yet. Click "Add New Item" to get started!</p>
        </div>
      ) : displayedNotesList.length === 0 ? (
         <div className="p-4 flex-1 flex flex-col justify-center items-center text-center">
          <p className="text-muted-foreground">No items of type "{sortTypeConfig[sortType].label}" found.</p>
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
                onDelete={() => onDeleteNote(note.id)}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
    </TooltipProvider>
  );
}

    