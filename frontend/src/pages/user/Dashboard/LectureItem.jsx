import { CheckCircle2, Clock, FileText } from 'lucide-react';
import './Dashboard.css';

export default function LectureItem({ lecture, status, onClick, onNoteClick, onToggle }) {
    const handleToggle = (e) => {
        e.stopPropagation();
        onToggle(lecture.id);
    };

    return (
        <div
            className={`lecture-row status-${status} glass-panel`}
            onClick={() => onClick(lecture.id)}
        >
            <div className="lecture-row-left">
                <h3 className="lecture-row-title">Lecture {lecture.id}</h3>
                {status === 'completed' && lecture.completedAt && (
                    <span className="lecture-row-meta desktop-only">
                        Completed on {new Date(lecture.completedAt).toLocaleDateString()}
                    </span>
                )}
            </div>

            <div className="lecture-row-right">
                <div className="status-indicator" onClick={handleToggle}>
                    {status === 'completed' ? (
                        <div className="status-icon-wrapper completed" title="Mark as Pending">
                            <CheckCircle2 size={24} color="var(--success)" />
                        </div>
                    ) : (
                        <div className="status-icon-wrapper pending" title="Mark as Completed">
                            <Clock size={24} color="var(--text-secondary)" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
