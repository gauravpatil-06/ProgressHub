import { useState, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import ProgressSummary from '../../../components/progress/ProgressSummary';
import LectureItem from './LectureItem';
import LectureModal from '../../../components/common/LectureModal';
import './Dashboard.css';

export default function Dashboard() {
    const { user, appSettings, userProgress, updateProgress, isInitialLoad } = useAuth();

    const TOTAL_LECTURES = appSettings?.totalLectures || 200;

    const [filter, setFilter] = useState('all'); // 'all', 'completed', 'pending'
    const [selectedLectureId, setSelectedLectureId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // No local useEffect! Data comes instantly from AuthContext cache.

    const highestCompletedId = useMemo(() => {
        let max = 0;
        Object.keys(userProgress).forEach(id => {
            if (userProgress[id]?.completedAt) {
                max = Math.max(max, parseInt(id));
            }
        });
        return max;
    }, [userProgress]);

    const lectures = useMemo(() => {
        const arr = [];
        for (let i = 1; i <= TOTAL_LECTURES; i++) {
            const data = userProgress[i] || {};
            const isCompleted = !!data.completedAt;

            let status = 'pending';
            if (isCompleted) {
                status = 'completed';
            } else if (i < highestCompletedId) {
                status = 'warning';
            }

            arr.push({
                id: i,
                status,
                completedAt: data.completedAt || null,
                note: data.note || '',
                hasNotes: data.hasNotes || false
            });
        }
        return arr;
    }, [userProgress, highestCompletedId, TOTAL_LECTURES]);

    const completedCount = useMemo(() => {
        return lectures.filter(l => l.status === 'completed').length;
    }, [lectures]);

    const filteredLectures = useMemo(() => {
        let filtered = lectures;
        if (filter === 'completed') filtered = lectures.filter(l => l.status === 'completed');
        else if (filter === 'pending') filtered = lectures.filter(l => l.status !== 'completed');
        return filtered;
    }, [lectures, filter]);

    const handleLectureClick = (id) => {
        setSelectedLectureId(id);
        setIsModalOpen(true);
    };

    const handleToggleCompletion = (id) => {
        const current = userProgress[id] || {};
        const isCompleted = !!current.completedAt;

        // Optimistic update: UI changes in < 0.1s
        updateProgress(id, {
            completedAt: isCompleted ? null : new Date().toISOString()
        });
    };

    const handleSaveNote = (id, noteText, hasFiles, shouldClose = true) => {
        const current = userProgress[id] || {};
        updateProgress(id, {
            note: noteText,
            hasNotes: !!noteText || hasFiles,
            completedAt: current.completedAt || new Date().toISOString()
        });
        if (shouldClose) {
            setIsModalOpen(false);
        }
    };

    const handleMarkAsIncomplete = (id) => {
        updateProgress(id, { completedAt: null });
        setIsModalOpen(false);
    };

    if (isInitialLoad) {
        return (
            <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <div className="animate-pulse" style={{ color: 'var(--text-secondary)' }}>Instant loading...</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header animate-fade-in">
                <h1 className="dashboard-title">My Learning Journey</h1>
                <p className="dashboard-subtitle">
                    <span style={{ color: 'var(--accent-primary)', fontWeight: '600', fontSize: '1.2rem' }}>Full Stack Java Development</span>
                </p>
            </div>

            {/* Instant UI display */}
            <div className="animate-fade-in" style={{ animationDelay: '0s' }}>
                <ProgressSummary total={TOTAL_LECTURES} completed={completedCount} />
            </div>

            <div className="lecture-section glass-container animate-fade-in" style={{ animationDelay: '0.1s', padding: '1.5rem' }}>
                <div className="lecture-section-header">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Lectures</h2>
                    <div className="lecture-filter">
                        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                        <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed</button>
                        <button className={`filter-btn ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>Pending</button>
                    </div>
                </div>

                <div className="lecture-vertical-list">
                    {filteredLectures.map(lecture => (
                        <LectureItem
                            key={lecture.id}
                            lecture={lecture}
                            status={lecture.status}
                            onClick={handleLectureClick}
                            onToggle={handleToggleCompletion}
                        />
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <LectureModal
                    lecture={lectures.find(l => l.id === selectedLectureId)}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveNote}
                    onMarkIncomplete={handleMarkAsIncomplete}
                />
            )}
        </div>
    );
}
