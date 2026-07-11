import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronDown,
  Code2,
  Cpu,
  Github,
  Layers3,
  RadioTower,
  Terminal,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '../../hooks/useI18n.js';
import Typewriter from '../ui/Typewriter.jsx';
import { categories } from '../../data/categories.js';
import { getAllWorks } from '../../data/works/index.js';

export default function HeroSection({ profile }) {
  const { locale } = useI18n();
  const works = getAllWorks();
  const stats = [
    { label: locale === 'zh' ? '作品' : 'Works', value: works.length },
    { label: locale === 'zh' ? '板块' : 'Tracks', value: categories.length },
    { label: 'FPGA', value: 'RTL' },
    { label: locale === 'zh' ? '语言' : 'Lang', value: 'ZH/EN' },
  ];
  const signals = [
    { icon: Cpu, label: 'FPGA / Verilog', color: 'text-orange-300' },
    { icon: Code2, label: 'React / Vite', color: 'text-sky-300' },
    { icon: RadioTower, label: 'IoT / Embedded', color: 'text-emerald-300' },
    { icon: Layers3, label: 'Projects / Notes', color: 'text-fuchsia-300' },
  ];

  return (
    <section className="home-hero-scene relative min-h-screen overflow-hidden bg-[#11131a] text-white">
      <div className="home-circuit-grid absolute inset-0" />
      <div className="home-scanline absolute inset-x-0 top-0 h-px" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(17,19,26,0.88),rgba(17,19,26,0.54)_46%,rgba(17,19,26,0.9))]" />

      <div className="pointer-events-none absolute left-0 top-24 h-24 w-1/2 -skew-y-6 bg-gradient-to-r from-cyan-400/20 via-transparent to-transparent" />
      <div className="pointer-events-none absolute bottom-20 right-0 h-28 w-2/3 skew-y-6 bg-gradient-to-l from-rose-400/20 via-amber-300/10 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-28">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/75 shadow-2xl shadow-black/20 backdrop-blur"
          >
            <Terminal size={16} className="text-emerald-300" />
            {locale === 'zh' ? '天问 · 创作者实验室' : 'TianWen · Creator Lab'}
          </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
            className="relative mx-auto mb-7 h-32 w-32 md:h-36 md:w-36"
        >
            <div className="home-avatar-ring absolute inset-0 rounded-full" />
            <div className="absolute inset-2 overflow-hidden rounded-full border border-white/30 bg-white/10 shadow-2xl shadow-cyan-500/20 backdrop-blur">
            <img
              src={profile.avatar}
              alt={profile.nickname[locale]}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
            className="font-heading text-5xl font-black leading-none tracking-normal text-white md:text-7xl"
        >
            {locale === 'zh' ? '把想法做成作品' : 'Build Ideas Into Works'}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-5"
        >
          <Typewriter
            phrases={profile.heroPhrases[locale]}
              className="text-lg font-medium text-cyan-100 md:text-2xl"
            typingSpeed={80}
            deleteSpeed={40}
            pauseDuration={2500}
          />
        </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/70 md:text-lg"
          >
            {locale === 'zh'
              ? '这里收集硬件、软件、学习笔记和课程项目：从 FPGA 实时视觉到 Web 工具，把每一次折腾沉淀成可被浏览、理解和复用的作品。'
              : 'A living portfolio for hardware, software, notes, and coursework: from FPGA vision to web tools, turning experiments into browsable, reusable work.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              to="/works"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-xl shadow-black/25 transition-transform hover:-translate-y-0.5"
            >
              {locale === 'zh' ? '进入作品集' : 'Explore Works'}
              <ArrowRight size={17} />
            </Link>
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/20"
            >
              <Github size={17} />
              GitHub
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.05 }}
          className="mt-14 grid gap-3 md:grid-cols-4"
        >
          {stats.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">
              <div className="font-heading text-2xl font-bold text-white">{item.value}</div>
              <div className="mt-1 text-xs font-semibold uppercase text-white/50">{item.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.18 }}
          className="mt-4 grid gap-3 md:grid-cols-4"
        >
          {signals.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="home-signal-card rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur" style={{ animationDelay: `${index * 0.35}s` }}>
                <div className="flex items-center gap-3">
                  <Icon size={18} className={item.color} />
                  <span className="text-sm font-semibold text-white/80">{item.label}</span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1 }, y: { repeat: Infinity, duration: 2 } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <ChevronDown size={28} className="text-white/60" />
      </motion.div>
    </section>
  );
}
