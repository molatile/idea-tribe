import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`[ErrorBoundary - ${this.props.pageName || 'Page'}] Error:`, error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#FDFBF7]">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-stone-200 p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-[#C68537]">
              <AlertCircle size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-playfair font-bold text-stone-900 mb-2">
                Unable to Load {this.props.pageName || 'Section'}
              </h2>
              <p className="text-sm text-stone-600 font-light leading-relaxed">
                A temporary error occurred while displaying this cultural section. The rest of the site and voice assistant remain active.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#C68537] text-white font-medium hover:bg-[#b0742f] transition-colors"
              >
                <RefreshCw size={16} /> Try Again
              </button>
              <a
                href="/"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 font-medium transition-colors"
              >
                <Home size={16} /> Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
