import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n.js';
import HeroSection from '../components/features/HeroSection.jsx';
import LabSections from '../components/features/LabSections.jsx';
import FeaturedWorks from '../components/features/FeaturedWorks.jsx';
import { defaultSEO } from '../data/seo.js';
import { profile } from '../data/profile.js';
import { skills } from '../data/skills.js';
import { getFeaturedWorks } from '../data/works/index.js';
import '../styles/observatory.css';

export default function HomePage() {
  const { locale } = useI18n();
  const featuredWorks = getFeaturedWorks();

  return (
    <div className="observatory">
      <Helmet>
        <title>{defaultSEO.title}</title>
        <meta name="description" content={defaultSEO.description[locale]} />
        <meta property="og:title" content={defaultSEO.title} />
        <meta property="og:description" content={defaultSEO.description[locale]} />
        <meta property="og:image" content={defaultSEO.ogImage} />
        <meta property="og:site_name" content={defaultSEO.siteName} />
      </Helmet>
      <HeroSection profile={profile} />
      <FeaturedWorks works={featuredWorks} />
      <LabSections profile={profile} skills={skills} />
    </div>
  );
}
