import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Share2,
  MapPin,
  BookOpen,
  Phone,
  MessageCircle,
  ImagePlus,
  Check,
} from 'lucide-react';
import { useBusinesses } from '../hooks/useBusinesses';
import { CITIES, API_URL } from '../constants';
import type { Business, Category } from '../types';
import { useCategories } from '../hooks/useCategories';
import { useAdvertisements } from '../hooks/useAdvertisements';
import { useBanners } from '../hooks/useBanners';
import CategoryMarquee from '../components/CategoryMarquee';
import { getImageUrl } from '../utils/imageUtils';
import { getSharedBusinessId, clearSharedBusinessParam, shareBusinessCard, fetchBusinessById } from '../utils/shareUtils';

/* ─── Inline horizontal card matching the reference design ─── */
function ListingCard({ biz, index, isHighlighted, ref }: { biz: Business; index: number; isHighlighted?: boolean; ref?: React.Ref<HTMLDivElement> }) {
  const imageUrl = getImageUrl(biz.image);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const success = await shareBusinessCard(biz);
    if (success && !navigator.canShare) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const delayClass = `card-delay-${Math.min(index, 19)}`;

  return (
    <div
      ref={ref}
      className={`card-animate ${delayClass} bg-white border border-[var(--color-border)] p-4 flex flex-row gap-4 hover:shadow-md transition-all duration-300 group ${
        isHighlighted ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
    >
      {/* Thumbnail */}
      <div className="w-[88px] h-[100px] md:w-[98px] md:h-[103px] bg-gray-100 relative overflow-hidden flex-shrink-0 border border-gray-100">
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
        <h3 className="text-[18px] font-bold text-[var(--color-primary)] m-0 line-clamp-1 leading-tight">
          {biz.name}
        </h3>

        <div className="mt-1 flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
          <BookOpen className="w-3 h-3 flex-shrink-0 text-[var(--color-text-muted)]" />
          <span className="line-clamp-1 font-medium">
            {biz.category}, {biz.sub_category}
          </span>
        </div>

        <div className="mt-2 flex items-start gap-2.5 text-[13px] text-[var(--color-text-secondary)]">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-[var(--color-text-muted)] mt-0.5" />
          <span className="line-clamp-3 leading-relaxed font-medium break-words">
            {biz.address}
          </span>
        </div>

        <div className="mt-auto pt-0.5 flex flex-wrap items-center gap-1.5">
          <a
            href={`tel:${biz.phone}`}
            className="inline-flex items-center gap-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-[13px] font-bold py-1 px-3 transition-colors"
            aria-label={`Call ${biz.name}`}
          >
            <Phone className="w-3 h-3" />
            Mobile
          </a>
          <a
            href={`https://wa.me/${biz.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-[var(--color-whatsapp)] hover:bg-[var(--color-whatsapp-hover)] text-white text-[13px] font-bold py-1 px-3 transition-colors"
            aria-label={`WhatsApp ${biz.name}`}
          >
            <MessageCircle className="w-3 h-3" />
            Whatsapp
          </a>
          <button
            onClick={handleShare}
            className={`inline-flex items-center gap-1 text-[14px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer ml-1 transition-colors ${
              copied ? 'text-emerald-600' : ''
            }`}
            aria-label={copied ? 'Link copied' : `Share ${biz.name}`}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" /> Copied!
              </>
            ) : (
              <>
                <Share2 className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Fallback banner images (used when a slot has no upload) ─── */
const BANNER_FALLBACKS: Record<string, { src: string; alt: string }> = {
  banner1: { src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80', alt: 'Business meeting' },
  banner2: { src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80', alt: 'Modern office' },
  banner3: { src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80', alt: 'Team collaboration' },
  banner4: { src: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=1600&q=80', alt: 'Professional workspace' },
  banner5: { src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80', alt: 'Business network' },
};

/* ─── Helper function to group businesses by category and sort by category & subcategory serial numbers ─── */
function groupAndSortBusinessesByCategory(
  businesses: Business[],
  categories: Category[]
): { category: Category; businesses: Business[] }[] {
  // Create a map of category names to categories (with serial numbers)
  const categoryMap = new Map(categories.map(cat => [cat.name, cat]));

  // Create a map of subcategory names to their display_order for quick lookup
  const subcategoryOrderMap = new Map<string, number>();
  categories.forEach(cat => {
    if (cat.subcategories) {
      cat.subcategories.forEach(subcat => {
        const key = `${cat.name}::${subcat.name}`; // Compound key to avoid conflicts
        subcategoryOrderMap.set(key, subcat.display_order ?? 999);
      });
    }
  });

  // Group businesses by category
  const grouped = new Map<string, Business[]>();
  businesses.forEach(biz => {
    if (!grouped.has(biz.category)) {
      grouped.set(biz.category, []);
    }
    grouped.get(biz.category)!.push(biz);
  });

  // Convert to array, sort categories by serial number, and sort businesses within each category by subcategory serial number
  const result = Array.from(grouped.entries())
    .map(([categoryName, businessList]) => {
      const category = categoryMap.get(categoryName) || {
        id: 0,
        name: categoryName,
        slug: '',
        display_order: 999, // Default for uncategorized
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Sort businesses within this category by subcategory display_order
      const sortedBusinesses = businessList.sort((a, b) => {
        const keyA = `${a.category}::${a.sub_category}`;
        const keyB = `${b.category}::${b.sub_category}`;
        const orderA = subcategoryOrderMap.get(keyA) ?? 999;
        const orderB = subcategoryOrderMap.get(keyB) ?? 999;
        return orderA - orderB;
      });

      return {
        category,
        businesses: sortedBusinesses,
      };
    })
    .sort((a, b) => {
      const orderA = a.category.display_order ?? 999;
      const orderB = b.category.display_order ?? 999;
      return orderA - orderB;
    });

  return result;
}

export default function Home() {
  // Filter states
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [sharedBusinessId, setSharedBusinessId] = useState<number | null>(null);
  const sharedBusinessRef = useRef<HTMLDivElement>(null);

  const { categories: dynamicCategories } = useCategories();
  const categoryNames = dynamicCategories.map((c) => c.name);
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
  const { banners } = useBanners();

  // Group and sort businesses by category serial number
  const groupedBusinesses = useMemo(
    () => groupAndSortBusinessesByCategory(businesses, dynamicCategories),
    [businesses, dynamicCategories]
  );

  // Build dynamic slide list: merge DB banners with fallbacks
  const bannerSlides = ['banner1', 'banner2', 'banner3', 'banner4', 'banner5'].map((slot) => {
    const db = banners.find(b => b.slot === slot);
    const hasUpload = db?.image_url && db.image_url.trim() !== '';
    const src = hasUpload
      ? getImageUrl(db!.image_url)
      : BANNER_FALLBACKS[slot].src;
    return { src, alt: BANNER_FALLBACKS[slot].alt, link: db?.link_url || null };
  });

  useEffect(() => {
    // Check if a business is being shared
    const bizId = getSharedBusinessId();

    if (bizId) {
      // Fetch the shared business first to verify it exists
      fetchBusinessById(bizId).then((sharedBiz) => {
        if (sharedBiz) {
          // If business found, set it and fetch with high limit to ensure it's included
          setSharedBusinessId(bizId);
          // Fetch page 1 with no filters and high limit (100) to ensure shared business is loaded
          // This ensures the business is in the rendered list for scrolling
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
  }, []);

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
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 4000);
  }, [bannerSlides.length]);

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
        setCurrentSlide((p) => (p + 1) % bannerSlides.length);
      } else {
        setCurrentSlide((p) => (p - 1 + bannerSlides.length) % bannerSlides.length);
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
    <div className="space-y-0 pb-6">
      {/* ─── Banner Carousel ─── */}
      <div
        ref={bannerRef}
        className={`w-full rounded-lg overflow-hidden shadow-sm mt-0 mb-1.5 relative group select-none ${
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
          {bannerSlides.map((img, i) => (
            img.link ? (
              <a key={i} href={img.link} target="_blank" rel="noopener noreferrer" className="w-full flex-shrink-0 block">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-[120px] md:h-[300px] object-cover"
                  draggable={false}
                />
              </a>
            ) : (
              <img
                key={i}
                src={img.src}
                alt={img.alt}
                className="w-full h-[120px] md:h-[300px] object-cover flex-shrink-0"
                draggable={false}
              />
            )
          ))}
        </div>

        {/* Left / Right Arrows */}
        <button
          onClick={(e) => { e.stopPropagation(); goToSlide((currentSlide - 1 + bannerSlides.length) % bannerSlides.length); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); goToSlide((currentSlide + 1) % bannerSlides.length); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {bannerSlides.map((_, i) => (
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
      <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4 mb-1.5">
        {/* Left: Title */}
        <div className="flex-shrink-0">

          <h1 className="text-lg md:text-xl font-extrabold text-[var(--color-text-primary)] tracking-tight leading-tight">
            Explore Business Around Me
          </h1>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            Online business directory and local search platform.
          </p>
        </div>

        {/* Right: Filters inline */}
        <div className="flex flex-row w-full sm:w-auto gap-1.5 sm:gap-2 md:max-w-3xl overflow-x-auto pb-1 sm:pb-0">
          <div className="flex-1 min-w-[80px]">
            <label htmlFor="hero-city" className="sr-only">Select district</label>
            <select
              id="hero-city"
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
            <label htmlFor="hero-category" className="sr-only">Select category</label>
            <select
              id="hero-category"
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
            <label htmlFor="hero-subcategory" className="sr-only">Select sub-category</label>
            <select
              id="hero-subcategory"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] text-[11px] sm:text-sm font-medium focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none block w-full p-2 sm:p-2.5 transition-colors cursor-pointer"
              disabled={
                !!category &&
                (!categoryMap[category] ||
                  categoryMap[category].length === 0)
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
          <button
            onClick={handleSearch}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white p-2 px-3 sm:p-2.5 sm:px-4 flex items-center justify-center shrink-0 transition-colors cursor-pointer rounded-r-none sm:rounded-none"
            aria-label="Search businesses"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* ─── Main Content Area ─── */}
      <div ref={listingsRef} className="grid grid-cols-1 md:grid-cols-4 gap-3">
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

          {/* Business Cards — flat 2-column grid, continuous flow across all categories */}
          {!loading && !error && businesses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Flatten all businesses from all groups into a single array */}
              {groupedBusinesses.flatMap((group) => group.businesses).map((biz, index) => {
                const items = [];

                // Insert inline ad at position 1 (2nd slot, index 1)
                if (index === 1) {
                  const inlineAd = ads.find(a => a.slot === 'inline-ad');
                  const hasImage = inlineAd?.image_url && inlineAd.image_url.trim() !== '';
                  const displayUrl = hasImage && inlineAd?.image_url ? (inlineAd.image_url.startsWith('/uploads') ? `${API_URL}${inlineAd.image_url}` : inlineAd.image_url) : null;

                  if (displayUrl) {
                    items.push(
                      <a
                        key="inline-ad"
                        href={inlineAd?.link_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white border border-[var(--color-border)] overflow-hidden h-[130px] block"
                      >
                        <img
                          src={displayUrl}
                          alt="Advertisement"
                          className="w-full h-full object-cover"
                        />
                      </a>
                    );
                  }
                }

                const isShared = sharedBusinessId === biz.id;
                items.push(
                  <ListingCard
                    key={biz.id}
                    biz={biz}
                    index={index}
                    isHighlighted={isShared}
                    ref={isShared ? sharedBusinessRef : undefined}
                  />
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
        <div className="hidden md:flex flex-col gap-2 md:-mt-11">
          {['ad1', 'ad2', 'ad3'].map((slot, idx) => {
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

      {/* ─── Popular Brands Section ─── */}
      <div className="pt-6">
        <div className="text-center mb-4 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border)]" />
          </div>
          <div className="relative">
            <span className="text-[var(--color-primary)] text-xs font-bold uppercase bg-[var(--color-background-gray)] px-4 tracking-wider">
              Popular Brands
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold mt-2 text-[var(--color-text-primary)]">
            These are our popular brands
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
                className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
