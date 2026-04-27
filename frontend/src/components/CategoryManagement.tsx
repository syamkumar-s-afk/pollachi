import { useState } from 'react';
import { Trash2, Edit2, Plus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from './Toast';
import { useAdminSettings } from '../hooks/useAdminSettings';
import ConfirmModal from './ConfirmModal';
import type { Category } from '../types';
import type { UseCategories } from '../hooks/useCategories';

interface CategoryManagementProps {
  token: string;
  categoryStore: UseCategories;
}

type Tab = 'list' | 'create' | 'edit';

export default function CategoryManagement({ token, categoryStore }: CategoryManagementProps) {
  const toast = useToast();
  const { categories, loading, error, createCategory, updateCategory, deleteCategory, createSubcategory, deleteSubcategory } = categoryStore;
  const { settings: adminSettings, updateBusinessDisplayMode, loading: settingsLoading } = useAdminSettings();

  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string; type: 'category' | 'subcategory' } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingDisplayMode, setTogglingDisplayMode] = useState(false);

  // Create form state
  const [createForm, setCreateForm] = useState({ name: '', displayOrder: undefined as number | undefined });
  const [createSubcats, setCreateSubcats] = useState<{ name: string; displayOrder: number | undefined }[]>([{ name: '', displayOrder: undefined }]);
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({});
  const [isCreating, setIsCreating] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({ name: '', displayOrder: undefined as number | undefined });
  const [newSubcatName, setNewSubcatName] = useState('');
  const [newSubcatDisplayOrder, setNewSubcatDisplayOrder] = useState(undefined as number | undefined);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddingSubcat, setIsAddingSubcat] = useState(false);
  const [editingSubcat, setEditingSubcat] = useState<{ id: number; name: string; displayOrder: number | undefined } | null>(null);
  const [isUpdatingSubcat, setIsUpdatingSubcat] = useState(false);
  const currentDisplayMode = adminSettings.businessDisplayMode;
  const nextDisplayMode =
    currentDisplayMode === 'category-based' ? 'recently-added' : 'category-based';

  // --- CREATE HANDLERS ---
  const validateCreateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!createForm.name.trim()) errors.name = 'Category name is required';
    else if (createForm.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
    else if (createForm.name.trim().length > 100) errors.name = 'Name cannot exceed 100 characters';

    const validSubcats = createSubcats.map(s => s.name.trim()).filter(Boolean);
    if (validSubcats.length === 0) {
      errors.subcategories = 'At least one subcategory is required';
    }

    setCreateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCreateForm()) return;

    setIsCreating(true);
    try {
      const newCat = await createCategory(createForm.name, '', token, createForm.displayOrder);

      const validSubcats = createSubcats.filter(s => s.name.trim());

      for (const subcat of validSubcats) {
        try {
          await createSubcategory(newCat.id, subcat.name, token, subcat.displayOrder);
        } catch (error) {
          console.error('Failed to add subcategory:', subcat.name, error);
        }
      }

      toast.success('Category created', `"${createForm.name}" has been added.`);
      setCreateForm({ name: '', displayOrder: undefined });
      setCreateSubcats([{ name: '', displayOrder: undefined }]);
      setCreateErrors({});
      setActiveTab('list');
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to create category';
      if (errorMsg.includes('already exists')) {
        setCreateErrors({ name: errorMsg });
      } else {
        toast.error('Create failed', errorMsg);
      }
    } finally {
      setIsCreating(false);
    }
  };

  // --- EDIT HANDLERS ---
  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setEditForm({ name: category.name, displayOrder: category.display_order });
    setNewSubcatName('');
    setNewSubcatDisplayOrder(undefined);
    setEditErrors({});
    setActiveTab('edit');
  };

  const validateEditForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!editForm.name.trim()) errors.name = 'Category name is required';
    else if (editForm.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
    else if (editForm.name.trim().length > 100) errors.name = 'Name cannot exceed 100 characters';

    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !validateEditForm()) return;

    setIsUpdating(true);
    try {
      await updateCategory(editingCategory.id, { name: editForm.name, display_order: editForm.displayOrder }, token);
      toast.success('Category updated', `"${editForm.name}" has been saved.`);
      setEditingCategory(null);
      setEditForm({ name: '', displayOrder: undefined });
      setEditErrors({});
      setActiveTab('list');
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to update category';
      if (errorMsg.includes('already exists')) {
        setEditErrors({ name: errorMsg });
      } else {
        toast.error('Update failed', errorMsg);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // --- DELETE HANDLERS ---
  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      if (deleteTarget.type === 'category') {
        await deleteCategory(deleteTarget.id, token);
        toast.success('Deleted', `Category "${deleteTarget.name}" has been removed.`);
        if (editingCategory?.id === deleteTarget.id) {
          setEditingCategory(null);
          setActiveTab('list');
        }
      } else {
        await deleteSubcategory(deleteTarget.id, token);
        toast.success('Deleted', `Subcategory "${deleteTarget.name}" has been removed.`);
      }
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error('Delete failed', err?.message || 'Could not delete.');
    } finally {
      setIsDeleting(false);
    }
  };

  // --- DISPLAY MODE HANDLERS ---
  const handleToggleDisplayMode = async () => {
    setTogglingDisplayMode(true);
    try {
      await updateBusinessDisplayMode(nextDisplayMode);
      const modeName =
        nextDisplayMode === 'category-based'
          ? 'Category-Based Ranking'
          : 'Recently Added';
      toast.success('Settings updated', `Display mode changed to "${modeName}".`);
    } catch (err: any) {
      toast.error('Failed to update', err?.message || 'Could not update display mode.');
    } finally {
      setTogglingDisplayMode(false);
    }
  };

  // --- SUBCATEGORY HANDLERS ---
  const handleAddSubcategory = async (e?: React.MouseEvent | React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingCategory || !newSubcatName.trim()) return;

    setIsAddingSubcat(true);
    try {
      await createSubcategory(editingCategory.id, newSubcatName, token, newSubcatDisplayOrder);
      toast.success('Subcategory added', `"${newSubcatName}" has been created.`);
      setNewSubcatName('');
      setNewSubcatDisplayOrder(undefined);
      // Refresh the editing category
      const updatedCategory = categories.find(c => c.id === editingCategory.id);
      if (updatedCategory) {
        setEditingCategory(updatedCategory);
      }
    } catch (err: any) {
      toast.error('Failed to add', err?.message || 'Could not create subcategory.');
    } finally {
      setIsAddingSubcat(false);
    }
  };

  const handleUpdateSubcategory = async (e?: React.MouseEvent | React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingSubcat || !editingSubcat.name.trim()) return;

    setIsUpdatingSubcat(true);
    try {
      await categoryStore.updateSubcategory(editingSubcat.id, editingSubcat.name, token, editingSubcat.displayOrder);
      toast.success('Subcategory updated', `"${editingSubcat.name}" has been saved.`);
      setEditingSubcat(null);

      // We manually update local editingCategory state to reflect the change
      setEditingCategory(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          subcategories: prev.subcategories?.map(sc =>
            sc.id === editingSubcat.id ? { ...sc, name: editingSubcat.name, display_order: editingSubcat.displayOrder } : sc
          )
        };
      });
    } catch (err: any) {
      toast.error('Update failed', err?.message || 'Could not update subcategory.');
    } finally {
      setIsUpdatingSubcat(false);
    }
  };

  // --- RENDER ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)] mb-4" />
        <p className="text-[var(--color-text-muted)]">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
        <p className="text-red-700 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Display Settings Section */}
      <div className="rounded-lg border border-[var(--color-border)] bg-white p-3 shadow-sm sm:rounded-xl sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] sm:text-base">Business Display Mode</h3>
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)] sm:mt-1 sm:text-sm">
              Choose how businesses appear on the homepage.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="inline-flex w-full rounded-lg border border-[var(--color-border)] bg-gray-50 p-1 sm:w-auto">
              {[
                { key: 'category-based' as const, label: 'Category-Based' },
                { key: 'recently-added' as const, label: 'Recently Added' },
              ].map((mode) => {
                const isActive = currentDisplayMode === mode.key;
                return (
                  <button
                    key={mode.key}
                    type="button"
                    onClick={isActive ? undefined : handleToggleDisplayMode}
                    disabled={isActive || togglingDisplayMode || settingsLoading}
                    className={`inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-semibold transition-colors sm:h-9 sm:flex-none sm:gap-2 sm:px-3 sm:text-sm ${
                      isActive
                        ? 'bg-white text-[var(--color-primary)] shadow-sm'
                        : 'text-[var(--color-text-secondary)] hover:bg-white hover:text-[var(--color-text-primary)]'
                    } disabled:cursor-default`}
                  >
                    {isActive && <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                    {mode.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleToggleDisplayMode}
              disabled={togglingDisplayMode || settingsLoading}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[var(--color-text-primary)] px-3 text-xs font-bold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:px-4 sm:text-sm"
              title={currentDisplayMode === 'category-based' ? 'Switch to Recently Added mode' : 'Switch to Category-Based mode'}
            >
              {togglingDisplayMode ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                nextDisplayMode === 'category-based'
                  ? 'Switch '
                  : 'Switch'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-[var(--color-border)] sm:gap-2">
        {(['list', 'create', 'edit'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap border-b-2 px-3 py-2 text-xs font-semibold transition-colors sm:px-4 sm:py-3 sm:text-sm ${
              activeTab === tab
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            }`}
          >
            {tab === 'list' && 'Categories'}
            {tab === 'create' && 'Create New'}
            {tab === 'edit' && 'Edit'}
          </button>
        ))}
      </div>

      {/* List Tab */}
      {activeTab === 'list' && (
        <div className="space-y-2 sm:space-y-3">
          {categories.length === 0 ? (
            <div className="text-center py-8 text-[var(--color-text-muted)]">
              <p>No categories yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="grid gap-2">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between gap-2 rounded-lg border border-[var(--color-border)] bg-white p-3 transition-shadow hover:shadow-sm sm:rounded-xl sm:p-4">
                  <div className="flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-[var(--color-text-primary)] sm:text-base">{cat.name}</p>
                    <p className="mt-0.5 text-xs text-[var(--color-text-muted)] sm:mt-1">
                      {cat.subcategories?.length || 0} subcategorie{(cat.subcategories?.length || 0) !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1.5 sm:gap-2">
                    <button
                      onClick={() => handleEditClick(cat)}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:bg-red-50 sm:px-3 sm:text-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: cat.id, name: cat.name, type: 'category' })}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 sm:px-3 sm:text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Tab */}
      {activeTab === 'create' && (
        <form onSubmit={handleCreateSubmit} className="max-w-md space-y-3 rounded-lg border border-[var(--color-border)] bg-white p-3 sm:space-y-4 sm:rounded-xl sm:p-6">
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Category Name *</label>
            <input
              type="text"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              placeholder="e.g., Healthcare, Technology"
              className={`w-full border ${createErrors.name ? 'border-red-300 bg-red-50' : 'border-[var(--color-border)]'} rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors`}
            />
            {createErrors.name && <p className="text-xs text-red-600 mt-1">{createErrors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Serial Number</label>
            <input
              type="number"
              value={createForm.displayOrder ?? ''}
              onChange={(e) => setCreateForm({ ...createForm, displayOrder: e.target.value ? parseInt(e.target.value, 10) : undefined })}
              placeholder="Leave empty for auto-increment"
              className="w-full border border-[var(--color-border)] rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
              min="0"
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Lower numbers appear first. Leave empty to auto-assign.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Subcategories *</label>
            <div className="space-y-2 mb-3">
              {createSubcats.map((sc, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={sc.name}
                    onChange={(e) => {
                      const newArr = [...createSubcats];
                      newArr[idx] = { ...newArr[idx], name: e.target.value };
                      setCreateSubcats(newArr);
                    }}
                    placeholder="e.g., Fast Food, Grocery Store"
                    className="flex-1 border border-[var(--color-border)] rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
                  />
                  <input
                    type="number"
                    value={sc.displayOrder ?? ''}
                    onChange={(e) => {
                      const newArr = [...createSubcats];
                      newArr[idx] = { ...newArr[idx], displayOrder: e.target.value ? parseInt(e.target.value, 10) : undefined };
                      setCreateSubcats(newArr);
                    }}
                    placeholder="Order"
                    className="w-16 border border-[var(--color-border)] rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
                    min="0"
                    title="Serial number for ordering"
                  />
                  {createSubcats.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setCreateSubcats(createSubcats.filter((_, i) => i !== idx))}
                      className="px-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {createErrors.subcategories && <p className="text-xs text-red-600 mb-2">{createErrors.subcategories}</p>}
            <button
              type="button"
              onClick={() => setCreateSubcats([...createSubcats, { name: '', displayOrder: undefined }])}
              className="text-sm font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add another subcategory
            </button>
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                Creating...
              </>
            ) : (
              'Create Category'
            )}
          </button>
        </form>
      )}

      {/* Edit Tab */}
      {activeTab === 'edit' && editingCategory && (
        <div className="space-y-3 sm:space-y-6">
          <form onSubmit={handleUpdateSubmit} className="max-w-md space-y-4 rounded-lg border border-[var(--color-border)] bg-white p-3 sm:space-y-6 sm:rounded-xl sm:p-6">
            <h3 className="font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-3">Edit Category</h3>

            {/* General Settings */}
            <div>
              <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Category Name *</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className={`w-full border ${editErrors.name ? 'border-red-300 bg-red-50' : 'border-[var(--color-border)]'} rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors`}
              />
              {editErrors.name && <p className="text-xs text-red-600 mt-1">{editErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Serial Number</label>
              <input
                type="number"
                value={editForm.displayOrder ?? ''}
                onChange={(e) => setEditForm({ ...editForm, displayOrder: e.target.value ? parseInt(e.target.value, 10) : undefined })}
                placeholder="Lower numbers appear first"
                className="w-full border border-[var(--color-border)] rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
                min="0"
              />
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Lower numbers appear first in listing and filters.</p>
            </div>

            {/* Subcategories integrated manager */}
            <div className="pt-2">
              <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-3">Subcategories *</label>
              
              <div className="space-y-2 mb-4">
                {editingCategory.subcategories && editingCategory.subcategories.length > 0 ? (
                  editingCategory.subcategories.map((subcat) => (
                    <div key={subcat.id} className="p-3 bg-gray-50 rounded-xl border border-transparent hover:border-gray-200 transition-colors">
                      {editingSubcat?.id === subcat.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingSubcat.name}
                            onChange={(e) => setEditingSubcat({ ...editingSubcat, name: e.target.value })}
                            className="flex-1 border border-[var(--color-border)] rounded-md p-1.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleUpdateSubcategory();
                              }
                            }}
                          />
                          <input
                            type="number"
                            value={editingSubcat.displayOrder ?? ''}
                            onChange={(e) => setEditingSubcat({ ...editingSubcat, displayOrder: e.target.value ? parseInt(e.target.value, 10) : undefined })}
                            placeholder="Order"
                            className="w-16 border border-[var(--color-border)] rounded-md p-1.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                            min="0"
                            title="Serial number for ordering"
                          />
                          <button
                            type="button"
                            disabled={isUpdatingSubcat || !editingSubcat.name.trim()}
                            onClick={() => handleUpdateSubcategory()}
                            className="text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 cursor-pointer text-center min-w-[60px]"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingSubcat(null)}
                            className="text-sm font-semibold text-[var(--color-text-secondary)] bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded-md transition-colors cursor-pointer text-center flex-shrink-0"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-[var(--color-text-secondary)]">{subcat.name}</p>
                            {subcat.display_order !== undefined && (
                              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Serial: {subcat.display_order}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingSubcat({ id: subcat.id, name: subcat.name, displayOrder: subcat.display_order })}
                              className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer p-1"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget({ id: subcat.id, name: subcat.name, type: 'subcategory' })}
                              className="text-[var(--color-text-muted)] hover:text-red-600 transition-colors cursor-pointer p-1"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[var(--color-text-muted)] py-2 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">No subcategories setup yet.</p>
                )}
              </div>

              {/* Add Subcategory Inline Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubcatName}
                  onChange={(e) => setNewSubcatName(e.target.value)}
                  placeholder="New subcategory..."
                  className="flex-1 border border-[var(--color-border)] rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubcategory();
                    }
                  }}
                />
                <input
                  type="number"
                  value={newSubcatDisplayOrder ?? ''}
                  onChange={(e) => setNewSubcatDisplayOrder(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                  placeholder="Order"
                  className="w-16 border border-[var(--color-border)] rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                  min="0"
                  title="Serial number for ordering"
                />
                <button
                  type="button"
                  onClick={() => handleAddSubcategory()}
                  disabled={isAddingSubcat || !newSubcatName.trim()}
                  className="px-4 py-2.5 bg-gray-100 text-[var(--color-text-primary)] hover:bg-gray-200 disabled:opacity-50 font-semibold rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer flex-shrink-0"
                  title="Add Subcategory"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)]">
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm select-none"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                    Saving changes...
                  </>
                ) : (
                  'Update Category Name'
                )}
              </button>
              <p className="text-xs text-center text-[var(--color-text-muted)] mt-3">Subcategories are saved instantly when added or edited.</p>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          open={!!deleteTarget}
          title="Delete"
          message={
            deleteTarget.type === 'category' ? (
              <>Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This cannot be undone.</>
            ) : (
              <>Delete the subcategory <strong>{deleteTarget.name}</strong>?</>
            )
          }
          danger
          loading={isDeleting}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
