import { Download } from 'lucide-react';
import { getNoteByTitleFromFirestore } from '@/services/note-service';

export default async function Resume() {
  const note = await getNoteByTitleFromFirestore('KKEK_CV');
  
  // Try to use the direct URL from content, fallback to download route
  let resumeUrl = note?.content || '';
  if (!resumeUrl && note?.documentMetadata?.storageId) {
    resumeUrl = `/api/notes/download?storageId=${note.documentMetadata.storageId}`;
  }

  // Fallback if not found or no URL available
  if (!resumeUrl) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white flex-col gap-4">
        <h1 className="text-2xl font-semibold">Resume Not Found</h1>
        <p className="text-slate-400">Please make sure a document named &quot;KKEK_CV&quot; is uploaded in the notes.</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950">
      <iframe 
        src={resumeUrl} 
        className="h-full w-full border-none"
        title="Resume"
      />
      <a 
        href={resumeUrl} 
        download={note?.documentMetadata?.fileName || 'KKEK_CV.pdf'}
        className="absolute bottom-8 right-8 md:bottom-12 md:right-12 bg-primary text-primary-foreground p-4 rounded-full shadow-2xl shadow-primary/20 hover:scale-110 hover:bg-primary/90 transition-transform flex items-center justify-center z-50 group"
        title="Download Resume"
      >
        <Download className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
      </a>
    </div>
  );
}
