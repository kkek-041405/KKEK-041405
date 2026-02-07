
"use client";

import type { Note } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkles, Loader2, Copy, Pencil, Maximize, Download, Share2, MoreVertical, Trash2, Eye, EyeOff, ExternalLink, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ShareNoteDialog } from './share-note-dialog';

interface NoteViewProps {
  note: Note;
  resolvedServingUrl?: string | null | undefined;
  onSummarize: (noteId: string, noteContent: string) => Promise<void>;
  isLoadingSummary: boolean;
  onEditRequest: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onBack: () => void;
}

export function NoteView({ note, resolvedServingUrl, onSummarize, isLoadingSummary, onEditRequest, onDelete, onBack }: NoteViewProps) {
  const [isCopyingValue, setIsCopyingValue] = useState(false);
  const [isCopyingSummary, setIsCopyingSummary] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isValueVisible, setIsValueVisible] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();
  
  const [isIframeLoading, setIsIframeLoading] = useState(false);
  const [iframeLoadFailed, setIframeLoadFailed] = useState(false);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [canCopy, setCanCopy] = useState(false);
  useEffect(() => {
    setCanCopy(typeof navigator !== 'undefined' && !!navigator.clipboard);
  }, []);

  // Reset visibility state when the note changes
  useEffect(() => {
    setIsValueVisible(false);
  }, [note.id]);

  useEffect(() => {
    // Reset iframe states when the note changes or url is resolved
    if (note.type === 'document' && resolvedServingUrl) {
      setIsIframeLoading(true);
      setIframeLoadFailed(false);

      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }

      loadTimeoutRef.current = setTimeout(() => {
        setIsIframeLoading(false);
        setIframeLoadFailed(true);
      }, 15000); // 15-second timeout
    } else if (note.type === 'document') {
       // Reset if URL is not yet resolved
       setIsIframeLoading(false);
       setIframeLoadFailed(false);
    }

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [note.id, note.type, resolvedServingUrl]);

  const handleIframeLoad = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    setIsIframeLoading(false);
    setIframeLoadFailed(false);
  };


  const handleSummarize = () => {
    if (note.type === 'note') {
      onSummarize(note.id, note.content);
    }
  };

  const handleFullscreen = () => {
    if (iframeRef.current) {
      iframeRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        toast({
          title: "Fullscreen Not Supported",
          description: "Your browser might not support this feature or it was blocked.",
          variant: "destructive",
        });
      });
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

  const fileType = note.documentMetadata?.fileType;
  const isOfficeDoc = fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || note.documentMetadata?.fileName?.endsWith('.docx');
  const isPdf = fileType === 'application/pdf' || note.documentMetadata?.fileName?.endsWith('.pdf');

  let finalDocumentUrl = resolvedServingUrl;

  if (finalDocumentUrl && (isOfficeDoc || isPdf)) {
    finalDocumentUrl = `https://docs.google.com/gview?url=${encodeURIComponent(finalDocumentUrl)}&embedded=true`;
  }
  
  const getFileExtension = () => {
    if (note.type !== 'document' || !note.documentMetadata?.fileName) {
      return '';
    }
    const parts = note.documentMetadata.fileName.split('.');
    return parts.length > 1 ? `.${parts.pop()?.toLowerCase()}` : '';
  }
  
  const fileExtension = getFileExtension();
  const downloadFilename = `${note.title || 'document'}${fileExtension}`;


  return (
    <div className="bg-card text-card-foreground border-0 flex flex-col flex-1 h-full">
      <div className="flex items-start justify-between gap-4 p-6 border-b">
        <div className="flex-1 flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden h-9 w-9 -ml-2 shrink-0">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back to list</span>
          </Button>

          <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold leading-none tracking-tight break-words truncate">
                  {note.title}
                </h2>
                {fileExtension && (
                  <Badge variant="secondary" className="whitespace-nowrap h-fit shrink-0">
                    {fileExtension.replace('.', '')}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                Created on: {format(new Date(note.createdAt), "PPP p")}
              </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
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
            <Button variant="outline" size="sm" onClick={() => setIsShareDialogOpen(true)}>
                <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEditRequest(note)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">More actions</span>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  {note.type === 'document' && (
                    <>
                      <DropdownMenuItem onSelect={() => window.open(`${note.content}&filename=${encodeURIComponent(downloadFilename)}`, '_blank')}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={handleFullscreen} disabled={!finalDocumentUrl}>
                          <Maximize className="mr-2 h-4 w-4" />
                          Fullscreen
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onSelect={() => onDelete(note.id)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
      <div className={cn(
        "flex-1 overflow-y-auto",
        note.type !== 'document' && "p-6"
      )}>
        {note.type === 'note' && note.content && (
          <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words">
            {note.content}
          </div>
        )}

        {note.type === 'keyInformation' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Key Name:</h3>
              <p className="text-lg text-foreground break-words">{note.title}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Value:</h3>
              <div className="flex items-center justify-between gap-2 bg-muted/50 p-3 rounded-md">
                <p className="flex-1 font-mono text-base text-foreground whitespace-pre-wrap break-words">
                  {isValueVisible ? note.content : '••••••••••••••••'}
                </p>
                <div className="flex items-center">
                   <Button 
                      onClick={() => setIsValueVisible(!isValueVisible)} 
                      variant="ghost" 
                      size="icon"
                      className="shrink-0 h-8 w-8"
                      aria-label={isValueVisible ? "Hide value" : "Show value"}
                    >
                      {isValueVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
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
          </div>
        )}

        {note.type === 'document' && (
            <div className="h-full flex flex-col flex-1 relative">
              {resolvedServingUrl === undefined ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                   <Loader2 className="h-8 w-8 animate-spin text-primary" />
                   <p className="ml-4">Resolving document URL...</p>
                 </div>
              ) : iframeLoadFailed ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/30 rounded-md p-4">
                    <p className="mb-4">Document preview failed to load.</p>
                    <Button asChild>
                        <a href={resolvedServingUrl ?? '#'} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" /> Open in New Tab
                        </a>
                    </Button>
                 </div>
              ) : !finalDocumentUrl ? (
                 <div className="flex-1 flex items-center justify-center text-muted-foreground bg-muted/30 rounded-md p-4 text-center">
                   <span>Document preview is not available for this file type.</span>
                </div>
              ) : (
                <>
                  {isIframeLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-card z-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="mt-4 text-muted-foreground">Loading document...</p>
                    </div>
                  )}
                  <iframe
                    ref={iframeRef}
                    src={finalDocumentUrl}
                    onLoad={handleIframeLoad}
                    className={cn(
                        "w-full h-full flex-1 border-0 rounded-md bg-white",
                        isIframeLoading && "opacity-0"
                    )}
                    title={`Embedded document: ${note.title}`}
                    allowFullScreen
                  />
                </>
              )}
            </div>
        )}
        
        {note.summary && (
          <>
            {(note.type === 'note' || note.type === 'keyInformation') && note.content && <Separator className="my-6" />}
            <div className="rounded-lg border bg-secondary/50 p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center text-secondary-foreground">
                  <Sparkles className="mr-2 h-5 w-5 text-primary" />
                  AI Summary
                </h3>
                {canCopy && (
                  <Button
                    onClick={handleCopySummary}
                    disabled={isCopyingSummary || !note.summary}
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-8 w-8 text-secondary-foreground/70 hover:text-secondary-foreground"
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
              <p className="text-secondary-foreground/90 whitespace-pre-wrap break-words">{note.summary}</p>
            </div>
          </>
        )}
      </div>
       <ShareNoteDialog
        note={note}
        isOpen={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
      />
    </div>
  );
}
