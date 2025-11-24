
"use client";

import type { Note } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, FileText, Info, Copy, Pencil, ExternalLink, FileArchive } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NoteViewProps {
  note: Note;
  onSummarize: (noteId: string, noteContent: string) => Promise<void>;
  isLoadingSummary: boolean;
  onEditRequest: (note: Note) => void;
}

export function NoteView({ note, onSummarize, isLoadingSummary, onEditRequest }: NoteViewProps) {
  const [isCopyingValue, setIsCopyingValue] = useState(false);
  const [isCopyingSummary, setIsCopyingSummary] = useState(false);
  const { toast } = useToast();
  
  const [canCopy, setCanCopy] = useState(false);
  useEffect(() => {
    setCanCopy(typeof navigator !== 'undefined' && !!navigator.clipboard);
  }, []);


  const handleSummarize = () => {
    if (note.type === 'note') {
      onSummarize(note.id, note.content);
    }
  };

  const handleCopyValue = async () => {
    if (!canCopy || note.type !== 'keyInformation' || !note.content) return;
    setIsCopyingValue(true);
    try {
      await navigator.clipboard.writeText(note.content);
      toast({
        title: "Value Copied!",
        description: "The key information value has been copied to your clipboard.",
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast({
        title: "Copy Failed",
        description: "Could not copy value to clipboard.",
        variant: "destructive",
      });
    } finally {
      setIsCopyingValue(false);
    }
  };

  const handleCopySummary = async () => {
    if (!canCopy || !note.summary) return;
    setIsCopyingSummary(true);
    try {
      await navigator.clipboard.writeText(note.summary);
      toast({
        title: "Summary Copied!",
        description: "The AI summary has been copied to your clipboard.",
      });
    } catch (err) {
      console.error('Failed to copy summary: ', err);
      toast({
        title: "Copy Failed",
        description: "Could not copy summary to clipboard.",
        variant: "destructive",
      });
    } finally {
      setIsCopyingSummary(false);
    }
  };

  const itemTypeDisplay = note.type === 'note' ? 'Note' : note.type === 'keyInformation' ? 'Key Information' : 'Document';
  const ItemIcon = note.type === 'note' ? FileText : note.type === 'keyInformation' ? Info : FileArchive;

  return (
    <div className="bg-card text-card-foreground shadow-lg rounded-lg border flex flex-col flex-1">
      <div className="flex flex-col space-y-1.5 p-6 border-b">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-semibold leading-none tracking-tight break-words">
            {note.title}
          </h2>
          <Badge variant={note.type === 'note' ? "secondary" : "outline"} className="ml-2 whitespace-nowrap">
            <ItemIcon className="mr-1 h-4 w-4" />
            {itemTypeDisplay}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Created on: {format(new Date(note.createdAt), "PPP p")}
        </p>
      </div>
      <div className="p-6 pt-0 flex-1 overflow-y-auto">
        {note.type === 'note' && note.content && (
          <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words pt-6">
            {note.content}
          </div>
        )}

        {note.type === 'keyInformation' && (
          <div className="space-y-4 pt-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Key Name:</h3>
              <p className="text-lg text-foreground break-words">{note.title}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Value:</h3>
              <div className="flex items-center justify-between gap-2 bg-muted/50 p-3 rounded-md">
                <p className="flex-1 text-base text-foreground whitespace-pre-wrap break-words">{note.content}</p>
                {canCopy && (
                  <Button 
                    onClick={handleCopyValue} 
                    disabled={isCopyingValue || !note.content}
                    variant="ghost" 
                    size="icon"
                    className="shrink-0 h-8 w-8"
                    aria-label="Copy value"
                  >
                    {isCopyingValue ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {note.type === 'document' && (
             <div className="space-y-4 pt-6">
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Document Name:</h3>
                    <p className="text-lg text-foreground break-words">{note.title}</p>
                </div>
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">File Location:</h3>
                     <Button asChild variant="outline">
                        <Link href={note.content} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Document
                        </Link>
                     </Button>
                </div>
            </div>
        )}
        
        {note.summary && note.type === 'note' && (
          <div className={`${!(note.type === 'note' && note.content) ? 'pt-6' : ''}`}>
            {note.type === 'note' && note.content && <Separator className="my-6" />}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-primary" />
                  AI Summary
                </h3>
                {canCopy && (
                  <Button
                    onClick={handleCopySummary}
                    disabled={isCopyingSummary || !note.summary}
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-8 w-8"
                    aria-label="Copy AI summary"
                  >
                    {isCopyingSummary ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
              <p className="text-muted-foreground whitespace-pre-wrap break-words">{note.summary}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-end p-6 pt-0 border-t mt-auto min-h-[76px] gap-2">
        <Button variant="outline" size="default" onClick={() => onEditRequest(note)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
        </Button>
        {note.type === 'note' && (
          <Button onClick={handleSummarize} disabled={isLoadingSummary || !note.content}>
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
        )}
      </div>
    </div>
  );
}
