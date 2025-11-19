
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NoteAuthForm, type NoteAuthFormValues } from '@/components/note-auth-form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LockKeyhole, LogIn } from 'lucide-react';
import { PortfolioHeader } from '@/components/portfolio-header';
import { PortfolioFooter } from '@/components/portfolio-footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getAccessCodeFromFirestore } from '@/services/config-service';

export default function NotesAuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Check if already authenticated and redirect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authStatus = sessionStorage.getItem('notesAuthenticated');
      if (authStatus === 'true') {
        router.replace('/notes/content');
      }
    }
  }, [router]);

  const handleAuthenticate = async (data: NoteAuthFormValues) => {
    setIsLoading(true);
    const correctAccessCode = await getAccessCodeFromFirestore();

    if (correctAccessCode && data.accessCode === correctAccessCode) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('notesAuthenticated', 'true');
      }
      router.replace('/notes/content'); // Use replace to avoid back button to auth page
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
              This section requires an access code. Please enter it below or use the "Notes" button in the header.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <NoteAuthForm onAuthenticate={handleAuthenticate} isLoading={isLoading} />
             <Button variant="outline" className="w-full" asChild>
                <Link href="/#home">
                    Go Back to Portfolio
                </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      <PortfolioFooter />
    </div>
  );
}
