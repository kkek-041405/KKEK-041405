
"use client";

import type { Note } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, FileText, Info } from 'lucide-react';
import { format } from 'date-fns';

interface NoteViewProps {
  note: Note;
  onSummarize: (noteId: string, noteContent: string) => Promise<void>;
  isLoadingSummary: boolean;
}

export function NoteView({ note, onSummarize, isLoadingSummary }: NoteViewProps) {
  const handleSummarize = () => {
    onSummarize(note.id, note.content);
  };

  const itemTypeDisplay = note.type === 'note' ? 'Note' : 'Key Information';
  const ItemIcon = note.type === 'note' ? FileText : Info;

  return (
    <div className="bg-card text-card-foreground shadow-lg rounded-lg border flex flex-col flex-1">
      <div className="flex flex-col space-y-1.5 p-6 border-b"> {/* Header section */}
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-semibold leading-none tracking-tight break-words">{note.title}</h2>
          <Badge variant={note.type === 'note' ? "secondary" : "outline"} className="ml-2 whitespace-nowrap">
            <ItemIcon className="mr-1 h-4 w-4" />
            {itemTypeDisplay}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Created on: {format(new Date(note.createdAt), "PPP p")}
        </p>
      </div>
      <div className="p-6 pt-0 flex-1 overflow-y-auto"> {/* Content section */}
        {note.type === 'note' && note.content && (
          <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words pt-6">
            {note.content}
          </div>
        )}
        
        {note.summary && note.type === 'note' && (
          <div className={`${!(note.type === 'note' && note.content) ? 'pt-6' : ''}`}>
            {note.type === 'note' && note.content && <Separator className="my-6" />}
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary" />
                AI Summary
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap break-words">{note.summary}</p>
            </div>
          </div>
        )}
      </div>
      {note.type === 'note' && (
        <div className="flex items-center p-6 pt-0 border-t mt-auto"> {/* Footer section */}
          <Button onClick={handleSummarize} disabled={isLoadingSummary}>
            {isLoadingSummary ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Summarize Note
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
