import { useState, useRef } from 'react';
import { Image as ImageIcon, Save, Loader2, Link as LinkIcon, Upload, Trash2 } from 'lucide-react';
import { useBanners } from '../hooks/useBanners';
import { API_URL } from '../constants';
import { useToast } from './Toast';
import { getImageUrl } from '../utils/imageUtils';

const SLOT_LABELS: Record<string, string> = {
  banner1: 'Banner 1',
  banner2: 'Banner 2',
  banner3: 'Banner 3',
  banner4: 'Banner 4',
  banner5: 'Banner 5',
};

const FALLBACK_IMAGES: Record<string, string> = {
  banner1: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80',
  banner2: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80',
  banner3: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80',
  banner4: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=1600&q=80',
  banner5: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80',
};

export default function BannerManagement() {
  const { banners, updateBanner } = useBanners();
  const [updatingSlot, setUpdatingSlot] = useState<string | null>(null);

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-sm">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-1 tracking-tight">
          Homepage Banners
        </h2>
        <p className="text-xs text-[var(--color-text-muted)] mb-6 pb-4 border-b border-[var(--color-border)]">
          Upload images for each of the 5 carousel banner slots. Changes are reflected immediately on the homepage.
          If no image is uploaded for a slot, the default stock photo is used.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {['banner1', 'banner2', 'banner3', 'banner4', 'banner5'].map((slot) => {
            const banner = banners.find(b => b.slot === slot);
            return (
              <BannerSlotForm
                key={slot}
                slot={slot}
                label={SLOT_LABELS[slot]}
                fallback={FALLBACK_IMAGES[slot]}
                banner={banner}
                updateBanner={updateBanner}
                updatingSlot={updatingSlot}
                setUpdatingSlot={setUpdatingSlot}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BannerSlotForm({ slot, label, fallback, banner, updateBanner, updatingSlot, setUpdatingSlot }: any) {
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(getImageUrl(banner?.image_url, label));
  const [linkUrl, setLinkUrl] = useState(banner?.link_url || '');

  // Update local state if banner data changes (after refresh)
  const currentImageUrl = getImageUrl(banner?.image_url, label);

  const displayImage = preview || currentImageUrl || fallback;
  const isUploading = updatingSlot === slot;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!file && linkUrl === (banner?.link_url || '')) {
      toast.error('No changes', 'Upload a new image or update the link first.');
      return;
    }

    setUpdatingSlot(slot);
    const formData = new FormData();
    if (file) formData.append('imageFile', file);
    formData.append('link_url', linkUrl);

    try {
      await updateBanner(slot, formData);
      toast.success('Saved!', `${label} updated successfully.`);
      setFile(null);
    } catch (err: any) {
      toast.error('Failed', err.message || 'Could not update banner.');
    } finally {
      setUpdatingSlot(null);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm hover:shadow transition-shadow bg-white flex flex-col">
      {/* Preview */}
      <div className="relative h-[120px] bg-gray-100 overflow-hidden group">
        <img
          src={displayImage}
          alt={label}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = fallback; }}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-gray-100 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" /> Upload
          </button>
          {file && (
            <button
              onClick={handleClear}
              className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
        {/* Badge */}
        <div className="absolute top-2 left-2 bg-[var(--color-primary)] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
          {slot}
        </div>
        {file && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
            New
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <p className="text-[13px] font-semibold text-[var(--color-text-primary)]">{label}</p>

        {/* Hidden file input */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Click-to-upload visible area */}
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full border border-dashed border-[var(--color-border)] rounded-lg py-2 text-xs text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors flex items-center justify-center gap-2"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          {file ? file.name.substring(0, 25) + (file.name.length > 25 ? '…' : '') : 'Click to upload image'}
        </button>

        {/* Link field */}
        <div className="flex items-center border border-[var(--color-border)] rounded-lg overflow-hidden">
          <span className="px-2 py-1.5 bg-gray-50 border-r border-[var(--color-border)]">
            <LinkIcon className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
          </span>
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://yourlink.com"
            className="flex-1 px-2 py-1.5 text-xs outline-none text-[var(--color-text-secondary)] bg-white"
          />
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={isUploading}
          className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-auto"
        >
          {isUploading ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>
          ) : (
            <><Save className="w-3.5 h-3.5" /> Save Banner</>
          )}
        </button>
      </div>
    </div>
  );
}
