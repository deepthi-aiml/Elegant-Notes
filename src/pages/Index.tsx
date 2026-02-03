import { useEffect, useCallback } from 'react';
import { useNotesStore } from '@/store/notesStore';
import { useAuth } from '@/components/auth/AuthProvider';
import { AppShell } from '@/components/layout/AppShell';
import { WelcomePanel } from '@/components/layout/WelcomePanel';
import { NoteList } from '@/components/notes/NoteList';
import { NoteEditor } from '@/components/notes/NoteEditor';

const Index = () => {
  const {
    activeNoteId,
    searchQuery,
    showArchived,
    setActiveNote,
    addNote,
    updateNote,
    deleteNote,
    duplicateNote,
    togglePin,
    toggleArchive,
    setNoteColor,
    addTag,
    removeTag,
    getActiveNote,
    getFilteredNotes,
    getAllTags,
    setSearchQuery,
    fetchNotes,
    syncLocalToCloud,
    togglePublic,
  } = useNotesStore();

  const { user, signOut } = useAuth();

  const activeNote = getActiveNote();
  const filteredNotes = getFilteredNotes();
  const allTags = getAllTags();

  // Load and sync notes
  useEffect(() => {
    if (user) {
      fetchNotes();
      // Sync local notes once after login
      const hasSynced = localStorage.getItem('has_synced_to_cloud');
      if (!hasSynced) {
        syncLocalToCloud().then(() => {
          localStorage.setItem('has_synced_to_cloud', 'true');
        });
      }
    }
  }, [user, fetchNotes, syncLocalToCloud]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();

      if (isMod && key === 'n') {
        e.preventDefault();
        addNote();
      } else if (isMod && key === 'f') {
        e.preventDefault();
        // Focus search
        const searchInput = document.querySelector('input[type="text"][placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select(); // Select all text for quick replacement
        }
      } else if (isMod && key === 'p' && activeNote) {
        e.preventDefault();
        togglePin(activeNote.id);
      }
    },
    [addNote, activeNote, togglePin]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Auto-select first note if none selected
  useEffect(() => {
    if (!activeNoteId && filteredNotes.length > 0) {
      setActiveNote(filteredNotes[0].id);
    }
  }, [activeNoteId, filteredNotes, setActiveNote]);

  const sidebar = (
    <NoteList
      notes={filteredNotes}
      activeNoteId={activeNoteId}
      showArchived={showArchived}
      searchQuery={searchQuery}
      onNoteClick={setActiveNote}
      onPin={togglePin}
      onArchive={toggleArchive}
      onDuplicate={duplicateNote}
      onDelete={deleteNote}
      onCreateNote={addNote}
    />
  );

  const editor = activeNote ? (
    <NoteEditor
      note={activeNote}
      allTags={allTags}
      onUpdate={(updates) => updateNote(activeNote.id, updates)}
      onAddTag={(tag) => addTag(activeNote.id, tag)}
      onRemoveTag={(tag) => removeTag(activeNote.id, tag)}
      onSetColor={(color) => setNoteColor(activeNote.id, color)}
      onPin={() => togglePin(activeNote.id)}
      onArchive={() => toggleArchive(activeNote.id)}
      onDuplicate={() => duplicateNote(activeNote.id)}
      onDelete={() => deleteNote(activeNote.id)}
      onTogglePublic={() => togglePublic(activeNote.id)}
    />
  ) : (
    <WelcomePanel onCreateNote={addNote} />
  );

  return <AppShell sidebar={sidebar} editor={editor} />;
};

export default Index;
