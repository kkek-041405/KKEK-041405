export interface Note {
    id: string;
    title: string;
    content: string; // For documents, this will hold the file URL
    createdAt: string; // ISO Date string
    summary?: string;
    type: 'note' | 'keyInformation' | 'document';
    // For documents, keep structured metadata about the file stored in Convex
    documentMetadata?: {
      convexDocumentId?: string;
      storageId?: string;
      fileName?: string;
      fileType?: string;
      fileSize?: number;
    };
  }
  
  