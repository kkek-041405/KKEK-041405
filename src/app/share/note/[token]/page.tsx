
import { getNoteFromShareToken } from '@/services/share-note-server';
import { PortfolioHeader } from '@/components/portfolio-header';
import { PortfolioFooter } from '@/components/portfolio-footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileWarning, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import type { Note } from '@/lib/types';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@convex/_generated/api';

// A slimmed-down, read-only version of NoteView
function SharedNoteDisplay({ note, documentUrl }: { note: Note, documentUrl?: string | null }) {
  const itemTypeDisplay = note.type === 'note' ? 'Note' : note.type === 'keyInformation' ? 'Key Information' : 'Document';

  const fileType = note.documentMetadata?.fileType;
  const isOfficeDoc = fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || note.documentMetadata?.fileName?.endsWith('.docx');
  const isPdf = fileType === 'application/pdf' || note.documentMetadata?.fileName?.endsWith('.pdf');

  let finalDocumentUrl = documentUrl;
  if (documentUrl && (isOfficeDoc || isPdf)) {
      finalDocumentUrl = `https://docs.google.com/gview?url=${encodeURIComponent(documentUrl)}&embedded=true`;
  }
  
  const getFileExtension = () => {
    if (note.type !== 'document' || !note.documentMetadata?.fileName) {
      return null;
    }
    const parts = note.documentMetadata.fileName.split('.');
    return parts.length > 1 ? parts.pop()?.toLowerCase() : null;
  }
  
  const fileExtension = getFileExtension();


  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl flex flex-col max-h-[90vh]">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <CardTitle className="text-2xl md:text-3xl">{note.title}</CardTitle>
            {fileExtension && (
              <Badge variant="secondary" className="whitespace-nowrap h-fit">
                {fileExtension}
              </Badge>
            )}
          </div>
          <Badge variant="secondary">{itemTypeDisplay}</Badge>
        </div>
        <CardDescription>
          Shared on: {format(new Date(), "PPP p")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
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
            <div className="h-full flex flex-col flex-1">
              {finalDocumentUrl ? (
                <iframe
                  src={finalDocumentUrl}
                  className="w-full h-full flex-1 border-0 rounded-md bg-white"
                  title={`Embedded document: ${note.title}`}
                  allowFullScreen
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground bg-muted/30 rounded-md">
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
    </Card>
  );
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
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <PortfolioHeader />
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        {note ? (
          <SharedNoteDisplay note={note} documentUrl={documentUrl} />
        ) : (
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
        )}
      </main>
      <PortfolioFooter />
    </div>
  );
}
