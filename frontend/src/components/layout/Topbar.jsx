import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Menu, Moon, Sun } from 'lucide-react';

export default function Topbar({ toggleSidebar, isAdmin }) {
    const { user, logout } = useAuth();
    const [theme, setTheme] = useLocalStorage('ProgressHub_theme', 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.charAt(0).toUpperCase();
    };

    return (
        <header className="topbar">
            <div className="topbar-left">
                <button className="mobile-menu-btn" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>
                <div style={{ marginLeft: '1rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isAdmin ? 'Admin Portal' : ''}
                </div>
            </div>

            <div className="topbar-right">
                <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <div className="user-profile">
                    <div className="avatar" style={{ overflow: 'hidden' }}>
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            isAdmin ? 'A' : getInitials(user?.name)
                        )}
                    </div>
                    <div className="user-info">
                        {isAdmin ? (
                            <span className="user-name" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Admin</span>
                        ) : (
                            <>
                                <span className="user-name" style={{ color: 'black', fontWeight: 'bold' }}>{user?.name || 'User'}</span>
                                <span className="user-role" style={{ color: 'black', fontWeight: '500' }}>Student</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
