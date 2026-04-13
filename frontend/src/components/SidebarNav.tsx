import { Plus, FolderOpen, Image as ImageIcon, LayoutPanelLeft } from 'lucide-react';

interface SidebarNavProps {
  activeSection: 'businesses' | 'categories' | 'advertisements' | 'banners';
  onSectionChange: (section: 'businesses' | 'categories' | 'advertisements' | 'banners') => void;
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

export default function SidebarNav({
  activeSection,
  onSectionChange,
  isCollapsed,
  onToggle,
  isMobile,
}: SidebarNavProps) {
  const handleNavClick = (section: 'businesses' | 'categories' | 'advertisements' | 'banners') => {
    onSectionChange(section);
    if (isMobile && !isCollapsed) {
      onToggle();
    }
  };

  // Hide sidebar on mobile when collapsed (for overlay effect)
  if (isMobile && isCollapsed) {
    return null;
  }

  const sidebarWidth = isMobile ? 'w-full' : isCollapsed ? 'w-20' : 'w-64';
  const sidebarClasses = `
    ${sidebarWidth}
    bg-white
    border-r border-[var(--color-border)]
    shadow-sm
    transition-all duration-200 ease-in-out
    flex flex-col
    ${isMobile ? 'fixed top-0 left-0 h-screen z-50' : 'relative'}
  `;

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      <aside className={sidebarClasses}>
        {/* Header */}
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
          {!isCollapsed && <span className="font-bold text-[var(--color-text-primary)]">Admin</span>}
          {isMobile && (
            <button
              onClick={onToggle}
              className="ml-auto text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-2">
          {/* New Business */}
          <button
            onClick={() => handleNavClick('businesses')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm transition-colors ${
              activeSection === 'businesses'
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:bg-gray-100'
            }`}
          >
            <Plus className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>New Business</span>}
          </button>

          {/* Category Management */}
          <button
            onClick={() => handleNavClick('categories')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm transition-colors ${
              activeSection === 'categories'
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:bg-gray-100'
            }`}
          >
            <FolderOpen className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Category Management</span>}
          </button>

          {/* Advertisements */}
          <button
            onClick={() => handleNavClick('advertisements')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm transition-colors ${
              activeSection === 'advertisements'
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:bg-gray-100'
            }`}
          >
            <ImageIcon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Advertisements</span>}
          </button>

          {/* Banners */}
          <button
            onClick={() => handleNavClick('banners')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm transition-colors ${
              activeSection === 'banners'
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:bg-gray-100'
            }`}
          >
            <LayoutPanelLeft className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Banners</span>}
          </button>
        </nav>

        {/* Toggle Button (Desktop only) */}
        {!isMobile && (
          <div className="border-t border-[var(--color-border)] p-3">
            <button
              onClick={onToggle}
              className="w-full flex items-center justify-center px-3 py-2 rounded-xl text-xs font-semibold text-[var(--color-text-muted)] hover:bg-gray-100 transition-colors"
              title={isCollapsed ? 'Expand' : 'Collapse'}
            >
              {isCollapsed ? '→' : '←'}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
