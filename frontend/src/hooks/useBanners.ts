import { useState, useEffect } from 'react';
import { API_URL } from '../constants';

export interface Banner {
  id: number;
  slot: string;
  image_url: string | null;
  link_url: string | null;
  updated_at: string;
}

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBanners = async () => {
    try {
      const res = await fetch(`${API_URL}/api/banners`);
      const json = await res.json();
      if (json.data) setBanners(json.data);
    } catch (e) {
      // fail silently — fallback images handled in component
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const updateBanner = async (slot: string, formData: FormData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You must be logged in to update banners.');
      }

      const res = await fetch(`${API_URL}/api/banners/${slot}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        if (res.status === 401) {
          throw new Error('Unauthorized: Your session may have expired. Please log in again.');
        }
        throw new Error(json.error || `Failed to update banner (Status: ${res.status})`);
      }

      await fetchBanners();
    } catch (err: any) {
      console.error('Banner update failed:', err);
      throw err;
    }
  };

  return { banners, loading, updateBanner, refetch: fetchBanners };
}
