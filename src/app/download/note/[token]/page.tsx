
import { getNoteFromShareToken } from '@/services/share-note-server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileWarning, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

// Server-side function to call the API route to consume the token
async function consumeTokenOnServer(token: string) {
  // We need the absolute URL for server-side fetch.
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const absoluteUrl = `${protocol}://${host}`;

  try {
    const res = await fetch(`${absoluteUrl}/api/notes/consume-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      cache: 'no-store',
    });
    if (!res.ok) {
        console.warn(`Failed to consume token ${token} on server. The link may be reusable.`);
    }
  } catch (error) {
    console.warn(`Failed to make consume token request for token ${token}:`, error);
  }
}

export default async function DownloadNotePage({ params }: { params: { token: string } }) {
  const { token } = params;
  const note = await getNoteFromShareToken(token);

  if (note && note.type === 'document' && note.content) {
    // Consume the token
    await consumeTokenOnServer(token);
    
    const getFileExtension = (fileName?: string) => {
        if (!fileName) return '';
        const parts = fileName.split('.');
        if (parts.length > 1) {
            return `.${parts.pop()}`;
        }
        return '';
    };

    const extension = getFileExtension(note.documentMetadata?.fileName);
    const downloadFilename = `${note.title}${extension}`;

    // Redirect to the download URL with the desired filename
    redirect(`${note.content}&filename=${encodeURIComponent(downloadFilename)}`);
  }

  // If we reach here, the note is invalid or not a document.
  // Show a loading/error page.
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

  // If note exists but isn't a document, show a different error.
  if (note.type !== 'document') {
       return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
        <Card className="w-full max-w-md shadow-xl text-center">
            <CardHeader>
                <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit mb-4">
                    <FileWarning className="h-10 w-10 text-destructive" />
                </div>
                <CardTitle className="text-2xl">Invalid Link Type</CardTitle>
                <CardDescription>
                    This link is not for a downloadable document.
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
  
   // Fallback loader while redirecting
   return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4">Preparing your download...</p>
    </div>
   )
}
