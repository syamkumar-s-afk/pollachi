import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary — catches rendering errors app-wide
 * and shows a beautiful fallback UI with retry capability.
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--color-background-gray)] flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-10 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
              Something went wrong
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mb-2 leading-relaxed">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            {this.state.error && (
              <p className="text-xs text-[var(--color-text-muted)] bg-gray-50 rounded-lg p-3 mb-6 font-mono break-all">
                {this.state.error.message}
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-[var(--color-text-primary)] font-semibold text-sm px-6 py-3 rounded-xl transition-colors cursor-pointer"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
