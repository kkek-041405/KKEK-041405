
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NoteAuthForm, type NoteAuthFormValues } from '@/components/note-auth-form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LockKeyhole } from 'lucide-react';
import { PortfolioHeader } from '@/components/portfolio-header';
import { PortfolioFooter } from '@/components/portfolio-footer';

export default function NotesAuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthenticate = (data: NoteAuthFormValues) => {
    setIsLoading(true);
    // Basic client-side check for simplicity. In a real app, this should be more secure.
    if (data.accessCode === process.env.NEXT_PUBLIC_NOTES_ACCESS_CODE) {
      // Store a flag in session storage to indicate authentication
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('notesAuthenticated', 'true');
      }
      router.push('/notes/content');
    } else {
      toast({
        title: 'Access Denied',
        description: 'The access code you entered is incorrect. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <PortfolioHeader />
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-3">
              <LockKeyhole className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl md:text-3xl">Access Protected Notes</CardTitle>
            <CardDescription className="text-md md:text-lg">
              Please enter the access code to view your notes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NoteAuthForm onAuthenticate={handleAuthenticate} isLoading={isLoading} />
          </CardContent>
        </Card>
      </main>
      <PortfolioFooter />
    </div>
  );
}
