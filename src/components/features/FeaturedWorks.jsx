import { Link } from 'react-router-dom';
import { ArrowUpRight, MoveRight } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n.js';
import { categories } from '../../data/categories.js';
export default function FeaturedWorks({ works }) {
  const { locale } = useI18n();
  const zh = locale === 'zh';
  return <section id="selected-work" className="lab-section lab-container">
    <header className="lab-section-header"><div><p className="lab-overline">01 / SELECTED EXPLORATIONS</p><h2>{zh ? '想法，已着陆。' : 'Ideas, made real.'}</h2></div><Link to="/works" className="lab-text-link">{zh ? '全部作品' : 'All projects'} <MoveRight size={18} /></Link></header>
    <div className="project-atlas">{works.map((work, i) => {
      const category = categories.find(c => c.id === work.category);
      return <Link key={work.id} to={`/works/${work.category}/${work.id}`} className="atlas-project" style={{ '--project-accent': category?.gradient.from || '#efba80' }}>
        <div className="atlas-image"><img src={work.coverImage} alt={work.title[locale]} loading="lazy" /><span className="atlas-index">EXPERIMENT / {String(i + 1).padStart(2, '0')}</span><span className="atlas-open"><ArrowUpRight size={20} /></span></div>
        <div className="atlas-body"><div className="atlas-meta"><span>{category?.name[locale]}</span><span>{work.createdAt?.slice(0, 4)}</span></div><h3>{work.title[locale]}</h3><p>{work.description.short[locale]}</p><div className="atlas-tags">{work.tags.slice(0, 4).map(tag => <span key={tag}>{tag}</span>)}</div></div>
      </Link>;
    })}</div>
    {!works.length && <p className="lab-muted">{zh ? '新的探索正在进行中。' : 'New experiments are underway.'}</p>}
  </section>;
}
