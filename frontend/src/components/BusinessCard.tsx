import { useState, forwardRef } from 'react';
import {
  Share2,
  MapPin,
  BookOpen,
  Phone,
  Check,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import type { Business } from '../types';
import { getImageUrl } from '../utils/imageUtils';
import { shareBusinessCard } from '../utils/shareUtils';
import { getSafeHttpUrl } from '../utils/urlUtils';
import ImagePreviewModal from './ImagePreviewModal';

interface BusinessCardProps {
  business: Business;
  index: number;
  /** 'grid' = vertical card (Home page), 'list' = horizontal card (Listings page) */
  variant?: 'grid' | 'list';
  /** For shared business highlighting on homepage */
  isHighlighted?: boolean;
  /** Ref for scroll-to functionality */
  ref?: React.Ref<HTMLDivElement>;
  /** Custom ID for business card */
  id?: string;
}

/**
 * Reusable business card component with two layout variants.
 * Includes staggered entrance animation, lazy-loaded images,
 * and accessible action buttons.
 */
const BusinessCard = forwardRef<HTMLDivElement | HTMLElement, BusinessCardProps>(
  (
    {
      business: biz,
      index,
      variant = 'list',
      isHighlighted = false,
      id,
    },
    ref
  ) => {
    const [copied, setCopied] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);

  const imageUrl = getImageUrl(biz.image);
  const mapUrl = getSafeHttpUrl(biz.mapUrl);

  const handleShare = async () => {
    const success = await shareBusinessCard(biz);
    if (success && !navigator.canShare) {
      // Show feedback only for clipboard copy (native share doesn't need it)
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const delayClass = `card-delay-${Math.min(index, 19)}`;
  const renderActions = () => (
    <div className="px-4 pb-4">
      <div className="flex flex-nowrap items-center gap-1.5 border-t border-gray-200 pt-3 justify-start sm:gap-2 sm:justify-end">
        <a
          href={`tel:${biz.phone}`}
          className="inline-flex h-[38px] min-w-0 flex-[0.95] items-center justify-start gap-1 rounded-md bg-red-500 px-2 text-[10px] font-extrabold text-white shadow-sm transition-colors hover:bg-red-600 sm:h-[44px] sm:flex-none sm:justify-center sm:gap-1.5 sm:px-3 sm:text-sm"
          aria-label={`Call ${biz.name}`}
        >
          <Phone className="h-4 w-4 sm:h-4 sm:w-4" />
          <span className="truncate">Call Us</span>
        </a>

        <a
          href={`https://wa.me/${biz.whatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-[38px] min-w-0 flex-[1.15] items-center justify-start gap-1 rounded-md bg-green-500 px-2 text-[10px] font-extrabold text-white shadow-sm transition-colors hover:bg-green-600 sm:h-[44px] sm:flex-none sm:justify-center sm:gap-1.5 sm:px-3 sm:text-sm"
          aria-label={`WhatsApp ${biz.name}`}
        >
          <FaWhatsapp className="h-4 w-4 sm:h-4 sm:w-4" />
          <span className="truncate">WhatsApp</span>
        </a>

        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-[38px] min-w-0 flex-[0.95] items-center justify-start gap-1 rounded-md bg-blue-500 px-2 text-[10px] font-extrabold text-white shadow-sm transition-colors hover:bg-blue-600 sm:h-[44px] sm:flex-none sm:justify-center sm:gap-1.5 sm:px-3 sm:text-sm"
            aria-label={`Open ${biz.name} location on map`}
            title="Open location"
          >
            <MapPin className="h-4 w-4 sm:h-4 sm:w-4" />
            <span className="truncate">Location</span>
          </a>
        )}

        <button
          type="button"
          onClick={handleShare}
          className={`inline-flex h-[38px] w-[32px] shrink-0 items-center justify-center rounded-md transition-colors sm:h-[44px] sm:w-[40px] ${
            copied
              ? 'bg-green-100 text-green-600'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          aria-label={copied ? 'Link copied' : `Share ${biz.name}`}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden text-xs sm:inline">Copied</span>
            </>
          ) : (
            <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </button>
      </div>
    </div>
  );

  if (variant === 'list') {
    return (
      <>
        <article
          id={id}
          ref={ref}
          className={`card-animate ${delayClass} bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col ${
            isHighlighted ? 'ring-2 ring-blue-500 shadow-lg' : ''
          }`}
          aria-label={`${biz.name} — ${biz.category}`}
        >
          {/* FULL WIDTH TITLE at TOP */}
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-lg md:text-xl font-bold text-[var(--color-primary)] m-0 line-clamp-2 leading-tight">
              {biz.name}
            </h3>
          </div>

          {/* FLEX ROW: Image LEFT + Content RIGHT */}
          <div className="flex flex-row gap-4 px-4 pb-2 flex-grow">
            {/* LEFT SIDE: Image (reduced height on mobile) */}
            <div
              className="w-[85px] md:w-[100px] h-[85px] md:h-[100px] bg-gray-100 relative overflow-hidden flex-shrink-0 border border-gray-300 rounded-md cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setShowImageModal(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setShowImageModal(true); }}
              aria-label={`View ${biz.name} image`}
            >
              <img
                src={imageUrl}
                alt={`${biz.name} storefront`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://placehold.co/400x300?text=No+Image';
                }}
              />
            </div>

            {/* RIGHT SIDE: Content (stacked vertically) */}
            <div className="flex flex-col flex-grow min-w-0 justify-between">
              {/* MIDDLE: Category and Address */}
              <div className="space-y-2 flex-grow">
                {/* Category */}
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  <BookOpen className="w-4 h-4 flex-shrink-0 text-[var(--color-text-muted)]" />
                  <span className="line-clamp-1 font-medium">
                    {biz.category}, {biz.sub_category}
                  </span>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                  <MapPin className="w-4 h-4 flex-shrink-0 text-[var(--color-text-muted)] mt-0.5" />
                  <span className="line-clamp-2 leading-relaxed font-medium break-words">
                    {biz.address}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {renderActions()}
        </article>

        {/* Image Preview Modal */}
        <ImagePreviewModal
          isOpen={showImageModal}
          onClose={() => setShowImageModal(false)}
          imageUrl={imageUrl}
          businessName={biz.name}
          category={biz.category}
        />
      </>
    );
  }

  // Grid variant (now matching list layout for homepage consistency)
  return (
    <>
      <article
        id={id}
        ref={ref}
        className={`card-animate ${delayClass} bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col ${
          isHighlighted ? 'ring-2 ring-blue-500 shadow-lg' : ''
        }`}
        aria-label={`${biz.name} — ${biz.category}`}
      >
        {/* FULL WIDTH TITLE at TOP */}
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-lg md:text-xl font-bold text-[var(--color-primary)] m-0 line-clamp-2 leading-tight">
            {biz.name}
          </h3>
        </div>

        {/* FLEX ROW: Image LEFT + Content RIGHT */}
        <div className="flex flex-row gap-4 px-4 pb-2 flex-grow">
          {/* LEFT SIDE: Image (reduced height on mobile) */}
          <div
            className="w-[85px] md:w-[100px] h-[85px] md:h-[100px] bg-gray-100 relative overflow-hidden flex-shrink-0 border border-gray-300 rounded-md cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setShowImageModal(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') setShowImageModal(true); }}
            aria-label={`View ${biz.name} image`}
          >
            <img
              src={imageUrl}
              alt={`${biz.name} storefront`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src =
                  'https://placehold.co/400x300?text=No+Image';
              }}
            />
          </div>

          {/* RIGHT SIDE: Content (stacked vertically) */}
          <div className="flex flex-col flex-grow min-w-0 justify-between">
            {/* MIDDLE: Category and Address */}
            <div className="space-y-2 flex-grow">
              {/* Category */}
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <BookOpen className="w-4 h-4 flex-shrink-0 text-[var(--color-text-muted)]" />
                <span className="line-clamp-1 font-medium">
                  {biz.category}, {biz.sub_category}
                </span>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                <MapPin className="w-4 h-4 flex-shrink-0 text-[var(--color-text-muted)] mt-0.5" />
                <span className="line-clamp-2 leading-relaxed font-medium break-words">
                  {biz.address}
                </span>
              </div>
            </div>
          </div>
        </div>
        {renderActions()}
      </article>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageUrl={imageUrl}
        businessName={biz.name}
        category={biz.category}
      />
    </>
  );
  }
);

BusinessCard.displayName = 'BusinessCard';
export default BusinessCard;
