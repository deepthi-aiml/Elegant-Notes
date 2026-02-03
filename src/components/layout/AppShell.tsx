import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  PenLine,
  FileText,
  Archive,
  SortAsc,
  ChevronDown,
  Menu,
  X,
  LogOut,
  LogIn
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotesStore } from '@/store/notesStore';
import { useAuth } from '@/components/auth/AuthProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SearchBar } from '@/components/ui/SearchBar';
import { SortOption } from '@/types';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AppShellProps {
  sidebar: ReactNode;
  editor: ReactNode;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'updated', label: 'Last modified' },
  { value: 'created', label: 'Date created' },
  { value: 'title', label: 'Title' },
];

export function AppShell({ sidebar, editor }: AppShellProps) {
  const {
    notes,
    searchQuery,
    setSearchQuery,
    showArchived,
    setShowArchived,
    sortBy,
    setSortBy,
    addNote,
    getFilteredNotes,
    activeNoteId,
  } = useNotesStore();

  const { user, signOut } = useAuth();

  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  // Auto-close sidebar on mobile when a note is selected
  useEffect(() => {
    if (isMobile && activeNoteId) {
      setIsSidebarOpen(false);
    }
  }, [activeNoteId, isMobile]);

  const filteredNotes = getFilteredNotes();
  const currentSort = sortOptions.find((s) => s.value === sortBy);
  const totalNotes = notes.filter((n) => !n.isArchived).length;
  const archivedCount = notes.filter((n) => n.isArchived).length;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Mobile Backdrop */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "flex h-full w-80 flex-shrink-0 flex-col border-r border-border bg-sidebar glass transition-transform duration-300 ease-in-out",
          isMobile ? "fixed inset-y-0 left-0 z-50 transform" : "relative",
          isMobile && !isSidebarOpen && "-translate-x-full"
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between border-b border-sidebar-border p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileText className="h-4 w-4" />
            </div>
            <h1 className="text-lg font-semibold">Elegant notes</h1>
          </div>
          <ThemeToggle />
        </div>

        {/* Search and actions */}
        <div className="p-4 space-y-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search notes..."
          />

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addNote()}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 font-medium text-primary-foreground shadow-elegant transition-shadow hover:shadow-glow"
            >
              <PenLine className="h-4 w-4" />
              New Note
            </motion.button>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-accent">
                <SortAsc className="h-4 w-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={cn(
                      sortBy === option.value && 'bg-accent'
                    )}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex border-b border-sidebar-border">
          <button
            onClick={() => setShowArchived(false)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors',
              !showArchived
                ? 'border-b-2 border-primary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <FileText className="h-4 w-4" />
            Notes
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs">
              {totalNotes}
            </span>
          </button>
          <button
            onClick={() => setShowArchived(true)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors',
              showArchived
                ? 'border-b-2 border-primary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Archive className="h-4 w-4" />
            Archive
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs">
              {archivedCount}
            </span>
          </button>
        </div>

        {/* Note list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          {sidebar}
        </div>

        {/* Footer info */}
        <div className="flex flex-col border-t border-sidebar-border px-4 py-3 gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
              {currentSort && ` • Sorted by ${currentSort.label.toLowerCase()}`}
            </p>
          </div>

          {user ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-1 items-center gap-2 overflow-hidden">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary shrink-0">
                  {(user.user_metadata?.full_name || user.email?.split('@')[0])[0].toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="truncate text-xs text-foreground font-semibold">
                    {user.user_metadata?.full_name ||
                      (user.email?.split('@')[0].charAt(0).toUpperCase() + user.email?.split('@')[0].slice(1))}
                  </span>
                  <span className="truncate text-[10px] text-muted-foreground">
                    {user.user_metadata?.full_name ? user.email : 'Connected'}
                  </span>
                </div>
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground shrink-0 pl-1"
                title="Log out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log out</span>
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground shadow-sm transition-all hover:bg-accent hover:text-accent-foreground"
            >
              <LogIn className="h-3.5 w-3.5 text-primary" />
              Sign In to Sync
            </Link>
          )}
        </div>
      </aside>

      {/* Main content / Editor */}
      <main className="relative flex flex-1 flex-col overflow-hidden bg-background">
        {/* Mobile Header */}
        {isMobile && (
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="action-button -ml-2"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold truncate">Elegant notes</h1>
          </div>
        )}
        {editor}
      </main>
    </div>
  );
}
