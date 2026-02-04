'use client';

import { useState } from 'react';
import type { Note } from '@/lib/types';
import { NoteForm, type NoteFormSubmission, type NoteFormValues } from '@/components/note-form';
import { addNoteToFirestore, deleteNoteFromFirestore } from '@/services/note-service';
import { uploadFileToServer } from '@/services/file-upload-service';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, CircleDashed } from 'lucide-react';
import Link from 'next/link';

interface NoteFillFormProps {
  note: Note;
}

export function NoteFillForm({ note }: NoteFillFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSave = async (data: NoteFormSubmission) => {
    setIsSubmitting(true);
    try {
      if (data.type === 'document' && data.file) {
        const uploadResult = await uploadFileToServer(data.file);
        if (uploadResult) {
          data.content = `/api/notes/download?storageId=${encodeURIComponent(uploadResult.storageId)}`;
          data.documentMetadata = uploadResult;
        } else {
          throw new Error('File upload failed.');
        }
      }
      
      delete (data as any).file;
      if ((data as any).documentMetadata === null) {
          delete (data as any).documentMetadata;
      }
      
      // Create a new note with the submitted information
      await addNoteToFirestore(data);
      // Delete the original template note
      await deleteNoteFromFirestore(note.id);
      
      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to submit note:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting the information. Please try again.",
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
                <CardTitle className="text-2xl">Submission Complete!</CardTitle>
                <CardDescription>
                    Thank you. The information has been securely submitted.
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

  const initialValues: NoteFormValues = {
    title: note.title,
    content: note.content,
    type: note.type,
  };

  return (
    <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <CircleDashed className="h-7 w-7 text-primary" />
              Complete This Item
            </CardTitle>
            <CardDescription>
                You've been asked to complete the following item. Please fill in the details and submit.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <NoteForm
                onSave={handleSave}
                isLoading={isSubmitting}
                onFormSubmit={() => {}}
                defaultValues={initialValues}
                isEditing={true}
                submitButtonText="Submit Information"
            />
        </CardContent>
    </Card>
  );
}