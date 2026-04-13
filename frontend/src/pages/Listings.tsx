import { useState, useEffect } from 'react';
import {
  SearchX,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Megaphone,
  SlidersHorizontal,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useBusinesses } from '../hooks/useBusinesses';
import { CITIES } from '../constants';
import { useCategories } from '../hooks/useCategories';
import BusinessCard from '../components/BusinessCard';

export default function Listings() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Filter states initialized from URL
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [category, setCategory] = useState(
    searchParams.get('category') || ''
  );
  const [subCategory, setSubCategory] = useState(
    searchParams.get('sub_category') || ''
  );

  const { categories: dynamicCategories } = useCategories();
  const categoryNames = dynamicCategories.map(c => c.name);
  const categoryMap: { [key: string]: string[] } = {};
  dynamicCategories.forEach(c => {
    categoryMap[c.name] = c.subcategories?.map(sc => sc.name) || [];
  });
  const allSubCategories = Array.from(new Set(dynamicCategories.flatMap(c => c.subcategories?.map(sc => sc.name) || [])));

  const {
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
  } = useBusinesses({ city, category, subCategory });

  // Keep state in sync if URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setCity(params.get('city') || '');
    setCategory(params.get('category') || '');
    setSubCategory(params.get('sub_category') || '');
  }, [location.search]);

  // Fetch on mount and when filters change via URL
  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  // Reset sub-category when category changes and it's no longer valid
  useEffect(() => {
    if (
      category &&
      categoryMap[category] &&
      !categoryMap[category].includes(subCategory)
    ) {
      setSubCategory('');
    }
  }, [category]);

  const clearFilters = () => {
    setCity('');
    setCategory('');
    setSubCategory('');
  };

  const activeFilterCount = [city, category, subCategory].filter(Boolean).length;

  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i += 1) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (currentPage > 3) pages.push('...');

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i += 1) pages.push(i);

    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* ─── Title Section ─── */}
      <div
        ref={listingsRef}
        className="bg-gradient-to-r from-white to-gray-50 p-6 md:p-8 shadow-sm border border-[var(--color-border)] rounded-xl"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[var(--color-text-primary)] tracking-tight">
              Business Listings
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] font-medium mt-1.5">
              Filter and find the best local businesses across Tamil Nadu.
            </p>
          </div>
          {!loading && totalItems > 0 && (
            <div
              className="bg-white border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-secondary)] shadow-sm flex-shrink-0"
              aria-live="polite"
            >
              Showing{' '}
              <span className="font-semibold text-[var(--color-text-primary)]">
                {startItem}–{endItem}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-[var(--color-text-primary)]">
                {totalItems}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ─── Filter Bar ─── */}
      <div className="bg-white p-4 shadow-sm border border-[var(--color-border)] rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="w-4 h-4 text-[var(--color-text-muted)]" />
          <span className="text-sm font-semibold text-[var(--color-text-secondary)]">
            Filters
          </span>
          {activeFilterCount > 0 && (
            <span className="text-[10px] font-bold bg-[var(--color-primary)] text-white px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="ml-auto text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-grow">
            <label htmlFor="filter-city" className="sr-only">
              Select district
            </label>
            <select
              id="filter-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm font-medium focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none block w-full p-3 rounded-xl bg-gray-50 hover:bg-white transition-colors cursor-pointer"
            >
              <option value="">All Districts</option>
              {CITIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-grow">
            <label htmlFor="filter-category" className="sr-only">
              Select category
            </label>
            <select
              id="filter-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm font-medium focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none block w-full p-3 rounded-xl bg-gray-50 hover:bg-white transition-colors cursor-pointer"
            >
              <option value="">All Categories</option>
              {categoryNames.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-grow">
            <label htmlFor="filter-subcategory" className="sr-only">
              Select sub-category
            </label>
            <select
              id="filter-subcategory"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm font-medium focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none block w-full p-3 rounded-xl bg-gray-50 hover:bg-white transition-colors disabled:opacity-50 disabled:bg-gray-100 cursor-pointer"
              disabled={
                !!category &&
                (!categoryMap[category] ||
                  categoryMap[category].length === 0)
              }
            >
              <option value="">All Sub-Categories</option>
              {(category && categoryMap[category]
                ? categoryMap[category]
                : [...allSubCategories]
              ).map((sc) => (
                <option key={sc} value={sc}>
                  {sc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ─── Main Content Area ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Listings */}
        <div className="lg:col-span-3" aria-live="polite">
          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-10 text-center">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                Failed to load businesses
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-5 max-w-sm mx-auto">
                {error}
              </p>
              <button
                onClick={retry}
                className="inline-flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          )}

          {loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white p-3 border border-[var(--color-border)] flex flex-row gap-3">
                  <div className="w-[120px] h-[110px] skeleton-shimmer flex-shrink-0" />
                  <div className="flex flex-col flex-grow space-y-2.5 pt-1">
                    <div className="h-5 skeleton-shimmer rounded w-3/4" />
                    <div className="h-3.5 skeleton-shimmer rounded w-1/2" />
                    <div className="h-3.5 skeleton-shimmer rounded w-2/3" />
                    <div className="mt-auto flex gap-2 pt-2">
                      <div className="h-7 skeleton-shimmer rounded w-16" />
                      <div className="h-7 skeleton-shimmer rounded w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && businesses.length === 0 && (
            <div className="bg-white p-12 text-center shadow-sm border border-[var(--color-border)] rounded-xl flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <SearchX className="w-8 h-8 text-[var(--color-text-muted)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                No businesses found
              </h3>
              <p className="text-[var(--color-text-muted)] mb-6 text-sm max-w-sm">
                We couldn&apos;t find anything matching your current filters.
              </p>
              <button
                onClick={clearFilters}
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold py-2.5 px-6 rounded-xl transition-colors text-sm shadow-sm cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}

          {!loading && !error && businesses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {businesses.map((biz, index) => (
                <BusinessCard
                  key={biz.id}
                  business={biz}
                  index={index}
                  variant="list"
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              {getPageNumbers().map((pageNumber, index) =>
                pageNumber === '...' ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-sm font-semibold text-[var(--color-text-muted)]"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`h-10 min-w-10 rounded-xl border px-3 text-sm font-semibold transition-colors cursor-pointer ${currentPage === pageNumber
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-sm'
                        : 'border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                      }`}
                    aria-current={
                      currentPage === pageNumber ? 'page' : undefined
                    }
                  >
                    {pageNumber}
                  </button>
                )
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:flex flex-col gap-4">
          <div className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-[var(--color-primary)] to-red-500 text-white text-[10px] font-bold py-1.5 text-center uppercase tracking-wider">
              Advertisement
            </div>
            <div className="h-[550px] flex flex-col items-center justify-center text-[var(--color-text-muted)] text-sm bg-gradient-to-b from-gray-50 to-white p-6">
              <Megaphone className="w-10 h-10 mb-3 text-gray-300" />
              <p className="font-semibold text-[var(--color-text-secondary)] mb-1">
                Advertise Here
              </p>
              <p className="text-xs text-center leading-relaxed">
                Reach thousands of local customers. Contact us for rates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
