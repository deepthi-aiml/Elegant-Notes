import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { notesService } from '@/lib/notesService';
import { Note } from '@/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function Share() {
    const { slug } = useParams<{ slug: string }>();
    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (slug) {
            notesService.getPublicNote(slug)
                .then((data) => {
                    setNote({
                        id: data.id,
                        title: data.title,
                        content: data.content,
                        tags: data.tags || [],
                        createdAt: data.created_at,
                        updatedAt: data.updated_at,
                        isPinned: data.is_pinned,
                        isArchived: data.is_archived,
                        color: data.color,
                    } as Note);
                })
                .catch((err) => {
                    console.error(err);
                    setError('Note not found or is no longer public.');
                })
                .finally(() => setLoading(false));
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="animate-pulse text-muted-foreground">Loading note...</div>
            </div>
        );
    }

    if (error || !note) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
                <h1 className="mb-2 text-2xl font-bold">404</h1>
                <p className="mb-6 text-muted-foreground">{error || 'Note not found'}</p>
                <Button asChild variant="outline">
                    <Link to="/">Go Home</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8 flex items-center justify-between">
                    <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
                        <Link to="/">
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Elegant Notes
                        </Link>
                    </Button>
                    <div className="text-xs text-muted-foreground">
                        Shared via Elegant Notes
                    </div>
                </div>

                <article className="prose prose-invert max-w-none">
                    <div className="mb-4 text-sm text-muted-foreground">
                        {format(new Date(note.createdAt), 'MMMM d, yyyy')}
                    </div>
                    <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground">
                        {note.title || 'Untitled'}
                    </h1>

                    {note.tags && note.tags.length > 0 && (
                        <div className="mb-8 flex flex-wrap gap-2">
                            {note.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full bg-secondary/50 px-3 py-1 text-xs font-medium text-secondary-foreground"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="whitespace-pre-wrap text-lg leading-relaxed text-foreground/90">
                        {note.content}
                    </div>
                </article>
            </div>
        </div>
    );
}
