"use client";

import type * as React from 'react';
import type { Note } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Trash2, FileText, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoteListItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function NoteListItem({ note, isSelected, onSelect, onDelete }: NoteListItemProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selection when deleting
    onDelete();
  };

  const ItemIcon = note.type === 'note' ? FileText : Info;
  
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
      <div className="flex items-center space-x-3">
        <ItemIcon className={cn("h-5 w-5 shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
        <span className={cn("font-medium truncate", isSelected ? "text-primary" : "text-foreground")}>{note.title}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={handleDelete}
        aria-label={`Delete ${note.type === 'note' ? 'note' : 'key information'} titled ${note.title}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
