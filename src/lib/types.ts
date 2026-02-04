
export interface Note {
    id: string;
    title: string;
    content: string; // For documents, this will hold the file URL
    createdAt: string; // ISO string
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
  
export interface FirebaseNotification {
  id: string;
  appName: string;
  title: string;
  text: string;
  timestamp: number;
  actions: string[];
}

export interface CommandParameter {
  name: string;
  type: 'String' | 'Number' | 'Boolean';
  description: string;
  isRequired: boolean;
}

export interface Command {
  id: string;
  description: string;
  parameters: CommandParameter[];
}

export type Commands = Record<string, Omit<Command, 'id'>>;

export interface SharedNoteLink {
  id: string; // The token
  noteId: string;
  createdAt: string; // ISO string
  expiresAt: string; // ISO string
  viewLimit: number; // 0 for unlimited
  viewCount: number;
  type?: 'view' | 'fill';
}
