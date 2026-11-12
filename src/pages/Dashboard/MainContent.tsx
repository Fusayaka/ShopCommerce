import ProductList from './ProductList';
import { type DashboardTab } from './Dashboard';

interface MainContentProps {
    activeTab: DashboardTab;
}

function Placeholder({ title }: { title: string }) {
    return (
        <section className="flex flex-1 flex-col gap-5">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <div className="flex min-h-48 flex-1 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-400">
                Coming soon
            </div>
        </section>
    );
}

export default function MainContent({ activeTab }: MainContentProps) {
    switch (activeTab) {
        case 'product':
            return <ProductList />;
        case 'order':
            return <Placeholder title="Orders" />;
        case 'promotion':
            return <Placeholder title="Promotions" />;
        case 'user':
            return <Placeholder title="Users" />;
        default:
            return null;
    }
}
