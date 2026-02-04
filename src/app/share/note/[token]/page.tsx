
import { getNoteFromShareToken } from '@/services/share-note-server';
import { PortfolioHeader } from '@/components/portfolio-header';
import { PortfolioFooter } from '@/components/portfolio-footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileWarning, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import type { Note } from '@/lib/types';


// A slimmed-down, read-only version of NoteView
function SharedNoteDisplay({ note }: { note: Note }) {
  const itemTypeDisplay = note.type === 'note' ? 'Note' : note.type === 'keyInformation' ? 'Key Information' : 'Document';

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl md:text-3xl">{note.title}</CardTitle>
          <Badge variant="secondary">{itemTypeDisplay}</Badge>
        </div>
        <CardDescription>
          Shared on: {format(new Date(), "PPP p")}
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            <p className="text-muted-foreground">Document sharing is not yet supported in this view.</p>
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

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <PortfolioHeader />
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        {note ? (
          <SharedNoteDisplay note={note} />
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
