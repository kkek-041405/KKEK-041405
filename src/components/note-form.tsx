
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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
  content: z.string().optional(), 
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
}

export function NoteForm({ onSave, isLoading = false, onFormSubmit }: NoteFormProps) {
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: '',
      content: '',
      type: 'note',
    } as NoteFormValues, 
  });

  const selectedType = form.watch('type');

  const onSubmit = (data: NoteFormValues) => {
    onSave(data);
    form.reset({ title: '', content: '', type: selectedType } as NoteFormValues);
    if (onFormSubmit) {
      onFormSubmit();
    }
  };

  React.useEffect(() => {
    if (selectedType === 'keyInformation') {
      form.setValue('content', ''); 
    }
  }, [selectedType, form]);


  return (
    <div className="pt-4"> {/* Replaced Card with a div and some padding */}
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
                        field.onChange(value as 'note' | 'keyInformation');
                        form.reset({ title: '', content: '', type: value as 'note' | 'keyInformation' });
                      }}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 pt-1"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0 p-2 border rounded-md hover:bg-accent/50 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary">
                        <FormControl>
                          <RadioGroupItem value="note" id="type-note" />
                        </FormControl>
                        <FormLabel htmlFor="type-note" className="font-normal flex items-center cursor-pointer">
                          <PlusCircle className="mr-2 h-5 w-5 text-primary" /> Note
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0 p-2 border rounded-md hover:bg-accent/50 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary">
                        <FormControl>
                          <RadioGroupItem value="keyInformation" id="type-keyInformation" />
                        </FormControl>
                        <FormLabel htmlFor="type-keyInformation" className="font-normal flex items-center cursor-pointer">
                         <Info className="mr-2 h-5 w-5 text-primary" /> Key Information
                        </FormLabel>
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
                      placeholder={selectedType === 'note' ? "Enter note title (e.g., Meeting Recap)" : "Enter key information (e.g., Wi-Fi Password: MyPassword123)"} 
                      {...field} 
                      value={field.value || ''} 
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
                        placeholder="Write your note here... (e.g., Discussed project timelines and upcoming deadlines.)" 
                        {...field} 
                        rows={5} 
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
                {isLoading ? 'Saving...' : `Save ${selectedType === 'note' ? 'Note' : 'Information'}`}
              </Button>
            </div>
          </form>
        </Form>
    </div>
  );
}
