import { Link, useRouterState } from '@tanstack/react-router';
import {
  BarChart3,
  CreditCard,
  GitMerge,
  LayoutDashboard,
  RefreshCw,
  Settings,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Subscriptions', href: '/subscriptions', icon: CreditCard },
  { label: 'Renewals', href: '/renewals', icon: RefreshCw },
  { label: 'Savings', href: '/savings', icon: Sparkles },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Integrations', href: '/integrations', icon: GitMerge },
  { label: 'Team', href: '/team', icon: Users },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <aside className="border-sidebar-border bg-sidebar flex h-screen w-60 flex-col border-r">
      <div className="flex h-16 items-center gap-2 px-6">
        <Shield className="text-sidebar-primary h-6 w-6" />
        <span className="text-sidebar-foreground text-lg font-bold">SaaS Ops</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = currentPath.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-sidebar-border border-t p-4">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
            AC
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sidebar-foreground truncate text-sm font-medium">Acme Corp</p>
            <p className="text-sidebar-foreground/50 truncate text-xs">Free plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
