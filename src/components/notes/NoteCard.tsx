import { memo } from 'react';
import { motion } from 'framer-motion';
import { Pin, Archive, MoreVertical, Copy, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Note, NoteColor } from '@/types';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NoteCardProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
  onPin: () => void;
  onArchive: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const colorClasses: Record<NoteColor, string> = {
  default: 'bg-card border-border',
  rose: 'bg-note-rose border-note-rose-border',
  red: 'bg-note-red border-note-red-border',
  pink: 'bg-note-pink border-note-pink-border',
  fuchsia: 'bg-note-fuchsia border-note-fuchsia-border',
  violet: 'bg-note-violet border-note-violet-border',
  purple: 'bg-note-purple border-note-purple-border',
  indigo: 'bg-note-indigo border-note-indigo-border',
  navy: 'bg-note-navy border-note-navy-border',
  blue: 'bg-note-blue border-note-blue-border',
  sky: 'bg-note-sky border-note-sky-border',
  cyan: 'bg-note-cyan border-note-cyan-border',
  teal: 'bg-note-teal border-note-teal-border',
  mint: 'bg-note-mint border-note-mint-border',
  emerald: 'bg-note-emerald border-note-emerald-border',
  green: 'bg-note-green border-note-green-border',
  lime: 'bg-note-lime border-note-lime-border',
  yellow: 'bg-note-yellow border-note-yellow-border',
  amber: 'bg-note-amber border-note-amber-border',
  gold: 'bg-note-gold border-note-gold-border',
  orange: 'bg-note-orange border-note-orange-border',
  maroon: 'bg-note-maroon border-note-maroon-border',
  coffee: 'bg-note-coffee border-note-coffee-border',
  slate: 'bg-note-slate border-note-slate-border',
};

export const NoteCard = memo(function NoteCard({
  note,
  isActive,
  onClick,
  onPin,
  onArchive,
  onDuplicate,
  onDelete,
}: NoteCardProps) {
  const displayTitle = note.title || 'Untitled';
  const displayContent = note.content.slice(0, 100) || 'No content';
  const formattedDate = format(new Date(note.updatedAt), 'MMM d, yyyy');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={cn(
        'note-card group relative z-10 cursor-pointer rounded-xl border p-4 transition-all',
        colorClasses[note.color || 'default'],
        isActive && 'ring-2 ring-primary/20 !border-primary'
      )}
    >
      {/* Header with title and actions */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {note.isPinned && (
            <Pin className="h-3.5 w-3.5 flex-shrink-0 rotate-45 text-primary" />
          )}
          <h3 className="truncate font-medium text-foreground">
            {displayTitle}
          </h3>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              className="relative z-30 flex h-7 w-7 items-center justify-center rounded-md border border-border/50 bg-background/50 text-muted-foreground transition-all hover:bg-accent hover:text-foreground group-hover:bg-accent group-hover:text-foreground"
              aria-label="Note actions"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44 z-50 shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem onClick={() => onPin()}>
              <Pin className="mr-2 h-3.5 w-3.5 rotate-45 text-primary" />
              <span className="flex-1">{note.isPinned ? 'Unpin' : 'Pin to top'}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onArchive()}>
              <Archive className="mr-2 h-3.5 w-3.5" />
              <span className="flex-1">{note.isArchived ? 'Unarchive' : 'Archive'}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate()}>
              <Copy className="mr-2 h-3.5 w-3.5" />
              <span className="flex-1">Duplicate</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete()}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              <span className="flex-1">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content preview */}
      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
        {displayContent}
      </p>

      {/* Footer with tags and date */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 flex-wrap gap-1 overflow-hidden">
          {note.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="tag truncate text-xs"
            >
              {tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{note.tags.length - 3}
            </span>
          )}
        </div>
        <span className="flex-shrink-0 text-xs text-muted-foreground">
          {formattedDate}
        </span>
      </div>

      {/* Archive indicator */}
      {note.isArchived && (
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Archive className="h-3 w-3" />
          <span>Archived</span>
        </div>
      )}
    </motion.div>
  );
});
