
"use client";

import type { Note } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, FileText, Info, Copy, Pencil, ExternalLink, FileArchive } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface NoteViewProps {
  note: Note;
  /** If provided, a pre-resolved short-lived serving URL (from Convex) for the document. */
  resolvedServingUrl?: string | null | undefined;
  onSummarize: (noteId: string, noteContent: string) => Promise<void>;
  isLoadingSummary: boolean;
  onEditRequest: (note: Note) => void;
}

export function NoteView({ note, resolvedServingUrl, onSummarize, isLoadingSummary, onEditRequest }: NoteViewProps) {
  const [isCopyingValue, setIsCopyingValue] = useState(false);
  const [isCopyingSummary, setIsCopyingSummary] = useState(false);
  // opening is synchronous when using pre-resolved URL; no async spinner needed
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

  const documentUrl = resolvedServingUrl ?? (note.type === 'document' ? note.content : null);

  return (
    <div className="bg-card text-card-foreground shadow-lg rounded-lg border flex flex-col flex-1 h-full">
      <div className="flex items-start justify-between gap-4 p-6 border-b">
        <div className="flex-1 space-y-1.5">
            <h2 className="text-2xl font-semibold leading-none tracking-tight break-words">
              {note.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              Created on: {format(new Date(note.createdAt), "PPP p")}
            </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
             <Badge variant={note.type === 'note' ? "secondary" : "outline"} className="whitespace-nowrap h-fit">
              <ItemIcon className="mr-1 h-4 w-4" />
              {itemTypeDisplay}
            </Badge>
            {note.type === 'document' && (
                <Button
                    onClick={() => {
                        if (!documentUrl) return;
                        window.open(documentUrl, '_blank', 'noopener,noreferrer');
                    }}
                    variant="outline"
                    size="sm"
                    disabled={!documentUrl}
                >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open
                </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => onEditRequest(note)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
            {note.type === 'note' && (
            <Button size="sm" onClick={handleSummarize} disabled={isLoadingSummary || !note.content}>
                {isLoadingSummary ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Summarizing...
                </>
                ) : (
                <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Summarize
                </>
                )}
            </Button>
            )}
        </div>
      </div>
      <div className={cn(
        "flex-1 overflow-y-auto",
        note.type !== 'document' && "p-6 pt-0"
      )}>
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
            <div className="h-full flex flex-col">
              {documentUrl ? (
                <iframe
                  src={documentUrl}
                  className="w-full h-full flex-1 border-0"
                  title={`Embedded document: ${note.title}`}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  {resolvedServingUrl === undefined ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    <span>Document preview not available.</span>
                  )}
                </div>
              )}
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
    </div>
  );
}
