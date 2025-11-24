
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
import { PlusCircle, Info, Edit3, FileArchive } from 'lucide-react';

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

const documentSchema = z.object({
    type: z.literal('document'),
    title: z.string().min(1, { message: "Document name is required." }).max(100, { message: "Document name must be 100 characters or less." }),
    content: z.string().url({ message: "Please enter a valid URL." }),
});

const noteFormSchema = z.discriminatedUnion("type", [
  noteSchema,
  keyInformationSchema,
  documentSchema,
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

  const getTitleLabel = () => {
    switch (selectedType) {
        case 'note': return 'Title';
        case 'keyInformation': return 'Key Name';
        case 'document': return 'Document Name';
        default: return 'Title';
    }
  }

  const getContentLabel = () => {
    switch (selectedType) {
        case 'note': return 'Content';
        case 'keyInformation': return 'Value';
        case 'document': return 'Document URL';
        default: return 'Content';
    }
  }

  const getTitlePlaceholder = () => {
    switch (selectedType) {
        case 'note': return "Enter note title (e.g., Meeting Recap)";
        case 'keyInformation': return "Enter key name (e.g., Wi-Fi Password)";
        case 'document': return "Enter document name (e.g., Project Proposal Q3)";
        default: return "Enter title";
    }
  }
  
  const getContentPlaceholder = () => {
    switch (selectedType) {
        case 'note': return "Write your note here... (e.g., Discussed project timelines...)";
        case 'keyInformation': return "Enter the value for the key information (e.g., MyS3cur3P@ssw0rd!)";
        case 'document': return "Enter the document URL from your storage provider.";
        default: return "Enter content";
    }
  }


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
                          field.onChange(value as 'note' | 'keyInformation' | 'document');
                          form.reset({ title: '', content: '', type: value as 'note' | 'keyInformation' | 'document' });
                        }
                      }}
                      defaultValue={field.value}
                      value={field.value} // Ensure value is controlled
                      className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1"
                    >
                       <fieldset disabled={isEditing} className="contents">
                        <FormItem className="flex items-center space-x-2 space-y-0 p-2 border rounded-md hover:bg-accent/50 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary flex-1">
                          <FormControl>
                            <RadioGroupItem value="note" id="type-note" disabled={isEditing} />
                          </FormControl>
                          <FormLabel htmlFor="type-note" className={cn("font-normal flex items-center w-full", isEditing ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer")}>
                            <PlusCircle className="mr-2 h-5 w-5 text-primary" /> Note
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0 p-2 border rounded-md hover:bg-accent/50 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary flex-1">
                          <FormControl>
                            <RadioGroupItem value="keyInformation" id="type-keyInformation" disabled={isEditing} />
                          </FormControl>
                          <FormLabel htmlFor="type-keyInformation" className={cn("font-normal flex items-center w-full", isEditing ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer")}>
                           <Info className="mr-2 h-5 w-5 text-primary" /> Key Info
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0 p-2 border rounded-md hover:bg-accent/50 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary flex-1">
                          <FormControl>
                            <RadioGroupItem value="document" id="type-document" disabled={isEditing} />
                          </FormControl>
                          <FormLabel htmlFor="type-document" className={cn("font-normal flex items-center w-full", isEditing ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer")}>
                           <FileArchive className="mr-2 h-5 w-5 text-primary" /> Document
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
                  <FormLabel>{getTitleLabel()}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={getTitlePlaceholder()}
                      {...field}
                      value={field.value || ''} // Ensure controlled component
                      />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TODO: This is where user will implement Convex upload logic */}
            {/* For now, it's just a text input for the URL */}
            {selectedType === 'document' && (
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{getContentLabel()}</FormLabel>
                        <FormControl>
                            <Input
                            placeholder={getContentPlaceholder()}
                            {...field}
                            value={field.value || ''}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            )}
            
            {(selectedType === 'note' || selectedType === 'keyInformation') && (
                 <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{getContentLabel()}</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder={getContentPlaceholder()}
                                {...field}
                                rows={selectedType === 'note' ? 5 : 3}
                                value={field.value || ''}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (isEditing ? 'Updating...' : 'Saving...') : (isEditing ? `Update Item` : `Save Item`)}
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
