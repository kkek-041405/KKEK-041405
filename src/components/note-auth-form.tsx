
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, LogIn } from 'lucide-react';

const noteAuthSchema = z.object({
  accessCode: z.string().min(1, { message: "Access code is required." }),
});

export type NoteAuthFormValues = z.infer<typeof noteAuthSchema>;

interface NoteAuthFormProps {
  onAuthenticate: (data: NoteAuthFormValues) => void;
  isLoading?: boolean;
}

export function NoteAuthForm({ onAuthenticate, isLoading = false }: NoteAuthFormProps) {
  const form = useForm<NoteAuthFormValues>({
    resolver: zodResolver(noteAuthSchema),
    defaultValues: {
      accessCode: '',
    },
  });

  const onSubmit = (data: NoteAuthFormValues) => {
    onAuthenticate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="accessCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Access Code</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter the access code"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Unlock Notes
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
