"use client";

import React from 'react'; // Changed from "import type * as React from 'react';"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PlusCircle, Info } from 'lucide-react';

const noteSchema = z.object({
  type: z.literal('note'),
  title: z.string().min(1, { message: "Title is required." }).max(100, { message: "Title must be 100 characters or less." }),
  content: z.string().min(1, { message: "Content is required." }),
});

const keyInformationSchema = z.object({
  type: z.literal('keyInformation'),
  title: z.string().min(1, { message: "Key information is required." }).max(250, { message: "Key information must be 250 characters or less." }),
  content: z.string().optional(), // Content is not user-editable for keyInformation, but part of form state
});

const noteFormSchema = z.discriminatedUnion("type", [
  noteSchema,
  keyInformationSchema,
]);

export type NoteFormValues = z.infer<typeof noteFormSchema>;

interface NoteFormProps {
  onSave: (data: NoteFormValues) => void;
  isLoading?: boolean;
}

export function NoteForm({ onSave, isLoading = false }: NoteFormProps) {
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: '',
      content: '',
      type: 'note',
    } as NoteFormValues, // Ensure type safety for defaultValues
  });

  const selectedType = form.watch('type');

  const onSubmit = (data: NoteFormValues) => {
    onSave(data);
    form.reset({ title: '', content: '', type: selectedType } as NoteFormValues);
  };

  // Reset content field if type changes to keyInformation, or title if type changes to note (if it was key info)
  React.useEffect(() => {
    if (selectedType === 'keyInformation') {
      form.setValue('content', ''); // Clear content if switching to keyInformation
    }
    // No need to clear title as it's used by both, just placeholder/label changes
  }, [selectedType, form]);


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          {selectedType === 'note' ? <PlusCircle className="mr-2 h-6 w-6 text-primary" /> : <Info className="mr-2 h-6 w-6 text-primary" />}
          Create New {selectedType === 'note' ? 'Note' : 'Key Information'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value as 'note' | 'keyInformation');
                        form.reset({ title: '', content: '', type: value as 'note' | 'keyInformation' });
                      }}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="note" />
                        </FormControl>
                        <FormLabel className="font-normal">Note</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="keyInformation" />
                        </FormControl>
                        <FormLabel className="font-normal">Key Information</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{selectedType === 'note' ? 'Title' : 'Key Information'}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={selectedType === 'note' ? "Enter note title" : "Enter key information"} 
                      {...field} 
                      value={field.value || ''} // Ensure value is not undefined
                      />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectedType === 'note' && (
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write your note here..." 
                        {...field} 
                        rows={6} 
                        value={field.value || ''} // Ensure value is not undefined
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? 'Saving...' : `Save ${selectedType === 'note' ? 'Note' : 'Information'}`}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
