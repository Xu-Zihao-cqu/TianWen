import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/index.js';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import ErrorBoundary from './components/ui/ErrorBoundary.jsx';
import Layout from './components/layout/Layout.jsx';
import ScrollToTop from './components/layout/ScrollToTop.jsx';
import LoadingScreen from './components/ui/LoadingScreen.jsx';
import LoginPage from './pages/LoginPage.jsx';

// 路由级代码分割
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const WorksPage = lazy(() => import('./pages/WorksPage.jsx'));
const WorksListPage = lazy(() => import('./pages/WorksListPage.jsx'));
const WorkDetailPage = lazy(() => import('./pages/WorkDetailPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));
const BlogPage = lazy(() => import('./pages/BlogPage.jsx'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage.jsx'));
const BlogEditorPage = lazy(() => import('./pages/BlogEditorPage.jsx'));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="works" element={<WorksPage />} />
          <Route path="works/blog" element={<BlogPage />} />
          <Route path="works/blog/new" element={<BlogEditorPage />} />
          <Route path="works/blog/:postId/edit" element={<BlogEditorPage />} />
          <Route path="works/blog/:postId" element={<BlogDetailPage />} />
          <Route path="works/:category" element={<WorksListPage />} />
          <Route path="works/:category/:workId" element={<WorkDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function AuthGate() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <AnimatedRoutes />
    </Suspense>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider>
            <AuthProvider>
              <BrowserRouter>
                <ScrollToTop />
                <MotionConfig reducedMotion="user"><AuthGate /></MotionConfig>
              </BrowserRouter>
            </AuthProvider>
          </ThemeProvider>
        </I18nextProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
