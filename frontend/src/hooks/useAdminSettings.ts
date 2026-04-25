import { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../constants';

export interface AdminSettings {
  businessDisplayMode: 'category-based' | 'recently-added';
}

const SETTINGS_STORAGE_KEY = 'adminSettings';
const SETTINGS_EVENT_NAME = 'admin-settings-updated';

function persistSettings(settings: AdminSettings) {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(
    new CustomEvent<AdminSettings>(SETTINGS_EVENT_NAME, { detail: settings })
  );
}

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSettings>({
    businessDisplayMode: 'category-based'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/api/admin/settings`);
      if (!res.ok) throw new Error('Failed to fetch admin settings');
      const json = await res.json();
      const nextSettings = {
        businessDisplayMode: json.businessDisplayMode || 'category-based'
      };
      setSettings(nextSettings);
      persistSettings(nextSettings);
    } catch (err: any) {
      setError(err.message || 'Error fetching admin settings');
      // Use default if fetch fails
      const fallbackSettings = { businessDisplayMode: 'category-based' as const };
      setSettings(fallbackSettings);
      persistSettings(fallbackSettings);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cachedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (cachedSettings) {
      try {
        const parsedSettings = JSON.parse(cachedSettings) as AdminSettings;
        setSettings({
          businessDisplayMode:
            parsedSettings.businessDisplayMode || 'category-based'
        });
      } catch {
        localStorage.removeItem(SETTINGS_STORAGE_KEY);
      }
    }

    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    const handleSettingsEvent = (event: Event) => {
      const customEvent = event as CustomEvent<AdminSettings>;
      if (customEvent.detail?.businessDisplayMode) {
        setSettings(customEvent.detail);
      }
    };

    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key !== SETTINGS_STORAGE_KEY || !event.newValue) {
        return;
      }

      try {
        const parsedSettings = JSON.parse(event.newValue) as AdminSettings;
        setSettings({
          businessDisplayMode:
            parsedSettings.businessDisplayMode || 'category-based'
        });
      } catch {
        // Ignore malformed storage payloads.
      }
    };

    window.addEventListener(SETTINGS_EVENT_NAME, handleSettingsEvent as EventListener);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener(
        SETTINGS_EVENT_NAME,
        handleSettingsEvent as EventListener
      );
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  const updateBusinessDisplayMode = async (mode: 'category-based' | 'recently-added'): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You must be logged in to update settings.');
      }

      const res = await fetch(`${API_URL}/api/admin/settings/business-display-mode`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ mode })
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        if (res.status === 401) {
          throw new Error('Unauthorized: Your session may have expired. Please log in again.');
        }
        throw new Error(json.error || `Failed to update display mode (Status: ${res.status})`);
      }

      const json = await res.json();
      const nextSettings = {
        businessDisplayMode: json.businessDisplayMode || 'category-based'
      };
      setSettings(nextSettings);
      persistSettings(nextSettings);
    } catch (err: any) {
      console.error('Display mode update failed:', err);
      throw err;
    }
  };

  return {
    settings,
    loading,
    error,
    refreshSettings: fetchSettings,
    updateBusinessDisplayMode
  };
}
