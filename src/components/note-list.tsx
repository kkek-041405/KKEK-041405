
"use client";

import type { Note } from '@/lib/types';
import type { NoteFormValues } from '@/components/note-form';
import { NoteListItem } from './note-list-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ListChecks, FileText, Info, PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { NoteForm } from '@/components/note-form';

interface NoteListProps {
  notes: Note[]; // All notes for checking global empty state
  filteredNotes: Note[]; // Notes filtered by sortType for display
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  sortType: 'note' | 'keyInformation';
  onSortChange: (value: 'note' | 'keyInformation') => void;
  isFormOpen: boolean;
  onFormOpenChange: (open: boolean) => void;
  noteFormProps: {
    onSave: (data: NoteFormValues) => void;
    isLoading: boolean;
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
        <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-xl font-semibold text-foreground truncate">
                Your Items
            </h3>
        </div>
        <div className="flex items-center gap-1">
             <Dialog open={isFormOpen} onOpenChange={onFormOpenChange}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={() => onFormOpenChange(true)}
                  aria-label="Add New Item"
                  className="h-9 w-9"
                  title="Add New Item"
                >
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] md:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>{noteFormProps.isEditing ? 'Edit Item' : 'Create New Item'}</DialogTitle>
                </DialogHeader>
                <NoteForm
                  onSave={noteFormProps.onSave}
                  isLoading={noteFormProps.isLoading}
                  onFormSubmit={noteFormProps.onFormSubmit}
                  defaultValues={noteFormProps.defaultValues}
                  isEditing={noteFormProps.isEditing}
                />
              </DialogContent>
            </Dialog>

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
        <div className="p-4 pt-0 max-h-[500px] overflow-y-auto">
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
        </div>
      )}
    </div>
  );
}
