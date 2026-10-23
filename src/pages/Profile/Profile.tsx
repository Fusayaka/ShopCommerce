import './profile.css';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import avatarPlaceholder from '@/assets/avatar-placeholder.svg';
import cameraIcon from '@/assets/camera.svg';
import { userApi } from '@/api/userApi';
import { useAuth, setAuth, getToken } from '@/utils/auth';

type Tab = 'profile' | 'password';

export default function Profile() {
    const { user: currentUser } = useAuth();

    const [activeTab, setActiveTab] = useState<Tab>('profile');

    // Profile form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [savingProfile, setSavingProfile] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [savingPassword, setSavingPassword] = useState(false);

    // Load the current profile once.
    useEffect(() => {
        let active = true;
        userApi
            .getMe()
            .then((user) => {
                if (!active) return;
                setName(user.name ?? '');
                setEmail(user.email ?? '');
                setAvatar(user.avatar ?? '');
                setContact(user.contact ?? '');
                setAddress(user.address ?? '');
                setDescription(user.description ?? '');
            })
            .catch(() => {
                if (!active || !currentUser) return;
                setName(currentUser.name ?? '');
                setEmail(currentUser.email ?? '');
                setAvatar(currentUser.avatar ?? '');
                setContact(currentUser.contact ?? '');
                setAddress(currentUser.address ?? '');
                setDescription(currentUser.description ?? '');
            });
        return () => {
            active = false;
        };
    }, [currentUser]);

    const handleAvatarSelect = async (ev: React.ChangeEvent<HTMLInputElement>) => {
        const file = ev.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file.');
            ev.target.value = '';
            return;
        }
        try {
            // Upload to Cloudinary (via our API) and store the returned URL for Save to persist.
            const { url } = await userApi.uploadAvatar(file);
            setAvatar(url);
        } catch {
            // axiosClient already shows the error toast.
        } finally {
            ev.target.value = ''; // let the same file be re-selected later
        }
    };

    const handleSaveProfile = async (e: React.SyntheticEvent) => {
        // TODO: implement Avatar Change

        e.preventDefault();
        setSavingProfile(true);
        try {
            const updated = await userApi.updateProfile({
                name: name.trim(),
                email: email.trim(),
                avatar: avatar.trim() || undefined,
                contact: contact.trim() || undefined,
                address: address.trim() || undefined,
                description: description.trim() || undefined,
            });
            const token = getToken();
            if (token) setAuth(token, updated);
            toast.success('Profile updated successfully!');
        } catch {
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('New password and confirmation do not match.');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('New password must be at least 6 characters long.');
            return;
        }
        setSavingPassword(true);
        try {
            await userApi.changePassword({ currentPassword, newPassword });
            toast.success('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch {
            // axiosClient handles the error toast.
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <section className="profile-section">
            <div className="profile-tabs">
                <button
                    type="button"
                    className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    Profile
                </button>
                <button
                    type="button"
                    className={`profile-tab ${activeTab === 'password' ? 'active' : ''}`}
                    onClick={() => setActiveTab('password')}
                >
                    Change Password
                </button>
            </div>

            {activeTab === 'profile' ? (
                <form className="profile-card" onSubmit={handleSaveProfile}>
                    <div className="profile-avatar-col">
                        <button
                            type="button"
                            className="profile-avatar-btn"
                            onClick={() => fileInputRef.current?.click()}
                            aria-label="Upload avatar"
                        >
                            <img
                                className="profile-avatar"
                                src={avatar || avatarPlaceholder}
                                alt={name || 'User'}
                                onError={(ev) => { ev.currentTarget.src = avatarPlaceholder; }}
                            />
                            <span className="profile-avatar-overlay">
                                <img src={cameraIcon} alt="" className="profile-avatar-overlay-icon" />
                            </span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleAvatarSelect}
                        />
                    </div>

                    <div className="profile-fields">
                        <label className="profile-field">
                            <span className="profile-label">Name</span>
                            <input
                                type="text"
                                className="profile-input"
                                value={name}
                                onChange={(ev) => setName(ev.target.value)}
                                required
                            />
                        </label>

                        <label className="profile-field">
                            <span className="profile-label">Email</span>
                            <input
                                type="email"
                                className="profile-input"
                                value={email}
                                onChange={(ev) => setEmail(ev.target.value)}
                                required
                            />
                        </label>

                        <label className="profile-field">
                            <span className="profile-label">Contact</span>
                            <input
                                type="tel"
                                className="profile-input"
                                value={contact}
                                onChange={(ev) => setContact(ev.target.value)}
                                placeholder='123-456-7890'
                            />
                        </label>

                        <label className="profile-field">
                            <span className="profile-label">Address</span>
                            <input
                                type="text"
                                className="profile-input"
                                value={address}
                                onChange={(ev) => setAddress(ev.target.value)}
                            />
                        </label>

                        <label className="profile-field">
                            <span className="profile-label">Description</span>
                            <textarea
                                className="profile-input profile-textarea"
                                rows={4}
                                placeholder="Tell us a little about yourself"
                                value={description}
                                onChange={(ev) => setDescription(ev.target.value)}
                            />
                        </label>

                        <button type="submit" className="profile-save" disabled={savingProfile}>
                            {savingProfile ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                </form>
            ) : (
                <form className="profile-card profile-card--password" onSubmit={handleChangePassword}>
                    <div className="profile-fields">
                        <label className="profile-field">
                            <span className="profile-label">Current Password</span>
                            <input
                                type="password"
                                className="profile-input"
                                value={currentPassword}
                                onChange={(ev) => setCurrentPassword(ev.target.value)}
                                autoComplete="current-password"
                                required
                            />
                        </label>

                        <label className="profile-field">
                            <span className="profile-label">New Password</span>
                            <input
                                type="password"
                                className="profile-input"
                                value={newPassword}
                                onChange={(ev) => setNewPassword(ev.target.value)}
                                autoComplete="new-password"
                                required
                            />
                        </label>

                        <label className="profile-field">
                            <span className="profile-label">Confirm New Password</span>
                            <input
                                type="password"
                                className="profile-input"
                                value={confirmPassword}
                                onChange={(ev) => setConfirmPassword(ev.target.value)}
                                autoComplete="new-password"
                                required
                            />
                        </label>

                        <button type="submit" className="profile-save" disabled={savingPassword}>
                            {savingPassword ? 'Saving…' : 'Change Password'}
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}
