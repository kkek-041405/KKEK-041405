
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
import { Notebook, PlusCircle, Home } from 'lucide-react';
import Link from 'next/link';

interface AppBarProps {
  isFormOpen: boolean;
  onOpenChange: (open: boolean) => void;
  noteFormProps: {
    onSave: (data: NoteFormValues) => void;
    isLoading: boolean;
    onFormSubmit: () => void;
    defaultValues?: NoteFormValues | null;
    isEditing?: boolean;
  };
}

export function AppBar({ isFormOpen, onOpenChange, noteFormProps }: AppBarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container relative flex h-16 items-center justify-between px-4 sm:px-6 md:px-8">
        <div>
          <Link href="/" className="flex items-center group" aria-label="Go to Portfolio Home Page">
            <Home className="h-7 w-7 text-primary group-hover:text-primary/80 transition-colors" />
          </Link>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-2">
          <Notebook className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">NoteNest</h1>
        </div>

        <div>
          <Dialog open={isFormOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
              <Button size="default" className="shadow-md" onClick={() => onOpenChange(true)}>
                <PlusCircle className="mr-2 h-5 w-5" />
                Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>{noteFormProps.isEditing ? 'Edit Item' : 'Create New Item'}</DialogTitle>
              </DialogHeader>
              <NoteForm
                onSave={noteFormProps.onSave}
                isLoading={noteFormProps.isLoading}
                onFormSubmit={noteFormProps.onFormSubmit}
                defaultValues={noteFormProps.defaultValues}
                isEditing={noteFormProps.isEditing}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}

    