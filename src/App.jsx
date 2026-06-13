import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import ScrollToTop from './components/layout/ScrollToTop.jsx';
import HomePage from './pages/HomePage.jsx';
import WorksPage from './pages/WorksPage.jsx';
import WorksListPage from './pages/WorksListPage.jsx';
import WorkDetailPage from './pages/WorkDetailPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
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
  );
}

export default App;

/* ==========================================
   Provider 嵌套骨架（未来步骤逐步激活）
   Step 4:  + I18nextProvider + ThemeProvider
   Step 11: + AnimatePresence
   Step 12: + React.lazy + Suspense
   ==========================================

   <HelmetProvider>
     <ErrorBoundary>
       <I18nextProvider>
         <ThemeProvider>
           <BrowserRouter>
             <ScrollToTop />
             <AnimatePresence>
               <Suspense fallback={<LoadingScreen />}>
                 <Routes>...</Routes>
               </Suspense>
             </AnimatePresence>
           </BrowserRouter>
         </ThemeProvider>
       </I18nextProvider>
     </ErrorBoundary>
   </HelmetProvider>
*/
