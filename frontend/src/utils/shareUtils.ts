/**
 * Utility functions for generating and handling shareable business links.
 */

import type { Business } from '../types';

/**
 * Generate a shareable URL for a specific business.
 * @param business The business to generate a shareable link for
 * @returns The full shareable URL
 */
export function generateShareUrl(business: Business): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/?business=${business.id}`;
}

/**
 * Generate share data for a business (used by Web Share API).
 * @param business The business to share
 * @returns Share data object for navigator.share()
 */
export function getShareData(business: Business) {
  return {
    title: business.name,
    text: `Check out ${business.name} in ${business.city}!`,
    url: generateShareUrl(business),
  };
}

/**
 * Handle sharing a business card.
 * Uses native Web Share API if available, otherwise copies to clipboard.
 * @param business The business to share
 * @returns Promise that resolves when sharing is complete
 */
export async function shareBusinessCard(business: Business): Promise<boolean> {
  const shareData = getShareData(business);

  try {
    if (navigator.share && navigator.canShare?.(shareData)) {
      // Use native share dialog if available
      await navigator.share(shareData);
      return true;
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareData.url);
      return true;
    }
  } catch (error) {
    // User cancelled or error occurred
    console.error('Share failed:', error);
    return false;
  }
}

/**
 * Extract business ID from URL search params.
 * @returns Business ID if present, null otherwise
 */
export function getSharedBusinessId(): number | null {
  const params = new URLSearchParams(window.location.search);
  const businessId = params.get('business');
  return businessId ? parseInt(businessId, 10) : null;
}

/**
 * Remove business query param from URL without reloading.
 */
export function clearSharedBusinessParam(): void {
  const params = new URLSearchParams(window.location.search);
  if (params.has('business')) {
    params.delete('business');
    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }
}
