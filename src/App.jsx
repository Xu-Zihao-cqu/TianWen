import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/index.js';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import Layout from './components/layout/Layout.jsx';
import ScrollToTop from './components/layout/ScrollToTop.jsx';
import HomePage from './pages/HomePage.jsx';
import WorksPage from './pages/WorksPage.jsx';
import WorksListPage from './pages/WorksListPage.jsx';
import WorkDetailPage from './pages/WorkDetailPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="works" element={<WorksPage />} />
              <Route path="works/:category" element={<WorksListPage />} />
              <Route path="works/:category/:workId" element={<WorkDetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;

/* ==========================================
   后续步骤预留 Provider
   Step 11: + AnimatePresence (路由过渡动效)
   Step 12: + React.lazy + Suspense + HelmetProvider + ErrorBoundary
   ========================================== */
