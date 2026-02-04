
import { getNoteFromShareToken } from '@/services/share-note-server';
import { NoteFillForm } from '@/components/note-fill-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileWarning, NotebookText } from 'lucide-react';
import Link from 'next/link';

export default async function FillNotePage({ params }: { params: { token: string } }) {
  const { token } = params;
  const note = await getNoteFromShareToken(token);

  if (!note) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
        <Card className="w-full max-w-md shadow-xl text-center">
            <CardHeader>
                <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit mb-4">
                    <FileWarning className="h-10 w-10 text-destructive" />
                </div>
                <CardTitle className="text-2xl">Link Invalid or Expired</CardTitle>
                <CardDescription>
                    This link may have already been used, expired, or been deleted.
                </CardDescription>
            </CardHeader>
             <CardContent>
                <Link href="/" className="text-sm text-primary hover:underline">
                    Go to homepage
                </Link>
             </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen flex flex-col bg-background text-foreground">
        <header className="flex h-14 shrink-0 items-center border-b bg-background px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2 text-primary font-semibold">
                <NotebookText className="h-6 w-6" />
                <span>NoteNest</span>
            </Link>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center p-4">
            <NoteFillForm note={note} />
        </main>
    </div>
  );
}
