
// components/layout/filtered-sidebar.tsx
'use client';
import { useRBAC } from '@/hooks/use-rbac';
import { adminConfig } from '@/config/admin-config';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function FilteredSidebar() {
  const { getAccessibleTabs, loading } = useRBAC();
  const pathname = usePathname();

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  const accessibleTabs = getAccessibleTabs(adminConfig.sidebar.tabs);

  return (
    <aside className="w-64 bg-card border-r border-border h-screen overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-bold text-foreground mb-4">
          {adminConfig.header.logo.text}
        </h2>
        
        <nav className="space-y-1">
          {accessibleTabs.map((tab) => {
            const isActive = pathname === tab.href;
            
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {tab.icon}
                <span className="text-sm font-medium">{tab.label}</span>
                {tab.badge && (
                  <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
