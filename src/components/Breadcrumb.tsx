import type { ReactNode } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

interface NavNode {
  label: string;
  parent: string | null;
}

const NAV: Record<string, NavNode> = {
  [ROUTES.HOME]: { label: 'Home', parent: null },
  [ROUTES.PRODUCTS]: { label: 'Product', parent: ROUTES.HOME },
  '/product/:productId': { label: 'Product', parent: ROUTES.PRODUCTS },
  [ROUTES.CART]: { label: 'Cart', parent: ROUTES.HOME },
  [ROUTES.CHECKOUT]: { label: 'Checkout', parent: ROUTES.CART },
  [ROUTES.ORDERS]: { label: 'My Orders', parent: ROUTES.HOME },
};

export interface BreadcrumbProps {
  current?: ReactNode;
  className?: string;
}

const BASE =
  'mb-6 text-left text-sm text-[#666] [&_a]:text-[#666] [&_a]:no-underline [&_a]:transition-colors [&_a:hover]:text-black [&_a:hover]:underline';

function matchNavKey(pathname: string): string | undefined {
  return Object.keys(NAV).find((key) => matchPath(key, pathname));
}

export default function Breadcrumb({ current, className = '' }: BreadcrumbProps) {
  const { pathname } = useLocation();

  const trail: { key: string; label: string }[] = [];
  let key: string | null | undefined = matchNavKey(pathname);
  while (key) {
    const node: NavNode | undefined = NAV[key];
    if (!node) break;
    trail.unshift({ key, label: node.label });
    key = node.parent;
  }

  if (trail.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`${BASE} ${className}`}>
      {trail.map((crumb, index) => {
        const isLast = index === trail.length - 1;
        const label = isLast && current != null ? current : crumb.label;
        return (
          <span key={crumb.key}>
            {isLast ? (
              <span className="font-medium text-black">{label}</span>
            ) : (
              <Link to={crumb.key}>{label}</Link>
            )}
            {!isLast && (
              <span aria-hidden className="mx-1.5 text-xs">
                {'>'}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
