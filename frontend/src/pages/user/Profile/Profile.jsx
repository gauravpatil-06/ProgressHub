import { useState, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Camera, Save, User as UserIcon } from 'lucide-react';
import './Profile.css';

export default function Profile() {
    const { user, updateProfile } = useAuth();

    const [name, setName] = useState(user?.name || '');
    const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || null);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                setMessage('Image must be less than 2MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewAvatar(reader.result);
                setMessage('');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!name.trim()) {
            setMessage('Name cannot be empty');
            return;
        }

        setIsSaving(true);
        updateProfile(name, previewAvatar);

        setTimeout(() => {
            setIsSaving(false);
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        }, 600);
    };

    return (
        <div className="profile-page">
            <div className="profile-header animate-fade-in">
                <h1 className="profile-title">Profile Settings</h1>
                <p className="profile-subtitle">Personalize your workspace and identity.</p>
            </div>

            <div className="profile-content glass-container animate-fade-in" style={{ animationDelay: '0.1s' }}>

                <div className="profile-avatar-section">
                    <div className="avatar-preview-container">
                        {previewAvatar ? (
                            <img src={previewAvatar} alt="Profile Preview" className="avatar-image-full" />
                        ) : (
                            <div className="avatar-placeholder-full">
                                <UserIcon size={64} className="text-secondary" />
                            </div>
                        )}

                        <button
                            className="btn-upload-avatar"
                            onClick={() => fileInputRef.current?.click()}
                            title="Change Avatar"
                        >
                            <Camera size={20} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                    </div>
                    <div className="avatar-helper-text">
                        <h3>Profile Picture</h3>
                    </div>
                </div>

                <div className="profile-form-section">
                    {message && (
                        <div className={`form-message ${message.includes('success') ? 'success' : 'error'}`}>
                            {message}
                        </div>
                    )}

                    <div className="form-group">
                        <label>Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            title="Email cannot be changed"
                        />
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={isSaving}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Save size={18} />
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
