"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PlusCircle, Info, FileArchive, UploadCloud, File as FileIcon, X, Loader2, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const noteSchema = z.object({
  type: z.literal('note'),
  title: z.string().max(100, { message: "Title must be 100 characters or less." }).optional(),
  content: z.string().optional(),
});

const keyInformationSchema = z.object({
  type: z.literal('keyInformation'),
  title: z.string().max(100, { message: "Key name must be 100 characters or less." }).optional(),
  content: z.string().optional(),
});

const documentSchema = z.object({
  type: z.literal('document'),
  title: z.string().max(100, { message: "Document name must be 100 characters or less." }).optional(),
  content: z.string().optional(),
});

const noteFormSchema = z.discriminatedUnion("type", [
  noteSchema,
  keyInformationSchema,
  documentSchema,
]);

export type NoteFormValues = z.infer<typeof noteFormSchema>;
export type NoteFormSubmission = NoteFormValues & {
  file?: File | null;
  documentMetadata?: {
    convexDocumentId?: string;
    storageId?: string;
    fileName?: string;
    fileType?: string;
    fileSize?: number;
  };
};

interface NoteFormProps {
  onSave: (data: NoteFormSubmission) => Promise<void> | void;
  isLoading?: boolean;
  onGetLink?: (data: NoteFormSubmission) => Promise<void> | void;
  isGettingLink?: boolean;
  onFormSubmit?: () => void;
  defaultValues?: NoteFormValues | null;
  isEditing?: boolean;
  submitButtonText?: string;
}

export function NoteForm({
  onSave,
  isLoading = false,
  onGetLink,
  isGettingLink = false,
  onFormSubmit,
  defaultValues,
  isEditing = false,
  submitButtonText,
}: NoteFormProps) {
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
    setSelectedFile(null);
  }, [isEditing, defaultValues, form]);

  const selectedType = form.watch('type');

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const onSubmit = async (data: NoteFormValues) => {
    form.clearErrors();
    let isValid = true;
    
    // Title validation for "Save" action
    if (!onGetLink && (!data.title || data.title.trim() === '')) {
      form.setError('title', { type: 'manual', message: `${getTitleLabel()} is required for saving.` });
      isValid = false;
    }
    
    // Content validation for "Save" action
    if (!onGetLink && (data.type === 'note' || data.type === 'keyInformation') && (!data.content || data.content.trim() === '')) {
      form.setError('content', { type: 'manual', message: `${getContentLabel()} is required for saving.` });
      isValid = false;
    }

    // File validation
    if (data.type === 'document' && !selectedFile) {
        const isFillForm = submitButtonText === "Submit Information";
        // If it's a fillable form OR a new document creation, a file is required.
        if (isFillForm || !isEditing) {
            alert('A file is required to submit a document.');
            isValid = false;
        }
        // If we're just editing an existing document, not providing a file is okay.
    }

    if (!isValid) {
      return;
    }

    const submission: NoteFormSubmission = { ...data, file: selectedFile };
    
    await onSave(submission);

    if (onFormSubmit) {
      onFormSubmit();
    }
  };
  
  const handleGetLink = async () => {
    if (onGetLink) {
      const data = form.getValues();
      const submission: NoteFormSubmission = { ...data, file: selectedFile };
      await onGetLink(submission);
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
  
  const getTitlePlaceholder = () => {
    switch (selectedType) {
        case 'note': return "Enter note title...";
        case 'keyInformation': return "Enter key name...";
        case 'document': return "Enter document name...";
        default: return "Enter title";
    }
  }
  
  const getContentLabel = () => {
    switch (selectedType) {
        case 'note': return 'Content';
        case 'keyInformation': return 'Value';
        default: return 'Content';
    }
  }

  const getContentPlaceholder = () => {
    switch (selectedType) {
        case 'note': return "Write your note here...";
        case 'keyInformation': return "Enter the value for the key...";
        default: return "Enter content";
    }
  }
  
  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);

    if (file) {
      if (!form.getValues('title')) {
        const fileName = file.name;
        const lastDotIndex = fileName.lastIndexOf('.');
        const nameWithoutExtension = (lastDotIndex > 0) ? fileName.substring(0, lastDotIndex) : fileName;
        form.setValue('title', nameWithoutExtension);
      }
    }
  };


  return (
    <div className="pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {!isEditing && (
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
                          field.onChange(value as 'note' | 'keyInformation' | 'document');
                          form.reset({ title: '', content: '', type: value as 'note' | 'keyInformation' | 'document' });
                        }}
                        defaultValue={field.value}
                        value={field.value}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0 p-2 border rounded-md hover:bg-accent/50 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary flex-1">
                          <FormControl>
                            <RadioGroupItem value="note" id="type-note" />
                          </FormControl>
                          <FormLabel htmlFor="type-note" className="font-normal flex items-center w-full cursor-pointer">
                            <PlusCircle className="mr-2 h-5 w-5 text-primary" /> Note
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0 p-2 border rounded-md hover:bg-accent/50 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary flex-1">
                          <FormControl>
                            <RadioGroupItem value="keyInformation" id="type-keyInformation" />
                          </FormControl>
                          <FormLabel htmlFor="type-keyInformation" className="font-normal flex items-center w-full cursor-pointer">
                           <Info className="mr-2 h-5 w-5 text-primary" /> Key Info
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0 p-2 border rounded-md hover:bg-accent/50 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary flex-1">
                          <FormControl>
                            <RadioGroupItem value="document" id="type-document" />
                          </FormControl>
                          <FormLabel htmlFor="type-document" className="font-normal flex items-center w-full cursor-pointer">
                           <FileArchive className="mr-2 h-5 w-5 text-primary" /> Document
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
                      value={field.value || ''}
                      />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {selectedType === 'document' && (
              <FormItem>
                <FormLabel>File</FormLabel>
                <FormControl>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                      className="hidden"
                    />
                    {!selectedFile && !defaultValues?.content ? (
                       <div
                          className="mt-1 flex justify-center rounded-lg border-2 border-dashed border-input px-6 py-10 cursor-pointer hover:border-primary transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="text-center">
                            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                            <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                              <p className="pl-1">Click to upload or drag and drop</p>
                            </div>
                            <p className="text-xs leading-5 text-muted-foreground/80">PDF, PNG, JPG, etc.</p>
                          </div>
                        </div>
                    ) : (
                      <div className="mt-2 text-sm text-foreground">
                        <div className="flex items-center justify-between rounded-lg border bg-secondary/30 p-3">
                           <div className="flex items-center gap-3">
                              <FileIcon className="h-6 w-6 text-primary" />
                              <span className="font-medium">{selectedFile ? selectedFile.name : (defaultValues as any)?.documentMetadata?.fileName || 'Existing file'}</span>
                           </div>
                           <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => {
                                handleFileChange(null);
                                if (fileInputRef.current) fileInputRef.current.value = '';
                              }}
                            >
                             <X className="h-4 w-4"/>
                           </Button>
                        </div>
                      </div>
                    )}
                     <FormDescription className="mt-2">
                       {isEditing ? "Upload a new file to replace the existing one, or leave empty to keep the current file." : "Select a file for this document."}
                     </FormDescription>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
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

            <div className="flex justify-end pt-2 gap-2 flex-wrap sm:flex-nowrap">
               {!isEditing && onGetLink && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGetLink}
                    disabled={isLoading || isGettingLink}
                    className="w-full sm:w-auto"
                  >
                    {isGettingLink ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Save &amp; Get Link
                      </>
                    )}
                  </Button>
               )}
              <Button type="submit" disabled={isLoading || isGettingLink} className="w-full sm:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Submitting...' : (submitButtonText || (isEditing ? 'Update Item' : 'Save Item'))}
              </Button>
            </div>
          </form>
        </Form>
    </div>
  );
}
