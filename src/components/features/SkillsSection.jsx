import { useState, useMemo } from 'react';
import { useI18n } from '../../hooks/useI18n.js';
import SectionTitle from '../ui/SectionTitle.jsx';
import ProgressBar from '../ui/ProgressBar.jsx';
import Tag from '../ui/Tag.jsx';
import ScrollReveal from './ScrollReveal.jsx';

export default function SkillsSection({ skills }) {
  const { locale } = useI18n();
  const [activeTab, setActiveTab] = useState('all');

  const categories = useMemo(() => {
    const cats = [...new Set(skills.map((s) => s.category))];
    return ['all', ...cats];
  }, [skills]);

  const filtered = activeTab === 'all' ? skills : skills.filter((s) => s.category === activeTab);

  return (
    <section className="max-w-6xl mx-auto px-4 py-20 md:py-28 bg-slate-50/50 dark:bg-slate-800/30">
      <SectionTitle
        title={locale === 'zh' ? '技能栈' : 'Skills'}
        subtitle={locale === 'zh' ? '技术能力一览' : 'Technical Skills Overview'}
      />

      {/* Tab 切换 */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <Tag
            key={cat}
            active={activeTab === cat}
            onClick={() => setActiveTab(cat)}
            className="cursor-pointer capitalize"
          >
            {cat === 'all' ? (locale === 'zh' ? '全部' : 'All') : cat}
          </Tag>
        ))}
      </div>

      {/* 进度条列表 */}
      <div className="space-y-4 max-w-2xl">
        {filtered.map((skill, i) => (
          <ScrollReveal key={i}>
            <ProgressBar
              level={skill.level}
              label={skill.name[locale]}
              animated
            />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
