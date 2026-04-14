import { API_URL } from '../constants';

/**
 * Robustly handles image URL generation from various path formats.
 * Supports:
 * - Full URLs (http/https)
 * - Base64 strings (data:)
 * - Local server relative paths (/uploads/...)
 * - Fallbacks for null/undefined paths
 */
export const getImageUrl = (path: string | null | undefined, fallbackText = 'No Image') => {
  if (!path || path.trim() === '') {
    return `https://placehold.co/400x300?text=${encodeURIComponent(fallbackText)}`;
  }

  // If it's already a full URL or base64 data, return as is
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  // If it's a relative path, prefix with API_URL
  // This covers '/uploads/...' and any other relative paths
  if (path.startsWith('/')) {
    return `${API_URL}${path}`;
  }

  // Fallback for non-prefixed relative paths (unlikely in this setup)
  return path;
};
