export interface Note {
  id: string;
  user_id?: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isArchived: boolean;
  color?: NoteColor;
  public_slug?: string;
  is_public?: boolean;
}

export type NoteColor = 'default' | 'rose' | 'amber' | 'orange' | 'emerald' | 'lime' | 'sky' | 'cyan' | 'violet' | 'indigo' | 'pink' | 'slate' | 'red' | 'yellow' | 'green' | 'teal' | 'blue' | 'purple' | 'fuchsia' | 'coffee' | 'mint' | 'gold' | 'maroon' | 'navy';

export interface NotesState {
  notes: Note[];
  activeNoteId: string | null;
  searchQuery: string;
  filterTag: string | null;
  showArchived: boolean;
}

export type ViewMode = 'grid' | 'list';

export type SortOption = 'updated' | 'created' | 'title';

export interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  resolvedTheme: 'light' | 'dark';
}
