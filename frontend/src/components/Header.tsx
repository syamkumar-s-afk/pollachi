import { Link, useLocation } from 'react-router-dom';
import { Menu, PlusCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const tabs = [
    { name: 'Home', id: '1', path: '/' },
    { name: 'Listings', id: '2', path: '/listings' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white border-b border-[var(--color-border)] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-12 md:h-14">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:bg-[var(--color-primary-hover)] transition-colors group-hover:shadow-md">
                KN
              </div>
              <span className="font-extrabold text-xl md:text-2xl tracking-tight text-[var(--color-text-primary)]">
                Kodumudi
                <span className="text-[var(--color-primary)]">News</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            <div className="flex gap-0.5">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`px-3 py-1 font-semibold transition-all rounded text-xs ${isActive(tab.path)
                    ? 'text-[var(--color-primary)] bg-red-50'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-red-50/50'
                    }`}
                  aria-current={isActive(tab.path) ? 'page' : undefined}
                >
                  {tab.name}
                </Link>
              ))}
            </div>

            <div className="h-6 w-px bg-[var(--color-border)] mx-3" />

            <Link
              to="/add-business"
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 hover:-translate-y-0.5 hover:shadow-md"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Business
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center">
            <button
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav
          id="mobile-menu"
          className="lg:hidden border-t border-[var(--color-border)] bg-white menu-slide-enter"
          aria-label="Mobile navigation"
        >
          <div className="px-4 pt-2 pb-4 space-y-1">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${isActive(tab.path)
                  ? 'text-[var(--color-primary)] bg-red-50'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-red-50/50'
                  }`}
                aria-current={isActive(tab.path) ? 'page' : undefined}
              >
                {tab.name}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-[var(--color-border-light)]">
              <Link
                to="/add-business"
                onClick={() => setIsMenuOpen(false)}
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-3 rounded-xl text-base font-bold shadow-sm transition-all flex items-center justify-center gap-2 w-full mt-2"
              >
                <PlusCircle className="w-5 h-5" /> Add Business
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
