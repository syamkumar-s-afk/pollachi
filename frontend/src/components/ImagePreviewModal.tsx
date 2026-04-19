import { X } from 'lucide-react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  businessName: string;
  category: string;
}

/**
 * Reusable image preview modal component
 * Shows a full-screen modal with the business image and details
 */
export default function ImagePreviewModal({
  isOpen,
  onClose,
  imageUrl,
  businessName,
  category,
}: ImagePreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:bg-white/20 rounded-full p-2 transition-colors md:-top-12 md:-right-12"
          aria-label="Close image preview"
        >
          <X className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        {/* Image */}
        <img
          src={imageUrl}
          alt={`${businessName} preview`}
          className="w-full h-auto rounded-lg shadow-2xl"
          onError={(e) => {
            e.currentTarget.src =
              'https://placehold.co/800x600?text=No+Image';
          }}
        />

        {/* Image Info */}
        <div className="mt-4 text-center text-white">
          <p className="text-sm md:text-base font-medium">{businessName}</p>
          <p className="text-xs md:text-sm text-gray-300">{category}</p>
        </div>
      </div>
    </div>
  );
}
