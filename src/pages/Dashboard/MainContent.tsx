import ProductList from './ProductList';
import OrderList from './OrderList';
import PromotionList from './PromotionList';
import UserList from './UserList';
import { type DashboardTab } from './Dashboard';

interface MainContentProps {
    activeTab: DashboardTab;
}

export default function MainContent({ activeTab }: MainContentProps) {
    switch (activeTab) {
        case 'product':
            return <ProductList />;
        case 'order':
            return <OrderList />;
        case 'promotion':
            return <PromotionList />;
        case 'user':
            return <UserList />;
        default:
            return null;
    }
}
