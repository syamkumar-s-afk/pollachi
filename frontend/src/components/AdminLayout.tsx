import type { ReactNode } from 'react';
import type { AdminSection } from '../types';
import { useSidebarNav } from '../hooks/useSidebarNav';
import SidebarNav from './SidebarNav';

interface AdminLayoutProps {
  children: ReactNode;
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  onLogout?: () => void;
  sidebarContent?: ReactNode;
}

export default function AdminLayout({
  children,
  activeSection,
  onSectionChange,
  onLogout,
  sidebarContent,
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
          onLogout={onLogout}
          sidebarContent={sidebarContent}
        />

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
