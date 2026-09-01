import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Jan Nigrani Platform Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-slate-800 p-8 rounded-3xl border border-slate-700 space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500 text-indigo-400 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h1 className="text-xl font-bold text-white">Jan Nigrani Platform</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              We encountered a temporary rendering state. Click below to reload the public dashboard with real-time audit data.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-md cursor-pointer"
            >
              Reload Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
