import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note, NoteColor, SortOption } from '@/types';
import { notesService } from '@/lib/notesService';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface NotesStore {
  // State
  notes: Note[];
  activeNoteId: string | null;
  searchQuery: string;
  filterTag: string | null;
  showArchived: boolean;
  sortBy: SortOption;

  // Actions
  addNote: () => string;
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
  deleteNote: (id: string) => void;
  duplicateNote: (id: string) => void;
  setActiveNote: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFilterTag: (tag: string | null) => void;
  setShowArchived: (show: boolean) => void;
  setSortBy: (sort: SortOption) => void;
  togglePin: (id: string) => void;
  toggleArchive: (id: string) => void;
  setNoteColor: (id: string, color: NoteColor) => void;
  addTag: (id: string, tag: string) => void;
  removeTag: (id: string, tag: string) => void;
  fetchNotes: () => Promise<void>;
  syncLocalToCloud: () => Promise<void>;
  togglePublic: (id: string) => Promise<void>;

  // Selectors
  getActiveNote: () => Note | null;
  getFilteredNotes: () => Note[];
  getAllTags: () => string[];
}

const generateId = () => `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const createEmptyNote = (): Note => ({
  id: generateId(),
  title: '',
  content: '',
  tags: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isPinned: false,
  isArchived: false,
  color: 'default',
});

export const useNotesStore = create<NotesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      notes: [],
      activeNoteId: null,
      searchQuery: '',
      filterTag: null,
      showArchived: false,
      sortBy: 'updated',

      // Actions
      fetchNotes: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
          const notes = await notesService.getNotes();
          // Map DB snake_case to camelCase if needed, but our table uses camelCase or underscores?
          // The SQL I provided uses snake_case for DB fields mostly.
          // Let's ensure consistency. (Wait, the SQL used is_pinned, is_archived, etc.)
          // I should map them.
          const formattedNotes: Note[] = notes.map((n: any) => ({
            id: n.id,
            user_id: n.user_id,
            title: n.title,
            content: n.content,
            tags: n.tags || [],
            createdAt: n.created_at,
            updatedAt: n.updated_at,
            isPinned: n.is_pinned,
            isArchived: n.is_archived,
            color: n.color as NoteColor,
            public_slug: n.public_slug,
            is_public: n.is_public,
          }));
          set({ notes: formattedNotes });
        } catch (error) {
          console.error('Error fetching notes:', error);
        }
      },

      syncLocalToCloud: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { notes } = get();
        // Upload notes that don't have a user_id yet
        const localNotes = notes.filter(n => !n.user_id);

        for (const note of localNotes) {
          try {
            await notesService.createNote({
              title: note.title,
              content: note.content,
              tags: note.tags,
              is_pinned: note.isPinned,
              is_archived: note.isArchived,
              color: note.color,
            } as any);
          } catch (error) {
            console.error('Error syncing note:', error);
          }
        }

        // Refresh notes from cloud
        await get().fetchNotes();
      },

      addNote: () => {
        const newNote = createEmptyNote();
        set((state) => ({
          notes: [newNote, ...state.notes],
          activeNoteId: newNote.id,
        }));

        // Async sync if logged in
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user) {
            notesService.createNote({
              title: '',
              content: '',
              tags: [],
              is_pinned: false,
              is_archived: false,
              color: 'default'
            } as any).then(dbNote => {
              // Update local note with DB ID if needed, 
              // but for simplicity we'll just refresh later or swap.
              // Actually, better to replace the temp ID with DB ID.
              set(state => ({
                notes: state.notes.map(n => n.id === newNote.id ? {
                  ...n,
                  id: dbNote.id,
                  user_id: dbNote.user_id,
                  createdAt: dbNote.created_at,
                  updatedAt: dbNote.updated_at
                } : n),
                activeNoteId: state.activeNoteId === newNote.id ? dbNote.id : state.activeNoteId
              }));
            });
          }
        });

        return newNote.id;
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date().toISOString() }
              : note
          ),
        }));

        // Async sync
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user) {
            const mappedUpdates: any = {};
            if (updates.title !== undefined) mappedUpdates.title = updates.title;
            if (updates.content !== undefined) mappedUpdates.content = updates.content;
            if (updates.tags !== undefined) mappedUpdates.tags = updates.tags;
            if (updates.isPinned !== undefined) mappedUpdates.is_pinned = updates.isPinned;
            if (updates.isArchived !== undefined) mappedUpdates.is_archived = updates.isArchived;
            if (updates.color !== undefined) mappedUpdates.color = updates.color;

            notesService.updateNote(id, mappedUpdates).catch(console.error);
          }
        });
      },

      deleteNote: (id) => {
        set((state) => {
          const newNotes = state.notes.filter((note) => note.id !== id);
          const newActiveId =
            state.activeNoteId === id
              ? newNotes.length > 0
                ? newNotes[0].id
                : null
              : state.activeNoteId;
          return { notes: newNotes, activeNoteId: newActiveId };
        });

        // Async sync
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user) {
            notesService.deleteNote(id).catch(console.error);
          }
        });
      },

      duplicateNote: (id) => {
        const note = get().notes.find((n) => n.id === id);
        if (note) {
          const duplicated: Note = {
            ...note,
            id: generateId(),
            title: `${note.title} (copy)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set((state) => ({
            notes: [duplicated, ...state.notes],
            activeNoteId: duplicated.id,
          }));
        }
      },

      setActiveNote: (id) => set({ activeNoteId: id }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setFilterTag: (tag) => set({ filterTag: tag }),

      setShowArchived: (show) => set({ showArchived: show }),

      setSortBy: (sort) => set({ sortBy: sort }),

      togglePin: (id) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, isPinned: !note.isPinned, updatedAt: new Date().toISOString() }
              : note
          ),
        }));
      },

      toggleArchive: (id) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, isArchived: !note.isArchived, updatedAt: new Date().toISOString() }
              : note
          ),
        }));
      },

      setNoteColor: (id, color) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, color, updatedAt: new Date().toISOString() }
              : note
          ),
        }));

        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user) {
            notesService.updateNote(id, { color }).catch(console.error);
          }
        });
      },

      togglePublic: async (id) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error('You must be signed in to share notes.');
          return;
        }

        const note = get().notes.find(n => n.id === id);
        if (!note) return;

        const is_public = !note.is_public;
        let public_slug = note.public_slug;

        if (is_public && !public_slug) {
          // Generate an 8-char slug
          public_slug = Math.random().toString(36).substring(2, 10);
        }

        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, is_public, public_slug } : n
          ),
        }));

        await notesService.updateNote(id, { is_public, public_slug } as any);
      },

      addTag: (id, tag) => {
        const trimmedTag = tag.trim().toLowerCase();
        if (!trimmedTag) return;

        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id && !note.tags.includes(trimmedTag)
              ? {
                ...note,
                tags: [...note.tags, trimmedTag],
                updatedAt: new Date().toISOString(),
              }
              : note
          ),
        }));
      },

      removeTag: (id, tag) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? {
                ...note,
                tags: note.tags.filter((t) => t !== tag),
                updatedAt: new Date().toISOString(),
              }
              : note
          ),
        }));
      },

      // Selectors
      getActiveNote: () => {
        const state = get();
        return state.notes.find((note) => note.id === state.activeNoteId) || null;
      },

      getFilteredNotes: () => {
        const state = get();
        let filtered = state.notes.filter((note) =>
          state.showArchived ? note.isArchived : !note.isArchived
        );

        // Search filter
        if (state.searchQuery) {
          const query = state.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (note) =>
              note.title.toLowerCase().includes(query) ||
              note.content.toLowerCase().includes(query) ||
              note.tags.some((tag) => tag.includes(query))
          );
        }

        // Tag filter
        if (state.filterTag) {
          filtered = filtered.filter((note) => note.tags.includes(state.filterTag!));
        }

        // Sort
        filtered.sort((a, b) => {
          // Pinned notes always first
          if (a.isPinned !== b.isPinned) {
            return a.isPinned ? -1 : 1;
          }

          switch (state.sortBy) {
            case 'updated':
              return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            case 'created':
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'title':
              return a.title.localeCompare(b.title);
            default:
              return 0;
          }
        });

        return filtered;
      },

      getAllTags: () => {
        const state = get();
        const tagSet = new Set<string>();
        state.notes.forEach((note) => {
          note.tags.forEach((tag) => tagSet.add(tag));
        });
        return Array.from(tagSet).sort();
      },
    }),
    {
      name: 'elegant-notes-storage',
      partialize: (state) => ({
        notes: state.notes,
        sortBy: state.sortBy,
      }),
    }
  )
);
