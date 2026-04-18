import { useState, useEffect, useRef } from 'react';
import {
  SearchX,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  ImagePlus,
  X,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useBusinesses } from '../hooks/useBusinesses';
import { CITIES, API_URL } from '../constants';
import { useCategories } from '../hooks/useCategories';
import { useAdvertisements } from '../hooks/useAdvertisements';
import BusinessCard from '../components/BusinessCard';
import CategoryMarquee from '../components/CategoryMarquee';
import { getSharedBusinessId, clearSharedBusinessParam, fetchBusinessById } from '../utils/shareUtils';

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
  const [sharedBusinessId, setSharedBusinessId] = useState<number | null>(null);
  const sharedBusinessRef = useRef<HTMLDivElement>(null);

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

  const { ads } = useAdvertisements();

  // Keep state in sync if URL changes and handle shared business
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setCity(params.get('city') || '');
    setCategory(params.get('category') || '');
    setSubCategory(params.get('sub_category') || '');

    // Check if a business is being shared
    const bizId = getSharedBusinessId();
    if (bizId) {
      // Fetch the shared business first to verify it exists
      fetchBusinessById(bizId).then((sharedBiz) => {
        if (sharedBiz) {
          // If business found, set it and fetch with high limit
          setSharedBusinessId(bizId);
          // Fetch page 1 with high limit (100) to ensure shared business is loaded
          fetchPage(1, 100);
        } else {
          // Business not found, just load normally
          console.warn(`Shared business ${bizId} not found`);
          fetchPage(1);
        }
      });
    } else {
      // No shared business, normal load
      fetchPage(1);
    }
  }, [location.search]);

  // Fetch on mount and when filters change directly (not via URL)
  useEffect(() => {
    if (!getSharedBusinessId()) {
      fetchPage(1);
    }
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

  // Scroll to and highlight shared business when loaded
  useEffect(() => {
    if (sharedBusinessId && !loading && sharedBusinessRef.current) {
      const timer = setTimeout(() => {
        sharedBusinessRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Remove the param from URL after handling it
        clearSharedBusinessParam();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [sharedBusinessId, loading]);

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
    <div className="space-y-0 pb-6">
      {/* ─── Category Marquee ─── */}
      <CategoryMarquee />

      {/* ─── Search / Filter Section (matching Home layout) ─── */}
      <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4 mb-1.5">
        {/* Left: Title */}
        <div className="flex-shrink-0">

          <h1 className="text-lg md:text-xl font-extrabold text-[var(--color-text-primary)] tracking-tight leading-tight">
            {category ? `${category} Listings` : 'Business Listings'}
          </h1>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            Filter and find the best local businesses across Tamil Nadu.
          </p>
        </div>

        {/* Right: Filters inline */}
        <div className="flex flex-row w-full sm:w-auto gap-1.5 sm:gap-2 md:max-w-3xl overflow-x-auto pb-1 sm:pb-0">
          <div className="flex-1 min-w-[80px]">
            <label htmlFor="filter-city" className="sr-only">Select district</label>
            <select
              id="filter-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] text-[11px] sm:text-sm font-medium focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none block w-full p-2 sm:p-2.5 transition-colors cursor-pointer"
            >
              <option value="">City</option>
              {CITIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[90px]">
            <label htmlFor="filter-category" className="sr-only">Select category</label>
            <select
              id="filter-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] text-[11px] sm:text-sm font-medium focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none block w-full p-2 sm:p-2.5 transition-colors cursor-pointer"
            >
              <option value="">Category</option>
              {categoryNames.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[95px]">
            <label htmlFor="filter-subcategory" className="sr-only">Select sub-category</label>
            <select
              id="filter-subcategory"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] text-[11px] sm:text-sm font-medium focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none block w-full p-2 sm:p-2.5 transition-colors cursor-pointer disabled:opacity-50 disabled:bg-gray-100"
              disabled={
                !!category &&
                (!categoryMap[category] || categoryMap[category].length === 0)
              }
            >
              <option value="">Sub Category</option>
              {(category && categoryMap[category]
                ? categoryMap[category]
                : [...allSubCategories]
              ).map((sc) => (
                <option key={sc} value={sc}>{sc}</option>
              ))}
            </select>
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="p-2 sm:p-2.5 flex items-center justify-center bg-white hover:bg-red-50 text-[var(--color-text-muted)] hover:text-red-600 border border-[var(--color-border)] hover:border-red-300 transition-colors cursor-pointer flex-shrink-0"
              aria-label="Clear all filters"
              title="Clear all filters"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* ─── Main Content Area ─── */}
      <div ref={listingsRef} className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Listings */}
        <div className="md:col-span-3" aria-live="polite">
          {/* Results count */}
          {!loading && !error && totalItems > 0 && (
            <p className="text-xs text-[var(--color-text-muted)] mb-3">
              Showing <span className="font-semibold text-[var(--color-text-secondary)]">{startItem}–{endItem}</span> of <span className="font-semibold text-[var(--color-text-secondary)]">{totalItems}</span> results
            </p>
          )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {businesses.map((biz, index) => {
                const isShared = sharedBusinessId === biz.id;
                return (
                  <div
                    key={biz.id}
                    ref={isShared ? sharedBusinessRef : undefined}
                    className={isShared ? 'ring-2 ring-blue-500' : ''}
                  >
                    <BusinessCard
                      business={biz}
                      index={index}
                      variant="list"
                    />
                  </div>
                );
              })}
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
        <div className="hidden md:flex flex-col gap-2 md:-mt-11">
          {['listing-ad1', 'listing-ad2', 'listing-ad3'].map((slot, idx) => {
            const adData = ads.find(a => a.slot === slot);
            const hasImage = adData?.image_url && adData.image_url.trim() !== '';
            const displayUrl = hasImage && adData?.image_url ? (adData.image_url.startsWith('/uploads') ? `${API_URL}${adData.image_url}` : adData.image_url) : null;

            return (
              <div
                key={slot}
                className="bg-white border border-[var(--color-border)] overflow-hidden shadow-sm rounded-lg"
              >
                <div className="bg-gradient-to-r from-[var(--color-primary)] to-red-500 text-white text-[10px] font-bold py-1 text-center uppercase tracking-wider relative z-10">
                  Advertisement {idx + 1}
                </div>
                {displayUrl ? (
                  <a href={adData?.link_url || '#'} target="_blank" rel="noopener noreferrer" className="block h-[130px] w-full bg-gray-100">
                    <img src={displayUrl} alt={`Advertisement ${idx + 1}`} className="w-full h-full object-cover" />
                  </a>
                ) : (
                  <div className="h-[130px] flex flex-col items-center justify-center text-[var(--color-text-muted)] text-sm bg-gradient-to-b from-gray-50 to-white p-3 group hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center mb-2.5 transition-colors">
                      <ImagePlus className="w-5 h-5 text-gray-400 group-hover:text-[var(--color-primary)] transition-colors" />
                    </div>
                    <p className="font-semibold text-[var(--color-text-secondary)] text-xs mb-0.5">
                      Ad Space {idx + 1}
                    </p>
                    <p className="text-[11px] text-center leading-relaxed text-[var(--color-text-muted)]">
                      Available for advertisement
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
