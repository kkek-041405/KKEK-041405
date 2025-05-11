
"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PlusCircle, Info, Edit3 } from 'lucide-react';

const noteSchema = z.object({
  type: z.literal('note'),
  title: z.string().min(1, { message: "Title is required." }).max(100, { message: "Title must be 100 characters or less." }),
  content: z.string().min(1, { message: "Content is required." }),
});

const keyInformationSchema = z.object({
  type: z.literal('keyInformation'),
  title: z.string().min(1, { message: "Key name is required." }).max(100, { message: "Key name must be 100 characters or less." }),
  content: z.string().min(1, { message: "Value is required." }).max(500, { message: "Value must be 500 characters or less." }),
});

const noteFormSchema = z.discriminatedUnion("type", [
  noteSchema,
  keyInformationSchema,
]);

export type NoteFormValues = z.infer<typeof noteFormSchema>;

interface NoteFormProps {
  onSave: (data: NoteFormValues) => void;
  isLoading?: boolean;
  onFormSubmit?: () => void; // Callback to notify parent after submission
  defaultValues?: NoteFormValues | null;
  isEditing?: boolean;
}

export function NoteForm({ onSave, isLoading = false, onFormSubmit, defaultValues, isEditing = false }: NoteFormProps) {
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    // Default values are now set via useEffect based on props
  });

  useEffect(() => {
    if (isEditing && defaultValues) {
      form.reset(defaultValues);
    } else if (!isEditing) {
      form.reset({
        title: '',
        content: '',
        type: 'note',
      } as NoteFormValues);
    }
  }, [isEditing, defaultValues, form]);

  const selectedType = form.watch('type');

  const onSubmit = (data: NoteFormValues) => {
    onSave(data);
    // form.reset is handled by useEffect or parent closing the dialog
    if (onFormSubmit) {
      onFormSubmit();
    }
  };

  return (
    <div className="pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-semibold">
                    Select Item Type
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        if (!isEditing) { // Only allow type change if not editing
                          field.onChange(value as 'note' | 'keyInformation');
                          form.reset({ title: '', content: '', type: value as 'note' | 'keyInformation' });
                        }
                      }}
                      defaultValue={field.value}
                      value={field.value} // Ensure value is controlled
                      className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 pt-1"
                      // Disable RadioGroup if editing
                      // Using a fieldset with disabled attribute is more semantically correct
                    >
                       <fieldset disabled={isEditing} className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 w-full">
                        <FormItem className="flex items-center space-x-2 space-y-0 p-2 border rounded-md hover:bg-accent/50 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary flex-1">
                          <FormControl>
                            <RadioGroupItem value="note" id="type-note" disabled={isEditing} />
                          </FormControl>
                          <FormLabel htmlFor="type-note" className={cn("font-normal flex items-center", isEditing ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer")}>
                            <PlusCircle className="mr-2 h-5 w-5 text-primary" /> Note
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0 p-2 border rounded-md hover:bg-accent/50 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary flex-1">
                          <FormControl>
                            <RadioGroupItem value="keyInformation" id="type-keyInformation" disabled={isEditing} />
                          </FormControl>
                          <FormLabel htmlFor="type-keyInformation" className={cn("font-normal flex items-center", isEditing ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer")}>
                           <Info className="mr-2 h-5 w-5 text-primary" /> Key Information
                          </FormLabel>
                        </FormItem>
                       </fieldset>
                    </RadioGroup>
                  </FormControl>
                  {isEditing && <p className="text-xs text-muted-foreground">Item type cannot be changed during editing.</p>}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{selectedType === 'note' ? 'Title' : 'Key Name'}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={selectedType === 'note' ? "Enter note title (e.g., Meeting Recap)" : "Enter key name (e.g., Wi-Fi Password, API Token)"}
                      {...field}
                      value={field.value || ''} // Ensure controlled component
                      />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{selectedType === 'note' ? 'Content' : 'Value'}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={selectedType === 'note' ? "Write your note here... (e.g., Discussed project timelines...)" : "Enter the value for the key information (e.g., MyS3cur3P@ssw0rd!)"}
                      {...field}
                      rows={selectedType === 'note' ? 5 : 3}
                      value={field.value || ''} // Ensure controlled component
                      />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (isEditing ? 'Updating...' : 'Saving...') : (isEditing ? `Update ${selectedType === 'note' ? 'Note' : 'Information'}` : `Save ${selectedType === 'note' ? 'Note' : 'Information'}`)}
              </Button>
            </div>
          </form>
        </Form>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

    