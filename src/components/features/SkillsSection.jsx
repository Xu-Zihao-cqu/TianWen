import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../../hooks/useI18n.js';
import { getIcon } from '../../utils/icons.js';

const categoryLabels = {
  all: { zh: '全部', en: 'All' },
  frontend: { zh: '前端', en: 'Frontend' },
  backend: { zh: '后端', en: 'Backend' },
  embedded: { zh: '嵌入式', en: 'Embedded' },
  tooling: { zh: '工具链', en: 'Tooling' },
};

export default function SkillsSection({ skills }) {
  const { locale } = useI18n();
  const [activeTab, setActiveTab] = useState('all');

  const categories = useMemo(() => {
    const cats = [...new Set(skills.map((s) => s.category))];
    return ['all', ...cats];
  }, [skills]);

  const filtered = activeTab === 'all' ? skills : skills.filter((s) => s.category === activeTab);
  const averageLevel = Math.round(skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length);

  return (
    <section className="bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <div className="mb-10">
              <div className="mb-4 h-1 w-14 rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300" />
              <h2 className="font-heading text-3xl font-black text-white md:text-5xl">
                {locale === 'zh' ? '技能控制台' : 'Skill Console'}
              </h2>
              <p className="mt-4 text-base leading-7 text-white/50">
                {locale === 'zh' ? '把想法落地时经常用到的工具箱' : 'The toolkit behind the build process'}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <p className="text-sm leading-7 text-white/70">
                {locale === 'zh'
                  ? '从前端界面、后端脚本到嵌入式开发，技能栈服务于作品本身：能做、能调、能展示，也能把过程写清楚。'
                  : 'From frontend interfaces and backend scripts to embedded development, the stack serves the work: build it, tune it, present it, and explain it.'}
              </p>
              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="font-heading text-3xl font-bold">{skills.length}</div>
                  <div className="mt-1 text-xs font-semibold uppercase text-white/50">
                    {locale === 'zh' ? '技能项' : 'Skills'}
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="font-heading text-3xl font-bold">{averageLevel}%</div>
                  <div className="mt-1 text-xs font-semibold uppercase text-white/50">
                    {locale === 'zh' ? '平均熟练度' : 'Avg Level'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map((cat) => {
                const active = activeTab === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveTab(cat)}
                    className={[
                      'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                      active
                        ? 'bg-white text-slate-950 shadow-lg shadow-white/10'
                        : 'border border-white/10 bg-white/10 text-white/70 hover:bg-white/20',
                    ].join(' ')}
                  >
                    {categoryLabels[cat]?.[locale] || cat}
                  </button>
                );
              })}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((skill, index) => {
                const Icon = getIcon(skill.icon);
                return (
                  <motion.div
                    key={`${skill.name.en}-${activeTab}`}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                    className="group rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur transition-all hover:-translate-y-1 hover:bg-white/20"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-950">
                          {Icon && <Icon size={20} />}
                        </div>
                        <div>
                          <h3 className="font-heading text-base font-semibold text-white">
                            {skill.name[locale]}
                          </h3>
                          <p className="mt-0.5 text-xs font-semibold uppercase text-white/40">
                            {categoryLabels[skill.category]?.[locale] || skill.category}
                          </p>
                        </div>
                      </div>
                      <span className="font-heading text-xl font-bold text-white/90">
                        {skill.level}
                      </span>
                    </div>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: index * 0.06 }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
