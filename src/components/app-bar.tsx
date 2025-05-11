
"use client";

import type React from 'react';
import type { NoteFormValues } from '@/components/note-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { NoteForm } from '@/components/note-form';
import { Notebook, PlusCircle } from 'lucide-react';

interface AppBarProps {
  isFormOpen: boolean;
  onOpenChange: (open: boolean) => void;
  noteFormProps: {
    onSave: (data: NoteFormValues) => void;
    isLoading: boolean;
    onFormSubmit: () => void;
  };
}

export function AppBar({ isFormOpen, onOpenChange, noteFormProps }: AppBarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 md:px-8">
        <div className="flex items-center space-x-3">
          <Notebook className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">NoteNest</h1>
        </div>
        <Dialog open={isFormOpen} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button size="default" className="shadow-md">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] md:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Item</DialogTitle>
            </DialogHeader>
            <NoteForm
              onSave={noteFormProps.onSave}
              isLoading={noteFormProps.isLoading}
              onFormSubmit={noteFormProps.onFormSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
