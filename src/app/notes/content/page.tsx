"use client";

import type { Note } from '@/lib/types';
import type { NoteFormValues, NoteFormSubmission } from '@/components/note-form';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NoteList } from '@/components/note-list';
import { NoteView } from '@/components/note-view';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { summarizeNote, type SummarizeNoteInput } from '@/ai/flows/summarize-note';
import { createShareLink } from '@/services/share-note-service';
import { Notebook, FileText, Loader2, FileArchive } from 'lucide-react';
import { AppBar } from '@/components/app-bar';
import { 
  addNoteToFirestore, 
  getNotesFromFirestore, 
  updateNoteInFirestore, 
  deleteNoteFromFirestore 
} from '@/services/note-service';
import SpotifyView from '@/components/spotify-view';
import { uploadFileToServer, getFileServingUrl } from '@/services/file-upload-service';
import NotificationsView from '@/components/notifications-view';
import PhoneView from '@/components/phone-view';


const defaultKeyInfo: Note[] = [
  {
    id: 'default-spotify-placeholder',
    title: 'Spotify',
    content: 'Connect your Spotify account to manage playback.',
    type: 'keyInformation',
    createdAt: new Date(0).toISOString(),
  },
  {
    id: 'default-notifications-placeholder',
    title: 'Notifications',
    content: 'View your real-time notifications from connected devices.',
    type: 'keyInformation',
    createdAt: new Date(0).toISOString(),
  },
];


export default function NotesContentPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  // Map of noteId -> pre-resolved serving URL (null = resolved and not available, undefined = not yet resolved)
  const [resolvedServingUrls, setResolvedServingUrls] = useState<Record<string, string | null | undefined>>({});
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isGettingLink, setIsGettingLink] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const [sortType, setSortType] = useState<'note' | 'keyInformation' | 'document'>('note');

  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [initialFormValues, setInitialFormValues] = useState<NoteFormValues | null>(null);
  
  const [activeView, setActiveView] = useState<'notes' | 'spotify' | 'notifications' | 'phone'>('notes');

  useEffect(() => {
    // Check authentication status on the client side only
    const authStatus = sessionStorage.getItem('notesAuthenticated');
    if (authStatus !== 'true') {
      router.replace('/notes'); // Redirect to auth page if not authenticated
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated || activeView !== 'notes') return; 

    const fetchNotes = async () => {
      setIsLoadingNotes(true);
      try {
        const firestoreNotes = await getNotesFromFirestore();
        setNotes(firestoreNotes);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
        toast({
          title: "Error Fetching Notes",
          description: "Could not load your items from the cloud. Please try again later.",
          variant: "destructive",
        });
        setNotes([]); 
      }
      setIsLoadingNotes(false);
    };
    fetchNotes();
  }, [toast, isAuthenticated, activeView]);

  if (!isAuthenticated) {
    // Show a loading state or a minimal message while checking auth status and redirecting.
    // This view is consistent between server and initial client render.
    return (
       <div className="flex flex-col min-h-screen">
        <AppBar
          activeView={activeView}
          onViewChange={setActiveView}
        />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">Verifying access...</p>
        </main>
         <Toaster />
      </div>
    );
  }

  const handleSaveAndGetLink = async (data: NoteFormSubmission) => {
    setIsGettingLink(true);
    try {
      // 1. Save the note as a template
      const templateNote = await addNoteToFirestore(data);
      if (!templateNote || !templateNote.id) {
        throw new Error("Failed to create the note template.");
      }

      // 2. Create a single-use, fillable share link
      const link = await createShareLink(templateNote.id, {
        expiresInHours: 7 * 24, // 7 days
        viewLimit: 1,
      }, 'fill');
      
      // 3. Copy link to clipboard
      await navigator.clipboard.writeText(link);
      
      // 4. Show success toast and close form
      toast({
        title: 'Link Ready!',
        description: 'A single-use link has been copied to your clipboard.',
      });

      // 5. Add the template note to the UI temporarily
      setNotes(prev => [templateNote, ...prev].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      
      setIsFormOpen(false);
      setEditingNote(null);
      setInitialFormValues(null);

    } catch (error) {
      console.error("Failed to save and get link:", error);
      toast({
        title: 'Error Creating Link',
        description: 'Could not create a shareable link. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsGettingLink(false);
    }
  };


  const handleSaveNote = async (data: NoteFormSubmission) => {
    setIsSavingNote(true);
    try {
      if (editingNote) {
        // If editing a document and a new file was provided, upload and update metadata
        if (data.type === 'document' && data.file) {
          const uploadResult = await uploadFileToServer(data.file);
          if (uploadResult) {
            data.content = `/api/notes/download?storageId=${encodeURIComponent(uploadResult.storageId)}`;
            data.documentMetadata = uploadResult;
          }
        } else if (data.type === 'document' && !data.file) {
          // User did not upload a new file while editing — preserve existing document
          // content and metadata instead of accidentally overwriting them with empty values.
          if (editingNote?.content && (!data.content || String(data.content).trim() === '')) {
            console.log('[notes page] preserving existing document content for edit', { noteId: editingNote.id });
            data.content = editingNote.content;
          }
          if (!data.documentMetadata && editingNote?.documentMetadata) {
            console.log('[notes page] preserving existing documentMetadata for edit', { noteId: editingNote.id });
            data.documentMetadata = editingNote.documentMetadata as any;
          }
        }

        // Remove file object before saving to Firestore
        delete (data as any).file;
        // Firestore doesn't accept `null` for nested objects where types expect `undefined`.
        if ((data as any).documentMetadata === null) {
          delete (data as any).documentMetadata;
        }
        await updateNoteInFirestore(editingNote.id, data as Partial<Omit<Note, 'id'|'createdAt'>>);
        setNotes((prevNotes) =>
          prevNotes.map((n) =>
            n.id === editingNote.id ? ({ ...n, ...(data as Partial<Note>), createdAt: n.createdAt } as Note) : n
          ).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        );
        toast({
          title: `Item Updated!`,
          description: `Your item "${data.title}" has been successfully updated.`,
        });
      } else {
        // New note: if document and a file, upload first
        if (data.type === 'document') {
          if (data.file) {
            const uploadResult = await uploadFileToServer(data.file);
            if (uploadResult) {
              data.content = `/api/notes/download?storageId=${encodeURIComponent(uploadResult.storageId)}`;
              data.documentMetadata = uploadResult;
            }
          }

          // If document metadata was already provided by the form (upload happened in the form),
          // but content URL wasn't populated, ensure we set a download URL using the storageId.
          if ((data as any).documentMetadata && (!data.content || String(data.content).trim() === '')) {
            const sid = String((data as any).documentMetadata.storageId || (data as any).documentMetadata?.id || (data as any).documentMetadata?._id || '');
            if (sid) {
              console.log('[notes page] attaching content download url from provided documentMetadata', { sid });
              data.content = `/api/notes/download?storageId=${encodeURIComponent(sid)}`;
            }
          }
        }
        // Remove file object before saving to Firestore
        delete (data as any).file;
        // Ensure we don't send `null` for documentMetadata since our Note type allows only undefined
        if ((data as any).documentMetadata === null) {
          delete (data as any).documentMetadata;
        }
        console.log('[notes page] saving new note to Firestore', { title: data.title, type: data.type, hasDocumentMetadata: !!(data as any).documentMetadata });
        const addedNoteWithClientTimestamp = await addNoteToFirestore(data as any);
        setNotes((prevNotes) =>
          [addedNoteWithClientTimestamp, ...prevNotes].sort((a,b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
        
        toast({
          title: `Item Saved!`,
          description: `Your item "${addedNoteWithClientTimestamp.title}" has been successfully saved to the cloud.`,
        });
      }
      setIsFormOpen(false);
      setEditingNote(null);
      setInitialFormValues(null);
    } catch (error) {
      console.error("Failed to save item:", error);
      toast({
        title: `Error ${editingNote ? 'Updating' : 'Saving'} Item`,
        description: `Could not ${editingNote ? 'update' : 'save'} your item. Please try again.`,
        variant: "destructive",
      });
    }
    setIsSavingNote(false);
  };

  const handleRequestEdit = (noteToEdit: Note) => {
    if (noteToEdit.id.startsWith('default-')) {
        toast({
            title: "Cannot Edit Default Item",
            description: "Default items are not editable.",
            variant: "destructive"
        });
        return;
    }
    setEditingNote(noteToEdit);
    setInitialFormValues({
      title: noteToEdit.title,
      content: noteToEdit.content,
      type: noteToEdit.type,
    });
    setIsFormOpen(true);
  };
  
  const handleDialogValidOpenChange = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setEditingNote(null);
      setInitialFormValues(null);
    }
  }


  const handleSelectNote = (id: string) => {
    // Show the selection immediately
    setSelectedNoteId(id);

    // If this is a document note, pre-resolve the serving URL so View Document
    // can open a direct URL synchronously when clicked
    const noteToResolve = notes.find((n) => n.id === id) || defaultKeyInfo.find((n) => n.id === id);
    if (noteToResolve && noteToResolve.type === 'document') {
      // if we haven't resolved this one yet (value undefined), start resolving
      if (resolvedServingUrls[id] === undefined) {
        // mark as resolving
        setResolvedServingUrls((prev) => ({ ...prev, [id]: undefined }));

        (async () => {
          try {
            let storageId: string | null = null;
            try {
              const possibleUrl = new URL(noteToResolve.content, typeof window !== 'undefined' ? window.location.origin : '');
              storageId = possibleUrl.searchParams.get('storageId');
            } catch (e) {
              storageId = null;
            }

            if (!storageId) {
              console.log('[notes page] No storageId in selected document content', { id, content: noteToResolve.content });
              setResolvedServingUrls((prev) => ({ ...prev, [id]: null }));
              return;
            }

            console.log('[notes page] pre-resolving serving URL for selected note', { id, storageId });
            const result = await getFileServingUrl(storageId);
            console.log('[notes page] pre-resolve result', { id, result });
            const url = result?.url ?? null;
            setResolvedServingUrls((prev) => ({ ...prev, [id]: url }));
          } catch (err) {
            console.error('[notes page] Error pre-resolving serving URL for note', id, err);
            setResolvedServingUrls((prev) => ({ ...prev, [id]: null }));
          }
        })();
      }
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (id.startsWith('default-')) {
        toast({
            title: "Cannot Delete Default Item",
            description: "Default items cannot be deleted.",
            variant: "destructive"
        });
        return;
    }

    const itemToDelete = notes.find(note => note.id === id);
    if (!itemToDelete) return;

    try {
      await deleteNoteFromFirestore(id);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      if (selectedNoteId === id) {
        setSelectedNoteId(null);
      }
      toast({
        title: `Item Deleted`,
        description: `The item "${itemToDelete.title}" has been removed.`,
        variant: "destructive"
      });
    } catch (error) {
      console.error("Failed to delete note:", error);
      toast({
        title: "Error Deleting Item",
        description: "Could not delete your item from the cloud. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSummarizeNote = async (noteId: string, noteContent: string) => {
    setIsLoadingSummary(true);
    try {
      const input: SummarizeNoteInput = { note: noteContent };
      const result = await summarizeNote(input);
      if (result && result.summary) {
        await updateNoteInFirestore(noteId, { summary: result.summary });
        setNotes((prevNotes) =>
          prevNotes.map((n) =>
            n.id === noteId ? { ...n, summary: result.summary } : n
          )
        );
        toast({
          title: "Summary Generated!",
          description: "AI summary has been added to your note and saved to the cloud.",
        });
      } else {
        throw new Error("Summary was empty.");
      }
    } catch (error) {
      console.error("Failed to summarize note:", error);
      toast({
        title: "Error Summarizing",
        description: "Could not generate summary. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoadingSummary(false);
  };

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  const noteFormProps = {
    onSave: handleSaveNote,
    isLoading: isSavingNote,
    onGetLink: handleSaveAndGetLink,
    isGettingLink: isGettingLink,
    onFormSubmit: () => {
      setIsFormOpen(false);
      setEditingNote(null);
      setInitialFormValues(null);
    },
    defaultValues: initialFormValues,
    isEditing: !!editingNote,
  };
  
  const allNotesWithDefaults = [...defaultKeyInfo, ...notes];

  const filteredNotes = allNotesWithDefaults.filter(note => {
    return note.type === sortType;
  });

  if (isLoadingNotes && activeView === 'notes') {
    return (
      <div className="flex flex-col min-h-screen">
        <AppBar
          activeView={activeView}
          onViewChange={setActiveView}
        />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">Loading your items...</p>
        </main>
        <Toaster />
      </div>
    );
  }

  const renderNotesView = () => (
    <main className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-65px)]">
      <section
        aria-labelledby="items-list-heading"
        className="md:w-80 flex flex-col border-r"
      >
        <h2 id="items-list-heading" className="sr-only">Your Items</h2>
        <NoteList
          notes={allNotesWithDefaults}
          filteredNotes={filteredNotes}
          selectedNoteId={selectedNoteId}
          onSelectNote={handleSelectNote}
          onDeleteNote={handleDeleteNote}
          sortType={sortType}
          onSortChange={setSortType}
          isFormOpen={isFormOpen}
          onFormOpenChange={handleDialogValidOpenChange}
          noteFormProps={noteFormProps}
        />
      </section>

      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <section
            aria-labelledby="view-item-heading"
            className="flex flex-col flex-1 min-w-0"
          >
            <h2 id="view-item-heading" className="sr-only">Selected Item: {selectedNote.title}</h2>
            <NoteView
              note={selectedNote}
              resolvedServingUrl={selectedNote ? resolvedServingUrls[selectedNote.id] ?? null : null}
              onSummarize={handleSummarizeNote}
              isLoadingSummary={isLoadingSummary}
              onEditRequest={handleRequestEdit}
            />
          </section>
        ) : (
          !isLoadingNotes && allNotesWithDefaults.length > 0 && (
            <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-card text-card-foreground p-8 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground">No Item Selected</h3>
              <p className="text-muted-foreground">Select an item from the list to view its details.</p>
            </div>
          )
        )}
         { !selectedNote && !isLoadingNotes && allNotesWithDefaults.length === 0 && (
            <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-card text-card-foreground p-8 text-center">
              <Notebook className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground">No Items Yet</h3>
              <p className="text-muted-foreground">Click "Add New Item" to create your first note or key information.</p>
            </div>
          )
        }
      </div>
    </main>
  );

  const renderActiveView = () => {
    switch (activeView) {
      case 'spotify':
        return <SpotifyView />;
      case 'notifications':
        return <NotificationsView />;
      case 'phone':
        return <PhoneView />;
      case 'notes':
      default:
        return renderNotesView();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <AppBar
        activeView={activeView}
        onViewChange={setActiveView}
      />
      
      {renderActiveView()}
      
      <Toaster />
    </div>
  );
}