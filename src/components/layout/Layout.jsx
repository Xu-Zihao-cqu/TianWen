import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import '../../styles/observatory.css';

export default function Layout() {
  const home = useLocation().pathname === '/';
  return (
    <div className={`site-shell flex flex-col min-h-screen ${home ? 'space-layout' : ''}`}>
      <Navbar />
      <main id="main-content" className="flex-1 pt-[72px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
