/**
 * Centralized API service.
 * - AbortController with 10s timeout on every request
 * - Typed responses
 * - Structured error handling
 */

import { API_URL } from '../constants';
import type { Business, PaginatedResponse, ApiError } from '../types';

const REQUEST_TIMEOUT_MS = 10_000;

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
    });

    if (!res.ok) {
      const error: ApiError = {
        message: `Request failed: ${res.statusText}`,
        status: res.status,
      };
      throw error;
    }

    return await res.json();
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw { message: 'Request timed out. Please try again.' } as ApiError;
    }
    if ((err as ApiError).status) {
      throw err;
    }
    throw {
      message: 'Network error. Please check your connection.',
    } as ApiError;
  } finally {
    clearTimeout(timeoutId);
  }
}

export interface FetchBusinessesParams {
  city?: string;
  category?: string;
  subCategory?: string;
  page?: number;
  limit?: number;
}

export interface FetchBusinessesResult {
  businesses: Business[];
  total: number;
  totalPages: number;
  page: number;
}

export async function fetchBusinesses(
  params: FetchBusinessesParams
): Promise<FetchBusinessesResult> {
  const { city, category, subCategory, page = 1, limit = 20 } = params;

  const query = new URLSearchParams();
  if (city) query.append('city', city);
  if (category) query.append('category', category);
  if (subCategory) query.append('sub_category', subCategory);
  query.append('page', String(page));
  query.append('limit', String(limit));

  const json = await request<Business[] | PaginatedResponse>(
    `/api/businesses?${query.toString()}`
  );

  // Support both paginated and legacy array responses
  if (Array.isArray(json)) {
    const total = json.length;
    const safeTotalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, safeTotalPages);
    const startIndex = (safePage - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      businesses: json.slice(startIndex, endIndex),
      total,
      totalPages: safeTotalPages,
      page: safePage,
    };
  }

  return {
    businesses: Array.isArray(json.data) ? json.data : [],
    total: typeof json.total === 'number' ? json.total : 0,
    totalPages: Math.max(
      1,
      typeof json.totalPages === 'number' ? json.totalPages : 1
    ),
    page: typeof json.page === 'number' ? json.page : page,
  };
}

export async function loginAdmin(
  username: string,
  password: string
): Promise<{ token: string }> {
  return request('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
}

export async function saveBusiness(
  formData: FormData,
  id: number | null,
  token: string
): Promise<Business> {
  const url = id ? `/api/businesses/${id}` : '/api/businesses';
  const method = id ? 'PUT' : 'POST';

  return request(url, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
}

export async function deleteBusiness(
  id: number,
  token: string
): Promise<void> {
  await request(`/api/businesses/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
