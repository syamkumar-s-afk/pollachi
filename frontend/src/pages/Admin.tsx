import { useState, useEffect, useMemo } from 'react';
import {
  LogOut,
  Plus,
  Pencil,
  Trash2,
  ImagePlus,
  Search,
  ShieldCheck,
  Loader2,
  X,
} from 'lucide-react';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import AdminLayout from '../components/AdminLayout';
import CategoryManagement from '../components/CategoryManagement';
import AdvertisementManagement from '../components/AdvertisementManagement';
import BannerManagement from '../components/BannerManagement';
import { isTokenExpired } from '../components/ProtectedRoute';
import { CITIES, API_URL } from '../constants';
import { useCategories } from '../hooks/useCategories';
import type { Business } from '../types';
import {
  loginAdmin,
  saveBusiness,
  deleteBusiness as apiDeleteBusiness,
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
  adId: '',
};

export default function Admin() {
  const toast = useToast();
  const categoryStore = useCategories();
  const { categories, loading: categoriesLoading, subcategoriesMap } = categoryStore;

  // Auth state
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Navigation state
  const [activeSection, setActiveSection] = useState<'businesses' | 'categories' | 'advertisements' | 'banners'>('businesses');

  // Data state
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [form, setForm] = useState<BusinessForm>({ ...EMPTY_FORM });
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCustomCity, setIsCustomCity] = useState(false);
  const [saving, setSaving] = useState(false);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<Business | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check token on mount
  useEffect(() => {
    if (token && isTokenExpired(token)) {
      localStorage.removeItem('token');
      setToken(null);
      toast.warning('Session expired', 'Please log in again to continue.');
    }
  }, []);

  useEffect(() => {
    if (token) fetchBusinesses();
  }, [token]);

  // Image preview
  useEffect(() => {
    if (!file) {
      setImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const fetchBusinesses = async () => {
    try {
      const res = await fetch(`${API_URL}/api/businesses?limit=1000`);
      const json = await res.json();
      setBusinesses(Array.isArray(json) ? json : json.data || []);
    } catch {
      toast.error('Failed to load', 'Could not fetch business listings.');
    }
  };

  // Filtered businesses for search
  const filteredBusinesses = useMemo(() => {
    if (!searchQuery.trim()) return businesses;
    const q = searchQuery.toLowerCase();
    return businesses.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q)
    );
  }, [businesses, searchQuery]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = 'Business name is required';
    if (!form.category.trim()) newErrors.category = 'Category is required';
    if (!form.sub_category.trim())
      newErrors.sub_category = 'Sub-category is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[\d\s+\-()]{7,15}$/.test(form.phone))
      newErrors.phone = 'Enter a valid phone number';
    if (!form.whatsapp.trim())
      newErrors.whatsapp = 'WhatsApp number is required';
    else if (!/^[\d\s+\-()]{7,15}$/.test(form.whatsapp))
      newErrors.whatsapp = 'Enter a valid WhatsApp number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !validateForm()) return;

    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null) formData.append(key, value as string);
      });
      if (file) formData.append('imageFile', file);

      await saveBusiness(formData, form.id, token);

      toast.success(
        form.id ? 'Business updated' : 'Business created',
        `"${form.name}" has been saved successfully.`
      );

      resetForm();
      fetchBusinesses();
    } catch {
      toast.error('Save failed', 'Could not save the business. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !deleteTarget) return;

    setDeleting(true);
    try {
      await apiDeleteBusiness(deleteTarget.id, token);
      toast.success('Deleted', `"${deleteTarget.name}" has been removed.`);
      setDeleteTarget(null);
      fetchBusinesses();
    } catch {
      toast.error('Delete failed', 'Could not remove the business.');
    } finally {
      setDeleting(false);
    }
  };

  const editBusiness = (b: Business) => {
    setForm({ ...b });
    setIsCustomCity(
      b.city ? !CITIES.includes(b.city as typeof CITIES[number]) : false
    );
    setFile(null);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm({ ...EMPTY_FORM });
    setIsCustomCity(false);
    setFile(null);
    setImagePreview(null);
    setErrors({});
  };

  const inputClass = (field: string) =>
    `w-full border ${
      errors[field]
        ? 'border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-400'
        : 'border-[var(--color-border)] bg-white focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]'
    } p-2.5 rounded-xl text-sm outline-none focus:ring-2 transition-colors`;

  /* ─── Login Screen ─── */
  if (!token) {
    return (
      <div className="max-w-md mx-auto mt-8 md:mt-16">
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-[var(--color-border)]">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Admin Login
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-1.5">
              Sign in to manage your business listings
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-username"
                className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-1.5"
              >
                Username
              </label>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-[var(--color-border)] rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors bg-gray-50 hover:bg-white"
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
            </div>
            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-1.5"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[var(--color-border)] rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors bg-gray-50 hover:bg-white"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>
            <button
              disabled={loginLoading}
              className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
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

  /* ─── Admin Dashboard ─── */
  return (
    <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {/* Header */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            {activeSection === 'businesses' && 'Manage Businesses'}
            {activeSection === 'categories' && 'Category Management'}
            {activeSection === 'advertisements' && 'Manage Advertisements'}
            {activeSection === 'banners' && 'Homepage Banners'}
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            {activeSection === 'businesses' && `${businesses.length} businesses listed`}
            {activeSection === 'categories' && `${categories.length} categories available`}
            {activeSection === 'advertisements' && `3 advertisement slots`}
            {activeSection === 'banners' && `5 banner slots — manage your carousel`}
          </p>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer bg-gray-50 hover:bg-red-50 px-4 py-2 rounded-xl border border-[var(--color-border)]"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Businesses Section */}
      {activeSection === 'businesses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-[var(--color-border)] sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-base text-[var(--color-text-primary)] flex items-center gap-2">
                  {form.id ? (
                    <>
                      <Pencil className="w-4 h-4 text-[var(--color-primary)]" />
                      Edit Business
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-[var(--color-primary)]" />
                      Add Business
                    </>
                  )}
                </h3>
                {form.id && (
                  <button
                    onClick={resetForm}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-[var(--color-text-muted)] transition-colors cursor-pointer"
                    aria-label="Cancel editing"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5 text-sm">
                {/* Business Name */}
                <div>
                  <label htmlFor="biz-name" className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                    Business Name *
                  </label>
                  <input
                    id="biz-name"
                    placeholder="e.g. ABC Textiles"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass('name')}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="biz-category" className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                    Category * {categoriesLoading && <span className="text-[10px]">(loading...)</span>}
                  </label>
                  <select
                    id="biz-category"
                    value={form.category}
                    onChange={(e) => {
                      setForm({ ...form, category: e.target.value, sub_category: '' });
                    }}
                    disabled={categoriesLoading}
                    className={inputClass('category') + ' cursor-pointer disabled:opacity-50'}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
                </div>

                {/* Sub Category */}
                <div>
                  <label htmlFor="biz-subcategory" className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                    Sub Category *
                  </label>
                  <select
                    id="biz-subcategory"
                    value={form.sub_category}
                    onChange={(e) => {
                      setForm({ ...form, sub_category: e.target.value });
                    }}
                    disabled={!form.category || categoriesLoading}
                    className={inputClass('sub_category') + ' cursor-pointer disabled:opacity-50'}
                  >
                    <option value="">Select Sub Category</option>
                    {form.category &&
                      subcategoriesMap[categories.find(c => c.name === form.category)?.id || 0]?.map((sc) => (
                        <option key={sc.id} value={sc.name}>
                          {sc.name}
                        </option>
                      ))}
                  </select>
                  {errors.sub_category && <p className="text-xs text-red-500 mt-1">{errors.sub_category}</p>}
                </div>

                {/* City */}
                <div>
                  <label htmlFor="biz-city" className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                    District *
                  </label>
                  <select
                    id="biz-city"
                    value={isCustomCity ? 'Others' : form.city}
                    onChange={(e) => {
                      if (e.target.value === 'Others') {
                        setIsCustomCity(true);
                        setForm({ ...form, city: '' });
                      } else {
                        setIsCustomCity(false);
                        setForm({ ...form, city: e.target.value });
                      }
                    }}
                    className={inputClass('city') + ' cursor-pointer'}
                  >
                    <option value="">Select District</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="Others">Others</option>
                  </select>
                  {isCustomCity && (
                    <input
                      placeholder="Custom city name"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className={inputClass('city') + ' mt-2'}
                    />
                  )}
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="biz-address" className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                    Address *
                  </label>
                  <textarea
                    id="biz-address"
                    placeholder="Full business address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    rows={2}
                    className={inputClass('address') + ' resize-none'}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>

                {/* Phone + WhatsApp */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="biz-phone" className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                      Phone *
                    </label>
                    <input
                      id="biz-phone"
                      placeholder="Phone number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={inputClass('phone')}
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label htmlFor="biz-whatsapp" className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                      WhatsApp *
                    </label>
                    <input
                      id="biz-whatsapp"
                      placeholder="WhatsApp number"
                      value={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      className={inputClass('whatsapp')}
                    />
                    {errors.whatsapp && <p className="text-xs text-red-500 mt-1">{errors.whatsapp}</p>}
                  </div>
                </div>

                {/* Ad ID */}
                <div>
                  <label htmlFor="biz-adid" className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                    Ad ID
                  </label>
                  <input
                    id="biz-adid"
                    placeholder="e.g. #AdSR001"
                    value={form.adId}
                    onChange={(e) => setForm({ ...form, adId: e.target.value })}
                    className={inputClass('adId')}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">
                    Image
                  </label>
                  {imagePreview && (
                    <div className="relative mb-2 rounded-xl overflow-hidden border border-[var(--color-border)]">
                      <img src={imagePreview} alt="Upload preview" className="w-full h-32 object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-xl py-3 cursor-pointer transition-colors text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-red-50/50">
                    <ImagePlus className="w-4 h-4" />
                    {file ? file.name : 'Choose image…'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving…
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
                    className="w-full bg-gray-100 hover:bg-gray-200 text-[var(--color-text-secondary)] py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Business List Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-[var(--color-border)]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <h3 className="font-bold text-base text-[var(--color-text-primary)]">
                  All Businesses
                  <span className="text-sm font-normal text-[var(--color-text-muted)] ml-2">
                    ({filteredBusinesses.length})
                  </span>
                </h3>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    type="text"
                    placeholder="Search businesses…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-[var(--color-border)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] w-full sm:w-64 bg-gray-50 hover:bg-white transition-colors"
                    aria-label="Search listed businesses"
                  />
                </div>
              </div>

              {filteredBusinesses.length === 0 ? (
                <div className="text-center py-12 text-[var(--color-text-muted)]">
                  <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-medium">No businesses found</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                  {filteredBusinesses.map((b) => (
                    <div
                      key={b.id}
                      className="border border-[var(--color-border)] p-3.5 flex items-center gap-3 rounded-xl bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                        <img
                          src={
                            b.image?.startsWith('/uploads')
                              ? `${API_URL}${b.image}`
                              : b.image || 'https://placehold.co/100x100?text=N/A'
                          }
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/100x100?text=N/A';
                          }}
                        />
                      </div>

                      <div className="flex-grow min-w-0">
                        <h4 className="font-bold text-sm text-[var(--color-text-primary)] line-clamp-1">
                          {b.name}
                        </h4>
                        <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                          {b.category} · {b.sub_category} · {b.city}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => editBusiness(b)}
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors cursor-pointer"
                          aria-label={`Edit ${b.name}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(b)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                          aria-label={`Delete ${b.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Categories Section */}
      {activeSection === 'categories' && token && <CategoryManagement token={token} categoryStore={categoryStore} />}

      {/* Advertisements Section */}
      {activeSection === 'advertisements' && token && <AdvertisementManagement />}

      {/* Banners Section */}
      {activeSection === 'banners' && token && <BannerManagement />}

      {/* Delete Confirmation Modal */}
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
