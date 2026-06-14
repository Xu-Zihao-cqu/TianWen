import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">
              出错了
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md">
              页面遇到了意外错误，请刷新页面重试。
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 gradient-primary text-white rounded-xl font-medium"
            >
              刷新页面
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
