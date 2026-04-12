/**
 * Shared TypeScript interfaces for the SpotNews application.
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
  image: string;
  adId: string;
}

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
