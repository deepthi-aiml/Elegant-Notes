import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ count = 3, className }: LoadingSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl bg-muted p-4"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="mb-3 h-4 w-3/4 rounded bg-muted-foreground/10" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-muted-foreground/10" />
            <div className="h-3 w-5/6 rounded bg-muted-foreground/10" />
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-5 w-12 rounded-full bg-muted-foreground/10" />
            <div className="h-5 w-16 rounded-full bg-muted-foreground/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EditorSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse p-6', className)}>
      <div className="mb-6 h-8 w-1/2 rounded bg-muted-foreground/10" />
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-muted-foreground/10" />
        <div className="h-4 w-5/6 rounded bg-muted-foreground/10" />
        <div className="h-4 w-4/6 rounded bg-muted-foreground/10" />
        <div className="h-4 w-full rounded bg-muted-foreground/10" />
        <div className="h-4 w-3/4 rounded bg-muted-foreground/10" />
      </div>
    </div>
  );
}
