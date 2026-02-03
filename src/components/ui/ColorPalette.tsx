import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NoteColor } from '@/types';

interface ColorPaletteProps {
  selectedColor: NoteColor;
  onSelectColor: (color: NoteColor) => void;
  className?: string;
}

const colors: { value: NoteColor; label: string; className: string }[] = [
  { value: 'default', label: 'Default', className: 'bg-note-default border-note-default-border' },
  { value: 'rose', label: 'Rose', className: 'bg-note-rose border-note-rose-border' },
  { value: 'red', label: 'Red', className: 'bg-note-red border-note-red-border' },
  { value: 'maroon', label: 'Maroon', className: 'bg-note-maroon border-note-maroon-border' },
  { value: 'pink', label: 'Pink', className: 'bg-note-pink border-note-pink-border' },
  { value: 'fuchsia', label: 'Fuchsia', className: 'bg-note-fuchsia border-note-fuchsia-border' },
  { value: 'violet', label: 'Violet', className: 'bg-note-violet border-note-violet-border' },
  { value: 'purple', label: 'Purple', className: 'bg-note-purple border-note-purple-border' },
  { value: 'indigo', label: 'Indigo', className: 'bg-note-indigo border-note-indigo-border' },
  { value: 'navy', label: 'Navy', className: 'bg-note-navy border-note-navy-border' },
  { value: 'blue', label: 'Blue', className: 'bg-note-blue border-note-blue-border' },
  { value: 'sky', label: 'Sky', className: 'bg-note-sky border-note-sky-border' },
  { value: 'cyan', label: 'Cyan', className: 'bg-note-cyan border-note-cyan-border' },
  { value: 'teal', label: 'Teal', className: 'bg-note-teal border-note-teal-border' },
  { value: 'mint', label: 'Mint', className: 'bg-note-mint border-note-mint-border' },
  { value: 'emerald', label: 'Emerald', className: 'bg-note-emerald border-note-emerald-border' },
  { value: 'green', label: 'Green', className: 'bg-note-green border-note-green-border' },
  { value: 'lime', label: 'Lime', className: 'bg-note-lime border-note-lime-border' },
  { value: 'yellow', label: 'Yellow', className: 'bg-note-yellow border-note-yellow-border' },
  { value: 'amber', label: 'Amber', className: 'bg-note-amber border-note-amber-border' },
  { value: 'gold', label: 'Gold', className: 'bg-note-gold border-note-gold-border' },
  { value: 'orange', label: 'Orange', className: 'bg-note-orange border-note-orange-border' },
  { value: 'coffee', label: 'Coffee', className: 'bg-note-coffee border-note-coffee-border' },
  { value: 'slate', label: 'Slate', className: 'bg-note-slate border-note-slate-border' },
];

export function ColorPalette({ selectedColor, onSelectColor, className }: ColorPaletteProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2 max-w-[280px]', className)}>
      {colors.map(({ value, label, className: colorClass }) => (
        <button
          key={value}
          onClick={() => onSelectColor(value)}
          title={label}
          className={cn(
            'relative h-6 w-6 rounded-full border-2 transition-transform hover:scale-110',
            colorClass
          )}
        >
          {selectedColor === value && (
            <motion.div
              layoutId="color-indicator"
              className="absolute inset-0 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-background"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
