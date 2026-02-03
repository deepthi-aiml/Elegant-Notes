import { AnimatePresence } from 'framer-motion';
import { Note } from '@/types';
import { NoteCard } from './NoteCard';
import { EmptyState } from '@/components/ui/EmptyState';

interface NoteListProps {
  notes: Note[];
  activeNoteId: string | null;
  showArchived: boolean;
  searchQuery: string;
  onNoteClick: (id: string) => void;
  onPin: (id: string) => void;
  onArchive: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateNote: () => void;
}

export function NoteList({
  notes,
  activeNoteId,
  showArchived,
  searchQuery,
  onNoteClick,
  onPin,
  onArchive,
  onDuplicate,
  onDelete,
  onCreateNote,
}: NoteListProps) {
  if (notes.length === 0) {
    if (searchQuery) {
      return <EmptyState type="no-results" />;
    }
    if (showArchived) {
      return <EmptyState type="no-archived" />;
    }
    return <EmptyState type="no-notes" onCreateNote={onCreateNote} />;
  }

  const pinnedNotes = notes.filter((n) => n.isPinned);
  const regularNotes = notes.filter((n) => !n.isPinned);

  return (
    <div className="space-y-4 stagger-children">
      {/* Pinned section */}
      {pinnedNotes.length > 0 && (
        <div>
          <h4 className="mb-2 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Pinned
          </h4>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {pinnedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isActive={note.id === activeNoteId}
                  onClick={() => onNoteClick(note.id)}
                  onPin={() => onPin(note.id)}
                  onArchive={() => onArchive(note.id)}
                  onDuplicate={() => onDuplicate(note.id)}
                  onDelete={() => onDelete(note.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Regular notes section */}
      {regularNotes.length > 0 && (
        <div>
          {pinnedNotes.length > 0 && (
            <h4 className="mb-2 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Notes
            </h4>
          )}
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {regularNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isActive={note.id === activeNoteId}
                  onClick={() => onNoteClick(note.id)}
                  onPin={() => onPin(note.id)}
                  onArchive={() => onArchive(note.id)}
                  onDuplicate={() => onDuplicate(note.id)}
                  onDelete={() => onDelete(note.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
