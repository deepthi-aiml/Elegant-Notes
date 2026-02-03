import { supabase } from './supabase';
import { Note } from '@/types';

export const notesService = {
    async getNotes() {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async createNote(note: Partial<Note>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('notes')
            .insert([{ ...note, user_id: user.id }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateNote(id: string, updates: Partial<Note>) {
        const { data, error } = await supabase
            .from('notes')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteNote(id: string) {
        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async getPublicNote(slug: string) {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('public_slug', slug)
            .eq('is_public', true)
            .single();

        if (error) throw error;
        return data;
    },

    async syncNotes(localNotes: Note[]) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Filter out notes that already exist (if any) or handle conflict
        // For simplicity, we'll just try to upload all and let RLS/PK handle it or just do it once
        const notesToSync = localNotes.map(note => ({
            ...note,
            user_id: user.id,
            // Ensure we use UUIDs if the table expects them. 
            // Existing local IDs might be strings like 'note_...'. 
            // We should probably generate new UUIDs for Supabase if they aren't already.
        }));

        // Better way: only sync if DB is empty or user confirms.
        // For this app, let's just create them if they don't exist.
    }
};
