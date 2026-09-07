import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDown, Cpu, Code2, RadioTower } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '../../hooks/useI18n.js';
import { categories } from '../../data/categories.js';
import { getAllWorks } from '../../data/works/index.js';

export default function HeroSection({ profile }) {
  const { locale } = useI18n();
  const zh = locale === 'zh';
  return <section className="studio-hero relative isolate overflow-hidden bg-[#080f17] text-white">
    <div aria-hidden="true" className="studio-aurora" />
    <div aria-hidden="true" className="studio-grid absolute inset-0" />
    <div className="relative mx-auto max-w-6xl px-5 pb-8 pt-16 md:pt-24">
      <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-5 text-[10px] font-medium tracking-[0.2em] text-slate-400 md:mb-16">
        <span className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_12px_#5eead4]" />INDEPENDENT CREATOR & ENGINEER</span><span className="hidden sm:block">CHONGQING, CN / TIANWEN</span>
      </div>
      <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="mb-6 font-mono text-xs tracking-[0.25em] text-teal-300">IDEAS. ENGINEERED.</p>
          <h1 className="text-[clamp(3rem,6vw,5.5rem)] font-semibold leading-[1.18] tracking-tight">{zh ? <>让想象，<br />成为<span className="studio-hero-word">现实。</span></> : <>Imagine it.<br /><span className="studio-hero-word">Engineer it.</span></>}</h1>
          <p className="mt-7 max-w-md text-base leading-8 text-slate-400">{zh ? '在硬件与软件的交汇处，探索技术的可能。从一条电路到一个系统，让每个想法都有真实的回响。' : 'Exploring the space between hardware and software. From a single circuit to a complete system, giving ideas a life beyond the sketch.'}</p>
          <div className="mt-9 flex flex-wrap gap-4"><Link to="/works" className="inline-flex items-center gap-8 rounded-full bg-teal-200 px-6 py-4 text-sm font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-teal-100">{zh ? '探索作品' : 'Explore works'}<ArrowUpRight size={19} /></Link><Link to="/works/blog" className="inline-flex items-center gap-6 rounded-full border border-white/20 px-6 py-4 text-sm transition hover:border-white/60 hover:bg-white/5">{zh ? '阅读博客' : 'Read the journal'}<ArrowUpRight size={18} /></Link></div>
          <div className="mt-10 flex items-center gap-3"><img src={profile.avatar} alt={profile.nickname[locale]} className="h-9 w-9 rounded-full border border-white/20 object-cover" /><div className="text-xs text-slate-400"><span className="text-white">{profile.nickname[locale]}</span><span className="mx-2 text-slate-600">/</span>{zh ? '保持好奇，持续创造' : 'Stay curious. Keep building.'}</div></div>
        </motion.div>
        <div className="studio-orbit-scene relative mx-auto w-full max-w-[470px]" aria-label={zh ? '硬件、软件与物联网的交汇' : 'Hardware, software and IoT converge'}>
          <div aria-hidden="true" className="studio-orbit orbit-one" /><div aria-hidden="true" className="studio-orbit orbit-two" /><div aria-hidden="true" className="studio-orbit orbit-three" />
          <div className="studio-core"><div className="mb-3 font-mono text-[9px] tracking-[0.25em] text-teal-300">THE CREATIVE CORE</div><Cpu size={48} strokeWidth={1} className="mx-auto text-teal-100" /><div className="mt-4 text-2xl font-semibold tracking-[0.15em]">天问</div><div className="mt-2 font-mono text-[9px] tracking-[0.35em] text-slate-500">TIANWEN LAB</div></div>
          {[{ icon: Cpu, name: 'HARDWARE', sub: 'From circuits to systems', cls: 'node-hardware' }, { icon: Code2, name: 'SOFTWARE', sub: 'Built with intention', cls: 'node-software' }, { icon: RadioTower, name: 'CONNECTED', sub: 'Beyond the edge', cls: 'node-connected' }].map(({ icon: Icon, name, sub, cls }) => <div key={name} className={`studio-node ${cls}`}><Icon size={17} className="text-teal-200" /><div><div className="font-mono text-[10px] tracking-widest">{name}</div><div className="mt-1 text-[9px] text-slate-400">{sub}</div></div></div>)}
          <p className="absolute bottom-2 left-0 right-0 text-center font-mono text-[9px] tracking-[0.3em] text-slate-500">EXPLORE / CONNECT / CREATE</p>
        </div>
      </div>
      <div className="mt-16 grid grid-cols-3 items-end gap-4 border-t border-white/10 pt-7 md:mt-20 md:grid-cols-4">
        <div><span className="font-heading text-3xl">{String(getAllWorks().length).padStart(2, '0')}</span><span className="ml-3 text-xs text-slate-500">{zh ? '件作品' : 'Projects'}</span></div><div><span className="font-heading text-3xl">0{categories.length}</span><span className="ml-3 text-xs text-slate-500">{zh ? '个探索方向' : 'Disciplines'}</span></div><div className="font-mono text-xs leading-6 text-slate-400">HARDWARE × SOFTWARE<br /><span className="text-teal-200/70">BUILT WITH CURIOSITY</span></div><a href="#selected-work" className="hidden items-center justify-end gap-3 text-[10px] tracking-[0.2em] text-slate-400 md:flex">SCROLL TO EXPLORE<ArrowDown size={15} /></a>
      </div>
    </div>
  </section>;
}
