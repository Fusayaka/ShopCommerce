import './tailwind.css';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { useState } from 'react';
import { useAuth } from '@/utils/auth';
import { Navigate, useLocation } from 'react-router-dom';

export type DashboardTab = 'product' | 'promotion' | 'order' | 'user';

export default function Dashboard() {
    const location = useLocation();
    const from = location.state?.from || '/';

    const [activeTab, setActiveTab] = useState<DashboardTab>('product');
    const { loggedIn, user } = useAuth();

    if (!loggedIn) return <Navigate to="/login" replace />;
    if (user.role === 'customer') return <Navigate to={from} replace />;

    return (
        <div data-dashboard className="flex min-h-[70vh] w-full gap-6 rounded-xl bg-slate-50 p-6 text-slate-800">
            <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} user={user}/>
            <MainContent activeTab={activeTab} />
        </div>
    );
}
