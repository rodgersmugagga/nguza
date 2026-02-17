import React from 'react';
import { Helmet } from 'react-helmet-async';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
          <Helmet>
            <title>Error - Nguza Products</title>
          </Helmet>
          <div className="text-6xl mb-6">🏜️</div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-500 font-medium mb-8">We encountered an unexpected error. Please try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-700 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-emerald-700/20 active:scale-95 transition-all"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
