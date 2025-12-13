import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { initDB, saveFile, deleteFile as deleteFileFromDB } from '../utils/indexedDB';
import apiClient from '../services/apiClient';

export function useSharedNotes() {
    const { user } = useAuth();
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const refreshNotes = async () => {
        try {
            setIsLoading(true);
            const res = await apiClient.get('/notes');
            setNotes(res.data);
        } catch (e) {
            console.error("Failed to fetch shared notes", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshNotes();
    }, []);

    const addSharedNote = async (lectureNumber, textContent, file) => {
        if (!user) throw new Error("Must be logged in to upload notes");

        let fileRef = null;
        let fileType = null;
        let fileName = null;

        if (file) {
            if (file.size > 5 * 1024 * 1024) throw new Error("File must be smaller than 5MB");

            fileRef = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            fileType = file.type;
            fileName = file.name;

            try {
                await saveFile(fileRef, file);
            } catch (idbError) {
                console.error("IDB Save Failed:", idbError);
                throw new Error("Failed to save file to browser database.");
            }
        }

        const newNote = {
            lectureNumber,
            textContent,
            fileRef,
            fileType,
            fileName,
            uploadedBy: user.name,
            email: user.email,
            date: new Date().toISOString()
        };

        try {
            const res = await apiClient.post('/notes', newNote);
            setNotes(prev => [res.data, ...prev]);
            return res.data;
        } catch (err) {
            console.error("Failed to add note:", err);
            throw new Error("Failed to save note to server.");
        }
    };

    const getFileFromDB = async (fileRef) => {
        if (!fileRef) return null;
        const db = await initDB();
        return await db.get('notes_and_files', fileRef);
    }

    const deleteSharedNote = async (noteId) => {
        const noteToDelete = notes.find(n => (n.id || n._id) === noteId);
        if (!noteToDelete) return;

        if (user.role !== 'admin' && noteToDelete.email !== user.email) {
            throw new Error("You do not have permission to delete this note.");
        }

        if (noteToDelete.fileRef) {
            try {
                await deleteFileFromDB(noteToDelete.fileRef);
            } catch (e) {
                console.error("Failed to delete file from IDB", e);
            }
        }

        try {
            await apiClient.delete(`/notes/${noteId}`);
            setNotes(prev => prev.filter(n => (n.id || n._id) !== noteId));
        } catch (err) {
            console.error("Failed to delete note:", err);
        }
    }

    return { notes, addSharedNote, getFileFromDB, deleteSharedNote, refreshNotes, isLoading };
}
