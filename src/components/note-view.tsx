"use client";

import type { Note } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkles, Loader2, Copy, Pencil, Maximize, Download, Share2, MoreVertical, Trash2, Eye, EyeOff, ExternalLink, ChevronLeft, Info } from 'lucide-react';
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
  const [isCopied, setIsCopied] = useState(false);
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
      setTimeout(() => setIsCopyingValue(false), 2000);
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
    <div className="flex flex-col h-full bg-card relative">
      
      <div className="flex items-center justify-between px-6 py-4 z-10">
        <Button variant="ghost" size="sm" onClick={onBack} className="md:hidden -ml-2 text-muted-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="flex-1" />
        
        <div className="flex items-center gap-1">
          {note.type === 'note' && (
             <Button variant="ghost" size="sm" onClick={handleSummarize} disabled={isLoadingSummary || !note.content} className="text-muted-foreground hover:text-primary">
               {isLoadingSummary ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />} 
               {isLoadingSummary ? 'Analyzing...' : 'AI Summary'}
             </Button>
          )}

          <Button variant="ghost" size="sm" onClick={() => setIsShareDialogOpen(true)} className="text-muted-foreground hover:text-primary">
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>

          <div className="h-4 w-[1px] bg-border mx-2" />

          <Button variant="ghost" size="icon" onClick={() => onEditRequest(note)} className="h-8 w-8 text-muted-foreground">
            <Pencil className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <MoreVertical className="h-4 w-4" />
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

      <div className="flex-1 overflow-y-auto px-8 pb-10">
        <div className="max-w-3xl mx-auto space-y-8">
          
          <div className="space-y-2 border-b pb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{note.title}</h1>
              {note.type !== 'note' && (
                <Badge variant="outline" className="mt-1 font-normal text-muted-foreground">
                  {note.type === 'keyInformation' ? 'Secure Info' : getFileExtension()}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Last edited {format(new Date(note.createdAt), "PPP")}
            </p>
          </div>
          
          {note.type === 'note' && (
            <div className="prose dark:prose-invert max-w-none leading-7 text-foreground/90 whitespace-pre-wrap break-words">
              {note.content}
            </div>
          )}

          {note.type === 'keyInformation' && (
            <div className="bg-secondary/20 border border-border rounded-xl p-6 max-w-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-primary font-medium">
                   <Info className="h-4 w-4" /> Secure Value
                </div>
                <Button size="icon" variant="ghost" onClick={handleCopyValue} disabled={isCopyingValue}>
                   {isCopyingValue ? <Loader2 className="h-4 w-4 animate-spin"/> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="relative group cursor-pointer" onClick={() => setIsValueVisible(!isValueVisible)}>
                <div className={cn(
                  "p-4 rounded-lg bg-background border font-mono text-lg transition-all",
                  isValueVisible ? "text-foreground" : "text-muted-foreground tracking-widest blur-[2px] select-none"
                )}>
                  {isValueVisible ? note.content : "•••• •••• •••• ••••"}
                </div>
                {!isValueVisible && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-foreground text-background text-xs px-2 py-1 rounded shadow-lg font-bold">Click to Reveal</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {note.type === 'document' && (
             <div className="aspect-[4/3] w-full border rounded-xl overflow-hidden shadow-sm bg-muted/20 relative group">
                {resolvedServingUrl === undefined ? (
                    <div className="flex-1 flex h-full items-center justify-center text-muted-foreground">
                       <Loader2 className="h-8 w-8 animate-spin text-primary" />
                       <p className="ml-4">Resolving document URL...</p>
                     </div>
                ) : iframeLoadFailed ? (
                     <div className="flex-1 flex h-full flex-col items-center justify-center text-center text-muted-foreground p-4">
                        <p className="mb-4">Document preview failed to load.</p>
                        <Button asChild>
                            <a href={resolvedServingUrl ?? '#'} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" /> Open in New Tab
                            </a>
                        </Button>
                     </div>
                ) : !finalDocumentUrl ? (
                     <div className="flex-1 flex h-full items-center justify-center text-muted-foreground text-center p-4">
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
                            className={cn("w-full h-full flex-1 border-0 bg-white", isIframeLoading && "opacity-0")}
                            title={`Embedded document: ${note.title}`}
                            allowFullScreen
                        />
                    </>
                )}
                {finalDocumentUrl && (
                    <Button 
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      onClick={handleFullscreen}
                      variant="secondary"
                    >
                      <Maximize className="mr-2 h-4 w-4" /> Expand
                    </Button>
                )}
             </div>
          )}
          
          {note.summary && (
             <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-xl p-6 border border-primary/10 mt-8">
               <h3 className="font-semibold text-primary flex items-center gap-2 mb-3">
                 <Sparkles className="h-4 w-4" /> AI Summary
               </h3>
               <p className="text-sm leading-relaxed text-muted-foreground">{note.summary}</p>
             </div>
          )}

        </div>
      </div>

       <ShareNoteDialog
        note={note}
        isOpen={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
      />
    </div>
  );
}
