import { useState } from 'react';
import type { ReactNode } from 'react';
import type { AdminSection } from '../types';
import {
  Briefcase,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Image as ImageIcon,
  LayoutPanelLeft,
  List,
  LogOut,
  Megaphone,
  Plus,
  X,
} from 'lucide-react';

interface SidebarNavProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
  onLogout?: () => void;
  sidebarContent?: ReactNode;
}

const navItemClassName =
  'w-full rounded-lg text-sm font-semibold transition-colors';

export default function SidebarNav({
  activeSection,
  onSectionChange,
  isCollapsed,
  onToggle,
  isMobile,
  onLogout,
  sidebarContent,
}: SidebarNavProps) {
  const [isBusinessMenuOpen, setIsBusinessMenuOpen] = useState(true);

  const isBusinessSection =
    activeSection === 'add-business' || activeSection === 'all-businesses';

  const handleNavClick = (section: AdminSection) => {
    onSectionChange(section);
    if (section === 'add-business' || section === 'all-businesses') {
      setIsBusinessMenuOpen(true);
    }

    if (isMobile && !isCollapsed) {
      onToggle();
    }
  };

  if (isMobile && isCollapsed) {
    return null;
  }

  const sidebarWidth = isMobile ? 'w-full' : isCollapsed ? 'w-20' : 'w-72';
  const sidebarClasses = `
    ${sidebarWidth}
    bg-white
    border-r border-[var(--color-border)]
    shadow-sm
    transition-all duration-200 ease-in-out
    flex flex-col
    overflow-y-auto
    ${isMobile ? 'fixed top-0 left-0 h-screen z-50' : 'relative'}
  `;

  const renderNavButton = (
    section: AdminSection,
    label: string,
    icon: ReactNode,
    options?: {
      nested?: boolean;
      active?: boolean;
    }
  ) => {
    const isActive = options?.active ?? activeSection === section;
    const isNested = options?.nested ?? false;

    return (
      <button
        type="button"
        onClick={() => handleNavClick(section)}
        className={`${navItemClassName} flex items-center gap-3 px-3 py-2.5 sm:py-3 ${
          isNested ? 'ml-2' : ''
        } ${
          isActive
            ? 'bg-[var(--color-primary)] text-white shadow-sm'
            : 'text-[var(--color-text-secondary)] hover:bg-gray-100'
        }`}
      >
        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
          {icon}
        </span>
        {!isCollapsed && <span className="truncate">{label}</span>}
      </button>
    );
  };

  return (
    <>
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={onToggle}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex items-center justify-between border-b border-[var(--color-border)] p-3 sm:p-4">
          {!isCollapsed && (
            <span className="font-bold text-[var(--color-text-primary)]">
              Admin
            </span>
          )}
          {isMobile && (
            <button
              type="button"
              onClick={onToggle}
              className="ml-auto rounded-lg p-1 text-[var(--color-text-muted)] transition-colors hover:bg-gray-100 hover:text-[var(--color-text-primary)]"
              aria-label="Close admin menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 space-y-1.5 p-2 sm:space-y-2 sm:p-3">
          {isCollapsed ? (
            <>
              {renderNavButton('add-business', 'Add Business', <Plus className="h-5 w-5" />)}
              {renderNavButton('all-businesses', 'All Businesses', <List className="h-5 w-5" />)}
            </>
          ) : (
            <div className="rounded-xl border border-[var(--color-border)] bg-gray-50/70 p-1.5 sm:rounded-2xl sm:p-2">
              <button
                type="button"
                onClick={() => setIsBusinessMenuOpen((current) => !current)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors sm:rounded-xl sm:py-3 ${
                  isBusinessSection
                    ? 'bg-white text-[var(--color-text-primary)] shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold leading-tight">Businesses</p>
                    <p className="text-[11px] text-[var(--color-text-muted)] sm:text-xs">
                      Add and browse listings
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-[var(--color-text-muted)] transition-transform ${
                    isBusinessMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isBusinessMenuOpen && (
                <div className="mt-1.5 space-y-1.5 sm:mt-2 sm:space-y-2">
                  {renderNavButton('add-business', 'Add Business', <Plus className="h-4 w-4" />, {
                    nested: true,
                  })}
                  {renderNavButton(
                    'all-businesses',
                    'All Businesses',
                    <List className="h-4 w-4" />,
                    {
                      nested: true,
                    }
                  )}
                </div>
              )}
            </div>
          )}

          {renderNavButton('categories', 'Category Management', <FolderOpen className="h-5 w-5" />)}
          {renderNavButton('advertisements', 'Advertisements', <ImageIcon className="h-5 w-5" />)}
          {renderNavButton('banners', 'Banners', <LayoutPanelLeft className="h-5 w-5" />)}
          {renderNavButton('popup-ad', 'Popup Ad', <Megaphone className="h-5 w-5" />)}
        </nav>

        {!isCollapsed && sidebarContent && (
          <div className="border-t border-[var(--color-border)] px-3 py-3">
            {sidebarContent}
          </div>
        )}

        <div className="space-y-2 border-t border-[var(--color-border)] p-2 sm:space-y-3 sm:p-3">
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)] transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          )}
        </div>

        {!isMobile && (
          <div className="border-t border-[var(--color-border)] p-3">
            <button
              type="button"
              onClick={onToggle}
              className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[var(--color-text-muted)] transition-colors hover:bg-gray-100"
              title={isCollapsed ? 'Expand' : 'Collapse'}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
              {!isCollapsed && <span>Collapse</span>}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
