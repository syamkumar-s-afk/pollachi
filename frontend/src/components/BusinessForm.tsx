import type { Category } from '../types';

interface BusinessFormProps {
  onSubmit: (formData: FormData, id: number | null) => Promise<void>;
  categories: Category[];
  isLoading: boolean;
  errors: Record<string, string>;
}

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

export default function BusinessForm({
  categories,
}: BusinessFormProps) {
  // Note: This component is a simplified version for the plan.
  // In actual implementation, it would receive form state and handlers from the parent Admin component.
  // The full implementation in Admin.tsx maintains the complete form logic.



  return (
    <div className="max-w-2xl">
      <p className="text-sm text-[var(--color-text-muted)] mb-4">
        Categories are now managed in the "Category Management" section. Subcategories will appear below once you select a category.
      </p>
      <div className="bg-white border border-[var(--color-border)] rounded-xl p-6">
        <p className="text-[var(--color-text-secondary)] font-semibold mb-4">
          Form will automatically populate categories from the database.
        </p>
        <p className="text-sm text-[var(--color-text-muted)]">
          Total categories available: <span className="font-bold">{categories.length}</span>
        </p>
      </div>
    </div>
  );
}
