import { motion } from 'framer-motion';
import { FileText, PenLine } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  type: 'no-notes' | 'no-results' | 'no-archived';
  onCreateNote?: () => void;
  className?: string;
}

export function EmptyState({ type, onCreateNote, className }: EmptyStateProps) {
  const content = {
    'no-notes': {
      icon: FileText,
      title: 'No notes yet',
      description: 'Create your first note to get started',
      action: 'Create Note',
    },
    'no-results': {
      icon: FileText,
      title: 'No matching notes',
      description: 'Try adjusting your search or filters',
      action: null,
    },
    'no-archived': {
      icon: FileText,
      title: 'No archived notes',
      description: 'Archived notes will appear here',
      action: null,
    },
  };

  const { icon: Icon, title, description, action } = content[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center py-16 text-center',
        className
      )}
    >
      <div className="mb-4 rounded-2xl bg-accent/50 p-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-1 text-lg font-semibold gradient-text">{title}</h3>
      <p className="mb-6 text-sm text-muted-foreground">{description}</p>
      {action && onCreateNote && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateNote}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground shadow-elegant transition-shadow hover:shadow-glow"
        >
          <PenLine className="h-4 w-4" />
          {action}
        </motion.button>
      )}
    </motion.div>
  );
}
