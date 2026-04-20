import { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../constants';

export interface AdminSettings {
  businessDisplayMode: 'category-based' | 'recently-added';
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
      setSettings({
        businessDisplayMode: json.businessDisplayMode || 'category-based'
      });
    } catch (err: any) {
      setError(err.message || 'Error fetching admin settings');
      // Use default if fetch fails
      setSettings({ businessDisplayMode: 'category-based' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

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
      setSettings({
        businessDisplayMode: json.businessDisplayMode || 'category-based'
      });
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
