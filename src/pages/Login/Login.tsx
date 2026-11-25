import { useState } from 'react'
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { setAuth, setToken, useAuth } from '@/utils/auth';
import { loginApi } from '@/api/loginApi';
import { FormField } from '@/components';

const SOCIAL_ICON = "h-[18px] w-[18px] shrink-0";
const CARD = "flex max-h-full w-[90%] max-w-[420px] flex-col overflow-y-auto p-8 max-md:px-[1.3rem] max-md:py-[1.5rem] md:p-10";
const TITLE = "mb-[0.3rem] text-center text-[1.8rem] font-bold text-[#111] max-md:text-[1.5rem]";
const SWITCH_TOP = "mb-[0.9rem] text-center text-[0.9rem] text-[#555]";
const SWITCH_LINK = "cursor-pointer border-none bg-none p-0 font-semibold text-black underline";
const ERROR_BOX = "mb-[0.8rem] rounded-md border border-[#ffa39e] bg-[#fff1f0] px-2.5 py-2 text-[0.85rem] text-[#cf1322]";
const GROUP = "mb-[0.7rem]";
const BUTTON = "mt-[0.4rem] w-full cursor-pointer rounded-lg border-none bg-black py-[11px] text-base font-semibold text-white transition-colors hover:bg-[#333] disabled:cursor-not-allowed disabled:bg-[#888]";
const DIVIDER = "my-[0.9rem] flex items-center text-center text-[0.85rem] text-[#555] before:mr-3 before:flex-1 before:border-b before:border-[#e0e0e0] before:content-[''] after:ml-3 after:flex-1 after:border-b after:border-[#e0e0e0] after:content-['']";
const SOCIAL_BTN = "flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[20px] border border-[#ddd] bg-white px-4 py-[9px] text-[0.9rem] font-medium text-[#333] transition-colors hover:border-[#ffa39e] hover:bg-[#f8f9fa]";

const panelCls = (active: boolean, side: "in" | "up") => {
    const base = "inset-0 flex items-center justify-center transition-[transform,opacity,visibility] duration-1000 ease-in-out md:transform-none";
    if (active) return `${base} relative translate-x-0 visible opacity-100 pointer-events-auto`;
    return `${base} absolute invisible opacity-0 pointer-events-none ${side === "in" ? "-translate-x-full" : "translate-x-full"}`;
};

const SocialRow = ({ onSocial }: { onSocial: (provider: string) => void }) => (
    <div className="mx-auto mt-[0.2rem] flex max-w-[80%] justify-center gap-2.5">
        <button type="button" className={SOCIAL_BTN} onClick={() => onSocial('Google')}><GoogleIcon />Google</button>
        <button type="button" className={SOCIAL_BTN} onClick={() => onSocial('Facebook')}><FacebookIcon />Facebook</button>
    </div>
);

const GoogleIcon = () => (
    <svg className={SOCIAL_ICON} viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
);

const FacebookIcon = () => (
    <svg className={SOCIAL_ICON} viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#1877F2" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
);

export default function Login(){
    const [isLogin, setIsLogin] = useState<boolean>(true);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';

    const { loggedIn } = useAuth();
    if (loggedIn) {navigate(from, {replace: true})};


    // Đổi giữa Sign In / Sign Up.
    const switchMode = (toLogin: boolean) => {
        setError('');
        setFieldErrors({});
        setIsLogin(toLogin);

        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    const validate = () => {
        const fields: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!isLogin && !name.trim()) {
            fields.name = 'Please enter your name';
        }

        if (!email.trim()) {
            fields.email = 'Please enter your email';
        } else if (!emailPattern.test(email)) {
            fields.email = 'Please enter a valid email address';
        }

        if (!password) {
            fields.password = 'Please enter your password';
        } else if (!isLogin) {
            if (password.length < 6) {
                fields.password = 'Password must be at least 6 characters long';
            } else {
                const missing: string[] = [];
                if (!/[a-z]/.test(password)) missing.push('a lowercase letter');
                if (!/\d/.test(password)) missing.push('a number');
                if (missing.length) {
                    fields.password = `Password must contain ${missing.join(' and ')}`;
                }
            }
        }

        if (!isLogin) {
            if (!confirmPassword) {
                fields.confirmPassword = 'Please confirm your password';
            } else if (password !== confirmPassword) {
                fields.confirmPassword = 'Passwords do not match';
            }
        }

        return fields;
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});

        const validationErrors = validate();
        if (Object.keys(validationErrors).length) {
            setFieldErrors(validationErrors);
            return;
        }

        setIsLoading(true);

        try {
            if (isLogin){
                const response = await axios.post(
                    'http://localhost:3000/api/auth/login',
                    { email, password },
                    { withCredentials: true }
                );
                
                const token = response.data.accessToken;
                // Lưu token trước để axiosClient đính kèm cho /auth/me.
                setToken(token);

                // Lấy thông tin người dùng để hiển thị (tên/email/avatar).
                // Nếu lỗi vẫn coi là đã đăng nhập, chỉ thiếu thông tin hiển thị.
                const me = await loginApi.getMe().catch(() => null);

                // Cập nhật trạng thái đăng nhập + phát sự kiện -> Header đổi UI ngay.
                setAuth(token, me);

                setName('');
                navigate(from, {replace: true});
            }
            else {
                const response = await axios.post(
                    'http://localhost:3000/api/auth/register',
                    { email, password, name },
                    { withCredentials: true }
                );

                const token = response.data.accessToken;
                setToken(token);

                const me = await loginApi.getMe().catch(() => null);
                setAuth(token, me);
                setName('');

                setIsLogin(true);
                setPassword('');
                setConfirmPassword('');
                navigate(from, {replace: true});
            }
        }
        catch (err: unknown) {
            const apiErr = err as { response?: { data?: { message?: string | string[] } } };
            const raw = apiErr.response?.data?.message;
            const messages: string[] = Array.isArray(raw) ? raw : raw ? [raw] : [];

            if (messages.length === 0) {
                setError('Error in connecting to server');
                return;
            }

            if (isLogin) {
                setError(messages.join(', '));
                return;
            }

            const fields: { name?: string; email?: string; password?: string } = {};
            const rest: string[] = [];
            for (const msg of messages) {
                const m = msg.toLowerCase();
                if (m.includes('password')) fields.password ??= msg;
                else if (m.includes('email')) fields.email ??= msg;
                else if (m.includes('name')) fields.name ??= msg;
                else rest.push(msg);
            }
            setFieldErrors(fields);
            if (rest.length) setError(rest.join(', '));
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        // TODO: implement login with social link
        console.log(`Login with ${provider} clicked!`);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-[#0b1919] bg-[image:linear-gradient(135deg,rgba(11,25,25,0.1)_0%,rgba(6,61,38,0.1)_100%),url('https://i.pinimg.com/1200x/f5/88/07/f58807969c4413cbd9f71c95bbe61a3f.jpg')] bg-cover bg-center bg-no-repeat px-4 py-6 text-left">
            <div
                className={`relative max-h-[calc(100vh-48px)] w-full max-w-[440px] overflow-hidden rounded-[20px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.06)] max-md:max-w-[340px] max-md:rounded-[18px] max-md:bg-white/30 max-md:shadow-[0_20px_50px_rgba(0,0,0,0.35),inset_0_0_0_1px_rgba(255,255,255,0.45)] max-md:backdrop-blur-[10px] md:transition-transform md:duration-1000 md:ease-in-out ${
                    isLogin ? "md:-translate-x-[calc(35vw-260px)]" : "md:translate-x-[calc(35vw-260px)]"
                }`}
            >
                <div className={panelCls(isLogin, "in")}>
                    <div className={CARD}>
                        <h2 className={TITLE}>Sign In</h2>
                        <p className={SWITCH_TOP}>
                            Don't have an account?{' '}
                            <button type="button" onClick={() => switchMode(false)} className={SWITCH_LINK}>
                                Sign Up
                            </button>
                        </p>

                        {error && isLogin && <div className={ERROR_BOX}>{error}</div>}

                        <form onSubmit={handleSubmit} noValidate>
                            <FormField
                                variant="filled"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                error={fieldErrors.email}
                                wrapperClassName={GROUP}
                            />

                            <FormField
                                variant="filled"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                error={fieldErrors.password}
                                wrapperClassName={GROUP}
                            />

                            <button type="submit" disabled={isLoading} className={BUTTON}>
                                {isLoading ? 'Processing...' : 'Sign In'}
                            </button>
                        </form>

                        <div className={DIVIDER}>
                            <span>Or continue with </span>
                        </div>

                        <SocialRow onSocial={handleSocialLogin} />
                    </div>
                </div>

                <div className={panelCls(!isLogin, "up")}>
                    <div className={CARD}>
                        <h2 className={TITLE}>Sign Up</h2>
                        <p className={SWITCH_TOP}>
                            Already have an account?{' '}
                            <button type="button" onClick={() => switchMode(true)} className={SWITCH_LINK}>
                                Sign In
                            </button>
                        </p>

                        {error && !isLogin && <div className={ERROR_BOX}>{error}</div>}

                        <form onSubmit={handleSubmit} noValidate>
                            <FormField
                                variant="filled"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Name"
                                error={fieldErrors.name}
                                wrapperClassName={GROUP}
                            />

                            <FormField
                                variant="filled"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                error={fieldErrors.email}
                                wrapperClassName={GROUP}
                            />

                            <FormField
                                variant="filled"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                error={fieldErrors.password}
                                wrapperClassName={GROUP}
                            />

                            <FormField
                                variant="filled"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                error={fieldErrors.confirmPassword}
                                wrapperClassName={GROUP}
                            />

                            <button type="submit" disabled={isLoading} className={BUTTON}>
                                {isLoading ? 'Processing...' : 'Register'}
                            </button>
                        </form>

                        <div className={DIVIDER}>
                            <span>Or continue with</span>
                        </div>

                        <SocialRow onSocial={handleSocialLogin} />
                    </div>
                </div>

            </div>
        </div>
    );
}