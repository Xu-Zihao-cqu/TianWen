import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Code2, Terminal, Github, Mail } from 'lucide-react';
import { categories } from '../../data/categories.js';
import { useI18n } from '../../hooks/useI18n.js';
import { getIcon } from '../../utils/icons.js';
const groups = { all: ['全部', 'All'], embedded: ['嵌入式', 'Embedded'], frontend: ['前端', 'Frontend'], backend: ['后端', 'Backend'], tooling: ['工具链', 'Tooling'] };
export default function LabSections({ profile, skills }) {
  const { locale } = useI18n();
  const zh = locale === 'zh';
  const [filter, setFilter] = useState('all');
  return <>
    <section className="lab-section lab-container lab-directions">
      <div className="lab-intro"><p className="lab-overline">02 / THE EXPLORATION MAP</p><h2>{zh ? <>从比特，<br />到真实世界。</> : <>From bits.<br />To the real world.</>}</h2><p className="lab-muted">{zh ? '不设边界，只问可能。电路、系统、工具与文字，是我理解世界的不同语言。' : 'Circuits, systems, tools, and words. Different languages for understanding the same world.'}</p><span className="lab-coordinate">[ OPEN MIND. OPEN POSSIBILITIES. ]</span></div>
      <div className="direction-list">{categories.map((category, i) => { const Icon = getIcon(category.icon); return <Link className="direction-row" key={category.id} to={`/works/${category.id}`}><span className="direction-number">0{i + 1}</span><span className="direction-icon">{Icon && <Icon size={23} strokeWidth={1.25} />}</span><div><h3>{category.name[locale]}</h3><p>{category.description[locale]}</p></div><ArrowUpRight size={20} /></Link>; })}</div>
    </section>
    <section className="lab-section lab-container lab-toolkit">
      <header className="lab-section-header"><div><p className="lab-overline">03 / BEHIND THE BUILD</p><h2>{zh ? '把好奇心，编译成现实。' : 'Curiosity, compiled.'}</h2></div><Code2 size={34} strokeWidth={1} className="lab-muted" /></header>
      <div className="toolkit-grid"><div className="lab-terminal"><div className="terminal-bar"><span><i /><i /><i /></span><span>explorer.config</span><Terminal size={14} /></div><div className="terminal-body"><p><span className="terminal-comment">// {zh ? '关于这间数字实验室' : 'A little about this laboratory'}</span></p><p><span className="terminal-purple">const</span> explorer = {'{'}</p><p className="terminal-indent">name: <span className="terminal-string">"{profile.nickname[locale]}"</span>,</p><p className="terminal-indent">focus: [<span className="terminal-string">"hardware"</span>, <span className="terminal-string">"software"</span>],</p><p className="terminal-indent">approach: <span className="terminal-string">"learn by building"</span>,</p><p className="terminal-indent">curiosity: <span className="terminal-purple">Infinity</span></p><p>{'};'}</p><p className="terminal-prompt">❯ <span>{zh ? '下一个想法，正在发生。' : 'The next idea is taking shape.'}</span><b className="terminal-cursor" /></p></div><p className="terminal-note">{profile.bio[locale]}</p></div>
      <div className="toolkit-skills"><div className="skill-filters" aria-label={zh ? '技能分类' : 'Skill categories'}>{['all', ...new Set(skills.map(s => s.category))].map(group => <button key={group} type="button" aria-pressed={filter === group} onClick={() => setFilter(group)}>{groups[group]?.[zh ? 0 : 1] || group}</button>)}</div><div className="skill-inventory">{skills.filter(s => filter === 'all' || s.category === filter).map(skill => { const Icon = getIcon(skill.icon); return <div key={skill.name.en} className="inventory-item"><span>{Icon && <Icon size={19} strokeWidth={1.5} />}</span><h3>{skill.name[locale]}</h3><span className="inventory-category">{groups[skill.category]?.[zh ? 0 : 1]}</span><span aria-hidden="true">↗</span></div>; })}</div><p className="toolkit-footnote">{zh ? '工具会变，解决问题的好奇心不变。' : 'Tools evolve. The curiosity to solve problems stays.'}</p></div></div>
    </section>
    <section className="lab-container lab-contact"><p className="lab-overline">04 / ESTABLISH A CONNECTION</p><div className="contact-heading"><h2>{zh ? <>让下一个想法，<br /><span>从一次交流开始。</span></> : <>The next great idea<br /><span>starts with a hello.</span></>}</h2><a href={`mailto:${profile.contact.email}`} className="contact-orbit" aria-label={zh ? '发送邮件' : 'Send an email'}><ArrowUpRight size={45} strokeWidth={1} /></a></div><div className="contact-links"><a href={`mailto:${profile.contact.email}`}><Mail size={15} />{profile.contact.email}</a><a href={profile.contact.github} target="_blank" rel="noreferrer"><Github size={15} />GitHub <ArrowUpRight size={13} /></a><span>{zh ? '保持好奇，持续创造。' : 'Stay curious. Keep building.'}</span></div></section>
  </>;
}
