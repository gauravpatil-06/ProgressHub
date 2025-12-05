import Progress from '../models/Progress.js';

export const getProgress = async (req, res) => {
    try {
        const progress = await Progress.find({ userId: req.params.userId });
        const progressObj = {};
        progress.forEach(p => {
            progressObj[p.lectureId] = { completedAt: p.completedAt, note: p.note, hasNotes: p.hasNotes };
        });
        res.json(progressObj);
    } catch (err) {
        console.error('Progress fetch error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateProgress = async (req, res) => {
    try {
        const { userId, lectureId, completedAt, note, hasNotes } = req.body;
        const progress = await Progress.findOneAndUpdate(
            { userId, lectureId },
            { completedAt, note, hasNotes },
            { upsert: true, new: true }
        );
        res.json(progress);
    } catch (err) {
        console.error('Progress update error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
