import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDown, Github } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n.js';
import BlackHoleScene from './BlackHoleScene.jsx';

export default function HeroSection({ profile }) {
  const { locale } = useI18n();
  const zh = locale === 'zh';
  return <section className="event-horizon" aria-labelledby="horizon-title">
    <div className="observatory-stars" aria-hidden="true" />
    <BlackHoleScene />
    <div className="horizon-coordinates" aria-hidden="true"><span>天问 / TIANWEN</span><span>INDEPENDENT EXPLORATIONS — VOL. 01</span></div>
    <div className="lab-container horizon-content">
      <div className="horizon-copy">
        <p className="lab-overline"><span className="status-dot" /> CREATIVE ENGINEERING / {profile.nickname[locale]}</p>
        <h1 id="horizon-title">{zh ? <>保持好奇。<br /><span>越过视界。</span></> : <>Stay curious.<br /><span>Go beyond.</span></>}</h1>
        <p className="horizon-description">{zh ? '用电路感知世界，用代码回应想象。' : 'Sense the world through circuits. Give imagination a voice through code.'}<br />{zh ? '这里是我的数字实验室，收藏每一次对未知的探索。' : 'A digital laboratory for experiments at the edge of the known.'}</p>
        <div className="horizon-actions"><Link to="/works" className="lab-button">{zh ? '进入作品集' : 'Explore my work'}<ArrowUpRight size={18} /></Link><a className="lab-text-link" href={profile.contact.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={13} /></a></div>
        <div className="horizon-signature"><span className="signature-line" /><span>HARDWARE × SOFTWARE × CURIOSITY</span></div>
      </div>
      <div className="horizon-caption" aria-hidden="true"><span className="crosshair">+</span><p>EVENT HORIZON<span>{zh ? '未知，是探索的起点。' : 'The unknown is a place to begin.'}</span></p></div>
      <div className="horizon-bottom"><a href="#selected-work"><ArrowDown size={15} /> {zh ? '向下探索' : 'Scroll to explore'}</a><span>BUILD SOMETHING WORTH DISCOVERING.</span><span className="horizon-index">01 — ∞</span></div>
    </div>
  </section>;
}
