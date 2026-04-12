import { useEffect, useRef, useState } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Megaphone,
  TrendingUp,
  Users,
  Building2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBusinesses } from '../hooks/useBusinesses';
import { CATEGORIES, CITIES } from '../constants';
import BusinessCard from '../components/BusinessCard';

export default function Home() {
  const navigate = useNavigate();

  // Filter states
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');

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

  // Marquee state
  const [isMarqueeDragging, setIsMarqueeDragging] = useState(false);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const marqueeDragRef = useRef({
    active: false,
    moved: false,
    pointerId: -1,
    scrollLeft: 0,
    startX: 0,
  });

  useEffect(() => {
    fetchPage(1);
  }, []);

  const handleSearch = () => {
    fetchPage(1);
  };

  /* ─── Marquee Interaction Handlers ─── */

  const stopMarqueeDrag = (pointerId?: number) => {
    const marquee = marqueeRef.current;
    const dragState = marqueeDragRef.current;
    if (pointerId !== undefined && marquee?.hasPointerCapture(pointerId)) {
      marquee.releasePointerCapture(pointerId);
    }
    dragState.active = false;
    dragState.pointerId = -1;
    setIsMarqueeDragging(false);
  };

  const scrollMarquee = (direction: 'left' | 'right') => {
    const marquee = marqueeRef.current;
    if (!marquee) return;
    marquee.scrollBy({
      left: direction === 'left' ? -250 : 250,
      behavior: 'smooth',
    });
  };

  const handleMarqueeWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const marquee = marqueeRef.current;
    if (!marquee) return;
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      marquee.scrollLeft += event.deltaY;
    }
  };

  const handleMarqueePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const marquee = marqueeRef.current;
    if (!marquee) return;

    marqueeDragRef.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      scrollLeft: marquee.scrollLeft,
      startX: event.clientX,
    };
    marquee.setPointerCapture(event.pointerId);
    setIsMarqueeDragging(true);
  };

  const handleMarqueePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const marquee = marqueeRef.current;
    const dragState = marqueeDragRef.current;
    if (!marquee || !dragState.active) return;

    const deltaX = event.clientX - dragState.startX;
    if (Math.abs(deltaX) > 6) dragState.moved = true;
    marquee.scrollLeft = dragState.scrollLeft - deltaX;
  };

  const handleMarqueePointerUp = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    stopMarqueeDrag(event.pointerId);
  };

  const handleMarqueeClickCapture = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!marqueeDragRef.current.moved) return;
    event.preventDefault();
    event.stopPropagation();
    marqueeDragRef.current.moved = false;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ─── Hero Image ─── */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-xl h-[220px] md:h-[300px] mt-2">
        <img
          src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80"
          alt="Tamil Nadu business landscape"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* ─── Search / Filter Bar ─── */}
      <div className="w-full bg-white p-2.5 md:p-3 rounded-2xl shadow-lg border border-[var(--color-border)] flex flex-col md:flex-row gap-2 md:gap-3 -mt-4">
        <div className="flex-grow relative">
          <label htmlFor="hero-city" className="sr-only">
            Select district
          </label>
          <select
            id="hero-city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border border-[var(--color-border)] bg-gray-50 text-[var(--color-text-secondary)] text-sm font-medium focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none block w-full p-3 rounded-xl transition-colors hover:bg-white cursor-pointer"
          >
            <option value="">All Districts</option>
            {CITIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-grow relative">
          <label htmlFor="hero-category" className="sr-only">
            Select category
          </label>
          <select
            id="hero-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-[var(--color-border)] bg-gray-50 text-[var(--color-text-secondary)] text-sm font-medium focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none block w-full p-3 rounded-xl transition-colors hover:bg-white cursor-pointer"
          >
            <option value="">Category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-grow relative">
          <label htmlFor="hero-subcategory" className="sr-only">
            Select sub-category
          </label>
          <select
            id="hero-subcategory"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="border border-[var(--color-border)] bg-gray-50 text-[var(--color-text-secondary)] text-sm font-medium focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none block w-full p-3 rounded-xl transition-colors hover:bg-white cursor-pointer"
          >
            <option value="">Sub Category</option>
            {[
              'School',
              'College',
              'Restaurant',
              'Cafe',
              'Hospital',
              'Clinic',
              'Pharmacy',
              'Supermarket',
              "Men's Wear",
              "Women's Wear",
              'Electronics',
              'Automotive Repair',
              'Hotels',
              'Vegetable, Milk',
              'Non-veg',
              'Veg',
            ].map((sc) => (
              <option key={sc} value={sc}>
                {sc}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSearch}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center shrink-0 w-full md:w-auto hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
        >
          <Search className="w-5 h-5 mr-2" />
          Search
        </button>
      </div>

      {/* ─── Categories Marquee ─── */}
      <div className="w-full bg-white py-5 border-b border-[var(--color-border)] shadow-sm relative rounded-xl">
        <div className="absolute left-10 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none rounded-l-xl" />
        <div className="absolute right-10 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none rounded-r-xl" />

        <div className="flex items-center gap-1 px-2">
          <button
            onClick={() => scrollMarquee('left')}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-[var(--color-primary)] hover:text-white text-[var(--color-text-muted)] transition-colors shadow-sm border border-[var(--color-border)] cursor-pointer z-20"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={marqueeRef}
            aria-label="Business categories"
            role="region"
            className={`marquee-scroll flex-grow ${
              isMarqueeDragging ? 'is-dragging' : ''
            }`}
            onClickCapture={handleMarqueeClickCapture}
            onPointerCancel={handleMarqueePointerUp}
            onPointerDown={handleMarqueePointerDown}
            onPointerMove={handleMarqueePointerMove}
            onPointerUp={handleMarqueePointerUp}
            onWheel={handleMarqueeWheel}
          >
            <div className="animate-marquee">
              {[1, 2].map((set) => (
                <div key={set} className="flex gap-3 pr-3">
                  {CATEGORIES.map((c) => (
                    <button
                      key={`${set}-${c}`}
                      onClick={() =>
                        navigate(
                          `/listings?category=${encodeURIComponent(c)}`
                        )
                      }
                      className="text-[var(--color-primary)] font-semibold text-sm px-5 py-2 bg-red-50 hover:bg-[var(--color-primary)] hover:text-white rounded-full transition-all border border-red-100 shadow-sm cursor-pointer whitespace-nowrap hover:shadow-md hover:-translate-y-0.5"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => scrollMarquee('right')}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-[var(--color-primary)] hover:text-white text-[var(--color-text-muted)] transition-colors shadow-sm border border-[var(--color-border)] cursor-pointer z-20"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── Listings Section Header ─── */}
      <div
        ref={listingsRef}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2"
      >
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
            Business Listings
          </h2>
          {!loading && !error && totalItems > 0 && (
            <p className="text-sm text-[var(--color-text-muted)] mt-1" aria-live="polite">
              Showing{' '}
              <span className="font-semibold text-[var(--color-text-secondary)]">
                {startItem}–{endItem}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-[var(--color-text-secondary)]">
                {totalItems}
              </span>{' '}
              results
            </p>
          )}
        </div>
      </div>

      {/* ─── Main Content Area ─── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Listings Grid */}
        <div className="md:col-span-3" aria-live="polite">
          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
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

          {/* Loading Skeleton */}
          {loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-[var(--color-border)]"
                  >
                    <div className="h-40 skeleton-shimmer" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 skeleton-shimmer rounded-md w-3/4" />
                      <div className="h-4 skeleton-shimmer rounded-md w-1/2" />
                      <div className="h-4 skeleton-shimmer rounded-md w-full" />
                      <div className="flex gap-2 pt-2">
                        <div className="h-9 skeleton-shimmer rounded-lg w-24" />
                        <div className="h-9 skeleton-shimmer rounded-lg w-24" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && businesses.length === 0 && (
            <div className="md:col-span-2 bg-white p-16 text-center shadow-sm border border-[var(--color-border)] rounded-xl flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-[var(--color-text-muted)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                No businesses found
              </h3>
              <p className="text-[var(--color-text-muted)] text-sm max-w-sm">
                We couldn&apos;t find anything matching your current filters.
                Try adjusting your search criteria.
              </p>
            </div>
          )}

          {/* Business Cards */}
          {!loading && !error && businesses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {businesses.map((biz, index) => (
                <BusinessCard
                  key={biz.id}
                  business={biz}
                  index={index}
                  variant="grid"
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-6">
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
                <span className="text-sm text-[var(--color-text-muted)]">
                  of
                </span>
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
        <div className="hidden md:flex flex-col gap-4">
          {/* Ad Slot */}
          <div className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-[var(--color-primary)] to-red-500 text-white text-[10px] font-bold py-1.5 text-center uppercase tracking-wider">
              Advertisement
            </div>
            <div className="h-[500px] flex flex-col items-center justify-center text-[var(--color-text-muted)] text-sm bg-gradient-to-b from-gray-50 to-white p-6">
              <Megaphone className="w-10 h-10 mb-3 text-gray-300" />
              <p className="font-semibold text-[var(--color-text-secondary)] mb-1">
                Advertise Here
              </p>
              <p className="text-xs text-center leading-relaxed">
                Reach thousands of local customers. Contact us for pricing.
              </p>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white border border-[var(--color-border)] rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
              Directory Stats
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-[var(--color-text-primary)]">
                    {totalItems || '—'}
                  </p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    Listed Businesses
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-[var(--color-text-primary)]">
                    {CATEGORIES.length}
                  </p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    Categories
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-[var(--color-text-primary)]">
                    38
                  </p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    Districts Covered
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Featured Brands Section ─── */}
      <div className="pt-8">
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border)]" />
          </div>
          <div className="relative">
            <span className="text-[var(--color-primary)] text-xs font-bold uppercase bg-[var(--color-background-gray)] px-6 tracking-wider">
              Featured Brands
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mt-4 text-[var(--color-text-primary)]">
            Trusted by top businesses
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-2">
            These premium businesses are part of our growing directory network
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80',
              alt: 'Premium retail brand',
            },
            {
              img: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=600&q=80',
              alt: 'Technology brand',
            },
            {
              img: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&q=80',
              alt: 'Healthcare brand',
            },
          ].map((brand, i) => (
            <div
              key={i}
              className={`card-animate card-delay-${i} rounded-xl overflow-hidden shadow-sm border border-[var(--color-border)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}
            >
              <img
                src={brand.img}
                alt={brand.alt}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
