import User from '../models/User.js';
import Progress from '../models/Progress.js';
import SharedNote from '../models/SharedNote.js';

export const getAllUsersData = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' });
        const progress = await Progress.find();

        const fullData = users.map(u => {
            const userProgress = {};
            progress.filter(p => p.userId.toString() === u._id.toString()).forEach(p => {
                userProgress[p.lectureId] = p;
            });
            return {
                id: u._id,
                name: u.name,
                email: u.email,
                role: u.role,
                avatar: u.avatar,
                createdAt: u.createdAt,
                progress: userProgress
            };
        });
        res.json(fullData);
    } catch (err) {
        console.error('Admin users fetch error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await SharedNote.deleteMany({ email: user.email });
        }
        await User.findByIdAndDelete(req.params.id);
        await Progress.deleteMany({ userId: req.params.id });
        res.json({ message: 'User and their data deleted' });
    } catch (err) {
        console.error('Admin user delete error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
