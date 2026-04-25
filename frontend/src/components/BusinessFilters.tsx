import { Search, X } from 'lucide-react';
import { CITIES } from '../constants';

interface BusinessFiltersProps {
  city: string;
  category: string;
  subCategory: string;
  categoryNames: string[];
  categoryMap: Record<string, string[]>;
  allSubCategories: string[];
  onCityChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSubCategoryChange: (value: string) => void;
  onSearch: () => void;
  onClear?: () => void;
  showClearButton?: boolean;
}

const fieldClassName =
  'h-10 w-full min-w-0 rounded-lg border border-red-300 bg-white px-3 text-[12px] font-medium text-[var(--color-text-secondary)] shadow-sm outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-[var(--color-text-muted)] sm:h-11 sm:text-sm';

const searchButtonClassName =
  'flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-sm transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 sm:h-11 sm:w-11';

export default function BusinessFilters({
  city,
  category,
  subCategory,
  categoryNames,
  categoryMap,
  allSubCategories,
  onCityChange,
  onCategoryChange,
  onSubCategoryChange,
  onSearch,
  onClear,
  showClearButton = false,
}: BusinessFiltersProps) {
  const availableSubCategories =
    category && categoryMap[category]
      ? categoryMap[category]
      : allSubCategories;

  const gridClassName = showClearButton
    ? 'grid gap-2 grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_2.5rem] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_2.75rem_auto]'
    : 'grid gap-2 grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_2.5rem] sm:gap-2.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_2.75rem]';

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-white p-2.5 shadow-sm sm:p-3">
      <div className={gridClassName}>
        <div className="min-w-0">
          <label htmlFor="business-filter-city" className="sr-only">
            City
          </label>
          <select
            id="business-filter-city"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            className={fieldClassName}
          >
            <option value="">City</option>
            {CITIES.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0">
          <label htmlFor="business-filter-category" className="sr-only">
            Category
          </label>
          <select
            id="business-filter-category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={fieldClassName}
          >
            <option value="">Category</option>
            {categoryNames.map((categoryName) => (
              <option key={categoryName} value={categoryName}>
                {categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0">
          <label htmlFor="business-filter-subcategory" className="sr-only">
            Subcategory
          </label>
          <select
            id="business-filter-subcategory"
            value={subCategory}
            onChange={(e) => onSubCategoryChange(e.target.value)}
            className={fieldClassName}
            disabled={
              !!category &&
              (!categoryMap[category] || categoryMap[category].length === 0)
            }
          >
            <option value="">Sub Category</option>
            {availableSubCategories.map((subcategoryName) => (
              <option key={subcategoryName} value={subcategoryName}>
                {subcategoryName}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onSearch}
          className={searchButtonClassName}
          aria-label="Search businesses"
        >
          <Search className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        {showClearButton && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="col-span-full flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-4 text-sm font-semibold text-[var(--color-text-secondary)] shadow-sm transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 sm:h-11 xl:col-auto"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
