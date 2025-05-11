
"use client";

import type { Note } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
    // Content for 'note' type is guaranteed by how it's saved.
    onSummarize(note.id, note.content);
  };

  const itemTypeDisplay = note.type === 'note' ? 'Note' : 'Key Information';
  const ItemIcon = note.type === 'note' ? FileText : Info;

  return (
    <Card className="mt-8 shadow-lg flex flex-col flex-1"> {/* Card fills available space */}
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl break-words">{note.title}</CardTitle>
          <Badge variant={note.type === 'note' ? "secondary" : "outline"} className="ml-2 whitespace-nowrap">
            <ItemIcon className="mr-1 h-4 w-4" />
            {itemTypeDisplay}
          </Badge>
        </div>
        <CardDescription>
          Created on: {format(new Date(note.createdAt), "PPP p")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto"> {/* CardContent expands and scrolls if needed */}
        {note.type === 'note' && note.content && (
          <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words">
            {note.content}
          </div>
        )}
        {/* If it's keyInformation, the title already displays the information, so no separate content block is needed. */}
        
        {note.summary && note.type === 'note' && (
          <>
            <Separator className="my-6" />
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary" />
                AI Summary
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap break-words">{note.summary}</p>
            </div>
          </>
        )}
      </CardContent>
      {note.type === 'note' && (
        <CardFooter>
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
        </CardFooter>
      )}
    </Card>
  );
}
