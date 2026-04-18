import { useState } from 'react';
import {
  Share2,
  MapPin,
  BookOpen,
  Phone,
  MessageCircle,
  Check,
  X,
} from 'lucide-react';
import type { Business } from '../types';
import { getImageUrl } from '../utils/imageUtils';
import { shareBusinessCard } from '../utils/shareUtils';

interface BusinessCardProps {
  business: Business;
  index: number;
  /** 'grid' = vertical card (Home page), 'list' = horizontal card (Listings page) */
  variant?: 'grid' | 'list';
}

/**
 * Reusable business card component with two layout variants.
 * Includes staggered entrance animation, lazy-loaded images,
 * and accessible action buttons.
 */
export default function BusinessCard({
  business: biz,
  index,
  variant = 'grid',
}: BusinessCardProps) {
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
          className={`card-animate ${delayClass} bg-white border border-[var(--color-border)] p-4 flex flex-row gap-4 hover:shadow-md transition-all duration-300 group`}
          aria-label={`${biz.name} — ${biz.category}`}
        >
          {/* Image */}
          <div
            className="w-[88px] h-[93px] md:w-[98px] md:h-[103px] bg-gray-100 relative overflow-hidden flex-shrink-0 border border-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
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
                copied
                  ? 'text-emerald-600'
                  : ''
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
      </article>

      {/* Image Preview Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-10 right-0 text-white hover:bg-white/20 rounded-full p-2 transition-colors md:-top-12 md:-right-12"
              aria-label="Close image preview"
            >
              <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Image */}
            <img
              src={imageUrl}
              alt={`${biz.name} preview`}
              className="w-full h-auto rounded-lg shadow-2xl"
              onError={(e) => {
                e.currentTarget.src =
                  'https://placehold.co/800x600?text=No+Image';
              }}
            />

            {/* Image Info */}
            <div className="mt-4 text-center text-white">
              <p className="text-sm md:text-base font-medium">{biz.name}</p>
              <p className="text-xs md:text-sm text-gray-300">{biz.category}</p>
            </div>
          </div>
        </div>
      )}
    </>
    );
  }

  // Grid variant (vertical card)
  return (
    <>
      <article
        className={`card-animate ${delayClass} bg-white rounded-xl overflow-hidden shadow-sm border border-[var(--color-border)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col`}
        aria-label={`${biz.name} — ${biz.category}`}
      >
        {/* Card Image */}
        <div
          className="relative h-40 bg-gray-100 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
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
              e.currentTarget.src = 'https://placehold.co/400x300?text=No+Image';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[var(--color-primary)] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
          {biz.category}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-bold text-[var(--color-text-primary)] line-clamp-1 leading-snug mb-1.5">
          {biz.name}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] mb-2">
          <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="line-clamp-1">{biz.sub_category}</span>
        </div>

        <div className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)] mb-4">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-3 leading-relaxed break-words">
            {biz.address}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-3 border-t border-[var(--color-border-light)] flex items-center gap-2">
          <a
            href={`tel:${biz.phone}`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
            aria-label={`Call ${biz.name}`}
          >
            <Phone className="w-3.5 h-3.5" />
            Call
          </a>
          <a
            href={`https://wa.me/${biz.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-[var(--color-whatsapp)] hover:bg-[var(--color-whatsapp-hover)] text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
            aria-label={`WhatsApp ${biz.name}`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
          <button
            onClick={handleShare}
            className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
              copied
                ? 'border-emerald-200 text-emerald-600 bg-emerald-50'
                : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]'
            }`}
            aria-label={copied ? 'Link copied' : `Share ${biz.name}`}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </article>

    {/* Image Preview Modal */}
    {showImageModal && (
      <div
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        onClick={() => setShowImageModal(false)}
      >
        <div
          className="relative max-w-2xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute -top-10 right-0 text-white hover:bg-white/20 rounded-full p-2 transition-colors md:-top-12 md:-right-12"
            aria-label="Close image preview"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Image */}
          <img
            src={imageUrl}
            alt={`${biz.name} preview`}
            className="w-full h-auto rounded-lg shadow-2xl"
            onError={(e) => {
              e.currentTarget.src =
                'https://placehold.co/800x600?text=No+Image';
            }}
          />

          {/* Image Info */}
          <div className="mt-4 text-center text-white">
            <p className="text-sm md:text-base font-medium">{biz.name}</p>
            <p className="text-xs md:text-sm text-gray-300">{biz.category}</p>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
