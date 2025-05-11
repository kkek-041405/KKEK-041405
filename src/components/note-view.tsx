"use client";

import type { Note } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Loader2 } from 'lucide-react';
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

  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl break-words">{note.title}</CardTitle>
        <CardDescription>
          Created on: {format(new Date(note.createdAt), "PPP p")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words">
          {note.content}
        </div>
        {note.summary && (
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
    </Card>
  );
}
