
"use client";

import type * as React from 'react';
import type { Note } from '@/lib/types';
import { FileText, Info, FileArchive } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoteListItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
}

export function NoteListItem({ note, isSelected, onSelect }: NoteListItemProps) {

  const ItemIcon = note.type === 'note' ? FileText : note.type === 'keyInformation' ? Info : FileArchive;
  
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      className={cn(
        "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50",
        isSelected ? "bg-primary/10 border border-primary" : "border border-transparent"
      )}
    >
      <div className="flex items-center space-x-3 overflow-hidden">
        <ItemIcon className={cn("h-5 w-5 shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
        <span className={cn("font-medium truncate", isSelected ? "text-primary" : "text-foreground")}>{note.title}</span>
      </div>
    </div>
  );
}
