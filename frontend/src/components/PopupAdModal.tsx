import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../constants';
import type { PopupAd } from '../types';
import { getImageUrl } from '../utils/imageUtils';

const CTA_TEXT = 'பதிவு செய்ய இங்கே கிளிக் செய்யுங்கள்!';
const POPUP_DELAY_MS = 3000;

function phoneHref(phone?: string | null): string | undefined {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.length === 10 ? `tel:${digits}` : undefined;
}

export default function PopupAdModal() {
  const location = useLocation();
  const [popupAd, setPopupAd] = useState<PopupAd | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const imageUrl = popupAd?.image_url?.trim() ? getImageUrl(popupAd.image_url, 'Popup ad') : '';
  const imagePhoneHref = phoneHref(popupAd?.image_phone);
  const buttonPhoneHref = phoneHref(popupAd?.button_phone);

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      setIsVisible(false);
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function loadPopupAd() {
      try {
        const res = await fetch(`${API_URL}/api/popup-ad`);
        if (!res.ok) return;

        const json = await res.json();
        const data: PopupAd = json.data || {};
        if (!data.image_url?.trim()) return;

        const sessionKey = `popup-ad-dismissed:${data.updated_at || data.image_url}`;
        if (sessionStorage.getItem(sessionKey)) return;

        if (!cancelled) {
          setPopupAd(data);
          timer = setTimeout(() => {
            if (!cancelled) setIsVisible(true);
          }, POPUP_DELAY_MS);
        }
      } catch {
        // Popup ads are optional; ignore network errors on the public site.
      }
    }

    loadPopupAd();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [location.pathname]);

  const handleClose = () => {
    if (popupAd?.image_url || popupAd?.updated_at) {
      sessionStorage.setItem(
        `popup-ad-dismissed:${popupAd.updated_at || popupAd.image_url}`,
        '1'
      );
    }
    setIsVisible(false);
  };

  if (!isVisible || !imageUrl) {
    return null;
  }

  const image = (
    <div className="relative flex max-h-[76vh] w-full items-center justify-center overflow-hidden bg-gray-100">
      <img
        src={imageUrl}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl"
      />
      <div className="absolute inset-0 bg-white/35" />
      <img
        src={imageUrl}
        alt="Advertisement"
        className="relative block max-h-[76vh] w-full object-contain"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-3 py-5 backdrop-blur-sm">
      <div className="relative w-[80vw] max-w-[390px] overflow-visible">
        <button
          type="button"
          onClick={handleClose}
          className="absolute -right-2 -top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg transition-colors hover:bg-gray-900 sm:-right-5 sm:-top-5 sm:h-14 sm:w-14"
          aria-label="Close advertisement"
        >
          <X className="h-8 w-8 sm:h-10 sm:w-10" />
        </button>

        <div className="relative overflow-hidden rounded-sm bg-white shadow-2xl">
          <span className="absolute left-2 top-2 z-10 rounded bg-white px-2 py-1 text-xs font-bold text-gray-900 shadow-sm">
            Ad
          </span>

          {imagePhoneHref ? (
            <a href={imagePhoneHref} aria-label="Call from advertisement image">
              {image}
            </a>
          ) : (
            image
          )}

          {buttonPhoneHref ? (
            <a
              href={buttonPhoneHref}
              className="block bg-pink-600 px-4 py-3 text-center text-base font-black leading-snug text-white transition-colors hover:bg-pink-700 sm:text-lg"
            >
              {CTA_TEXT}
            </a>
          ) : (
            <div className="bg-pink-600 px-4 py-3 text-center text-base font-black leading-snug text-white sm:text-lg">
              {CTA_TEXT}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
