import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings2, Users, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import apiClient from '../../services/apiClient';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const { appSettings, getAllUsersData, deleteUser } = useAuth();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        refreshUsers();
    }, [appSettings]);

    const refreshUsers = async () => {
        const data = await getAllUsersData();
        const processedUsers = data.map(u => {
            let completedCount = 0;
            const progress = u.progress || {};
            Object.keys(progress).forEach(lectureId => {
                if (progress[lectureId]?.completedAt) completedCount++;
            });
            return {
                ...u,
                id: u.id || u._id,
                completedCount,
                percentage: appSettings.totalLectures > 0
                    ? Math.round((completedCount / appSettings.totalLectures) * 100)
                    : 0
            };
        }).sort((a, b) => b.completedCount - a.completedCount);

        setUsers(processedUsers);
    };

    const handleDelete = async (id) => {
        if (confirm("PERMANENT DELETE: Are you sure? All progress, shared notes, and files will be deleted. This user will NOT be able to login again with these credentials.")) {
            await deleteUser(id);
            refreshUsers();
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-header animate-fade-in">
                <h1 className="admin-title">User Management</h1>
                <p className="admin-subtitle">Monitor student progress and manage active accounts.</p>
            </div>


            <div className="admin-section glass-container animate-fade-in" style={{ width: '100%', marginTop: '2rem' }}>
                <h2 className="admin-section-title">
                    <Users size={20} color="var(--accent-secondary)" />
                    Student Database
                </h2>

                <div className="table-container">
                    {users.length === 0 ? (
                        <p className="text-secondary text-center" style={{ padding: '2rem' }}>
                            No active users found.
                        </p>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Password</th>
                                    <th>Progress</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td style={{ fontWeight: 500 }}>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{u.password || '******'}</td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '0.75rem' }}>{u.completedCount} / {appSettings.totalLectures} ({u.percentage}%)</span>
                                                <div className="user-progress-bar">
                                                    <div className="user-progress-fill" style={{ width: `${u.percentage}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <button className="action-btn" title="Delete User" onClick={() => handleDelete(u.id)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
