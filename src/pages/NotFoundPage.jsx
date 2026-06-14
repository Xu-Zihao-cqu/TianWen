import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Helmet>
        <title>404 | 天问 TianWen</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="text-center">
        <h1 className="text-8xl font-heading font-bold gradient-text mb-4">404</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 mb-8">
          页面未找到
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
