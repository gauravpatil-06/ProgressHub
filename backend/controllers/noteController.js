import SharedNote from '../models/SharedNote.js';

export const getNotes = async (req, res) => {
    try {
        const notes = await SharedNote.find().sort({ date: -1 });
        res.json(notes);
    } catch (err) {
        console.error('Notes fetch error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createNote = async (req, res) => {
    try {
        const note = new SharedNote(req.body);
        await note.save();
        res.status(201).json(note);
    } catch (err) {
        console.error('Note create error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteNote = async (req, res) => {
    try {
        await SharedNote.findByIdAndDelete(req.params.id);
        res.json({ message: 'Note deleted' });
    } catch (err) {
        console.error('Note delete error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
