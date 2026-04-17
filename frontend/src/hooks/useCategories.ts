import { useState, useCallback, useEffect } from 'react';
import type { Category, Subcategory } from '../types';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from '../services/api';

export interface UseCategories {
  categories: Category[];
  subcategoriesMap: { [categoryId: number]: Subcategory[] };
  loading: boolean;
  error: string | null;

  createCategory: (name: string, description?: string, token?: string, displayOrder?: number) => Promise<Category>;
  updateCategory: (id: number, updates: Partial<Category>, token: string) => Promise<void>;
  deleteCategory: (id: number, token: string) => Promise<void>;

  createSubcategory: (categoryId: number, name: string, token: string, displayOrder?: number) => Promise<Subcategory>;
  updateSubcategory: (id: number, name: string, token: string, displayOrder?: number) => Promise<void>;
  deleteSubcategory: (id: number, token: string) => Promise<void>;

  refresh: () => Promise<void>;
}

export function useCategories(): UseCategories {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Build subcategories map for easy lookup
  const subcategoriesMap: { [categoryId: number]: Subcategory[] } = {};
  categories.forEach((cat) => {
    if (cat.subcategories) {
      subcategoriesMap[cat.id] = cat.subcategories;
    }
  });

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleCreateCategory = useCallback(
    async (name: string, description?: string, token?: string, displayOrder?: number): Promise<Category> => {
      if (!token) throw new Error('Token required');
      try {
        const newCategory = await createCategory(name, description, displayOrder, token);
        // Refresh to ensure consistency
        await refresh();
        return newCategory;
      } catch (err: any) {
        throw new Error(err?.message || 'Failed to create category');
      }
    },
    [refresh]
  );

  const handleUpdateCategory = useCallback(
    async (id: number, updates: Partial<Category>, token: string) => {
      try {
        await updateCategory(id, updates, token);
        await refresh();
      } catch (err: any) {
        throw new Error(err?.message || 'Failed to update category');
      }
    },
    [refresh]
  );

  const handleDeleteCategory = useCallback(
    async (id: number, token: string) => {
      try {
        await deleteCategory(id, token);
        await refresh();
      } catch (err: any) {
        throw new Error(err?.message || 'Failed to delete category');
      }
    },
    [refresh]
  );

  const handleCreateSubcategory = useCallback(
    async (categoryId: number, name: string, token: string, displayOrder?: number): Promise<Subcategory> => {
      try {
        const newSubcategory = await createSubcategory(categoryId, name, displayOrder, token);
        await refresh();
        return newSubcategory;
      } catch (err: any) {
        throw new Error(err?.message || 'Failed to create subcategory');
      }
    },
    [refresh]
  );

  const handleUpdateSubcategory = useCallback(
    async (id: number, name: string, token: string, displayOrder?: number) => {
      try {
        await updateSubcategory(id, name, displayOrder, token);
        await refresh();
      } catch (err: any) {
        throw new Error(err?.message || 'Failed to update subcategory');
      }
    },
    [refresh]
  );

  const handleDeleteSubcategory = useCallback(
    async (id: number, token: string) => {
      try {
        await deleteSubcategory(id, token);
        await refresh();
      } catch (err: any) {
        throw new Error(err?.message || 'Failed to delete subcategory');
      }
    },
    [refresh]
  );

  return {
    categories,
    subcategoriesMap,
    loading,
    error,
    createCategory: handleCreateCategory,
    updateCategory: handleUpdateCategory,
    deleteCategory: handleDeleteCategory,
    createSubcategory: handleCreateSubcategory,
    updateSubcategory: handleUpdateSubcategory,
    deleteSubcategory: handleDeleteSubcategory,
    refresh,
  };
}
