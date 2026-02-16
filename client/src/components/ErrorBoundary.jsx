import React from 'react';
import { Helmet } from 'react-helmet-async';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🔴 Error Boundary caught:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Log to external service in production
    // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <>
          <Helmet>
            <title>Error - Rodvers Listings</title>
          </Helmet>
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-red-100 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6 sm:p-8">
              {/* Error Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">⚠️</span>
                </div>
              </div>

              {/* Error Title */}
              <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
                Something went wrong
              </h1>

              {/* Error Description */}
              <p className="text-center text-gray-600 mb-4">
                We're sorry! An unexpected error occurred. Our team has been notified.
              </p>

              {/* Error Details (Development Only) */}
              {import.meta.env.DEV && this.state.error && (
                <div className="bg-gray-100 rounded p-3 mb-6 max-h-32 overflow-y-auto">
                  <p className="text-xs font-mono text-red-600 break-words">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="text-xs font-bold cursor-pointer text-gray-700">
                        Component Stack
                      </summary>
                      <pre className="text-xs text-gray-600 overflow-auto mt-1">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex-1 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition duration-200"
                >
                  Go Home
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold rounded-lg transition duration-200"
                >
                  Reload Page
                </button>
              </div>

              {/* Support Message */}
              <p className="text-xs text-center text-gray-500 mt-4">
                If this issue persists, please contact support
              </p>
            </div>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}
