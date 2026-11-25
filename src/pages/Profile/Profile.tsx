import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import avatarPlaceholder from '@/assets/avatar-placeholder.svg';
import cameraIcon from '@/assets/camera.svg';
import { userApi } from '@/api/userApi';
import { useAuth, setAuth, getToken } from '@/utils/auth';
import { EyeToggle, ImageUploader } from '@/components';

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

    // Password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [savingPassword, setSavingPassword] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

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

    const handleAvatarSelect = (file: File) => {
        setSelectedFile(file);
        setAvatar(URL.createObjectURL(file));
    };

    const handleSaveProfile = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setSavingProfile(true);

        try {
            const updated = await userApi.updateProfile({
                name: name.trim(),
                email: email.trim(),
                contact: contact.trim() || undefined,
                address: address.trim() || undefined,
                description: description.trim() || undefined,
            }, selectedFile);

            const token = getToken();
            if (token) {
                setAuth(token, updated);
            }

            setSelectedFile(null);
            toast.success('Profile updated successfully!');
        } catch {
            // Toast catch error
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

    const FIELD = "relative flex flex-col gap-1.5";
    const LABEL = "ml-[15px] text-left text-sm font-semibold text-[#374151]";
    const INPUT = "w-full rounded-lg border border-[#d1d5db] px-3.5 py-3 pr-[42px] text-[15px] text-[#111827] outline-none transition-[border-color,box-shadow] focus:border-[#08060d] focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] [&::-ms-reveal]:hidden [&::-ms-clear]:hidden";
    const SAVE = "mt-2 cursor-pointer self-end rounded-lg border-none bg-[#08060d] px-6 py-2 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 max-sm:self-stretch";

    const tabCls = (active: boolean) =>
        `cursor-pointer border-none border-b-2 border-transparent bg-none px-[18px] py-2.5 text-[15px] font-semibold text-[#6b7280] transition-colors hover:text-[#111827] ${
            active ? "border-b-[#08060d] text-[#08060d]" : ""
        }`;

    return (
        <section className="mx-auto max-w-[1200px] px-[5%] py-8 max-md:px-[30px]">
            <div className="mb-5 flex gap-2 border-b border-[#e5e7eb]">
                <button type="button" className={tabCls(activeTab === 'profile')} onClick={() => setActiveTab('profile')}>
                    Profile
                </button>
                <button type="button" className={tabCls(activeTab === 'password')} onClick={() => setActiveTab('password')}>
                    Change Password
                </button>
            </div>

            {activeTab === 'profile' ? (
                <form className="flex gap-7 rounded-xl border border-[#e5e7eb] bg-white p-7 shadow-[0_6px_20px_rgba(0,0,0,0.05)] max-sm:flex-col max-sm:items-center" onSubmit={handleSaveProfile}>
                    <div className="flex w-[35%] shrink-0 flex-col items-center gap-3 max-sm:w-full max-sm:max-w-[320px]">
                        <ImageUploader
                            className="w-full"
                            shape="circle"
                            appearance="bare"
                            imageUrl={avatar || avatarPlaceholder}
                            fallbackSrc={avatarPlaceholder}
                            imgClassName="border border-[#e5e7eb] bg-[#f3f4f6]"
                            onSelect={handleAvatarSelect}
                            ariaLabel="Upload avatar"
                            overlay={<img src={cameraIcon} alt="" className="h-8 w-8" />}
                        />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-3 max-sm:w-full">
                        <label className={FIELD}>
                            <span className={LABEL}>Name</span>
                            <input
                                type="text"
                                className={INPUT}
                                value={name}
                                onChange={(ev) => setName(ev.target.value)}
                                required
                            />
                        </label>

                        <label className={FIELD}>
                            <span className={LABEL}>Email</span>
                            <input
                                type="email"
                                className={INPUT}
                                value={email}
                                onChange={(ev) => setEmail(ev.target.value)}
                                required
                            />
                        </label>

                        <label className={FIELD}>
                            <span className={LABEL}>Contact</span>
                            <input
                                type="tel"
                                className={INPUT}
                                value={contact}
                                onChange={(ev) => setContact(ev.target.value)}
                                placeholder='123-456-7890'
                            />
                        </label>

                        <label className={FIELD}>
                            <span className={LABEL}>Address</span>
                            <input
                                type="text"
                                className={INPUT}
                                value={address}
                                onChange={(ev) => setAddress(ev.target.value)}
                            />
                        </label>

                        <label className={FIELD}>
                            <span className={LABEL}>Description</span>
                            <textarea
                                className={`${INPUT} min-h-[96px] resize-y leading-normal`}
                                rows={4}
                                placeholder="Tell us a little about yourself"
                                value={description}
                                onChange={(ev) => setDescription(ev.target.value)}
                            />
                        </label>

                        <button type="submit" className={SAVE} disabled={savingProfile}>
                            {savingProfile ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                </form>
            ) : (
                <form className="flex gap-7 rounded-xl border border-[#e5e7eb] bg-white p-7 shadow-[0_6px_20px_rgba(0,0,0,0.05)] max-sm:flex-col max-sm:items-center" onSubmit={handleChangePassword}>
                    <div className="flex min-w-0 flex-1 flex-col gap-3 max-sm:w-full">
                        <label className={FIELD}>
                            <span className={LABEL}>Current Password</span>
                            <div className="relative">
                                <input
                                    type={showPasswords.current? "text" : "password"}
                                    className={INPUT}
                                    value={currentPassword}
                                    onChange={(ev) => setCurrentPassword(ev.target.value)}
                                    autoComplete="current-password"
                                    required
                                />
                                <EyeToggle shown={showPasswords.current} onToggle={() => setShowPasswords((prev) => ({...prev, current: !prev.current}))} className="absolute right-3 top-1/2 -translate-y-1/2" />
                            </div>
                        </label>

                        <label className={FIELD}>
                            <span className={LABEL}>New Password</span>
                            <div className="relative">
                                <input
                                    type={showPasswords.new? "text" : "password"}
                                    className={INPUT}
                                    value={newPassword}
                                    onChange={(ev) => setNewPassword(ev.target.value)}
                                    autoComplete="new-password"
                                    required
                                />
                                <EyeToggle shown={showPasswords.new} onToggle={() => setShowPasswords((prev) => ({...prev, new: !prev.new}))} className="absolute right-3 top-1/2 -translate-y-1/2" />
                            </div>
                        </label>

                        <label className={FIELD}>
                            <span className={LABEL}>Confirm New Password</span>
                            <div className="relative">
                                <input
                                    type={showPasswords.confirm? "text" : "password"}
                                    className={INPUT}
                                    value={confirmPassword}
                                    onChange={(ev) => setConfirmPassword(ev.target.value)}
                                    autoComplete="new-password"
                                    required
                                />
                                <EyeToggle shown={showPasswords.confirm} onToggle={() => setShowPasswords((prev) => ({...prev, confirm: !prev.confirm}))} className="absolute right-3 top-1/2 -translate-y-1/2" />
                            </div>
                        </label>

                        <button type="submit" className={SAVE} disabled={savingPassword}>
                            {savingPassword ? 'Saving…' : 'Change Password'}
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}
