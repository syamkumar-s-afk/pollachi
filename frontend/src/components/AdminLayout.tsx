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
        <div className="md:hidden sticky top-12 z-40 border-b border-[var(--color-border)] bg-white px-2 py-2">
          <button
            onClick={toggle}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 text-xs font-bold text-[var(--color-text-secondary)] transition-colors hover:bg-gray-50"
          >
            Menu
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
        <main className="flex-1 max-w-7xl mx-auto w-full px-2 py-3 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
