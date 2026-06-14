import WorkCard from './WorkCard.jsx';

export default function WorkCardGrid({ works = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {works.map((work) => (
        <WorkCard key={work.id} work={work} />
      ))}
    </div>
  );
}
