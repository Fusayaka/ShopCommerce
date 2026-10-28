import { useState } from 'react'
import './login.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setAuth, useAuth } from '@/utils/auth';
import { loginApi } from '@/api/loginApi';

const GoogleIcon = () => (
    <svg className="social-icon" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
);

const FacebookIcon = () => (
    <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true">
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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const navigate = useNavigate();

    const { loggedIn } = useAuth();
    if (loggedIn) {navigate('/')};


    // Đổi giữa Sign In / Sign Up: 2 form mờ chéo nhau (hiệu ứng ở login.css).
    const switchMode = (toLogin: boolean) => {
        setError('');
        setFieldErrors({});
        setIsLogin(toLogin);
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

    const handleSubmit = async (e: React.FormEvent) => {
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
                localStorage.setItem('accessToken', token);

                // Lấy thông tin người dùng để hiển thị (tên/email/avatar).
                // Nếu lỗi vẫn coi là đã đăng nhập, chỉ thiếu thông tin hiển thị.
                const me = await loginApi.getMe().catch(() => null);

                // Cập nhật trạng thái đăng nhập + phát sự kiện -> Header đổi UI ngay.
                setAuth(token, me);

                setName('');
                navigate('/');
            }
            else {
                const response = await axios.post(
                    'http://localhost:3000/api/auth/register',
                    { email, password, name },
                    { withCredentials: true }
                );

                const token = response.data.accessToken;
                localStorage.setItem('accessToken', token);

                const me = await loginApi.getMe().catch(() => null);
                setAuth(token, me);
                setName('');

                setIsLogin(true);
                setPassword('');
                setConfirmPassword('');
                navigate('/');
            }
        }
        catch (err: any) {
            const raw = err.response?.data?.message;
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
        console.log(`Login with ${provider} clicked!`);
    };

    return (
        <div className="login-page">
            <div className={`login-box ${isLogin ? 'sign-in-active' : 'sign-up-active'}`}>
                
                <div className="form-panel sign-in-panel">
                    <div className="login-card">
                        <h2 className="login-title">Sign In</h2>
                        <p className="login-switch-top">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => switchMode(false)}
                                className="login-switch-link"
                            >
                                Sign Up
                            </button>
                        </p>

                        {error && isLogin && <div className="login-error">{error}</div>}

                        <form onSubmit={handleSubmit} className="login-form" noValidate>
                            <div className="login-group">
                                <div className={`login-field${fieldErrors.email ? ' has-error' : ''}`}>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="login-input"
                                        placeholder="Email"
                                    />
                                </div>
                                {fieldErrors.email && <p className="login-error-text">{fieldErrors.email}</p>}
                            </div>

                            <div className="login-group">
                                <div className={`login-field${fieldErrors.password ? ' has-error' : ''}`}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="login-input"
                                        placeholder="Password"
                                    />
                                    <button
                                        type="button"
                                        className="login-eye"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                        {showPassword ? (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                        )}
                                    </button>
                                </div>
                                {fieldErrors.password && <p className="login-error-text">{fieldErrors.password}</p>}
                            </div>

                            <button type="submit" disabled={isLoading} className="login-button">
                                {isLoading ? 'Processing...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="login-divider">
                            <span>Or continue with </span>
                        </div>

                        <div className="social-login-group">
                            <button type="button" className="social-btn" onClick={() => handleSocialLogin('Google')}><GoogleIcon />Google</button>
                            <button type="button" className="social-btn" onClick={() => handleSocialLogin('Facebook')}><FacebookIcon />Facebook</button>
                        </div>
                    </div>
                </div>

                <div className="form-panel sign-up-panel">
                    <div className="login-card">
                        <h2 className="login-title">Sign Up</h2>
                        <p className="login-switch-top">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => switchMode(true)}
                                className="login-switch-link"
                            >
                                Sign In
                            </button>
                        </p>

                        {error && !isLogin && <div className="login-error">{error}</div>}

                        <form onSubmit={handleSubmit} className="login-form" noValidate>
                            <div className="login-group">
                                <div className={`login-field${fieldErrors.name ? ' has-error' : ''}`}>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="login-input"
                                        placeholder="Name"
                                    />
                                </div>
                                {fieldErrors.name && <p className="login-error-text">{fieldErrors.name}</p>}
                            </div>

                            <div className="login-group">
                                <div className={`login-field${fieldErrors.email ? ' has-error' : ''}`}>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="login-input"
                                        placeholder="Email"
                                    />
                                </div>
                                {fieldErrors.email && <p className="login-error-text">{fieldErrors.email}</p>}
                            </div>

                            <div className="login-group">
                                <div className={`login-field${fieldErrors.password ? ' has-error' : ''}`}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="login-input"
                                        placeholder="Password"
                                    />
                                    <button
                                        type="button"
                                        className="login-eye"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                        {showPassword ? (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                        )}
                                    </button>
                                </div>
                                {fieldErrors.password && <p className="login-error-text">{fieldErrors.password}</p>}
                            </div>

                            <div className="login-group">
                                <div className={`login-field${fieldErrors.confirmPassword ? ' has-error' : ''}`}>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="login-input"
                                        placeholder="Confirm Password"
                                    />
                                    <button
                                        type="button"
                                        className="login-eye"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    >
                                        {showConfirmPassword ? (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                        )}
                                    </button>
                                </div>
                                {fieldErrors.confirmPassword && <p className="login-error-text">{fieldErrors.confirmPassword}</p>}
                            </div>

                            <button type="submit" disabled={isLoading} className="login-button">
                                {isLoading ? 'Processing...' : 'Register'}
                            </button>
                        </form>

                        <div className="login-divider">
                            <span>Or continue with</span>
                        </div>

                        <div className="social-login-group">
                            <button type="button" className="social-btn" onClick={() => handleSocialLogin('Google')}><GoogleIcon />Google</button>
                            <button type="button" className="social-btn" onClick={() => handleSocialLogin('Facebook')}><FacebookIcon />Facebook</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}