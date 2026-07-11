import { Github, ArrowUp, Sparkles } from 'lucide-react';
import { profile } from '../../data/profile.js';

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950 text-white">
      <div className="home-circuit-grid absolute inset-0 opacity-20" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950">
            <Sparkles size={18} />
          </span>
          <div>
            <p className="font-heading text-base font-black">天问 TianWen</p>
            <p className="mt-1 text-xs text-white/50">
              &copy; {year} Built with curiosity and code.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {profile.contact.github && (
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/10 bg-white/10 p-2 text-white/70 transition-all hover:-translate-y-0.5 hover:bg-white/20 hover:text-white"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
          )}

          <button
            onClick={scrollToTop}
            className="rounded-full border border-white/10 bg-white/10 p-2 text-white/70 transition-all hover:-translate-y-0.5 hover:bg-white/20 hover:text-white"
            aria-label="回到顶部"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
}
