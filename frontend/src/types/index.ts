/**
 * Shared TypeScript interfaces for the KodumudiNews application.
 */

export interface Business {
  id: number;
  name: string;
  category: string;
  sub_category: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  mapUrl?: string | null;
  image: string;
  adId: string | null;
  created_at?: string;
}

export type AdminSection =
  | 'add-business'
  | 'all-businesses'
  | 'categories'
  | 'advertisements'
  | 'banners';

export interface PaginatedResponse {
  data: Business[];
  total: number;
  totalPages: number;
  page: number;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface Subcategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  display_order?: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  display_order?: number;
  is_priority?: boolean;
  created_at: string;
  updated_at: string;
  subcategories?: Subcategory[];
}

export interface CategoriesResponse {
  data: (Category & { subcategories: Subcategory[] })[];
  total: number;
}

