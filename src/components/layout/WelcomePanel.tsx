import { motion } from 'framer-motion';
import { FileText, PenLine } from 'lucide-react';

interface WelcomePanelProps {
  onCreateNote: () => void;
}

export function WelcomePanel({ onCreateNote }: WelcomePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex h-full flex-col items-center justify-center p-8"
    >
      <div className="mb-6 rounded-2xl bg-accent/50 p-6">
        <FileText className="h-12 w-12 text-primary" />
      </div>

      <h2 className="text-2xl font-bold mb-2 gradient-text">
        Welcome to Elegant notes
      </h2>

      <p className="mb-8 max-w-md text-center text-muted-foreground">
        A beautiful place to capture your thoughts. Select a note from the sidebar
        or create a new one to get started.
      </p>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCreateNote}
        className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-elevated transition-shadow hover:shadow-glow"
      >
        <PenLine className="h-5 w-5" />
        Create Your First Note
      </motion.button>

      <div className="mt-12 grid max-w-lg gap-4 text-sm text-muted-foreground">
        <div className="flex items-start gap-3">
          <kbd className="rounded bg-muted px-2 py-0.5 font-mono text-xs">Ctrl + N</kbd>
          <span>Create a new note</span>
        </div>
        <div className="flex items-start gap-3">
          <kbd className="rounded bg-muted px-2 py-0.5 font-mono text-xs">Ctrl + F</kbd>
          <span>Search notes</span>
        </div>
        <div className="flex items-start gap-3">
          <kbd className="rounded bg-muted px-2 py-0.5 font-mono text-xs">Ctrl + P</kbd>
          <span>Pin current note</span>
        </div>
      </div>
    </motion.div>
  );
}
