import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '../../hooks/useI18n.js';
import Typewriter from '../ui/Typewriter.jsx';

export default function HeroSection({ profile }) {
  const { locale } = useI18n();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 渐变背景（流动动画） */}
      <style>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradientFlow 8s ease infinite',
        }}
      />
      <div className="absolute inset-0 z-0 opacity-30" style={{
        background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
      }} />

      <div className="relative z-10 text-center px-4">
        {/* 头像 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="w-28 h-28 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden border-4 border-white/30 shadow-xl">
            <img
              src={profile.avatar}
              alt={profile.nickname[locale]}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* 昵称 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-5xl font-heading font-bold text-white mb-4"
        >
          {profile.nickname[locale]}
        </motion.h1>

        {/* 打字机 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Typewriter
            phrases={profile.heroPhrases[locale]}
            className="text-lg md:text-xl text-white/80 font-medium"
            typingSpeed={80}
            deleteSpeed={40}
            pauseDuration={2500}
          />
        </motion.div>
      </div>

      {/* 向下箭头 */}
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
