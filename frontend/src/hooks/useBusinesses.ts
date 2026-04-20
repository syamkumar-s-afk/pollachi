/**
 * Custom hook for fetching and paginating businesses.
 * Encapsulates all data-fetching logic in a reusable way,
 * used by both Home.tsx and Listings.tsx.
 */

import { useState, useCallback, useRef } from 'react';
import { fetchBusinesses as apiFetchBusinesses } from '../services/api';
import { ITEMS_PER_PAGE } from '../constants';
import type { Business, ApiError } from '../types';

export interface UseBusinessesOptions {
  city: string;
  category: string;
  subCategory: string;
  sort?: 'asc' | 'desc'; // Optional sort order for businesses by creation date
}

export interface UseBusinessesReturn {
  businesses: Business[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startItem: number;
  endItem: number;
  fetchPage: (page?: number, limit?: number) => Promise<void>;
  goToPage: (page: number) => void;
  retry: () => void;
  listingsRef: React.RefObject<HTMLDivElement | null>;
}

export function useBusinesses(
  options: UseBusinessesOptions
): UseBusinessesReturn {
  const { city, category, subCategory, sort = 'asc' } = options;

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const listingsRef = useRef<HTMLDivElement | null>(null);
  const lastPageRef = useRef(1);

  const fetchPage = useCallback(
    async (page = 1, limit?: number) => {
      setLoading(true);
      setError(null);
      lastPageRef.current = page;

      try {
        const result = await apiFetchBusinesses({
          city,
          category,
          subCategory,
          page,
          limit: limit ?? ITEMS_PER_PAGE,
          sort,
        });

        setBusinesses(result.businesses);
        setTotalItems(result.total);
        setTotalPages(result.totalPages);
        setCurrentPage(result.page);
      } catch (err: unknown) {
        const apiErr = err as ApiError;
        setError(apiErr.message || 'An unexpected error occurred.');
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    },
    [city, category, subCategory, sort]
  );

  const goToPage = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return;
      fetchPage(page);
      listingsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    },
    [fetchPage, totalPages]
  );

  const retry = useCallback(() => {
    fetchPage(lastPageRef.current);
  }, [fetchPage]);

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  return {
    businesses,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    startItem,
    endItem,
    fetchPage,
    goToPage,
    retry,
    listingsRef,
  };
}
