
import { getNoteFromShareToken } from '@/services/share-note-server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileWarning, Sparkles, NotebookText } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import type { Note } from '@/lib/types';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@convex/_generated/api';
import Link from 'next/link';

// The actual content display, now without its own header.
function SharedNoteDisplay({ note, documentUrl }: { note: Note, documentUrl?: string | null }) {
  const fileType = note.documentMetadata?.fileType;
  const isOfficeDoc = fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || note.documentMetadata?.fileName?.endsWith('.docx');
  const isPdf = fileType === 'application/pdf' || note.documentMetadata?.fileName?.endsWith('.pdf');

  let finalDocumentUrl = documentUrl;
  if (documentUrl && (isOfficeDoc || isPdf)) {
      finalDocumentUrl = `https://docs.google.com/gview?url=${encodeURIComponent(documentUrl)}&embedded=true`;
  }
  
  // The content area now fills the whole component, with padding inside.
  return (
    <div className="w-full h-full flex flex-col bg-card text-card-foreground">
      <CardContent className="flex-1 flex flex-col min-h-0 p-6 overflow-y-auto">
        {note.type === 'note' && (
          <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap break-words">
            {note.content}
          </div>
        )}
        {note.type === 'keyInformation' && (
           <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Value:</h3>
              <p className="text-lg text-foreground bg-muted/50 p-3 rounded-md break-words">{note.content}</p>
            </div>
        )}
        {note.type === 'document' && (
            <div className="h-full flex flex-col flex-1 -m-6"> {/* Negative margin to bleed into padding */}
              {finalDocumentUrl ? (
                <iframe
                  src={finalDocumentUrl}
                  className="w-full h-full flex-1 border-0 bg-white"
                  title={`Embedded document: ${note.title}`}
                  allowFullScreen
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground bg-muted/30">
                    <span>Document preview is not available for this file type.</span>
                </div>
              )}
            </div>
        )}
         {note.summary && (
            <div className="mt-6 pt-6 border-t">
                 <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />AI Summary</h3>
                 <p className="text-muted-foreground whitespace-pre-wrap break-words">{note.summary}</p>
            </div>
        )}
      </CardContent>
    </div>
  );
}


// The new minimal header strip
function SharedNoteHeader({ note }: { note: Note }) {
  const itemTypeDisplay = note.type === 'note' ? 'Note' : note.type === 'keyInformation' ? 'Key Info' : 'Document';
  
  return (
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-primary font-semibold">
              <NotebookText className="h-6 w-6" />
              <span>NoteNest</span>
          </Link>
          <div className="w-px h-6 bg-border"></div>
          <div className="flex items-center gap-2">
            <h1 className="text-md font-medium text-foreground truncate">{note.title}</h1>
            <Badge variant="outline">{itemTypeDisplay}</Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground hidden md:block">
            Shared on {format(new Date(note.createdAt), "PPP")}
        </p>
    </header>
  )
}


export default async function SharedNotePage({ params }: { params: { token: string } }) {
  const { token } = params;
  const note = await getNoteFromShareToken(token);

  let documentUrl: string | null = null;
  if (note?.type === 'document') {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (convexUrl) {
      try {
        const convex = new ConvexHttpClient(convexUrl);
        const storageId = note.documentMetadata?.storageId;
        
        if (storageId) {
          const getDocFn = (api.queries as any).getDocument?.default ?? api.queries.getDocument;
          const result = await convex.query(getDocFn, { storageId });
          documentUrl = result?.url ?? null;
        }

      } catch (e) {
        console.error("Failed to resolve document URL from Convex", e);
      }
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground">
        {note && <SharedNoteHeader note={note} />}
        <main className="flex-1 min-h-0">
            {note ? (
            <SharedNoteDisplay note={note} documentUrl={documentUrl} />
            ) : (
            // Center the error card
            <div className="flex h-full w-full items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl text-center">
                    <CardHeader>
                        <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit mb-4">
                            <FileWarning className="h-10 w-10 text-destructive" />
                        </div>
                        <CardTitle className="text-2xl">Link Invalid or Expired</CardTitle>
                        <CardDescription>
                            This share link is no longer valid. It may have expired, reached its view limit, or been deleted.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
            )}
        </main>
    </div>
  );
}
