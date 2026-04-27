import { useState, useRef } from 'react';
import { Link as LinkIcon, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from './Toast';
import { useAdvertisements } from '../hooks/useAdvertisements';
import { getImageUrl } from '../utils/imageUtils';

export default function AdvertisementManagement() {
  const { ads, loading, error, updateAd } = useAdvertisements();
  const [updatingSlot, setUpdatingSlot] = useState<string | null>(null);

  if (loading) return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--color-primary)]" /></div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl space-y-3 sm:space-y-6">
      {/* Homepage Advertisements Section */}
      <div className="rounded-lg border border-[var(--color-border)] bg-white p-3 shadow-sm sm:rounded-xl sm:p-6">
        <h2 className="mb-1 text-base font-bold tracking-tight text-[var(--color-text-primary)] sm:mb-2 sm:text-xl">Homepage Advertisements</h2>
        <p className="mb-4 border-b border-[var(--color-border)] pb-3 text-xs text-[var(--color-text-muted)] sm:mb-8 sm:pb-4 sm:text-sm">
          Upload banner images and set target links for the advertisement slots on the homepage.
          The 'inline-ad' will be displayed inline with the business listings.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {['ad1', 'ad2', 'ad3', 'inline-ad'].map((slot, index) => {
            const ad = ads.find(a => a.slot === slot);
            return <AdForm key={slot} slot={slot} index={index + 1} ad={ad} updateAd={updateAd} updatingSlot={updatingSlot} setUpdatingSlot={setUpdatingSlot} />;
          })}
        </div>
      </div>

      {/* Listing Page Advertisements Section */}
      <div className="rounded-lg border border-[var(--color-border)] bg-white p-3 shadow-sm sm:rounded-xl sm:p-6">
        <h2 className="mb-1 text-base font-bold tracking-tight text-[var(--color-text-primary)] sm:mb-2 sm:text-xl">Listing Page Advertisements</h2>
        <p className="mb-4 border-b border-[var(--color-border)] pb-3 text-xs text-[var(--color-text-muted)] sm:mb-8 sm:pb-4 sm:text-sm">
          Upload banner images and set target links for the advertisement slots on the business listings page.
          These three advertisement spaces appear in the sidebar on the listings page.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {['listing-ad1', 'listing-ad2', 'listing-ad3'].map((slot, index) => {
            const ad = ads.find(a => a.slot === slot);
            return <AdForm key={slot} slot={slot} index={index + 1} ad={ad} updateAd={updateAd} updatingSlot={updatingSlot} setUpdatingSlot={setUpdatingSlot} isListingAd={true} />;
          })}
        </div>
      </div>
    </div>
  );
}

function AdForm({ slot, index, ad, updateAd, updatingSlot, setUpdatingSlot, isListingAd = false }: any) {
  const toast = useToast();
  const [linkUrl, setLinkUrl] = useState(ad?.link_url || '');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(getImageUrl(ad?.image_url, 'Slot ' + index));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUpdating = updatingSlot === slot;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSave = async () => {
    try {
      setUpdatingSlot(slot);
      const formData = new FormData();
      formData.append('link_url', linkUrl);
      if (file) {
        formData.append('imageFile', file);
      } else if (ad?.image_url && preview !== null) {
        formData.append('image_url', ad.image_url);
      } else if (preview === null) {
        // Explicity clear it
        formData.append('image_url', '');
      }

      await updateAd(slot, formData);
      setFile(null); // Clear local file after successful upload
      toast.success('Success', `Advertisement slot ${index} updated successfully`);
    } catch (err: any) {
      toast.error('Failed', err.message || 'Failed to update advertisement');
    } finally {
      setUpdatingSlot(null);
    }
  };

  const handleClearImage = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex h-full flex-col rounded-lg border border-[var(--color-border)] bg-gray-50 p-3 shadow-sm transition-shadow hover:shadow sm:rounded-xl sm:p-5">
      <div className="mb-3 flex items-center justify-between text-sm font-bold text-[var(--color-text-primary)] sm:mb-5 sm:text-[15px]">
        <span className="truncate pr-2">{slot === 'inline-ad' ? 'Inline Ad' : `${isListingAd ? 'Listing ' : ''}Slot ${index}`}</span>
        <span className="text-[10px] uppercase bg-gray-200 px-2.5 py-1 rounded-md font-bold text-gray-500 tracking-wider items-center flex-shrink-0 block">{slot}</span>
      </div>

      {/* Image Preview / Upload Area */}
      <div 
          className={`group relative mb-3 flex h-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-colors sm:mb-5 sm:h-44 sm:rounded-xl ${
          preview ? 'border-transparent bg-black/5' : 'border-gray-300 bg-white hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5'
        }`}
        onClick={() => { if (!preview) fileInputRef.current?.click(); }}
      >
        {preview ? (
          <>
            <img src={preview} alt={`Ad ${index}`} className="w-full h-full object-cover" />
            <button 
              onClick={(e) => { e.stopPropagation(); handleClearImage(); }}
              className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white p-1.5 rounded-lg transition-colors text-xs font-semibold backdrop-blur-md opacity-0 group-hover:opacity-100 shadow-sm"
              title="Remove Image"
            >
              Remove
            </button>
            <div 
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            >
               <ImageIcon className="w-8 h-8 text-white drop-shadow-md" />
            </div>
          </>
        ) : (
          <div className="text-center px-4">
            <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-[var(--color-primary)] mx-auto mb-3 transition-colors" />
            <p className="text-sm text-[var(--color-text-secondary)] font-semibold mb-1">Upload Advertisement</p>
            <p className="text-[11px] text-gray-400 font-medium">Recommended: 600x400px</p>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden" 
        />
      </div>

      {/* Link Input */}
      <div className="mt-auto space-y-4">
        <div>
          <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wide">Target Link</label>
          <div className="relative group">
            <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors" />
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://yourlink.com"
              className="w-full text-sm pl-9 pr-3 py-2.5 rounded-lg border border-[var(--color-border)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors bg-white font-medium"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isUpdating}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-text-primary)] py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50 sm:py-3"
        >
          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isUpdating ? 'Saving...' : 'Save Slot'}
        </button>
      </div>
    </div>
  );
}
