import { useState, useEffect } from 'react';
import {
  SearchX,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  ImagePlus,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useBusinesses } from '../hooks/useBusinesses';
import { API_URL } from '../constants';
import { useCategories } from '../hooks/useCategories';
import { useAdvertisements } from '../hooks/useAdvertisements';
import BusinessCard from '../components/BusinessCard';
import CategoryMarquee from '../components/CategoryMarquee';
import BusinessFilters from '../components/BusinessFilters';
import type { Business } from '../types';
import { getSharedBusinessId, clearSharedBusinessParam, fetchBusinessById } from '../utils/shareUtils';
import { getSafeHttpUrl } from '../utils/urlUtils';

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
  const [sharedBusiness, setSharedBusiness] = useState<Business | null>(null);

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
          setSharedBusiness(sharedBiz);
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

  let finalBusinesses = [...businesses];
  if (sharedBusiness && !finalBusinesses.some(b => b.id === sharedBusiness.id)) {
    finalBusinesses = [sharedBusiness, ...finalBusinesses];
  }

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
    if (sharedBusinessId && !loading) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`business-card-${sharedBusinessId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Remove the param from URL after handling it
          clearSharedBusinessParam();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [sharedBusinessId, loading, finalBusinesses]);

  const clearFilters = () => {
    setCity('');
    setCategory('');
    setSubCategory('');
  };

  const activeFilterCount = [city, category, subCategory].filter(Boolean).length;

  const handleSearch = () => {
    fetchPage(1);
    listingsRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="space-y-0 pb-6">
      {/* ─── Category Marquee ─── */}
      <CategoryMarquee />

      {/* ─── Search / Filter Section (matching Home layout) ─── */}
      <div className="mb-5 grid gap-4 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:items-end">
        {/* Left: Title */}
        <div className="space-y-1">

          <h1 className="text-lg md:text-xl font-extrabold text-[var(--color-text-primary)] tracking-tight leading-tight">
            {category ? `${category} Listings` : 'Business Listings'}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Filter and find the best local businesses across Tamil Nadu.
          </p>
        </div>

        <BusinessFilters
          city={city}
          category={category}
          subCategory={subCategory}
          categoryNames={categoryNames}
          categoryMap={categoryMap}
          allSubCategories={allSubCategories}
          onCityChange={setCity}
          onCategoryChange={setCategory}
          onSubCategoryChange={setSubCategory}
          onSearch={handleSearch}
          onClear={clearFilters}
          showClearButton={activeFilterCount > 0}
        />
      </div>

      {/* ─── Main Content Area ─── */}
      <div ref={listingsRef} className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        {/* Listings */}
        <div className="min-w-0" aria-live="polite">
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
          {!loading && !error && finalBusinesses.length === 0 && (
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

          {!loading && !error && finalBusinesses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {finalBusinesses.map((biz, index) => {
                const isShared = sharedBusinessId === biz.id;
                return (
                  <div
                    key={biz.id}
                    id={`business-card-${biz.id}`}
                    className={isShared ? 'ring-2 ring-blue-500 shadow-lg' : ''}
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
            <div className="mt-3 md:mt-8 flex items-center justify-center gap-6">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-12 w-12 flex items-center justify-center rounded-full bg-white border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[var(--color-text-secondary)] disabled:hover:border-[var(--color-border)] transition-all duration-200 shadow-sm cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Page {currentPage}
                </span>
                <span className="text-sm text-[var(--color-text-muted)]">of</span>
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {totalPages}
                </span>
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-12 w-12 flex items-center justify-center rounded-full bg-white border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[var(--color-text-secondary)] disabled:hover:border-[var(--color-border)] transition-all duration-200 shadow-sm cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden self-start lg:sticky lg:top-24 lg:flex lg:flex-col lg:gap-3">
          {['listing-ad1', 'listing-ad2', 'listing-ad3'].map((slot, idx) => {
            const adData = ads.find(a => a.slot === slot);
            const hasImage = adData?.image_url && adData.image_url.trim() !== '';
            const displayUrl = hasImage && adData?.image_url ? (adData.image_url.startsWith('/uploads') ? `${API_URL}${adData.image_url}` : adData.image_url) : null;
            const linkUrl = getSafeHttpUrl(adData?.link_url);

            return (
              <div
                key={slot}
                className="bg-white border border-[var(--color-border)] overflow-hidden shadow-sm rounded-lg"
              >
                <div className="bg-gradient-to-r from-[var(--color-primary)] to-red-500 text-white text-[10px] font-bold py-1 text-center uppercase tracking-wider relative z-10">
                  Advertisement {idx + 1}
                </div>
                {displayUrl ? (
                  <a href={linkUrl || '#'} target="_blank" rel="noopener noreferrer" className="block h-[130px] w-full bg-gray-100">
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
