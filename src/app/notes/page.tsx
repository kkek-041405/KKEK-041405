
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NoteAuthForm, type NoteAuthFormValues } from '@/components/note-auth-form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LockKeyhole } from 'lucide-react';
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-300 font-sans">
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md bg-slate-900/60 border-slate-800 backdrop-blur-sm shadow-2xl shadow-black/50">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-3">
              <LockKeyhole className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-extrabold text-slate-100">Access NoteNest</CardTitle>
            <CardDescription className="text-md md:text-lg text-slate-400">
              This section requires an access code. Please enter it below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <NoteAuthForm onAuthenticate={handleAuthenticate} isLoading={isLoading} />
             <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:text-primary hover:border-primary/50 hover:bg-primary/10" asChild>
                <Link href="/">
                    Return to Portfolio
                </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
