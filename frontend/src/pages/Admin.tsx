import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import AdminLayout from '../components/AdminLayout';
import CategoryManagement from '../components/CategoryManagement';
import AdvertisementManagement from '../components/AdvertisementManagement';
import BannerManagement from '../components/BannerManagement';
import PopupAdManagement from '../components/PopupAdManagement';
import { isTokenExpired } from '../components/ProtectedRoute';
import { CITIES, API_URL } from '../constants';
import { useCategories } from '../hooks/useCategories';
import type { AdminSection, Business } from '../types';
import {
  deleteBusiness as apiDeleteBusiness,
  loginAdmin,
  saveBusiness,
} from '../services/api';

interface BusinessForm {
  id: number | null;
  name: string;
  category: string;
  sub_category: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  mapUrl: string;
  adId: string;
}

const EMPTY_FORM: BusinessForm = {
  id: null,
  name: '',
  category: '',
  sub_category: '',
  city: '',
  address: '',
  phone: '',
  whatsapp: '',
  mapUrl: '',
  adId: '',
};

const AD_ID_REGEX = /^AD(\d+)$/i;
const TEN_DIGIT_PHONE_REGEX = /^\d{10}$/;
const ADDRESS_MAX_LINES = 3;
const ADDRESS_MAX_CHARS_PER_LINE = 40;
const ADDRESS_MAX_LENGTH = ADDRESS_MAX_LINES * ADDRESS_MAX_CHARS_PER_LINE;

function getTenDigitValue(value: string): string {
  return value.replace(/\D/g, '').slice(0, 10);
}

function getCardAddressValue(value: string): string {
  const normalizedValue = value.replace(/\r\n/g, '\n');
  const lines = normalizedValue
    .split('\n')
    .slice(0, ADDRESS_MAX_LINES)
    .map((line) => line.slice(0, ADDRESS_MAX_CHARS_PER_LINE));

  return lines.join('\n');
}

function getAddressLines(value: string): string[] {
  const lines = getCardAddressValue(value).split('\n');
  return Array.from({ length: ADDRESS_MAX_LINES }, (_, index) => lines[index] ?? '');
}

function updateAddressLine(value: string, lineIndex: number, nextLine: string): string {
  const lines = getAddressLines(value);
  lines[lineIndex] = nextLine.slice(0, ADDRESS_MAX_CHARS_PER_LINE);
  return lines.join('\n').replace(/\n+$/, '');
}

function getAdIdNumber(adId: string | null | undefined): number {
  if (!adId) {
    return 0;
  }

  const match = adId.trim().toUpperCase().match(AD_ID_REGEX);
  if (!match) {
    return 0;
  }

  const numericValue = parseInt(match[1], 10);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function formatAdId(sequence: number): string {
  return `AD${String(sequence).padStart(3, '0')}`;
}

export default function Admin() {
  const toast = useToast();
  const categoryStore = useCategories();
  const { categories, loading: categoriesLoading, subcategoriesMap } = categoryStore;

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeSection, setActiveSection] = useState<AdminSection>('add-business');

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [form, setForm] = useState<BusinessForm>({ ...EMPTY_FORM });
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Business | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchBusinesses = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/businesses?limit=1000`);
      const json = await res.json();
      setBusinesses(Array.isArray(json) ? json : json.data || []);
    } catch {
      toast.error('Failed to load', 'Could not fetch business listings.');
    }
  }, [toast]);

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      localStorage.removeItem('token');
      setToken(null);
      toast.warning('Session expired', 'Please log in again to continue.');
    }
  }, [toast, token]);

  useEffect(() => {
    if (token) {
      void fetchBusinesses();
    }
  }, [fetchBusinesses, token]);

  useEffect(() => {
    if (!file) {
      setImagePreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setImagePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const filteredBusinesses = useMemo(() => {
    if (!searchQuery.trim()) {
      return businesses;
    }

    const normalizedQuery = searchQuery.trim().toLowerCase();
    return businesses.filter((business) =>
      [
        business.name,
        business.category,
        business.sub_category,
        business.city,
        business.address,
        business.adId ?? '',
      ].some((value) => value.toLowerCase().includes(normalizedQuery))
    );
  }, [businesses, searchQuery]);

  const sortedBusinesses = useMemo(
    () =>
      [...filteredBusinesses].sort((firstBusiness, secondBusiness) => {
        const adIdDifference =
          getAdIdNumber(secondBusiness.adId) - getAdIdNumber(firstBusiness.adId);

        if (adIdDifference !== 0) {
          return adIdDifference;
        }

        return secondBusiness.id - firstBusiness.id;
      }),
    [filteredBusinesses]
  );

  const nextAutoAdId = useMemo(() => {
    const highestAdId = businesses.reduce((currentHighest, business) => {
      return Math.max(currentHighest, getAdIdNumber(business.adId));
    }, 0);

    return formatAdId(highestAdId + 1);
  }, [businesses]);

  const validateForm = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!form.name.trim()) nextErrors.name = 'Business name is required';
    if (!form.category.trim()) nextErrors.category = 'Category is required';
    if (!form.sub_category.trim()) nextErrors.sub_category = 'Sub-category is required';
    if (!form.city.trim()) nextErrors.city = 'District is required';
    if (!form.address.trim()) nextErrors.address = 'Address is required';
    else if (form.address.trim().length > ADDRESS_MAX_LENGTH) {
      nextErrors.address = `Address must fit within ${ADDRESS_MAX_LINES} lines`;
    }
    if (!form.phone.trim()) nextErrors.phone = 'Phone number is required';
    else if (!TEN_DIGIT_PHONE_REGEX.test(form.phone)) nextErrors.phone = 'Phone number must be exactly 10 digits';
    if (!form.whatsapp.trim()) nextErrors.whatsapp = 'WhatsApp number is required';
    else if (!TEN_DIGIT_PHONE_REGEX.test(form.whatsapp)) nextErrors.whatsapp = 'WhatsApp number must be exactly 10 digits';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginLoading(true);

    try {
      const data = await loginAdmin(username, password);
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        toast.success('Welcome back!', 'Logged in successfully.');
      }
    } catch {
      toast.error('Login failed', 'Invalid username or password.');
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    toast.info('Logged out', 'You have been signed out.');
  };

  const resetForm = () => {
    setForm({ ...EMPTY_FORM });
    setFile(null);
    setImagePreview(null);
    setErrors({});
  };

  const editBusiness = (business: Business) => {
    setForm({
      id: business.id,
      name: business.name,
      category: business.category,
      sub_category: business.sub_category,
      city: business.city,
      address: business.address,
      phone: getTenDigitValue(business.phone),
      whatsapp: getTenDigitValue(business.whatsapp),
      mapUrl: business.mapUrl ?? '',
      adId: business.adId ?? '',
    });
    setFile(null);
    setImagePreview(null);
    setErrors({});
    setActiveSection('add-business');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token || !validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (file) {
        formData.append('imageFile', file);
      }

      await saveBusiness(formData, form.id, token);

      toast.success(
        form.id ? 'Business updated' : 'Business created',
        `"${form.name}" has been saved successfully.`
      );

      resetForm();
      await fetchBusinesses();
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : 'Could not save the business. Please try again.';

      toast.error('Save failed', message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !deleteTarget) {
      return;
    }

    setDeleting(true);

    try {
      await apiDeleteBusiness(deleteTarget.id, token);

      if (form.id === deleteTarget.id) {
        resetForm();
      }

      toast.success('Deleted', `"${deleteTarget.name}" has been removed.`);
      setDeleteTarget(null);
      await fetchBusinesses();
    } catch {
      toast.error('Delete failed', 'Could not remove the business.');
    } finally {
      setDeleting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-lg border p-2 text-sm outline-none transition-colors focus:ring-2 sm:rounded-xl sm:p-2.5 ${
      errors[field]
        ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200'
        : 'border-[var(--color-border)] bg-white focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/20'
    }`;

  const adIdHelperText = form.id
    ? form.adId
      ? `Current Ad ID: ${form.adId}. Leave it as-is unless you want to replace it with a custom value.`
      : `This business does not have an Ad ID yet. Leave it blank to assign ${nextAutoAdId} automatically.`
    : `Leave this blank to auto-generate `;

  const addressLines = getAddressLines(form.address);
  const businessSidebarContent = null;

  if (!token) {
    return (
      <div className="mx-auto mt-8 max-w-md md:mt-16">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-8 shadow-lg md:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)] shadow-md">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Admin Login
            </h2>
            <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
              Sign in to manage your business listings
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-username"
                className="mb-1.5 block text-sm font-semibold text-[var(--color-text-secondary)]"
              >
                Username
              </label>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-gray-50 p-3 text-sm outline-none transition-colors hover:bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-sm font-semibold text-[var(--color-text-secondary)]"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-gray-50 p-3 text-sm outline-none transition-colors hover:bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[var(--color-primary-hover)] hover:shadow-md disabled:opacity-50"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onLogout={logout}
      sidebarContent={businessSidebarContent}
    >
      {activeSection === 'add-business' && (
        <div className="space-y-3 sm:space-y-6">
          <div className="rounded-lg border border-[var(--color-border)] bg-white p-3 shadow-sm sm:rounded-xl sm:p-6">
            <div className="mb-3 flex items-center justify-between sm:mb-6">
              <h3 className="flex items-center gap-2 text-base font-bold text-[var(--color-text-primary)] sm:text-lg">
                {form.id ? (
                  <>
                    <Pencil className="h-4 w-4 text-[var(--color-primary)] sm:h-5 sm:w-5" />
                    Edit Business
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 text-[var(--color-primary)] sm:h-5 sm:w-5" />
                    Add Business
                  </>
                )}
              </h3>

              {form.id && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-gray-100"
                  aria-label="Cancel editing"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-sm sm:space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
                <div>
                  <label
                    htmlFor="biz-name"
                    className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]"
                  >
                    Business Name *
                  </label>
                  <input
                    id="biz-name"
                    placeholder="e.g. ABC Textiles"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    className={inputClass('name')}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label
                    htmlFor="biz-category"
                    className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]"
                  >
                    Category * {categoriesLoading && <span className="text-[10px]">(loading...)</span>}
                  </label>
                  <select
                    id="biz-category"
                    value={form.category}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        category: event.target.value,
                        sub_category: '',
                      })
                    }
                    disabled={categoriesLoading}
                    className={`${inputClass('category')} cursor-pointer disabled:opacity-50`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
                </div>

                <div>
                  <label
                    htmlFor="biz-subcategory"
                    className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]"
                  >
                    Sub Category *
                  </label>
                  <select
                    id="biz-subcategory"
                    value={form.sub_category}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        sub_category: event.target.value,
                      })
                    }
                    disabled={!form.category || categoriesLoading}
                    className={`${inputClass('sub_category')} cursor-pointer disabled:opacity-50`}
                  >
                    <option value="">Select Sub Category</option>
                    {form.category &&
                      subcategoriesMap[categories.find((category) => category.name === form.category)?.id || 0]?.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.name}>
                          {subcategory.name}
                        </option>
                      ))}
                  </select>
                  {errors.sub_category && (
                    <p className="mt-1 text-xs text-red-500">{errors.sub_category}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
                <div>
                  <label
                    htmlFor="biz-city"
                    className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]"
                  >
                    District *
                  </label>
                  <select
                    id="biz-city"
                    value={form.city}
                    onChange={(event) => setForm({ ...form, city: event.target.value })}
                    className={`${inputClass('city')} cursor-pointer`}
                  >
                    <option value="">Select District</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                </div>

                <div>
                  <label
                    htmlFor="biz-address"
                    className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]"
                  >
                    Address *
                  </label>
                  <div className="space-y-1.5">
                    {addressLines.map((line, index) => (
                      <input
                        key={index}
                        id={index === 0 ? 'biz-address' : undefined}
                        value={line}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            address: updateAddressLine(form.address, index, event.target.value),
                          })
                        }
                        maxLength={ADDRESS_MAX_CHARS_PER_LINE}
                        placeholder={
                          index === 0
                            ? 'Line 1: Shop / street'
                            : index === 1
                              ? 'Line 2: Area / landmark'
                              : 'Line 3: Town / pincode'
                        }
                        className={inputClass('address')}
                      />
                    ))}
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-[var(--color-text-muted)]">
                      Each line prints separately on the business card.
                    </span>
                    <span
                      className={
                        form.address.length > ADDRESS_MAX_LENGTH
                          ? 'font-semibold text-red-500'
                          : 'text-[var(--color-text-muted)]'
                      }
                    >
                      {addressLines.filter((line) => line.trim()).length}/{ADDRESS_MAX_LINES} lines
                    </span>
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-500">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="biz-adid"
                    className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]"
                  >
                    Ad ID
                  </label>
                  <input
                    id="biz-adid"
                    placeholder={`Leave blank for ${nextAutoAdId}`}
                    value={form.adId}
                    onChange={(event) => setForm({ ...form, adId: event.target.value })}
                    className={inputClass('adId')}
                  />
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {adIdHelperText}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
                <div>
                  <label
                    htmlFor="biz-phone"
                    className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]"
                  >
                    Phone *
                  </label>
                  <input
                    id="biz-phone"
                    type="tel"
                    inputMode="numeric"
                    dir="ltr"
                    lang="en"
                    autoComplete="tel-national"
                    pattern="\d{10}"
                    maxLength={10}
                    placeholder="10 digit phone number"
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: getTenDigitValue(event.target.value) })}
                    className={inputClass('phone')}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>

                <div>
                  <label
                    htmlFor="biz-whatsapp"
                    className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]"
                  >
                    WhatsApp *
                  </label>
                  <input
                    id="biz-whatsapp"
                    type="tel"
                    inputMode="numeric"
                    dir="ltr"
                    lang="en"
                    autoComplete="tel-national"
                    pattern="\d{10}"
                    maxLength={10}
                    placeholder="10 digit WhatsApp number"
                    value={form.whatsapp}
                    onChange={(event) => setForm({ ...form, whatsapp: getTenDigitValue(event.target.value) })}
                    className={inputClass('whatsapp')}
                  />
                  {errors.whatsapp && (
                    <p className="mt-1 text-xs text-red-500">{errors.whatsapp}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="biz-map-url"
                    className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]"
                  >
                    Map / Location URL
                  </label>
                  <input
                    id="biz-map-url"
                    type="url"
                    placeholder="https://maps.app.goo.gl/..."
                    value={form.mapUrl}
                    onChange={(event) => setForm({ ...form, mapUrl: event.target.value })}
                    className={inputClass('mapUrl')}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[var(--color-text-secondary)]">
                  Image
                </label>

                {imagePreview && (
                  <div className="relative mb-2 overflow-hidden rounded-xl border border-[var(--color-border)]">
                    <img
                      src={imagePreview}
                      alt="Upload preview"
                    className="h-24 w-full object-cover sm:h-32"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setImagePreview(null);
                      }}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/50 text-white transition-colors hover:bg-black/70"
                      aria-label="Remove image"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--color-border)] py-2.5 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)] hover:bg-red-50/50 hover:text-[var(--color-primary)] sm:rounded-xl sm:py-3">
                  <ImagePlus className="h-4 w-4" />
                  {file ? file.name : 'Choose image...'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setFile(event.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="sticky bottom-0 -mx-3 flex gap-2 border-t border-[var(--color-border)] bg-white/95 px-3 py-2 pt-2 backdrop-blur sm:static sm:mx-0 sm:gap-3 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:pt-2 sm:backdrop-blur-none">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[var(--color-primary-hover)] hover:shadow-md disabled:opacity-50 sm:rounded-xl sm:py-3"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : form.id ? (
                    'Update Business'
                  ) : (
                    'Add Business'
                  )}
                </button>

                {form.id && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 rounded-lg bg-gray-100 py-2.5 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:bg-gray-200 sm:rounded-xl sm:py-3"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {activeSection === 'all-businesses' && (
        <div className="space-y-3 sm:space-y-6">
          <div className="rounded-lg border border-[var(--color-border)] bg-white p-3 shadow-sm sm:rounded-xl sm:p-6">
            <div className="mb-3 flex flex-col gap-3 lg:mb-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--color-text-primary)] sm:text-lg">
                  All Businesses
                </h3>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)] sm:mt-1 sm:text-sm">
                  Browse, search, edit, and manage every business from a single workspace.
                </p>
              </div>

              <div className="relative w-full max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  placeholder="Search by name, city, category, or Ad ID"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition-colors hover:border-[var(--color-primary)]/40 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 sm:rounded-xl sm:py-3 sm:pr-4"
                  aria-label="Search all businesses"
                />
              </div>
            </div>

            <div className="mb-3 rounded-lg border border-[var(--color-border)] bg-gray-50 px-3 py-2 text-xs text-[var(--color-text-secondary)] sm:mb-4 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm">
              Showing <span className="font-semibold text-[var(--color-text-primary)]">{sortedBusinesses.length}</span> of{' '}
              <span className="font-semibold text-[var(--color-text-primary)]">{businesses.length}</span> businesses
            </div>

            {sortedBusinesses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-gray-50 px-4 py-16 text-center text-[var(--color-text-muted)]">
                <Search className="mx-auto mb-4 h-10 w-10 opacity-40" />
                <p className="text-sm font-medium">No businesses found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
                {sortedBusinesses.map((business) => (
                  <div
                    key={business.id}
                    className="rounded-lg border border-[var(--color-border)] bg-white p-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl sm:p-3"
                  >
                    <div className="space-y-2">
                      <h4 className="line-clamp-2 text-xs font-bold leading-tight text-[var(--color-text-primary)] sm:text-base">
                        {business.name}
                      </h4>
                      <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-[var(--color-primary)] sm:px-3 sm:py-1 sm:text-xs">
                        {business.adId || 'Pending Ad ID'}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-1.5 sm:mt-3 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => editBusiness(business)}
                        className="flex-1 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 sm:rounded-xl sm:px-3 sm:py-2 sm:text-sm"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(business)}
                        className="rounded-lg border border-red-200 bg-red-50 px-2 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 sm:rounded-xl sm:px-3 sm:py-2 sm:text-sm"
                        aria-label={`Delete ${business.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'categories' && token && (
        <CategoryManagement token={token} categoryStore={categoryStore} />
      )}

      {activeSection === 'advertisements' && token && <AdvertisementManagement />}

      {activeSection === 'banners' && token && <BannerManagement />}

      {activeSection === 'popup-ad' && token && <PopupAdManagement token={token} />}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Business"
        message={
          <>
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
          </>
        }
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
