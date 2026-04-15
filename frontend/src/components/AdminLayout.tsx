import type { ReactNode } from 'react';
import { useSidebarNav } from '../hooks/useSidebarNav';
import SidebarNav from './SidebarNav';

interface AdminLayoutProps {
  children: ReactNode;
  activeSection: 'businesses' | 'categories' | 'advertisements' | 'banners';
  onSectionChange: (section: 'businesses' | 'categories' | 'advertisements' | 'banners') => void;
  businessesCount?: number;
  categoriesCount?: number;
  onLogout?: () => void;
}

export default function AdminLayout({
  children,
  activeSection,
  onSectionChange,
  businessesCount = 0,
  categoriesCount = 0,
  onLogout,
}: AdminLayoutProps) {
  const { isCollapsed, toggle, isMobile } = useSidebarNav();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sidebar Toggle Button (Mobile) */}
      {isMobile && (
        <div className="md:hidden sticky top-16 z-40 bg-white border-b border-[var(--color-border)] px-4 py-3">
          <button
            onClick={toggle}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-gray-50 transition-colors"
          >
            ☰ {isCollapsed ? 'Show' : 'Hide'} Menu
          </button>
        </div>
      )}

      <div className="flex flex-1">
        {/* Sidebar */}
        <SidebarNav
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          isCollapsed={isCollapsed}
          onToggle={toggle}
          isMobile={isMobile}
          businessesCount={businessesCount}
          categoriesCount={categoriesCount}
          onLogout={onLogout}
        />

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
