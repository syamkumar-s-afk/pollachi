import { useState, forwardRef } from 'react';
import {
  Share2,
  MapPin,
  BookOpen,
  Phone,
  MessageCircle,
  Check,
} from 'lucide-react';
import type { Business } from '../types';
import { getImageUrl } from '../utils/imageUtils';
import { shareBusinessCard } from '../utils/shareUtils';
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

  const handleShare = async () => {
    const success = await shareBusinessCard(biz);
    if (success && !navigator.canShare) {
      // Show feedback only for clipboard copy (native share doesn't need it)
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const delayClass = `card-delay-${Math.min(index, 19)}`;

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
          <div className="flex flex-row gap-4 px-4 pb-4 flex-grow">
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

              {/* BOTTOM: Action Buttons */}
              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 justify-end">
                {/* Mobile Button */}
                <a
                  href={`tel:${biz.phone}`}
                  className="inline-flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2 px-3 transition-colors rounded-md shadow-sm"
                  aria-label={`Call ${biz.name}`}
                >
                  <Phone className="w-4 h-4" />
                  Mobile
                </a>

                {/* WhatsApp Button */}
                <a
                  href={`https://wa.me/${biz.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-2 px-3 transition-colors rounded-md shadow-sm"
                  aria-label={`WhatsApp ${biz.name}`}
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className={`inline-flex items-center gap-1.5 text-base font-medium py-2 px-3 transition-colors rounded-md ${
                    copied
                      ? 'bg-green-100 text-green-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label={copied ? 'Link copied' : `Share ${biz.name}`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="text-xs">Copied</span>
                    </>
                  ) : (
                    <Share2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
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
        <div className="flex flex-row gap-4 px-4 pb-4 flex-grow">
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

            {/* BOTTOM: Action Buttons */}
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 justify-end">
              {/* Call Button */}
              <a
                href={`tel:${biz.phone}`}
                className="inline-flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2 px-3 transition-colors rounded-md shadow-sm"
                aria-label={`Call ${biz.name}`}
              >
                <Phone className="w-4 h-4" />
                Call
              </a>

              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/${biz.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-2 px-3 transition-colors rounded-md shadow-sm"
                aria-label={`WhatsApp ${biz.name}`}
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className={`inline-flex items-center gap-1.5 text-base font-medium py-2 px-3 transition-colors rounded-md ${
                  copied
                    ? 'bg-green-100 text-green-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label={copied ? 'Link copied' : `Share ${biz.name}`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="text-xs">Copied</span>
                  </>
                ) : (
                  <Share2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
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
