import type { User } from '@/types';
import { type DashboardTab } from './Dashboard';

interface SidebarProps {
    activeTab: DashboardTab;
    onSelectTab: (tab: DashboardTab) => void;
    user: User;
}

const MAIN_ITEMS: { label: string; tab: DashboardTab }[] = [
    { label: 'Product', tab: 'product' },
    { label: 'Order', tab: 'order' },
    { label: 'Promotions', tab: 'promotion' },
];

export default function Sidebar({ activeTab, onSelectTab, user }: SidebarProps) {
    const isAdmin = user.role === 'admin';
    const initial = (user.name?.trim()?.[0] ?? 'U').toUpperCase();

    const renderNavButton = (label: string, tab: DashboardTab) => (
        <button
            key={tab}
            type="button"
            onClick={() => onSelectTab(tab)}
            className={`rounded-lg px-5 py-2.5 text-left text-sm font-medium transition-all border-transparent bg-inherit ${
                activeTab === tab
                    ? 'text-[#6EEEF4] text-base font-bold bg-slate-600'
                    : `
                    text-[#4DCAEA] text-slate-600 text-base
                    hover:font-large hover:font-medium
                    hover:text-slate-600 hover:bg-slate-300
                    `
            }`}
        >
            {label}
        </button>
    );

    return (
        <aside className="flex w-60 shrink-0 flex-col gap-5 rounded-xl bg-[#F5EFEB] p-5 shadow-sm">
            <h2 className="text-sm font-bold tracking-widest text-slate-900">DASHBOARD</h2>

            {/* User info card */}
            <div className="flex items-center gap-3 px-4 py-3">
                {user.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-12 w-12 rounded-xl object-cover"
                    />
                ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">
                        {initial}
                    </div>
                )}
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 text-start pl-2">{user.name}</p>
                    <span className="mt-0.5 inline-block px-2 py-0.5 text-xs font-medium capitalize text-slate-600">
                        {user.role}
                    </span>
                </div>
            </div>

            {/* Main navigation */}
            <nav className="flex flex-col gap-1">
                {MAIN_ITEMS.map((item) => renderNavButton(item.label, item.tab))}
            </nav>

            {/* Admin-only section*/}
            {isAdmin && (
                <div className="flex flex-col gap-1 border-t border-slate-200">
                    {renderNavButton('User', 'user')}
                </div>
            )}
        </aside>
    );
}
