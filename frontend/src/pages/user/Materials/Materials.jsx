import { useState, useMemo } from 'react';
import { useSharedNotes } from '../../hooks/useSharedNotes';
import { useAuth } from '../../../context/AuthContext';
import { Search, FileText, File, Image as ImageIcon, Download, Filter, User, Trash2, ExternalLink } from 'lucide-react';
import './Materials.css';

export default function Materials() {
    const { notes, getFileFromDB, deleteSharedNote } = useSharedNotes();
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'lecture'

    const filteredNotes = useMemo(() => {
        let result = [...notes];

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(n =>
                (n.uploadedBy && n.uploadedBy.toLowerCase().includes(lowerSearch)) ||
                (n.lectureNumber && n.lectureNumber.toString().includes(lowerSearch))
            );
        }

        if (sortBy === 'newest') {
            result.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortBy === 'oldest') {
            result.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortBy === 'lecture') {
            result.sort((a, b) => a.lectureNumber - b.lectureNumber);
        }

        return result;
    }, [notes, searchTerm, sortBy]);

    const handleDownload = async (note) => {
        if (!note.fileRef) return;
        try {
            const blob = await getFileFromDB(note.fileRef);
            if (!blob) {
                console.error("Download failed: Blob not found for ref", note.fileRef);
                alert("File not found in your browser's database. This may be an old record. Please try uploading the file again.");
                return;
            }

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = note.fileName || `lecture_${note.lectureNumber}_note`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error("Download failed", e);
            alert("Download failed.");
        }
    };

    const handleOpen = async (note) => {
        if (!note.fileRef) return;

        // Open a blank tab immediately to prevent popup blockers
        const newTab = window.open('about:blank', '_blank');

        try {
            const blob = await getFileFromDB(note.fileRef);
            if (!blob) {
                newTab.close();
                console.error("Open failed: Blob not found for ref", note.fileRef);
                alert("File not found in your browser's database. This may be an old record. Please try uploading the file again.");
                return;
            }

            const blobUrl = URL.createObjectURL(blob);
            newTab.location.href = blobUrl;

            // Note: We can't revoke the URL immediately because the tab needs it to load.
            // Browser usually handles this when the tab is closed or navigated.
        } catch (e) {
            console.error("Open failed", e);
            if (newTab) newTab.close();
            alert("Could not open the file.");
        }
    };



    return (
        <div className="materials-container">
            <div className="materials-header animate-fade-in">
                <h1 className="materials-title">Global Study Materials</h1>
                <p className="materials-subtitle">Access and download notes shared by all students across all lectures.</p>
            </div>

            <div className="materials-controls animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="search-bar expanded glass-panel">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by student name or lecture number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-dropdown glass-panel">
                    <Filter size={18} />
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="lecture">Sort by Lecture</option>
                    </select>
                </div>
            </div>

            <div className="materials-grid animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {filteredNotes.length === 0 ? (
                    <div className="empty-materials glass-panel">
                        <FileText size={48} color="var(--text-secondary)" style={{ opacity: 0.5 }} />
                        <h3>No shared materials found</h3>
                        <p>Upload files from the Dashboard to share them globally.</p>
                    </div>
                ) : (
                    filteredNotes.map(note => (
                        <div key={note.id} className="material-card glass-panel">
                            <div className="material-card-content" style={{ paddingTop: '1rem' }}>
                                <div className="material-card-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span className="badge-lecture">Lecture {note.lectureNumber}</span>
                                        {note.fileType && (
                                            <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', background: 'var(--bg-tertiary)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                                                {note.fileType.split('/')[1]?.toUpperCase() || 'FILE'}
                                            </span>
                                        )}
                                    </div>
                                    <span className="material-date">{new Date(note.date).toLocaleDateString()}</span>
                                </div>
                                <h3 className="material-filename" title={note.fileName || 'Shared Note'}>
                                    {note.fileName || 'Shared Note'}
                                </h3>
                                <div className="material-uploader">
                                    <User size={14} />
                                    <span>{note.uploadedBy || 'Anonymous'}</span>
                                </div>
                            </div>
                            <div className="material-card-actions" style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                                {isAdmin && (
                                    <button
                                        className="btn btn-outline"
                                        style={{ color: 'var(--danger)', borderColor: 'var(--danger)', padding: '0.5rem' }}
                                        onClick={() => {
                                            if (confirm("Delete this shared material globally?")) {
                                                deleteSharedNote(note.id);
                                            }
                                        }}
                                        title="Delete Note"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                                <button
                                    className="btn btn-primary"
                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    onClick={() => handleOpen(note)}
                                    disabled={!note.fileRef}
                                >
                                    <ExternalLink size={16} style={{ marginRight: '0.5rem' }} />
                                    Open
                                </button>
                                <button
                                    className="btn btn-outline"
                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    onClick={() => handleDownload(note)}
                                    disabled={!note.fileRef}
                                >
                                    <Download size={16} style={{ marginRight: '0.5rem' }} />
                                    Download
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
