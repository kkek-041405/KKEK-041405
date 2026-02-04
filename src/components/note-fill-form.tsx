
'use client';

import { useState } from 'react';
import type { Note } from '@/lib/types';
import { NoteForm, type NoteFormSubmission, type NoteFormValues } from '@/components/note-form';
import { updateNoteInFirestore } from '@/services/note-service';
import { uploadFileToServer } from '@/services/file-upload-service';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Edit } from 'lucide-react';
import Link from 'next/link';

interface NoteFillFormProps {
  note: Note;
  token: string;
}

// New client-side service function to call the API route
async function consumeTokenOnServer(token: string) {
  try {
    const res = await fetch('/api/notes/consume-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) {
        console.warn('Failed to consume token on server. The link may be reusable.');
    }
  } catch (error) {
    console.warn('Failed to make consume token request:', error);
  }
}

export function NoteFillForm({ note, token }: NoteFillFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleUpdateNote = async (data: NoteFormSubmission) => {
    setIsSubmitting(true);
    try {
      let submissionData: Partial<Omit<Note, 'id' | 'createdAt'>> = {
        title: data.title,
        content: data.content,
        type: data.type,
      };

      if (data.type === 'document') {
          if (data.file) { // A new file was uploaded
            const uploadResult = await uploadFileToServer(data.file);
            if (uploadResult) {
              submissionData.content = `/api/notes/download?storageId=${encodeURIComponent(uploadResult.storageId)}`;
              submissionData.documentMetadata = uploadResult;
            } else {
              throw new Error('File upload failed.');
            }
          } else if (data.content && data.content.length > 0) {
            // No new file, but content is not empty, so keep the existing file.
            submissionData.content = note.content;
            submissionData.documentMetadata = note.documentMetadata;
          } else {
            // No new file and content is empty, so user wants to remove the file.
            submissionData.content = '';
            submissionData.documentMetadata = null as any; // Set to null to clear in Firestore
          }
      }
      
      // Update the existing note
      await updateNoteInFirestore(note.id, submissionData);
      
      // After successful submission, consume the token.
      await consumeTokenOnServer(token);
      
      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to update note:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isSubmitted) {
    return (
      <Card className="w-full max-w-lg shadow-xl text-center">
            <CardHeader>
                 <div className="mx-auto bg-green-500/10 p-4 rounded-full w-fit mb-4">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <CardTitle className="text-2xl">Update Complete!</CardTitle>
                <CardDescription>
                    Thank you. The item has been successfully updated.
                </CardDescription>
            </CardHeader>
             <CardContent>
                <Link href="/" className="text-sm text-primary hover:underline">
                    Go to homepage
                </Link>
             </CardContent>
        </Card>
    );
  }

  // The NoteForm expects `defaultValues` to be of type `NoteFormValues`,
  // but we also need to pass `documentMetadata` for display purposes.
  // We can cast the `note` object which has the correct shape.
  const initialValues = note as NoteFormValues;

  return (
    <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Edit className="h-7 w-7 text-primary" />
              Edit Information
            </CardTitle>
            <CardDescription>
                You've been asked to edit the following item. Please make your changes and submit.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <NoteForm
                onSave={handleUpdateNote}
                isLoading={isSubmitting}
                onFormSubmit={() => {}}
                defaultValues={initialValues}
                isEditing={true}
                submitButtonText="Update Information"
            />
        </CardContent>
    </Card>
  );
}
