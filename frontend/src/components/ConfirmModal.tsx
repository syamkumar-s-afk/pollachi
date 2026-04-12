import { type ReactNode } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Lightweight confirmation modal to replace browser confirm() dialogs.
 * Supports loading state for async confirmation actions.
 */
export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="modal-overlay fixed inset-0 z-[9998] flex items-center justify-center p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="modal-content relative bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              danger ? 'bg-red-50' : 'bg-amber-50'
            }`}
          >
            <AlertTriangle
              className={`w-6 h-6 ${
                danger ? 'text-red-600' : 'text-amber-600'
              }`}
            />
          </div>

          <h2
            id="confirm-modal-title"
            className="text-lg font-bold text-[var(--color-text-primary)] mb-2"
          >
            {title}
          </h2>
          <div className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {message}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-[var(--color-text-primary)] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50 cursor-pointer ${
              danger
                ? 'bg-[var(--color-danger)] hover:bg-[var(--color-danger-hover)]'
                : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]'
            }`}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="opacity-25"
                  />
                  <path
                    d="M4 12a8 8 0 018-8"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="opacity-75"
                  />
                </svg>
                Processing…
              </span>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
