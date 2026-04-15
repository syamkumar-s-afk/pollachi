import { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../constants';

export interface Advertisement {
  id: number;
  slot: string; // 'ad1', 'ad2', 'ad3'
  image_url: string | null;
  link_url: string | null;
  updated_at: string;
}

export function useAdvertisements() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/api/advertisements`);
      if (!res.ok) throw new Error('Failed to fetch advertisements');
      const json = await res.json();
      setAds(json.data || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching advertisements');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const updateAd = async (slot: string, formData: FormData): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You must be logged in to update advertisements.');
      }

      const res = await fetch(`${API_URL}/api/advertisements/${slot}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        if (res.status === 401) {
          throw new Error('Unauthorized: Your session may have expired. Please log in again.');
        }
        throw new Error(json.error || `Failed to update advertisement (Status: ${res.status})`);
      }
      await fetchAds();
    } catch (err: any) {
      console.error('Advertisement update failed:', err);
      throw err;
    }
  };

  return { ads, loading, error, refreshAds: fetchAds, updateAd };
}
