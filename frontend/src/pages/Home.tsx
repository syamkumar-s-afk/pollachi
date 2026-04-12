import { useEffect, useState, useRef, useCallback } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Megaphone,
  Share2,
  MapPin,
  BookOpen,
  Phone,
  MessageCircle,
  ImagePlus,
} from 'lucide-react';
import { useBusinesses } from '../hooks/useBusinesses';
import { CATEGORIES, CITIES, API_URL } from '../constants';
import type { Business } from '../types';
import CategoryMarquee from '../components/CategoryMarquee';

/* ─── Inline horizontal card matching the reference design ─── */
function ListingCard({ biz, index }: { biz: Business; index: number }) {
  const imageUrl = biz.image?.startsWith('/uploads')
    ? `${API_URL}${biz.image}`
    : biz.image || 'https://placehold.co/400x300?text=No+Image';

  const delayClass = `card-delay-${Math.min(index, 19)}`;

  return (
    <div
      className={`card-animate ${delayClass} bg-white border border-[var(--color-border)] p-3 flex flex-row gap-3 hover:shadow-md transition-all duration-300 group`}
    >
      {/* Thumbnail */}
      <div className="w-[100px] h-[100px] md:w-[120px] md:h-[110px] bg-gray-100 relative overflow-hidden flex-shrink-0 border border-gray-100">
        <img
          src={imageUrl}
          alt={biz.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/400x300?text=No+Image';
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-[15px] font-bold text-[var(--color-primary)] m-0 line-clamp-1 leading-tight">
            {biz.name}
          </h3>
          <span className="text-[10px] text-[var(--color-text-muted)] font-bold flex-shrink-0 tracking-wider pt-0.5">
            {biz.adId || '#AdSR001'}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[var(--color-text-secondary)]">
          <BookOpen className="w-3.5 h-3.5 flex-shrink-0 text-[var(--color-text-muted)]" />
          <span className="line-clamp-1 font-medium">
            {biz.category}, {biz.sub_category}
          </span>
        </div>

        <div className="mt-1 flex items-start gap-1.5 text-[11px] text-[var(--color-text-secondary)]">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-[var(--color-text-muted)] mt-[1px]" />
          <span className="line-clamp-2 leading-snug font-medium">
            {biz.address}, {biz.city}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-2 flex flex-wrap items-center gap-2">
          <a
            href={`tel:${biz.phone}`}
            className="inline-flex items-center gap-1.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-[11px] font-bold py-1.5 px-4 transition-colors"
            aria-label={`Call ${biz.name}`}
          >
            <Phone className="w-3 h-3" />
            Mobile
          </a>
          <a
            href={`https://wa.me/${biz.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[var(--color-whatsapp)] hover:bg-[var(--color-whatsapp-hover)] text-white text-[11px] font-bold py-1.5 px-4 transition-colors"
            aria-label={`WhatsApp ${biz.name}`}
          >
            <MessageCircle className="w-3 h-3" />
            Whatsapp
          </a>
          <button
            className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer ml-1"
            aria-label={`Share ${biz.name}`}
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Banner images for the top carousel ─── */
const BANNER_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80', alt: 'Business meeting' },
  { src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80', alt: 'Modern office' },
  { src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80', alt: 'Team collaboration' },
  { src: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=1600&q=80', alt: 'Professional workspace' },
];

export default function Home() {
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

  useEffect(() => {
    fetchPage(1);
  }, []);

  const handleSearch = () => {
    fetchPage(1);
  };

  /* ─── Banner Carousel State ─── */
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bannerDragging, setBannerDragging] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const bannerStartX = useRef(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 4000);
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [startAutoPlay]);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
    startAutoPlay();
  };

  const handleBannerMouseDown = (e: React.MouseEvent) => {
    setBannerDragging(true);
    bannerStartX.current = e.clientX;
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  const handleBannerMouseUp = (e: React.MouseEvent) => {
    if (!bannerDragging) return;
    setBannerDragging(false);
    const diff = e.clientX - bannerStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        setCurrentSlide((p) => (p + 1) % BANNER_IMAGES.length);
      } else {
        setCurrentSlide((p) => (p - 1 + BANNER_IMAGES.length) % BANNER_IMAGES.length);
      }
    }
    startAutoPlay();
  };

  const handleBannerMouseLeave = () => {
    if (bannerDragging) {
      setBannerDragging(false);
      startAutoPlay();
    }
  };

  return (
    <div className="space-y-0 pb-12">
      {/* ─── Banner Carousel ─── */}
      <div
        ref={bannerRef}
        className={`w-full rounded-lg overflow-hidden shadow-sm mt-2 mb-6 relative group select-none ${
          bannerDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={handleBannerMouseDown}
        onMouseUp={handleBannerMouseUp}
        onMouseLeave={handleBannerMouseLeave}
      >
        {/* Slides */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {BANNER_IMAGES.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt={img.alt}
              className="w-full h-[160px] md:h-[220px] object-cover flex-shrink-0"
              draggable={false}
            />
          ))}
        </div>

        {/* Left / Right Arrows */}
        <button
          onClick={(e) => { e.stopPropagation(); goToSlide((currentSlide - 1 + BANNER_IMAGES.length) % BANNER_IMAGES.length); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); goToSlide((currentSlide + 1) % BANNER_IMAGES.length); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {BANNER_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); goToSlide(i); }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentSlide
                  ? 'w-6 bg-white shadow-md'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ─── Category Marquee ─── */}
      <CategoryMarquee />

      {/* ─── Search / Filter Section (matching reference) ─── */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 mb-6">
        {/* Left: Title */}
        <div className="flex-shrink-0">
          <p className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-wide mb-0.5">
            Popular Businesses
          </p>
          <h1 className="text-xl md:text-2xl font-extrabold text-[var(--color-text-primary)] tracking-tight leading-tight">
            Explore Business Around Me
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Online business directory and local search platform.
          </p>
        </div>

        {/* Right: Filters inline */}
        <div className="flex flex-col sm:flex-row gap-2 flex-grow">
          <div className="flex-grow">
            <label htmlFor="hero-city" className="sr-only">Select district</label>
            <select
              id="hero-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] text-sm font-medium focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none block w-full p-2.5 transition-colors cursor-pointer"
            >
              <option value="">City</option>
              {CITIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="flex-grow">
            <label htmlFor="hero-category" className="sr-only">Select category</label>
            <select
              id="hero-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] text-sm font-medium focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none block w-full p-2.5 transition-colors cursor-pointer"
            >
              <option value="">Category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex-grow">
            <label htmlFor="hero-subcategory" className="sr-only">Select sub-category</label>
            <select
              id="hero-subcategory"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] text-sm font-medium focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none block w-full p-2.5 transition-colors cursor-pointer"
            >
              <option value="">Sub Category</option>
              {['School', 'College', 'Restaurant', 'Cafe', 'Hospital', 'Clinic', 'Pharmacy', 'Supermarket', "Men's Wear", "Women's Wear", 'Electronics', 'Automotive Repair', 'Hotels', 'Vegetable, Milk', 'Non-veg', 'Veg'].map((sc) => (
                <option key={sc} value={sc}>{sc}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white p-2.5 px-4 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            aria-label="Search businesses"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ─── Main Content Area ─── */}
      <div ref={listingsRef} className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Listings — 2 columns */}
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
            <div className="md:col-span-2 bg-white p-16 text-center border border-[var(--color-border)] flex flex-col items-center justify-center">
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

          {/* Results count */}
          {!loading && !error && totalItems > 0 && (
            <p className="text-xs text-[var(--color-text-muted)] mb-3">
              Showing <span className="font-semibold text-[var(--color-text-secondary)]">{startItem}–{endItem}</span> of <span className="font-semibold text-[var(--color-text-secondary)]">{totalItems}</span> results
            </p>
          )}

          {/* Business Cards — horizontal list layout with ad in 2nd slot */}
          {!loading && !error && businesses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {businesses.map((biz, index) => {
                const items = [];

                {/* Insert ad banner in the 2nd slot (index 1) */}
                if (index === 1) {
                  items.push(
                    <div
                      key="inline-ad"
                      className="bg-white border border-[var(--color-border)] overflow-hidden h-[130px]"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=600&q=80"
                        alt="Advertisement"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                }

                items.push(
                  <ListingCard key={biz.id} biz={biz} index={index} />
                );

                return items;
              })}
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

        {/* Sidebar — 3 Ad Slots */}
        <div className="hidden md:flex flex-col gap-4">
          {[1, 2, 3].map((slot) => (
            <div
              key={slot}
              className="bg-white border border-[var(--color-border)] overflow-hidden shadow-sm rounded-lg"
            >
              <div className="bg-gradient-to-r from-[var(--color-primary)] to-red-500 text-white text-[10px] font-bold py-1 text-center uppercase tracking-wider">
                Advertisement {slot}
              </div>
              <div className="h-[180px] flex flex-col items-center justify-center text-[var(--color-text-muted)] text-sm bg-gradient-to-b from-gray-50 to-white p-4 group hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center mb-2.5 transition-colors">
                  <ImagePlus className="w-5 h-5 text-gray-400 group-hover:text-[var(--color-primary)] transition-colors" />
                </div>
                <p className="font-semibold text-[var(--color-text-secondary)] text-xs mb-0.5">
                  Ad Space {slot}
                </p>
                <p className="text-[11px] text-center leading-relaxed text-[var(--color-text-muted)]">
                  Upload your ad image
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Popular Brands Section ─── */}
      <div className="pt-10">
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border)]" />
          </div>
          <div className="relative">
            <span className="text-[var(--color-primary)] text-sm font-bold uppercase bg-[var(--color-background-gray)] px-6 tracking-wider">
              Popular Brands
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mt-4 text-[var(--color-text-primary)]">
            These are our popular brands
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80', alt: 'Brand 1' },
            { img: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=600&q=80', alt: 'Brand 2' },
            { img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80', alt: 'Brand 3' },
          ].map((brand, i) => (
            <div
              key={i}
              className={`card-animate card-delay-${i} overflow-hidden shadow-sm border border-[var(--color-border)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}
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
