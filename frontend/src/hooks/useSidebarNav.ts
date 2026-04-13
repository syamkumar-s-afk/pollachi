import { useState, useCallback, useEffect } from 'react';

export interface UseSidebarNav {
  isCollapsed: boolean;
  toggle: () => void;
  isMobile: boolean;
}

const STORAGE_KEY = 'admin-sidebar-collapsed';

export function useSidebarNav(): UseSidebarNav {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768; // md breakpoint
    }
    return false;
  });

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return true;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore
    }
    return false;
  });

  // Handle window resize to detect mobile/desktop
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile((prev) => {
        if (mobile && !prev) {
          setIsCollapsed(true);
        }
        return mobile;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggle = useCallback(() => {
    setIsCollapsed((prev: boolean) => {
      const newValue = !prev;
      if (typeof window !== 'undefined' && window.innerWidth >= 768) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
        } catch {
          // ignore
        }
      }
      return newValue;
    });
  }, []);

  return {
    isCollapsed,
    toggle,
    isMobile,
  };
}
