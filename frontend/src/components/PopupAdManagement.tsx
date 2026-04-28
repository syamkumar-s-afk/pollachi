import { useEffect, useRef, useState } from 'react';
import { Image as ImageIcon, Loader2, Phone, Save, Upload, X } from 'lucide-react';
import { API_URL } from '../constants';
import type { PopupAd } from '../types';
import { getImageUrl } from '../utils/imageUtils';
import { useToast } from './Toast';

interface PopupAdManagementProps {
  token: string;
}

const CTA_TEXT = 'பதிவு செய்ய இங்கே கிளிக் செய்யுங்கள்!';

function onlyTenDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 10);
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export default function PopupAdManagement({ token }: PopupAdManagementProps) {
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [popupAd, setPopupAd] = useState<PopupAd | null>(null);
  const [imagePhone, setImagePhone] = useState('');
  const [buttonPhone, setButtonPhone] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadPopupAd() {
      try {
        const res = await fetch(`${API_URL}/api/popup-ad`);
        if (!res.ok) throw new Error('Could not load popup ad.');
        const json = await res.json();
        const data: PopupAd = json.data || {};

        if (!cancelled) {
          setPopupAd(data);
          setImagePhone(data.image_phone || '');
          setButtonPhone(data.button_phone || '');
        }
      } catch (err: unknown) {
        if (!cancelled) {
          toast.error('Load failed', getErrorMessage(err, 'Could not load popup ad.'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPopupAd();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  const imageUrl = preview || (popupAd?.image_url?.trim() ? getImageUrl(popupAd.image_url, 'Popup ad') : '');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const clearSelectedImage = () => {
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSave = async () => {
    if (imagePhone && imagePhone.length !== 10) {
      toast.error('Check image phone', 'Image click phone number must be 10 digits.');
      return;
    }

    if (buttonPhone && buttonPhone.length !== 10) {
      toast.error('Check button phone', 'Button phone number must be 10 digits.');
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append('image_phone', imagePhone);
    formData.append('button_phone', buttonPhone);
    formData.append('image_url', popupAd?.image_url || '');
    if (file) formData.append('imageFile', file);

    try {
      const res = await fetch(`${API_URL}/api/popup-ad`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Could not save popup ad.');
      }

      const json = await res.json();
      setPopupAd(json.data);
      setFile(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = '';
      toast.success('Saved', 'Popup ad updated successfully.');
    } catch (err: unknown) {
      toast.error('Save failed', getErrorMessage(err, 'Could not save popup ad.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-[var(--color-border)] bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-3 sm:space-y-4">
      <div className="rounded-lg border border-[var(--color-border)] bg-white p-3 shadow-sm sm:rounded-xl sm:p-5">
        <div className="mb-4 border-b border-[var(--color-border)] pb-3">
          <h2 className="text-base font-bold tracking-tight text-[var(--color-text-primary)] sm:text-lg">
            Popup Ad
          </h2>
          <p className="mt-1 text-xs text-[var(--color-text-muted)] sm:text-sm">
            This ad appears 3 seconds after visitors open the website.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]">
                Popup Image
              </label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-border)] bg-gray-50 px-3 py-4 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                <Upload className="h-4 w-4" />
                {file ? file.name : 'Upload popup image'}
              </button>
              {file && (
                <button
                  type="button"
                  onClick={clearSelectedImage}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear selected image
                </button>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]">
                  Image Click Phone
                </span>
                <div className="flex overflow-hidden rounded-lg border border-[var(--color-border)] bg-white">
                  <span className="flex items-center border-r border-[var(--color-border)] bg-gray-50 px-3 text-[var(--color-text-muted)]">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={imagePhone}
                    onChange={(event) => setImagePhone(onlyTenDigits(event.target.value))}
                    placeholder="10 digit number"
                    className="min-w-0 flex-1 px-3 py-2 text-sm outline-none"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]">
                  Button Phone
                </span>
                <div className="flex overflow-hidden rounded-lg border border-[var(--color-border)] bg-white">
                  <span className="flex items-center border-r border-[var(--color-border)] bg-gray-50 px-3 text-[var(--color-text-muted)]">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={buttonPhone}
                    onChange={(event) => setButtonPhone(onlyTenDigits(event.target.value))}
                    placeholder="10 digit number"
                    className="min-w-0 flex-1 px-3 py-2 text-sm outline-none"
                  />
                </div>
              </label>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Popup Ad
            </button>
          </div>

          <div className="rounded-lg border border-[var(--color-border)] bg-gray-50 p-3">
            <p className="mb-2 text-xs font-semibold text-[var(--color-text-muted)]">Preview</p>
            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
              <div className="relative aspect-[9/16] bg-gray-100">
                {imageUrl ? (
                  <img src={imageUrl} alt="Popup ad preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[var(--color-text-muted)]">
                    <ImageIcon className="h-8 w-8" />
                    <span className="text-xs font-semibold">No image uploaded</span>
                  </div>
                )}
                <span className="absolute left-2 top-2 rounded bg-white px-2 py-1 text-xs font-bold text-gray-800">
                  Ad
                </span>
              </div>
              <div className="bg-pink-600 px-3 py-3 text-center text-sm font-bold text-white">
                {CTA_TEXT}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
