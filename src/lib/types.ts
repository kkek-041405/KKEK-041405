export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO Date string
  summary?: string;
  type: 'note' | 'keyInformation';
}

