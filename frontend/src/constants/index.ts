/**
 * Centralized application constants.
 * Single source of truth for cities and other constants used across the application.
 *
 * NOTE: Categories are now managed dynamically via the API (/api/categories)
 * See useCategories hook for fetching and managing categories.
 */

export const CITIES = [
 'கொடுமுடி', 
  'சாலைப்புதூர்',
  'ஒத்தக்கடை',
  'சிவகிரி',
  'தாமரைபாளையம்',
  'ஊஞ்சலூர்'


] as const;

export const ITEMS_PER_PAGE = 11;

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

